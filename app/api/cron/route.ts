import { NextResponse } from "next/server";

import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "@/lib/scrapeUtils";
import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeEmagProduct } from "@/lib/scraper";
import { generateEmail, sendEmail } from "@/lib/nodemailer";


export const dynamic = "force-dynamic";
export const revalidate = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateHumanInteraction = async () => {
  // Simulate waiting time between actions
  const waitTime = Math.floor(Math.random() * 500) + 1000; 
  console.log(`Waiting for ${waitTime / 1000} seconds...`);
  await delay(waitTime);
};

export async function GET(request: Request) {
  try {
    console.log('------/api/GET execution in progress....---------');
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No product fetched");

    // Scrape and update products
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {

        //Wait
        await simulateHumanInteraction();
        
        // Scrape product
        const scrapedProduct = await scrapeEmagProduct(currentProduct.url);

        if (!scrapedProduct) return;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
          },
        ];
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          originalPrice: currentProduct.priceHistory[0].price,

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

        // Check status and send emails
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
          await fetch('https://http://localhost:3000/api/send/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailContent, userEmails }),
          });

        }
          //Wait
          await simulateHumanInteraction();
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