import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    let MONGO_URI = process.env.MONGO_URI || '';

    MONGO_URI = MONGO_URI.replace('<password>', process.env.MONGO_PASSWORD || '');
    MONGO_URI = MONGO_URI.replace('<username>', process.env.MONGO_USERNAME || '');

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI as any);
        console.log('MongoDB connected');
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
