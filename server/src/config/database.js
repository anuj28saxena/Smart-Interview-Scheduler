import mongoose from 'mongoose';
import config from './config.js';

async function connectDB() {

     await mongoose.connect(config.MONGO_URI, {
          serverSelectionTimeoutMS: 5000
     })

     console.log('Connected to MongoDB');     

}

export default connectDB;
