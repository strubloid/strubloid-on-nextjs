#!/usr/bin/env node

/**
 * Update Facebook Data Script
 * Fetches fresh Facebook photo URLs and updates backend/data/facebook.json
 *
 * Usage: node scripts/update-facebook-json.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================================
// Environment Variables
// ============================================================================

// Load .env file (manual parsing, no dotenv dependency)
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key] = value;
        }
    });
}

const APP_ID = process.env.NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_ID;
const APP_SECRET = process.env.NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_SECRET;
const USER_TOKEN = process.env.NEXT_PUBLIC_STRUBLOID_FACEBOOK_USER_TOKEN;

if (!APP_ID || !APP_SECRET) {
    console.error('❌ Error: Missing Facebook App credentials in .env');
    console.error('Required:');
    console.error('  NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_ID');
    console.error('  NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_SECRET');
    process.exit(1);
}

if (!USER_TOKEN) {
    console.warn('⚠️  Warning: NEXT_PUBLIC_STRUBLOID_FACEBOOK_USER_TOKEN not found');
    console.warn('   Will try App Access Token, but photo access may be limited');
    console.warn('   Get a User Token: https://developers.facebook.com/tools/explorer\n');
}

// Data file path
const DATA_FILE = path.join(__dirname, '../backend/data/facebook.json');
const API_VERSION = 'v21.0';

// ============================================================================
// HTTP Utilities
// ============================================================================

/**
 * Fetch data from Facebook Graph API
 * @param {string} path API path (e.g., "/{photo-id}")
 * @param {string} accessToken Access token
 * @returns {Promise<any>}
 */
async function fetchFromFacebook(path, accessToken) {
    return new Promise((resolve, reject) => {
        const url = new URL(`https://graph.facebook.com/${API_VERSION}${path}`);
        url.searchParams.append('access_token', accessToken);

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(new Error(`Facebook API error: ${json.error.message}`));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Get App Access Token
 * @returns {Promise<string>}
 */
async function getAccessToken() {
    try {
        const data = await fetchFromFacebook(
            '/oauth/access_token',
            `${APP_ID}|${APP_SECRET}`
        );
        // Actually, for app access token we need a different endpoint
        // GET /oauth/access_token with client_id, client_secret, grant_type
        // Let me rewrite this to use a simpler approach
        return null;
    } catch (e) {
        throw new Error(`Failed to get access token: ${e.message}`);
    }
}

/**
 * Get Access Token
 * Prefers User Token (if available) over App Access Token
 * @returns {Promise<string>}
 */
async function getAccessToken() {
    // Use User Token if available (has better permissions)
    if (USER_TOKEN) {
        console.log('Using User Access Token from .env');
        return USER_TOKEN;
    }

    // Fall back to generating App Access Token
    return new Promise((resolve, reject) => {
        const url = new URL('https://graph.facebook.com/oauth/access_token');
        url.searchParams.append('client_id', APP_ID);
        url.searchParams.append('client_secret', APP_SECRET);
        url.searchParams.append('grant_type', 'client_credentials');

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(new Error(`Failed to get access token: ${json.error.message}`));
                    } else {
                        console.log('Generated App Access Token');
                        resolve(json.access_token);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse token response: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

// ============================================================================
// Album ID Normalization
// ============================================================================

/**
 * Normalize album ID by stripping "a." prefix if present
 * @param {string} albumId Album ID (with or without "a." prefix)
 * @returns {string} Normalized album ID
 */
function normalizeAlbumId(albumId) {
    if (!albumId) return albumId;
    return albumId.startsWith('a.') ? albumId.substring(2) : albumId;
}

// ============================================================================
// Facebook Photo Fetching
// ============================================================================

/**
 * Fetch a single photo by Facebook photo ID using album context
 * Returns the largest available CDN image URL
 * @param {string} fbid Photo ID
 * @param {string} accessToken
 * @returns {Promise<string|null>}
 */
async function fetchPhotoUrl(fbid, accessToken) {
    try {
        // Try to fetch the photo directly with images field
        const response = await fetchFromFacebook(`/${fbid}?fields=images`, accessToken);
        if (response.images && response.images.length > 0) {
            // Return the largest image source URL (CDN URL, not Facebook page)
            return response.images[0].source;
        }
        return null;
    } catch (e) {
        console.warn(`⚠️  Could not fetch photo ${fbid}: ${e.message}`);
        return null;
    }
}

/**
 * Get user's albums and find the correct album ID format
 * @param {string} accessToken
 * @returns {Promise<Map>} Map of album identifiers to album IDs
 */
async function fetchUserAlbums(accessToken) {
    try {
        const response = await fetchFromFacebook(
            `/me/albums?fields=id,name,count&limit=100`,
            accessToken
        );

        if (!response.data || !Array.isArray(response.data)) {
            return new Map();
        }

        const albumMap = new Map();
        for (const album of response.data) {
            // Store the full API ID format
            albumMap.set(album.id, { id: album.id, name: album.name, count: album.count });

            // Also store by numeric part only (for setid lookups)
            // Album IDs from API come as "{user_id}_{numeric_id}", extract numeric part
            if (album.id.includes('_')) {
                const numericPart = album.id.split('_')[1];
                // Store both formats: "a.{numeric}" and just "{numeric}"
                albumMap.set(`a.${numericPart}`, { id: album.id, name: album.name, count: album.count });
                albumMap.set(numericPart, { id: album.id, name: album.name, count: album.count });
            }
        }

        console.log(`✅ Found ${response.data.length} album(s):\n`);
        for (const album of response.data) {
            console.log(`   - ${album.name} (ID: ${album.id}, ${album.count} photos)`);
        }
        console.log('');

        return albumMap;
    } catch (e) {
        console.warn(`⚠️  Could not fetch user albums: ${e.message}`);
        return new Map();
    }
}

/**
 * Fetch all photos from a Facebook album (with pagination)
 * Extracts the actual CDN image URLs (scontent.*.fna.fbcdn.net)
 * @param {string} albumIdentifier Album ID or identifier (with or without "a." prefix)
 * @param {string} accessToken
 * @returns {Promise<Array>}
 */
async function fetchAlbumPhotos(albumIdentifier, accessToken) {
    try {
        const allPhotos = [];
        let after = null;
        let pageCount = 0;
        const maxPages = 10; // Limit to 10 pages to avoid excessive API calls

        while (pageCount < maxPages) {
            let url = `/${albumIdentifier}/photos?fields=id,images,name,created_time&limit=100`;
            if (after) {
                url += `&after=${after}`;
            }

            let response = await fetchFromFacebook(url, accessToken);

            if (!response.data || !Array.isArray(response.data)) {
                break;
            }

            // Process photos from this page
            for (const photo of response.data) {
                let imageUrl = '';
                if (photo.images && Array.isArray(photo.images) && photo.images.length > 0) {
                    imageUrl = photo.images[0].source || '';
                }

                allPhotos.push({
                    fbid: photo.id,
                    title: photo.name || 'Photo',
                    url: imageUrl,
                });
            }

            // Check if there are more pages
            if (response.paging && response.paging.cursors && response.paging.cursors.after) {
                after = response.paging.cursors.after;
                pageCount++;
            } else {
                break;
            }
        }

        return allPhotos;
    } catch (e) {
        console.warn(`⚠️  Could not fetch album ${albumIdentifier}: ${e.message}`);
        return [];
    }
}

// ============================================================================
// JSON Processing
// ============================================================================

/**
 * Read current facebook.json
 */
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.warn(`⚠️  ${DATA_FILE} not found. Creating new file.`);
            return { timestamp: Date.now(), photos: [] };
        }
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        throw new Error(`Failed to read ${DATA_FILE}: ${e.message}`);
    }
}

/**
 * Write updated data to facebook.json
 */
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✅ Updated ${DATA_FILE}`);
    } catch (e) {
        throw new Error(`Failed to write ${DATA_FILE}: ${e.message}`);
    }
}

// ============================================================================
// Main Script
// ============================================================================

async function main() {
    console.log('🔄 Fetching Facebook photos...\n');

    try {
        // Get access token
        console.log('📝 Authenticating with Facebook...');
        const accessToken = await getAccessToken();
        console.log('✅ Ready to fetch photos\n');

        // Read existing data
        const data = readData();
        let photos = data.photos || [];
        let photosUpdated = 0;
        let photosExpanded = 0;

        // Fetch user's albums first to get correct ID format
        console.log(`🔄 Loading your Facebook albums...\n`);
        const userAlbumsMap = await fetchUserAlbums(accessToken);

        // Group photos by album for efficient batch processing
        const albumMap = new Map();
        const individualsToFetch = [];

        for (const entry of photos) {
            if (entry.setid) {
                const albumIdentifier = entry.setid;
                if (!albumMap.has(albumIdentifier)) {
                    albumMap.set(albumIdentifier, []);
                }
                albumMap.get(albumIdentifier).push(entry);
            } else if (entry.fbid) {
                individualsToFetch.push(entry);
            }
        }

        // Fetch albums once and update all photos from that album
        console.log(`🔄 Fetching ${albumMap.size} album(s)...\n`);

        for (const [albumIdentifier, entries] of albumMap) {
            console.log(`📷 Album ${albumIdentifier} (${entries.length} photo entries)`);

            // Normalize album ID by stripping "a." prefix
            const normalizedId = normalizeAlbumId(albumIdentifier);

            // Try to find the correct album ID format
            let correctAlbumId = normalizedId;

            // Try lookup with normalized ID first
            if (userAlbumsMap.has(normalizedId)) {
                correctAlbumId = userAlbumsMap.get(normalizedId).id;
                console.log(`   → Using correct API format: ${correctAlbumId}`);
            }
            // Try with original ID if normalized didn't match
            else if (userAlbumsMap.has(albumIdentifier)) {
                correctAlbumId = userAlbumsMap.get(albumIdentifier).id;
                console.log(`   → Using correct API format: ${correctAlbumId}`);
            }
            // Fall back to normalized ID
            else {
                console.log(`   → Album not found in your albums. Using: ${correctAlbumId}`);
            }

            const albumPhotos = await fetchAlbumPhotos(correctAlbumId, accessToken);

            if (albumPhotos.length > 0) {
                console.log(`   ✅ Found ${albumPhotos.length} photos\n`);

                // Debug: Show the fbids returned from API
                const apiFbids = albumPhotos.map(p => p.fbid);
                if (entries.length > 0 && apiFbids.length > 0) {
                    console.log(`   📊 Sample API fbid:    ${apiFbids[0]}`);
                    console.log(`   📊 Sample entry fbid:  ${entries[0].fbid}\n`);
                }

                // Create a map of fbid -> photo data
                const photoMap = new Map(albumPhotos.map(p => [p.fbid, p]));

                // Update each entry with the corresponding photo data
                let matchedCount = 0;
                for (const entry of entries) {
                    if (photoMap.has(entry.fbid)) {
                        matchedCount++;
                        const photoData = photoMap.get(entry.fbid);
                        if (photoData.url) {
                            entry.url = photoData.url;
                            photosUpdated++;
                            console.log(`   ✅ ${entry.id} → CDN URL fetched`);
                        } else {
                            console.log(`   ⚠️  ${entry.id} → No URL in response`);
                        }
                    } else {
                        console.log(`   ⚠️  ${entry.id} (fbid: ${entry.fbid}) → Photo not in album`);
                    }
                }
                console.log(`   📊 Matched: ${matchedCount}/${entries.length} photos\n`);
            } else {
                console.log(`   ⚠️  Could not fetch album photos\n`);
            }
        }

        // Fetch individual photos without albums
        if (individualsToFetch.length > 0) {
            console.log(`🔄 Fetching ${individualsToFetch.length} individual photo(s)...\n`);

            for (const entry of individualsToFetch) {
                console.log(`📸 ${entry.id}`);
                const url = await fetchPhotoUrl(entry.fbid, accessToken);
                if (url) {
                    entry.url = url;
                    photosUpdated++;
                    console.log(`   ✅ CDN URL fetched`);
                } else {
                    console.log(`   ⚠️  No URL found`);
                }
                console.log('');
            }
        }

        // Update timestamp
        data.timestamp = Date.now();
        data.photos = photos;

        // Write updated file
        writeData(data);

        // Summary
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Summary:');
        console.log(`   CDN URLs updated: ${photosUpdated}/${data.photos.length}`);
        console.log(`   Albums processed: ${albumMap.size}`);
        console.log(`   Total photos:     ${data.photos.length}`);
        console.log('');
        console.log('📌 Next Steps:');
        console.log('   Run this script regularly (daily/weekly) to refresh');
        console.log('   CDN URLs before they expire');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
