/**
 * GitHub Service
 * Fetches and caches GitHub repository data from the GitHub API
 */

import { readCache, writeCache } from "./github.cache";
import type { CachedLanguage, CachedProject, GithubCache, GithubRepo } from "./github.types";

// Configuration
const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * GitHub repositories to track
 * Add or remove entries to customize which repos are displayed
 */
export const REPOS: GithubRepo[] = [
    {
        name: ".bash_aliases",
        url: "https://github.com/strubloid/.bash_aliases",
        fallbackDescription: "A structured way to create your ~/.bash_aliases using classes",
    },
    {
        name: "Cardgame",
        url: "https://github.com/strubloid/cardgame",
        fallbackDescription: "A card game built with Unity",
    },
    {
        name: "Python Music",
        url: "https://github.com/strubloid/py-music",
        fallbackDescription: "Full-stack music theory app",
    },
    {
        name: "Sperm Whale",
        url: "https://github.com/strubloid/spermwhale",
        fallbackDescription: "Real-time transcription and translation system",
    },
    {
        name: "React & Java",
        url: "https://github.com/strubloid/ReactAndJava",
        fallbackDescription: "Book Manager with React and Java",
    },
    {
        name: "My Resume",
        url: "https://github.com/strubloid/resume",
        fallbackDescription: "A collection of explanations and documentation",
    },
    {
        name: "Fixing SD Card",
        url: "https://github.com/strubloid/fix-sd",
        fallbackDescription: "Safe recovery tool for .nef (Nikon RAW) images from unmountable SD cards.",
    },
];

/**
 * Extract repository slug from GitHub URL
 * @param url GitHub repository URL
 * @returns Repository slug (e.g., "strubloid/repo-name") or null if invalid
 */
function repoSlug(url: string): string | null {
    const m = url.match(/github\.com\/([^/]+\/[^/]+)/);
    return m ? m[1] : null;
}

/**
 * Fetch repository data and language statistics from GitHub API
 * @param slug Repository slug
 * @returns Repository metadata or null if fetch fails
 */
async function fetchRepoData(
    slug: string,
): Promise<{ description: string | null; stars: number; langs: Record<string, number> } | null> {
    try {
        const [repoRes, langRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${slug}`, {
                headers: { Accept: "application/vnd.github.v3+json" },
            }),
            fetch(`https://api.github.com/repos/${slug}/languages`, {
                headers: { Accept: "application/vnd.github.v3+json" },
            }),
        ]);

        if (!repoRes.ok || !langRes.ok) return null;

        const repo = await repoRes.json();
        const langs = await langRes.json();

        return {
            description: repo.description,
            stars: repo.stargazers_count,
            langs,
        };
    } catch {
        return null;
    }
}

/**
 * Convert language byte counts to percentage list
 * Returns top 5 languages by percentage
 * @param langs Language byte counts from GitHub API
 * @returns Sorted list of top languages with percentages
 */
function toLangList(langs: Record<string, number>): CachedLanguage[] {
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(langs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, bytes]) => ({
            name,
            percentage: ((bytes / total) * 100).toFixed(1),
        }));
}

/**
 * Refresh GitHub cache from API
 * Attempts to fetch fresh data for all repositories
 * Preserves cached data if API calls fail
 * @returns Updated cache
 */
async function refreshCache(): Promise<GithubCache> {
    const existing = readCache();
    const existingMap = new Map(existing.projects.map((p) => [p.url, p]));
    const projects: CachedProject[] = [];
    let successCount = 0;

    await Promise.allSettled(
        REPOS.map(async (repo) => {
            const slug = repoSlug(repo.url);
            if (!slug) return;

            const data = await fetchRepoData(slug);
            const prev = existingMap.get(repo.url);

            if (data) successCount++;

            // Use fresh data if available, otherwise preserve cached data
            const newLangs = data ? toLangList(data.langs) : [];
            const languages = newLangs.length > 0 ? newLangs : prev?.languages ?? [];

            projects.push({
                name: repo.name,
                url: repo.url,
                description: data?.description || prev?.description || repo.fallbackDescription,
                stars: data?.stars ?? prev?.stars ?? 0,
                languages,
            });
        }),
    );

    // If every API call failed, don't overwrite the cache
    if (successCount === 0 && existing.projects.length > 0) {
        return existing;
    }

    // Maintain original repo order
    const ordered = REPOS.map((r) => projects.find((p) => p.url === r.url)).filter(
        Boolean,
    ) as CachedProject[];

    // Only update timestamp if we got fresh data
    const newTimestamp = successCount > 0 ? Date.now() : existing.timestamp;
    const cache: GithubCache = { timestamp: newTimestamp, projects: ordered };

    writeCache(cache);
    return cache;
}

/**
 * Get GitHub projects with intelligent caching
 * Uses 1-hour TTL for cache validity
 * Falls back to cached data if API fails
 * Returns fallback descriptions if cache is empty
 * @returns List of cached projects
 */
export async function getGithubProjects(): Promise<CachedProject[]> {
    const cache = readCache();

    // Check if cache has language data (indicates successful fetch)
    const hasLanguages = cache.projects.some((p) => p.languages.length > 0);
    const isFresh = Date.now() - cache.timestamp < ONE_HOUR_MS;

    // Return cached data if valid, has languages, and is fresh
    if (cache.projects.length > 0 && isFresh && hasLanguages) {
        return cache.projects;
    }

    try {
        const fresh = await refreshCache();
        return fresh.projects;
    } catch {
        // Use stale cache if available
        if (cache.projects.length > 0) {
            return cache.projects;
        }

        // Last resort: return fallback data without language stats
        return REPOS.map((r) => ({
            name: r.name,
            url: r.url,
            description: r.fallbackDescription,
            stars: 0,
            languages: [],
        }));
    }
}
