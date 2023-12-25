import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async() =>{
  mongoose.set("strictQuery", false);

  if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is undefined');

  if(isConnected) return console.log('using existing DB connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (e) {
    
  }
}