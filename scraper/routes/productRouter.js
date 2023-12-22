import express from 'express';
import { addOrUpdateProduct, getProduct } from '../controllers/productController.js';
const productRouter = express.Router();

productRouter.post('/addProduct', addOrUpdateProduct);
productRouter.get('/getProduct', getProduct);

export default productRouter;