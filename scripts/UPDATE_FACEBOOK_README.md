# Update Facebook Data Script

This script fetches fresh **Facebook CDN image URLs** (from `scontent.*.fna.fbcdn.net`) and updates `backend/data/facebook.json`. These URLs expire over time due to security parameters, so this script should be run periodically.

## What It Does

The script reads your `facebook.json` and:

1. **Groups photos by album** (`setid`)
2. **Fetches from Facebook Graph API** to get the latest CDN image URLs
3. **Extracts the largest image** for each photo
4. **Updates the `url` field** with fresh CDN URLs (e.g., `https://scontent.fdub6-1.fna.fbcdn.net/v/...`)
5. **Preserves `fbid` and `setid`** for future updates

## Why This Matters

Facebook CDN URLs contain expiring parameters:
```
https://scontent.fdub6-1.fna.fbcdn.net/v/t39.30808-6/...
  ?_nc_cat=106          ← expires
  &_nc_sid=f798df       ← expires
  &_nc_ohc=xSqWxf4Zso   ← expires
  ...&oe=69AC88D4        ← expires
```

By storing **IDs** (`fbid`, `setid`) instead of URLs, you can refresh them anytime.

## Prerequisites

### ✅ Already in your `.env`:
```
NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_ID=<your-app-id>
NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_SECRET=<your-app-secret>
```

### ⚠️ **Required: User Access Token**

The App Access Token has limited permissions. You need a **User Access Token** to access photos.

#### Getting a User Access Token

**Quick way (24-hour token):**
1. Go to https://developers.facebook.com/tools/explorer
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Copy the token and add to `.env`:
```
NEXT_PUBLIC_STRUBLOID_FACEBOOK_USER_TOKEN=<your-token>
```

**Long-lived token (60 days):**
See the Facebook Docs: https://developers.facebook.com/docs/facebook-login/access-tokens/access-token-gen

## How to Run

### Option 1: Direct Node (Recommended)
```bash
cd /path/to/strubloid-on-nextjs
node scripts/update-facebook-json.js
```

### Option 2: Using npm script (add to package.json)
Add this to your `package.json` `scripts` section:
```json
"scripts": {
  "update:facebook": "node scripts/update-facebook-json.js",
  ...
}
```

Then run:
```bash
npm run update:facebook
```

### Option 3: Schedule with cron (update daily)
```bash
# Add to crontab
0 0 * * * cd /path/to/strubloid-on-nextjs && node scripts/update-facebook-json.js
```

## Output Example

```
🔄 Fetching Facebook photos...

📝 Authenticating with Facebook...
✅ Got access token

📸 [1/2] Processing photo_1...
   → Fetching photo 25499029293038529
   ✅ URL updated

📸 [2/2] Processing photo_2...
   → Fetching album a.311306528904153
   ✅ Found 12 photos in album
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
   Photos updated:  1
   Albums expanded: 12
   Total photos:    13
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## What Gets Updated

**Before:**
```json
{
  "timestamp": 1739980000,
  "photos": [
    {
      "id": "photo_1",
      "fbid": "25499029293038529",
      "setid": "a.311306528904153",
      "title": "Facebook Photo 1",
      "url": ""
    }
  ]
}
```

**After:**
```json
{
  "timestamp": 1740048000,
  "photos": [
    {
      "id": "photo_1",
      "fbid": "25499029293038529",
      "setid": "a.311306528904153",
      "title": "Facebook Photo 1",
      "url": "https://scontent.fcai1-2.fna.fbcdn.net/v/t1.6435-9/..."
    },
    {
      "id": "photo_1_1",
      "fbid": "123456789",
      "setid": "a.311306528904153",
      "title": "Album Photo 1",
      "url": "https://scontent.fcai1-2.fna.fbcdn.net/v/..."
    }
    // ... more album photos
  ]
}
```

## Next Step: Runtime URL Fetching

After this script works, you can create a **backend service** that:
1. Caches the URLs for 24 hours
2. Automatically refreshes stale URLs
3. Handles API errors gracefully

See: `backend/services/flickr/flickr.service.ts` for the reference pattern to replicate for Facebook.

## Troubleshooting

### "Missing Facebook credentials"
Make sure `NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_ID` and `NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_SECRET` are in your `.env` file.

### "Failed to get access token"
Check that your App ID and Secret are correct and active in Facebook Developers dashboard.

### "Could not fetch photo" or "Could not fetch album"
The photo/album might be private. Make sure your app has permission to access the photos.

## Future Enhancement

Create an API endpoint: `src/pages/api/facebook.ts` that:
- Calls this script periodically
- Caches URLs in memory for 24 hours
- Serves fresh URLs to the frontend
- Falls back to `facebook.json` if API fails

Similar to: `src/pages/api/flickr.ts`
