
export type Product = {
  _id? : string;
  reviewsCount: number;
  url: string;
  imageUrl: string;
  name: string;
  category: string;
  currentPrice: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  description: string;
  productCode: string;
  starRating: number;
  brand: string;
  users?: User[];
  priceHistory: PriceHistoryItem[] | [];
}

export type PriceHistoryItem = {
  price: number;
}

export type User = {
  email: string;
}


export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  name: string;
  url: string;
};