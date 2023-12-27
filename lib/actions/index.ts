"use server"
import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import { scrapeEmagProduct } from "../scraper";
import Product from '../models/product.model';
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../scrapeUtils";
import { User } from "@/types";
import { generateEmail, sendEmail } from "../nodemailer";

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
      
      const updatedStarRating: any = scrapedProduct.starRating;
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        starRating: updatedStarRating,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
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

export async function getSimilar(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);
    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: {$ne: productId},
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserToProduct(productId: string, userEmail: string){
  try {
      const product = await Product.findById(productId);
      if(!product) return;
  
      const userExists = product.users.some((user: User) => user.email === userEmail);
      if(!userExists){
        product.users.push({email: userEmail});
        await product.save();
      
        const emailContent = await generateEmail(product, "WELCOME");
        await sendEmail(emailContent, [userEmail]);
      }

  } catch (e) {
    console.log(e);
  }

}

export async function heroImages() {
  try {
    const randomProducts = await Product.aggregate([
      { $sample: { size: 5 } },
    ]);

    // Extract image URLs from the fetched products
    const imageUrls = randomProducts.map((product) => ({
      imgUrl: product.imageUrl,
      alt: product.name, 
    }));

    return imageUrls;
  } catch (error) {
    console.error('Error fetching random products:', error);
    return [];
  }
};
