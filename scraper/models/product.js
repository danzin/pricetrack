import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  price: { type: String, required: true },
  date: { type: String ,required: true },
});
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  category: { type: String, required: true, unique: false },
  imageUrl: { type: String, required: true, unique: false },
  currentPrice: { type: String, unique: false },
  // brand: { type: String, required: true, unique: false },
  lastUpdate: {type: String, required: true, unique: false },
  url: { type: String, required: true, unique: false},
  priceHistory: [priceHistorySchema]
});

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Product = mongoose.model("Product", productSchema, "Products");

export default Product;