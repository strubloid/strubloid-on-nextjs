import type { NextApiRequest, NextApiResponse } from "next";
import { getTimelineData } from "../../../backend/services/timeline";
import type { TimelineData } from "../../../backend/services/timeline";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimelineData | { error: string }>
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const data = getTimelineData();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error loading timeline data:", error);
        res.status(500).json({ error: "Failed to load timeline data" });
    }
}
