// Script to update flickr.json with live album data from Flickr API
// Uses the flickr-sdk (same as lib/flickr.ts) for reliable authentication
const fs = require('fs');
const path = require('path');
const { createFlickr } = require('flickr-sdk');

// Load .env file
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

const flickrPath = path.join(__dirname, '../data/flickr.json');
const API_KEY = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_KEY;
const USERNAME = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_ID || 'josephbr';
const USER_ID = process.env.NEXT_PUBLIC_STRUBLOID_FLICKR_NSID || '59111853@N06';

console.log('Starting Flickr JSON update script...');
console.log(`Using API Key: ${API_KEY ? '✓' : '✗ (missing)'}`);

if (!API_KEY) {
    console.error('Error: NEXT_PUBLIC_STRUBLOID_FLICKR_KEY environment variable is not set');
    process.exit(1);
}

// Initialize flickr SDK
const { flickr } = createFlickr(API_KEY);

// Helper: Build photo URL from Flickr response
function buildPhotoUrl(server, id, secret, size = 'z') {
    return `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

async function updateFlickrJson() {
    console.log('Reading existing flickr.json...');
    let flickrData;
    try {
        const content = fs.readFileSync(flickrPath, 'utf8');
        flickrData = JSON.parse(content);
    } catch (e) {
        console.error('Error reading flickr.json:', e.message);
        process.exit(1);
    }

    const albums = flickrData.albums || [];

    if (albums.length === 0) {
        console.log('No albums found in flickr.json');
        return;
    }

    console.log(`Found ${albums.length} albums. Fetching live data from Flickr API...\n`);

    // Fetch fresh album data from API
    let liveAlbums = [];
    try {
        console.log(`Calling flickr.photosets.getList with user_id: ${USER_ID}`);
        const response = await flickr('flickr.photosets.getList', {
            user_id: USER_ID,
            per_page: '100',
        });

        console.log(`✓ API Response received\n`);

        if (response.photosets && Array.isArray(response.photosets.photoset)) {
            console.log(`Found ${response.photosets.photoset.length} albums in API response\n`);
            liveAlbums = response.photosets.photoset.map((set) => ({
                id: set.id,
                title: set.title?._content || 'Untitled',
                description: set.description?._content?.replace(/<[^>]+>/g, '') || '',
                photoCount: parseInt(set.photos, 10),
                coverUrl: set.server && set.primary && set.secret
                    ? buildPhotoUrl(set.server, set.primary, set.secret, 'z')
                    : '',
                flickrUrl: `https://www.flickr.com/photos/${USERNAME}/albums/${set.id}`,
            }));
        } else {
            console.log('⚠️  No photosets found in API response (albums may be private)\n');
        }
    } catch (e) {
        console.error(`Error fetching album data from Flickr API: ${e.message}`);
        console.log('Continuing with existing album data...\n');
    }

    // Create a map of live albums by ID for quick lookup
    const liveAlbumsMap = new Map();
    liveAlbums.forEach(album => {
        liveAlbumsMap.set(album.id, album);
    });

    // Update albums with live data
    let updatedCount = 0;
    for (const album of albums) {
        const liveAlbum = liveAlbumsMap.get(album.id);

        if (!liveAlbum) {
            console.log(`⚠️  Album "${album.title}" (${album.id}) not found in live data`);
            continue;
        }

        const changes = [];

        // Check title
        if (album.title !== liveAlbum.title) {
            changes.push(`title: "${album.title}" → "${liveAlbum.title}"`);
            album.title = liveAlbum.title;
        }

        // Check description
        if (album.description !== liveAlbum.description) {
            const oldDesc = album.description.substring(0, 50).replace(/\n/g, ' ');
            const newDesc = liveAlbum.description.substring(0, 50).replace(/\n/g, ' ');
            changes.push(`description: "${oldDesc}..." → "${newDesc}..."`);
            album.description = liveAlbum.description;
        }

        // Check photoCount
        if (album.photoCount !== liveAlbum.photoCount) {
            changes.push(`photoCount: ${album.photoCount} → ${liveAlbum.photoCount}`);
            album.photoCount = liveAlbum.photoCount;
        }

        // Check coverUrl
        if (album.coverUrl !== liveAlbum.coverUrl) {
            changes.push(`coverUrl: updated`);
            album.coverUrl = liveAlbum.coverUrl;
        }

        // Check flickrUrl
        if (album.flickrUrl !== liveAlbum.flickrUrl) {
            changes.push(`flickrUrl: "${album.flickrUrl}" → "${liveAlbum.flickrUrl}"`);
            album.flickrUrl = liveAlbum.flickrUrl;
        }

        if (changes.length > 0) {
            console.log(`✓ Updated "${album.title}":`);
            changes.forEach(change => console.log(`  • ${change}`));
            updatedCount++;
        } else {
            console.log(`✓ "${album.title}" — no changes`);
        }
    }

    // Save updated data
    console.log(`\nSaving updated data to flickr.json...`);
    fs.writeFileSync(flickrPath, JSON.stringify(flickrData, null, 2));
    console.log(`✓ Complete! Updated ${updatedCount} album(s).`);
}

// Run the update
updateFlickrJson().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
