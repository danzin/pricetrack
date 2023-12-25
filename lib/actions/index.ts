"use server"
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import { scrapeEmagProduct } from "../scraper";
import Product from '../models/product.model';

export async function scrapeAndStoreProduct(productUrl: string){
  if(!productUrl) return;
  
  try {
    connectToDB();
    const scrapedProduct = await scrapeEmagProduct(productUrl);
    if(!scrapedProduct) return;

    let product = scrapedProduct;
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (e: any) {
    throw new Error(`Failed to create/update product: ${e.message}`);
  }
}

export async function getProductById(productId: string){
  try {
    connectToDB();
    
    const product = await Product.findOne({_id: productId});

    if(!product) return null;

    return product;

  } catch (e:any) {
    
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}