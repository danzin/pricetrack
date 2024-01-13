import axios from 'axios';
import cheerio from 'cheerio';
import { extractCodeProduct, extractPrice, extractReviewsCount, extractStarRating, removeHTML } from '../scrapeUtils';
import { PriceHistoryItem, Product } from '@/types';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateHumanInteraction = async () => {
  // Simulate waiting time between actions
  const waitTime = Math.floor(Math.random() * 500) + 1000; 
  console.log(`Waiting for ${waitTime / 1000} seconds...`);
  await delay(waitTime);
};

export async function scrapeEmagProduct(url: string) {
  if (!url) return;
  const username = String(process.env.BRIGHTDATA_USERNAME)
  const password = String(process.env.BRIGHTDATA_PASSWORD)
  const port = 22225;
  const session_id = (111111 * Math.random()) | 0;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    auth: {
      username: `${username}-session-${session_id}`,
      password,

    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false
  }
  
  try {
    // Request product url
    console.log('scraper');
    const response = await axios.get(url, options);
    await simulateHumanInteraction();
    const $ = cheerio.load(response.data);
    
    // Get Title
    let productTitle = $('.page-title').text().trim();

    // Get Price
    let productPrice = $('.product-new-price').first().text().trim();
    // console.log(productPrice)
    const currentPrice = extractPrice(productPrice);
 
    // Get Image
    let linkImageElement = $('.product-gallery-image').first();
    let hrefValue = linkImageElement.attr('href');

    // Get Brand
    let brand = $('.disclaimer-section > p > a').text();

    // Get Category
    let n = $('.breadcrumb > li').length;
    let category = $('.breadcrumb > li').eq(n - 3).text();

    const hasRating = $('.rating-text');
    var reviewsCount = 0;
    var starRating = 0;

    // If product has rating and reviews, get them
    if (hasRating.length) {
      let reviewsEl = $('.rating-text > span').first().text();
      reviewsCount = extractReviewsCount(reviewsEl);

      let starRatingElement = $('.rating-text').first().text();
      starRating = extractStarRating(starRatingElement);
    }

    // Get Description
    let description = $('#description-body').first().text();
    description = removeHTML(description);

    // Get Product Code
    let productCodeEl = $('.product-code-display').first().text();
    const productCode = extractCodeProduct(productCodeEl);

    // Create Product object
    const product: Product = {
      name: productTitle,
      category: category || '',
      imageUrl: hrefValue || '',
      currentPrice: currentPrice,
      brand: brand || '',
      url: url,
      description: description,
      starRating: starRating || 0,
      productCode: productCode || '',
      reviewsCount: reviewsCount || 0,
      priceHistory: [],
      lowestPrice: currentPrice,
      highestPrice: currentPrice,
      averagePrice: currentPrice,
    };


    // const mockProduct = {
    //   name: 'title',
    //   category: 'category',
    //   imageUrl: 'hrefvalue',
    //   currentPrice: 1000,
    //   brand: 'brand',
    //   url: 'url',
    //   originalPrice: 1000,
    //   description: 'description',
    //   starRating: 0,
    //   productCode: 'productCode',
    //   reviewsCount: 0,
    //   priceHistory: [],
    //   lowestPrice: 1000,
    //   highestPrice: 1000,
    //   averagePrice: 1000,
    // }
    // return mockProduct;
    // Return Product
    return product;
  } catch (e: any) {
    throw new Error(`Failed to scrape product: ${e.message}`);
  }
}
