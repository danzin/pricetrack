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
      
    } else {
      const now = new Date()
      const priceHistArray = [{
        price: scrapedProduct.currentPrice,
        date: now,
      }]
      product = {
        ...scrapedProduct,
        priceHistory: priceHistArray
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );
    console.log(newProduct)

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

    const products = await Product.find().sort({createdAt: -1});
    revalidatePath(`/products/`);
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
    connectToDB();
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
    connectToDB();
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


// export async function recentlyDiscounted() {
//   try {
//     connectToDB();
//     const recentlyDiscountedProducts = await Product.find({
//       'priceHistory.1': { $exists: true }, 
//       $expr: {
//         $lt: [
//           { $arrayElemAt: ['$priceHistory.price', -1] }, 
//           { $arrayElemAt: ['$priceHistory.price', -2] },
//         ],
//       },
//     });
//     return recentlyDiscountedProducts;
//   } catch (error) {
//     console.error('Error finding recently discounted products:', error);
//   } 
// }

/*TODO: THIS ONE IS FOR TESTING PURPOSES AND UNTIL THE DATA AGES
REMEMBER TO FIX RECENTLY DISCOUNTED. IT'S SUPPOSED TO RETURN RECENT DISCOUNTS FROM THE PAST
FEW DAYS, THIS ONE RETURNS ONLY DISCOUNTED IF CURRENTPRICE > ORIGINAL PRICE WHICH IS INNACURATE 
CONSIDERING THE BONKERS STATE OF PRICES AND DISCOUNTS ON THAT WEBSITE */
// export async function recentlyDiscounted() {
//   try {
//     connectToDB();
//     const recentlyDiscountedProducts = await Product.aggregate([
//       {
//         $match: {
//           'originalPrice': { $exists: true },
//         },
//       },
//       {
//         $addFields: {
//           discounted: {
//             $lt: ['$currentPrice', '$originalPrice'],
//           },
//         },
//       },
//       {
//         $match: {
//           'priceHistory.1': { $exists: true },
//           'discounted': true,
//         },
//       },
//     ]).sort({ updatedAt: -1 }).limit(10);

//     return recentlyDiscountedProducts;
//   } catch (error) {
//     console.error('Error finding recently discounted products:', error);
//   } 
// }

export async function getRelatedByCategory(id: string) {
  try {
    connectToDB();
    const product = await Product.findById(id);
    if (!product) {
      console.log(`Product with ID '${id}' not found.`);
      return;
    }

    // Find more products from the same category
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
    }).limit(6);   
     return relatedProducts;
    } catch (error) {
    console.error('Error finding products by category:', error);
  } 
}

