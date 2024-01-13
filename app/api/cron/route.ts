import { NextResponse } from "next/server";

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/scrapeUtils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeEmagProduct } from "@/lib/scraper";
import { generateEmail, sendEmail } from "@/lib/nodemailer";


export const dynamic = "force-dynamic";
export const revalidate = 0;



export async function GET(request: Request) {
  try {
    console.log('------/api/GET execution in progress....---------');
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // Scrape and update all products at once
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        
        // Scrape product 
        const scrapedProduct = await scrapeEmagProduct(currentProduct.url);
        let updatedPriceHistory = currentProduct.priceHistory;
        if (!scrapedProduct) return;

        // Only update priceHistory array if the new price is different from the previous price
        const prevPrice = currentProduct.priceHistory[currentProduct.priceHistory.length - 1].price;
        if (prevPrice != scrapedProduct.currentPrice){
          console.log('Updating priceHistory array.........');
           updatedPriceHistory = [
            ...currentProduct.priceHistory,
            {
              price: Number(scrapedProduct.currentPrice),
              date: new Date(), 
            },
          ];
        }
  

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update Products in DB
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            name: updatedProduct.name,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmail(productInfo, emailNotifType);
          const userEmails = updatedProduct.users.map((user: any) => user.email);
          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      })
    );
      console.log('---------FINISHED /api/cron execution--------------')
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error}`);
  }
}