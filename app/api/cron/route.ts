import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose"
import { generateEmail, sendEmail } from "@/lib/nodemailer";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/scrapeUtils";
import { scrapeEmagProduct } from "@/lib/scraper";
import { NextResponse } from "next/server";


export const maxDuration = 10;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {

  try {
    connectToDB();

    const products = await Product.find({});
    if(!products) throw new Error("No products found");
    
    //Scrape product
    const updatedProducts = await Promise.all(
      products.map(async(current) =>{
        const scrapedProduct = await scrapeEmagProduct(current.url);

        if(!scrapedProduct) throw new Error('No product found');
        
        const updatedPriceHistory = [
          ...current.priceHistory,
          { price: scrapedProduct.currentPrice }
        ]
        const updatedStarRating: any = scrapedProduct.starRating;
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          starRating: updatedStarRating,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        }

        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product,
        );

        //Check product status and send email   
        const emailNotifType = getEmailNotifType(scrapedProduct, current)
          if(emailNotifType && updatedProduct.users.length > 0){
            const productInfo = {
              name: updatedProduct.name,
              url: updatedProduct.url,
            }

            const emailContent = await generateEmail(productInfo, emailNotifType);

            const userMails = updatedProduct.users.map((user: any) => user.email);

            await sendEmail(emailContent, userMails);
          }

          return updatedProduct;
      })
    )
    return NextResponse.json({
      message: 'OK', data: updatedProducts
    })
  } catch (e) {
    throw new Error(`GET Error: ${e}`)    
  }
}