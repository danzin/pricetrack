export function extractPrice(textPrice: any){
  if(textPrice){
    let price = textPrice.replace(/[лв]/g, '').replace(',', '.');
    price = price.substr(0, price.length - 2);
    price = parseFloat(price);
    console.log(price)
    return price;
  }

  return 'Empty textPrice string';
}



