import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mandiri_sdb';

// Connect to MongoDB
const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log(`[DB] Attempting connection to: ${maskedURI}`);

const connectionPromise = mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 20000, // Increase to 20 seconds for slow networks
  connectTimeoutMS: 20000,
  family: 4, // Force IPv4 to avoid DNS resolution issues on some systems
})
  .then(() => {
    console.log('✅ [DB] Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ [DB] MongoDB connection error:', err.message);
  });

export { connectionPromise };
export default mongoose.connection;
