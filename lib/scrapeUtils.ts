import { PriceHistoryItem, Product } from "@/types";
const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;


export function extractPrice(input:any){
  if (input) {
    const parts = input.split(',');
    const result = parts[0];
    return result.replace(/\D/g,'');
  } else {
    console.log('extractPrice received no input');
  }
}


// export function extractPrice(input: any){
//   if(!input) return "extractPrice received empty input";
//   // console.log(input);
//   let match = input.replace(/[лв]/g, '')
//   match = match.replace(' ', '')
//   // match = match.replace('.', '')
//   console.log(match)
//   const formatter = new Intl.NumberFormat('bg-BG', {
//     style: 'currency',
//     currency: 'BGN'
//   });
//   if(match){
//     const bulgarianCurrencyString = match;
//     const cleanNumberString = bulgarianCurrencyString?.match(/\d+/g).join('');
//     const bulgarianCurrencyNumber = parseInt(cleanNumberString, 10);
    
//     console.log(bulgarianCurrencyNumber);
    
//     const formatted = match.replace(',', '.')

//     // console.log('extractPrice log1:',formatter.format(formatted))
//     // const ret = formatter.format(formatted)
//     // match = parseFloat(match).toFixed(3);
//     // console.log(match)
//     return match;
//   }
//   throw new Error("extractPrice found no match");
// }

export function extractReviewsCount(input: any){
  if(!input) return 0;

  const match = input.match(/\((\d+)\s*ревю(?:та)?\)/);
  if(match) {
    const extractedNumber = parseInt(match[1], 10);
    return extractedNumber;
  } 
  throw new Error("extractReviewsCount found no match");
   
}

export function extractStarRating(input: any) {
  if(!input) return 0;

  const match = input.trim('').match(/(\d+(\.\d+)?)/);
  if(match) {
    const extractedNumber = Number(match[1]);
    return extractedNumber;
  } 
  throw new Error("extractStarRating found no match");
}

export function extractCodeProduct(input: any) {
  if(!input) return "extractCodeProduct received empty input";

  const match = input.match(/: (.*)/);
  if(match) return match[1];

  throw new Error('extractCodeProduct found no match')
}

export function removeHTML(input: any){
  if(!input) return "removeHTML received empty input"
  var text = input.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "").trim();
  const cleanedText = text.replace(/\n\s*\n/g, '\n\n');
  return cleanedText
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
  let highestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }

  return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
  let lowestPrice = priceList[0];

  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }

  return lowestPrice.price !== undefined ? lowestPrice.price : 0;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {

  //remove duplicates from priceList array
  priceList = priceList.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.price === value.price
    ))
  ) 
  //calculate average
  const sum = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sum / priceList.length || 0;
  //format value
  const formattedValue = parseFloat(averagePrice.toFixed(3)); 

  return formattedValue;
}

export const getEmailNotifType = (
  scrapedProduct: Product,
  currentProduct: Product
) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE as keyof typeof Notification;
  }
  // if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
  //   return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
  // }
  // if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
  //   return Notification.THRESHOLD_MET as keyof typeof Notification;
  // }

  return null;
};

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
