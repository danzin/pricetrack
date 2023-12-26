import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async() =>{
  mongoose.set("strictQuery", false);

  if(!process.env.MONGODB_URI_CLD) return console.log('MONGODB_URI is undefined');

  if(isConnected) return console.log('using existing DB connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI_CLD);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (e) {
    
  }
}