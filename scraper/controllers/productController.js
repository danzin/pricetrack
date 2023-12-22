import Product from '../models/product.js'
import { scrapeProduct } from '../scraper.js';
export const addOrUpdateProduct = async (req, res) => {
  const { url } = req.body;
  if(!url) res.status(400).send({ success: false, message: 'URL is required' });
  try {   
    console.log(url)
    const product = await scrapeProduct(url)

    // Check if the product with the given URL exists
    const existingProduct = await Product.findOne({url});
    if (existingProduct) {
      console.log('Product url exists')
      // update priceHistory

      existingProduct.lastUpdate = product.requestDate;
      existingProduct.priceHistory.push({ price: product.price, date: product.requestDate });
      const updatedProduct =  await existingProduct.save();
      res.status(200).send({message: 'Existing product updated successfully', product: updatedProduct })
    } else {
      console.log('Product url does not exist')

      // Product doesn't exist, create a new document
      const newProduct = await Product.create({
        name: product.name, // Set appropriate values for other fields
        category: product.category,
        imageUrl:product.imageUrl,
        price: product.price,
        lastUpdate: product.requestDate,
        url: product.url,
        priceHistory: [{ price: product.price, date: product.requestDate }],
      });
      res.status(200).send({message:'Product added to database', newProduct })
    }
    console.log("Product updated or inserted successfully");
  } catch (error) {
    console.error("Error updating or inserting product:", error.message);
  }
};

export const getProduct = async (req, res) => {
  const { url } = req.body;
  if(!url) res.status(400).send({success: false, message: 'URL is required'})
  const product = await Product.findOne({url});
  res.status(200).send({success: true, message:"OK", product: product})
  return product;
}