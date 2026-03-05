import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mandiri_sdb';

// Connect to MongoDB
const connectionPromise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
  // Let Mongoose handle buffering and reconnection
})
  .then(() => {
    console.log('✅ [DB] Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ [DB] MongoDB connection error:', err.message);
  });

export { connectionPromise };
export default mongoose.connection;
