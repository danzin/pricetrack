import playwright from 'playwright';
import { getCurrentDateTime } from './utils.js';
const DEFAULT_TIMEOUT = 40000;


 async function getProduct(url) {
  const browser = await playwright.chromium.launch({
    headless: false,
    proxy: {
      server: '51.254.69.243:3128',
      type: 'https'
  }
  });
  const page = await browser.newPage();
  try {
    await page.goto(url,DEFAULT_TIMEOUT);
    // await page.waitForTimeout(DEFAULT_TIMEOUT);
    const ip = await page.locator('#ip').first().textContent();
    console.log(ip)
  }catch(e){
    console.log(e)
  }
   finally {
    await browser.close();
  }
}
getProduct('https://www.whatsmyip.org/')