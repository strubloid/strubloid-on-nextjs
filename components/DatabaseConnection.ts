import mongoose from 'mongoose';

interface ConnectionCache {
    isConnected?: number;
}

const connection: ConnectionCache = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) return;

    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        const db = await mongoose.connect(mongoUri);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

export default dbConnect;
