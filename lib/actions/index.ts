"use server"

import { scrapeEmagProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string){
  if(!productUrl) return;
  
  try {
    const scrapedProduct = await scrapeEmagProduct(productUrl);  
  } catch (e: any) {
    throw new Error(`Failed to create/update product: ${e.message}`);
  }

}