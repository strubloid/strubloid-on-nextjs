/**
 * GitHub Service Cache Management
 * Handles reading and writing GitHub data cache
 */

import fs from "fs";
import path from "path";
import type { GithubCache } from "./github.types";

const CACHE_FILE = path.join(process.cwd(), "backend", "data", "github.json");

/**
 * Read GitHub cache from file
 * Returns empty cache if file doesn't exist or can't be parsed
 */
export function readCache(): GithubCache {
    try {
        const raw = fs.readFileSync(CACHE_FILE, "utf-8");
        return JSON.parse(raw) as GithubCache;
    } catch {
        return { timestamp: 0, projects: [] };
    }
}

/**
 * Write GitHub cache to file
 * Creates directory if it doesn't exist
 */
export function writeCache(cache: GithubCache): void {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}
