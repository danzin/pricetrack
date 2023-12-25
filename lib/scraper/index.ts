/*
Using Playwright with headless chromium for scraping because 
any requests coming from axios are blocked by Emag
regardless of proxy configuration or user-agent presented
*/
import playwright from 'playwright';
import { extractPrice } from '../scrapeUtils';

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
    let productPrice =  await page.locator('.product-new-price').first().textContent();
    let linkImageElement =  page.locator('.product-gallery-image').first();
    let hrefValue = await linkImageElement.getAttribute('href');
    let manufacturer = await page.locator('.disclaimer-section > p > a').textContent();
    let breadcrumbs = page.locator('.breadcrumb');
    let n = await breadcrumbs.locator('li').count();
    let child = await breadcrumbs.locator('li').nth(n-3).textContent();
    productTitle = productTitle?.replace(/\s+/g, ' ').trim()!;

    const currentPrice = extractPrice(productPrice);

    const product = {
      name: productTitle,
      category: child,
      imageUrl: hrefValue,
      currentPrice: currentPrice,
      brand: manufacturer,
      url: url,
    };
    return product;
    
    }catch (e: any) {
      console.error('Error fetching product:', e.message);
      return e;
    }finally {
    await browser.close();
  }

}