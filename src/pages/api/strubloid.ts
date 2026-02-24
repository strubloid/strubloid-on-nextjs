import type { NextApiRequest, NextApiResponse } from "next";
import { getStrubloidData } from "../../../backend/services/strubloid";
import type { StrubloidData } from "../../../backend/services/strubloid";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StrubloidData | { error: string }>
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const data = getStrubloidData();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error loading strubloid data:", error);
        res.status(500).json({ error: "Failed to load strubloid data" });
    }
}
