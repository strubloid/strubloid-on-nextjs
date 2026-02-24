/**
 * MongoDB Database Connection
 * Manages Mongoose connection with caching to avoid multiple connections
 */

import mongoose from "mongoose";

interface ConnectionCache {
    isConnected?: number;
    error?: string;
}

const connection: ConnectionCache = {};

/**
 * Connect to MongoDB database
 * Uses connection caching to prevent multiple connections
 * Requires NEXT_PUBLIC_MONGO_URI environment variable
 */
async function dbConnect(): Promise<void> {
    if (connection.isConnected) return;

    try {
        const mongoUri = process.env.NEXT_PUBLIC_MONGO_URI;
        if (!mongoUri) {
            throw new Error("NEXT_PUBLIC_MONGO_URI environment variable is not defined");
        }

        const db = await mongoose.connect(mongoUri);
        connection.isConnected = db.connections[0].readyState;
        connection.error = undefined;
        console.log("✓ MongoDB connected successfully");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        connection.error = errorMessage;
        console.error("✗ Database connection failed:", errorMessage);
        throw error;
    }
}

/**
 * Get current MongoDB connection status
 * Returns connection state and any error message
 */
export function getConnectionStatus(): { connected: boolean; status: string; error?: string } {
    const isConnected = connection.isConnected === 1;

    if (isConnected) {
        return {
            connected: true,
            status: "Connected",
        };
    }

    if (connection.error) {
        return {
            connected: false,
            status: "Disconnected",
            error: connection.error,
        };
    }

    return {
        connected: false,
        status: "Not attempted",
    };
}

export default dbConnect;
