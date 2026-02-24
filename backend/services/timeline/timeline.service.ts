/**
 * Timeline Service
 * Loads and serves career timeline data (rafael.json)
 */

import fs from "fs";
import path from "path";
import type { TimelineData } from "./timeline.types";

const DATA_FILE = path.join(process.cwd(), "backend", "data", "rafael.json");

/**
 * Load timeline data from JSON file
 * @returns Array of timeline items
 */
export function getTimelineData(): TimelineData {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as TimelineData;
}
