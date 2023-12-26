/*
Using Playwright with headless chromium for scraping because 
any requests coming from axios are blocked by Emag
regardless of proxy configuration or user-agent presented
*/
import playwright from 'playwright';
import { extractCodeProduct, extractPrice, extractReviewsCount, extractStarRating, removeHTML } from '../scrapeUtils';

const DEFAULT_TIMEOUT = 4000;

export async function scrapeEmagProduct(url: string){
  if(!url) return;
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForTimeout(DEFAULT_TIMEOUT);
    let productTitle = await page.locator('.page-title').textContent();
    productTitle = productTitle?.trim()!;

    let productPrice =  await page.locator('.product-new-price').first().textContent();
    const currentPrice = extractPrice(productPrice);

    let linkImageElement =  page.locator('.product-gallery-image').first();
    let hrefValue = await linkImageElement.getAttribute('href');

    let brand = await page.locator('.disclaimer-section > p > a').textContent();

    let n = await page.locator('.breadcrumb > li').count();
    let category = await page.locator('.breadcrumb > li').nth(n-3).textContent();
    
    const hasRating = await page.$('.rating-text');
    var reviewsCount: any = 0;
    var starRating: any = 0;

    if(hasRating){
      let reviewsEl = await page.locator('.rating-text > span').first().textContent();
      reviewsCount = extractReviewsCount(reviewsEl);
  
      let starRatingElement = await page.locator('.rating-text').first().textContent();
      starRating = extractStarRating(starRatingElement);
    }
    let description: any = await page.locator('#description-body').first().textContent();
    description = removeHTML(description);

    let productCodeEl = await page.locator('.product-code-display').first().textContent();
    const productCode = extractCodeProduct(productCodeEl);
    const product = {
      name: productTitle,
      category: category || ' ',
      imageUrl: hrefValue!,
      currentPrice: currentPrice,
      brand: brand || '',
      url: url,
      description: description,
      starRating: starRating || 0,
      productCode: productCode || '',
      reviewsCount: reviewsCount || 0,
      originalPrice: currentPrice,
      priceHistory: [],
      lowestPrice: Number(currentPrice),
      highestPrice: Number(currentPrice),
      averagePrice: Number(currentPrice),
    };
    console.log('SCRAPED PRODUCT: ', product)
    return product;
    
    }catch (e: any) {
      throw new Error(`Failed to scrape product: ${e.message}`);
    }finally {
    await browser.close();
  }

}