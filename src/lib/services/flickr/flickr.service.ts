/**
 * Flickr Service
 * Fetches and caches Flickr photostream and albums
 */

import fs from "fs";
import path from "path";
import { createFlickr } from "flickr-sdk";
import type { FlickrPhoto, FlickrAlbum, FlickrCache } from "./flickr.types";

// Configuration
const ONE_HOUR_MS = 60 * 60 * 1000;
const CACHE_FILE = path.join(process.cwd(), "data", "flickr.json");

// Environment variables
const API_KEY = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_KEY ?? "";
const USERNAME = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_ID ?? "johndoe";
let USER_ID = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_NSID ?? "52424323@Z03";

// Flickr SDK instance
const { flickr } = createFlickr(API_KEY);

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Read Flickr cache from file
 * Returns null if cache doesn't exist or can't be parsed
 */
function readCache(): FlickrCache | null {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        }
    } catch {
        /* ignore corrupt cache */
    }
    return null;
}

/**
 * Write Flickr cache to file
 */
function writeCache(data: FlickrCache): void {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ============================================================================
// User Resolution
// ============================================================================

let resolvedUserId: string | null = null;

/**
 * Resolve Flickr user ID from username
 * Cached per process lifetime
 * Falls back to default ID if resolution fails
 */
async function resolveUserId(): Promise<string> {
    if (resolvedUserId) return resolvedUserId;

    try {
        const body = await flickr("flickr.people.findByUsername", { username: USERNAME });
        resolvedUserId = (body as any).user.nsid;
        return resolvedUserId!;
    } catch {
        return USER_ID;
    }
}

// ============================================================================
// URL Builders
// ============================================================================

/**
 * Build a Flickr photo URL using live.staticflickr.com
 */
function buildPhotoUrl(server: string, id: string, secret: string, size: string): string {
    return `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

/**
 * Build the page URL for a photo on Flickr
 */
function buildPageUrl(photoId: string): string {
    return `https://www.flickr.com/photos/${USERNAME}/${photoId}`;
}

// ============================================================================
// API Fetching
// ============================================================================

/**
 * Fetch photostream from Flickr API
 * Paginates up to 10 pages of 100 photos each
 */
async function fetchPhotostream(): Promise<FlickrPhoto[]> {
    const userId = await resolveUserId();
    const photos: FlickrPhoto[] = [];
    let page = 1;
    const perPage = 100;
    let totalPages = 1;

    while (page <= totalPages && page <= 10) {
        try {
            const body = await flickr("flickr.people.getPublicPhotos", {
                user_id: userId,
                per_page: String(perPage),
                page: String(page),
                extras: "url_z,url_c,url_l,url_o,description",
            });

            const data = body as any;
            totalPages = data.photos.pages;

            for (const p of data.photos.photo) {
                const url_z = p.url_z ?? buildPhotoUrl(p.server, p.id, p.secret, "z");
                const url_c = p.url_c ?? buildPhotoUrl(p.server, p.id, p.secret, "c");
                const url_l = p.url_l ?? buildPhotoUrl(p.server, p.id, p.secret, "b");

                photos.push({
                    id: p.id,
                    title: p.title || "Untitled",
                    description: p.description?._content?.replace(/<[^>]+>/g, "") || "",
                    url_z,
                    url_c,
                    url_l,
                    url_o: p.url_o,
                    width_z: parseInt(p.width_z || "640", 10),
                    height_z: parseInt(p.height_z || "480", 10),
                    pageUrl: buildPageUrl(p.id),
                });
            }
        } catch {
            break;
        }

        page++;
    }

    return photos;
}

/**
 * Fetch albums from Flickr API
 */
async function fetchAlbums(): Promise<FlickrAlbum[]> {
    const userId = await resolveUserId();

    try {
        const body = await flickr("flickr.photosets.getList", {
            user_id: userId,
            per_page: "50",
        });

        const data = body as any;
        if (!data || !data.photosets || !Array.isArray(data.photosets.photoset)) return [];

        return data.photosets.photoset.map((set: any) => ({
            id: set.id,
            title: set.title?._content || "Untitled",
            description: set.description?._content?.replace(/<[^>]+>/g, "") || "",
            photoCount: set.photos,
            coverUrl:
                set.server && set.primary && set.secret
                    ? buildPhotoUrl(set.server, set.primary, set.secret, "z")
                    : "",
            flickrUrl: `https://www.flickr.com/photos/${USERNAME}/albums/${set.id}`,
        }));
    } catch {
        return [];
    }
}

/**
 * Fetch photos from public feed as fallback
 * Used when API calls fail or return empty
 */
async function fetchFromPublicFeed(): Promise<FlickrPhoto[]> {
    const userId = await resolveUserId();
    const feedUrl = `https://www.flickr.com/services/feeds/photos_public.gne?id=${userId}&format=json&nojsoncallback=1`;

    try {
        const res = await fetch(feedUrl);
        if (!res.ok) return [];

        const json = await res.json();
        if (!json.items || !Array.isArray(json.items)) return [];

        return json.items.map((item: any, idx: number) => {
            const url_z = item.media.m.replace("_m.", "_z.");
            const url_c = item.media.m.replace("_m.", "_c.");
            const url_l = item.media.m.replace("_m.", "_b.");

            return {
                id: item.link.split("/").filter(Boolean).pop() || `feed-${idx}`,
                title: item.title || "Untitled",
                description: item.description?.replace(/<[^>]+>/g, "") || "",
                url_z,
                url_c,
                url_l,
                url_o: item.media.m,
                width_z: 640,
                height_z: 480,
                pageUrl: item.link,
            };
        });
    } catch {
        return [];
    }
}

// ============================================================================
// Cache Refresh
// ============================================================================

/**
 * Refresh Flickr cache from API
 * Falls back to existing cache if API returns empty (rate limit/auth issues)
 */
async function refreshCache(existing: FlickrCache | null): Promise<FlickrCache> {
    const [photos, albums] = await Promise.all([fetchPhotostream(), fetchAlbums()]);

    // Preserve existing data if API returns empty
    const finalPhotos = photos.length > 0 ? photos : existing?.photos ?? [];
    const finalAlbums = albums.length > 0 ? albums : existing?.albums ?? [];

    const hasNewData = photos.length > 0 || albums.length > 0;

    const cache: FlickrCache = {
        timestamp: hasNewData ? Date.now() : (existing?.timestamp ?? Date.now()),
        photos: finalPhotos,
        albums: finalAlbums,
    };

    if (hasNewData || !existing) {
        writeCache(cache);
    }

    return cache;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Get Flickr data with intelligent caching
 * Uses 1-hour TTL for cache validity
 * Falls back to public feed if API data is empty
 * @returns Object containing photos and albums
 */
export async function getFlickrData(): Promise<{ photos: FlickrPhoto[]; albums: FlickrAlbum[] }> {
    const cached = readCache();

    // Return cached data if fresh
    if (cached && Date.now() - cached.timestamp < ONE_HOUR_MS) {
        return { photos: cached.photos, albums: cached.albums };
    }

    const fresh = await refreshCache(cached);

    // Try public feed if API returns no photos
    if (fresh.photos.length === 0) {
        const feedPhotos = await fetchFromPublicFeed();
        if (feedPhotos.length > 0) {
            const cache: FlickrCache = {
                timestamp: Date.now(),
                photos: feedPhotos,
                albums: fresh.albums,
            };
            writeCache(cache);
            return { photos: feedPhotos, albums: fresh.albums };
        }
    }

    return { photos: fresh.photos, albums: fresh.albums };
}
