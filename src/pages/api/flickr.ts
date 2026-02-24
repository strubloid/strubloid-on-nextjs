import type { NextApiRequest, NextApiResponse } from "next";
import { getFlickrData } from "../../../backend/services/flickr";
import type { FlickrPhoto, FlickrAlbum } from "../../../backend/services/flickr";

interface FlickrResponse {
    photos: FlickrPhoto[];
    albums: FlickrAlbum[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FlickrResponse | { error: string }>
): Promise<void> {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { photos, albums } = await getFlickrData();
        res.status(200).json({ photos, albums });
    } catch (error) {
        console.error("Error loading flickr data:", error);
        res.status(500).json({ error: "Failed to load flickr data" });
    }
}
