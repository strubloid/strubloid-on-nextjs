/**
 * Strubloid Service
 * Loads and serves Strubloid profile and career data
 */

import fs from "fs";
import path from "path";
import type { StrubloidData } from "./strubloid.types";

const DATA_FILE = path.join(process.cwd(), "src", "data", "strubloid.json");

/**
 * Load Strubloid profile data from JSON file
 * This data includes profile info, skills, experience, education, and more
 * @returns Strubloid profile data
 */
export function getStrubloidData(): StrubloidData {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as StrubloidData;
}
