import axios from 'axios';
import cheerio from 'cheerio';
import { extractCodeProduct, extractPrice, extractReviewsCount, extractStarRating, removeHTML } from '../scrapeUtils';

const DEFAULT_TIMEOUT = 1400;

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
  
    
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    await new Promise(resolve => setTimeout(resolve, DEFAULT_TIMEOUT));
    let productTitle = $('.page-title').text().trim();
    let productPrice = $('.product-new-price').first().text();
    const currentPrice = extractPrice(productPrice);

    let linkImageElement = $('.product-gallery-image').first();
    let hrefValue = linkImageElement.attr('href');

    let brand = $('.disclaimer-section > p > a').text();

    let n = $('.breadcrumb > li').length;
    let category = $('.breadcrumb > li').eq(n - 3).text();

    const hasRating = $('.rating-text');
    var reviewsCount = 0;
    var starRating = 0;

    if (hasRating.length) {
      let reviewsEl = $('.rating-text > span').first().text();
      reviewsCount = extractReviewsCount(reviewsEl);

      let starRatingElement = $('.rating-text').first().text();
      starRating = extractStarRating(starRatingElement);
    }

    let description = $('#description-body').first().text();
    description = removeHTML(description);

    let productCodeEl = $('.product-code-display').first().text();
    const productCode = extractCodeProduct(productCodeEl);

    const product = {
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
      lowestPrice: Number(),
      highestPrice: Number(),
      averagePrice: Number(),
    };

    return product;
  } catch (e: any) {
    throw new Error(`Failed to scrape product: ${e.message}`);
  }
}
