import express from 'express';
import mongoose  from 'mongoose';
import config from './utils/config.js'
import productRouter from './routes/productRouter.js';
const app = express();


const port = 5252;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error.message);
  });

app.use(express.json())
app.use('/api/', productRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
