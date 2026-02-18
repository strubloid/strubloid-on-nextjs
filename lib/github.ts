import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CachedLanguage {
    name: string;
    percentage: string;
}

export interface CachedProject {
    name: string;
    url: string;
    description: string;
    stars: number;
    languages: CachedLanguage[];
}

export interface GithubCache {
    timestamp: number;
    projects: CachedProject[];
}

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const ONE_HOUR_MS = 60 * 60 * 1000;
const CACHE_FILE = path.join(process.cwd(), "data", "github.json");

/** The repos we want to track — add/remove entries here */
export const REPOS: { name: string; url: string; fallbackDescription: string }[] = [
    { name: ".bash_aliases", url: "https://github.com/strubloid/.bash_aliases", fallbackDescription: "A structured way to create your ~/.bash_aliases using classes" },
    { name: "Cardgame", url: "https://github.com/strubloid/cardgame", fallbackDescription: "A card game built with Unity" },
    { name: "Python Music", url: "https://github.com/strubloid/py-music", fallbackDescription: "Full-stack music theory app" },
    { name: "Sperm Whale", url: "https://github.com/strubloid/spermwhale", fallbackDescription: "Real-time transcription and translation system" },
    { name: "React & Java", url: "https://github.com/strubloid/ReactAndJava", fallbackDescription: "Book Manager with React and Java" },
    { name: "My Resume", url: "https://github.com/strubloid/resume", fallbackDescription: "A collection of explanations and documentation" },
    { name: "Fixing SD Card", url: "https://github.com/strubloid/fix-sd", fallbackDescription: "Safe recovery tool for .nef (Nikon RAW) images from unmountable SD cards." },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function repoSlug(url: string): string | null {
    const m = url.match(/github\.com\/([^/]+\/[^/]+)/);
    return m ? m[1] : null;
}

function readCache(): GithubCache {
    try {
        const raw = fs.readFileSync(CACHE_FILE, "utf-8");
        return JSON.parse(raw) as GithubCache;
    } catch {
        return { timestamp: 0, projects: [] };
    }
}

function writeCache(cache: GithubCache): void {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

async function fetchRepoData(slug: string): Promise<{ description: string | null; stars: number; langs: Record<string, number> } | null> {
    try {
        const [repoRes, langRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${slug}`, { headers: { Accept: "application/vnd.github.v3+json" } }),
            fetch(`https://api.github.com/repos/${slug}/languages`, { headers: { Accept: "application/vnd.github.v3+json" } }),
        ]);
        if (!repoRes.ok || !langRes.ok) return null;
        const repo = await repoRes.json();
        const langs = await langRes.json();
        return { description: repo.description, stars: repo.stargazers_count, langs };
    } catch {
        return null;
    }
}

function toLangList(langs: Record<string, number>): CachedLanguage[] {
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return Object.entries(langs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, bytes]) => ({ name, percentage: ((bytes / total) * 100).toFixed(1) }));
}

/* ------------------------------------------------------------------ */
/*  Refresh all repos from GitHub API                                  */
/* ------------------------------------------------------------------ */

async function refreshCache(): Promise<GithubCache> {
    const projects: CachedProject[] = [];

    await Promise.allSettled(
        REPOS.map(async (repo) => {
            const slug = repoSlug(repo.url);
            if (!slug) return;
            const data = await fetchRepoData(slug);
            projects.push({
                name: repo.name,
                url: repo.url,
                description: data?.description || repo.fallbackDescription,
                stars: data?.stars ?? 0,
                languages: data ? toLangList(data.langs) : [],
            });
        }),
    );

    const ordered = REPOS.map((r) => projects.find((p) => p.url === r.url)).filter(Boolean) as CachedProject[];
    const cache: GithubCache = { timestamp: Date.now(), projects: ordered };
    writeCache(cache);
    return cache;
}

/* ------------------------------------------------------------------ */
/*  Public: get projects (cached, 1h TTL)                              */
/* ------------------------------------------------------------------ */

export async function getGithubProjects(): Promise<CachedProject[]> {
    const cache = readCache();

    if (cache.projects.length > 0 && Date.now() - cache.timestamp < ONE_HOUR_MS) {
        return cache.projects;
    }

    try {
        const fresh = await refreshCache();
        return fresh.projects;
    } catch {
        // If refresh fails but we have stale data, use it
        if (cache.projects.length > 0) return cache.projects;
        // Last resort: return fallback descriptions with no languages
        return REPOS.map((r) => ({
            name: r.name,
            url: r.url,
            description: r.fallbackDescription,
            stars: 0,
            languages: [],
        }));
    }
}
