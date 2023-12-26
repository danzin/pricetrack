import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  category: { type: String, required: true, unique: false },
  imageUrl: { type: String, required: true, unique: false },
  currentPrice: { type: Number, required: true, unique: false },
  originalPrice: { type: Number, required: true },
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  description: {type: String},
  brand: { type: String, required: true, unique: false },
  reviewsCount: { type: Number, required: true, unique: false},
  productCode: { type: String, required: true, unique: false},
  url: { type: String, required: true, unique: false},
  starRating: { type: Number, required: true, unique: false},
  priceHistory: [
    { 
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
  users: [
    {email: { type: String, required: true}}
  ], default: [],
},
{ timestamps: true } );



productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;