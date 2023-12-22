import playwright from 'playwright';
import { getCurrentDateTime } from './utils.js';
const DEFAULT_TIMEOUT = 4000;

export const scrapeProduct = async (url) => {

  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  const browser = await playwright.chromium.launch({
    headless: false,
  });
  const page = await browser.newPage();
  const currentDate = getCurrentDateTime();
  try {
    await page.goto(url);
    await page.waitForTimeout(DEFAULT_TIMEOUT);
    let productTitle = await page.locator('.page-title').textContent();
    let productPrice = await page.locator('.product-new-price').first().textContent();
    let linkImageElement = page.locator('.product-gallery-image').first();
    let hrefValue = await linkImageElement.getAttribute('href');
    let breadcrumbs = await page.locator('.breadcrumb').textContent();
    breadcrumbs = breadcrumbs.replace(/\s+/g, ' ').trim();
    productTitle = productTitle.replace(/\s+/g, ' ').trim();
    productPrice = productPrice.replace(/\s+/g, ' ').trim();
    const product = {
      name: productTitle,
      category: breadcrumbs,
      imageUrl: hrefValue,
      price: productPrice,
      requestDate: currentDate,
      url: url,
    };
    return product;
    }catch (error) {
      console.error('Error fetching product:', error.message);
      return error;
    }finally {
    await browser.close();
  }
}