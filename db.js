import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mandiri_sdb';

// Connect to MongoDB
const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log(`[DB] Attempting connection to: ${maskedURI}`);

const connectionPromise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 20000, // 20 seconds
  connectTimeoutMS: 20000,
  // family: 4, // Removed: Can break resolution on some networks/Vercel
})
  .then(() => {
    console.log('✅ [DB] Connected to MongoDB');
    return mongoose.connection;
  })
  .catch(err => {
    console.error('❌ [DB] MongoDB connection error:', err.message);
  });

export { connectionPromise };
export default mongoose.connection;
