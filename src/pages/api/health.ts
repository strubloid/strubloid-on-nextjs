import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect, { getConnectionStatus } from "../../../backend/db/connection";

interface HealthResponse {
    status: "ok" | "degraded" | "error";
    timestamp: string;
    mongodb: {
        connected: boolean;
        status: string;
        error?: string;
    };
    environment: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HealthResponse | { error: string }>
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        // Try to connect to MongoDB
        try {
            await dbConnect();
        } catch (error) {
            // Connection failed, but we'll still report status
            console.error("Health check - DB connection attempt failed:", error);
        }

        // Get current connection status
        const dbStatus = getConnectionStatus();

        // Determine overall health status
        const overallStatus = dbStatus.connected ? "ok" : "degraded";

        const healthResponse: HealthResponse = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            mongodb: dbStatus,
            environment: process.env.NEXT_PUBLIC_NODE_ENV || "development",
        };

        res.status(dbStatus.connected ? 200 : 503).json(healthResponse);
    } catch (error) {
        console.error("Health check error:", error);
        res.status(500).json({
            error: "Health check failed",
        });
    }
}
