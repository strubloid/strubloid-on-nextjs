import type { NextApiRequest, NextApiResponse } from "next";
import { getBackgroundPhotos } from "../../../backend/services/background";
import type { BackgroundPhotos } from "../../../backend/services/background";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<BackgroundPhotos | { error: string }>
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const data = getBackgroundPhotos();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error loading background photos:", error);
        res.status(500).json({ error: "Failed to load background photos" });
    }
}
