import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import BoxInventory from './models/BoxInventory.js';
import Application from './models/Application.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        console.log('--- Database Seeding Start ---');
        console.log('Connecting to:', MONGODB_URI.split('@')[1]); // Log host part of URI safely

        const options = {
            serverSelectionTimeoutMS: 30000, // Wait 30 seconds for server selection
            connectTimeoutMS: 30000,        // Wait 30 seconds for initial connection
            socketTimeoutMS: 45000,         // Wait 45 seconds for socket operations
            family: 4                        // Force IPv4 if IPv6 is causing issues
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ Connected to MongoDB Atlas successfully.');

        // 1. Seed Box Inventory
        const boxCount = await BoxInventory.countDocuments();
        if (boxCount === 0) {
            console.log('📦 Seeding Box Inventory...');
            const sizes = [
                { box_size: '30', total_slots: 1700 },
                { box_size: '40', total_slots: 1700 },
                { box_size: '50', total_slots: 1700 }
            ];
            await BoxInventory.insertMany(sizes);
            console.log('✨ Box Inventory seeded (3 sizes, 1700 slots each).');
        } else {
            console.log('ℹ️ Box Inventory already exists.');
        }

        // 2. Seed Admin
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            console.log('👤 Creating default admin user...');
            await Admin.create({
                username: 'admin',
                password: 'password'
            });
            console.log('🔑 Default admin created (username: admin, password: password).');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        // 3. Force Collection Creation for Applications
        console.log('📁 Ensuring "applications" collection exists...');
        await Application.createCollection();
        console.log('✅ "applications" collection verified.');

        console.log('🎉 Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:');
        console.error('- Code:', error.code);
        console.error('- Message:', error.message);
        if (error.code === 'ETIMEOUT' || error.code === 'EREFUSED' || error.message.includes('timeout') || error.message.includes('queryTxt')) {
            console.error('\nLangkah Perbaikan (PENTING):');
            console.error('1. Jaringan Anda (Hotspot/ISP) memblokir DNS SRV (mongodb+srv).');
            console.error('2. SOLUSI: Gunakan "Standard Connection String" (bukan +srv).');
            console.error('   Cara: Di MongoDB Atlas, pilih Connect -> Drivers -> Driver Version "2.2.12 or earlier".');
            console.error('   Copy string "mongodb://user:pass@host0,host1,host2/..." ke .env');
            console.error('3. Pastikan DNS di Windows sudah 8.8.8.8 (Google DNS).');
        }
        process.exit(1);
    }
};

seedDatabase();
