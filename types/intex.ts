
export type Product = {
  _id? : string;
  url: string;
  imageUrl: string;
  name: string;
  category: string;
  currentPrice: number;

  priceHistory: PriceHistoryItem[] | [];
}

export type PriceHistoryItem = {
  price: number;
}