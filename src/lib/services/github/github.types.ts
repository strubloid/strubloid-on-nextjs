/**
 * GitHub Service Types
 * Types for GitHub API integration and caching
 */

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

export interface GithubRepo {
    name: string;
    url: string;
    fallbackDescription: string;
}
