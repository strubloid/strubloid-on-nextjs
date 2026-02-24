/**
 * Background Photos Service
 * Loads and serves background photos (facebook.json)
 */

import fs from "fs";
import path from "path";
import type { BackgroundPhotos } from "./background.types";

const DATA_FILE = path.join(process.cwd(), "backend", "data", "facebook.json");

/**
 * Load background photos from JSON file
 * @returns Photos data with timestamp
 */
export function getBackgroundPhotos(): BackgroundPhotos {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BackgroundPhotos;
}
