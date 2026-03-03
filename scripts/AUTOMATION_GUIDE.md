# Facebook URL Auto-Renewal Automation Guide

Your Facebook CDN URLs expire over time. Here are **4 ways** to automatically refresh them:

---

## Option 1: npm Script (Manual but Easy)

Run whenever you want to refresh URLs:

```bash
npm run update:facebook
```

This is the simplest way to update URLs on-demand.

---

## Option 2: Cron Job (Linux/Mac/WSL)

### Setup a daily refresh at midnight:

```bash
# Open crontab editor
crontab -e

# Add this line (replaces every day at midnight):
0 0 * * * cd /home/strubloid/apps/strubloid-on-nextjs && npm run update:facebook

# Or using node directly:
0 0 * * * cd /home/strubloid/apps/strubloid-on-nextjs && node scripts/update-facebook-json.js
```

### Cron Schedule Examples:
```
0 0 * * *     = Every day at midnight
0 */6 * * *   = Every 6 hours
0 0 * * 0     = Every Sunday at midnight
0 12 * * *    = Every day at noon
30 2 * * *    = Every day at 2:30 AM
```

### Verify cron is working:

```bash
# List current cron jobs
crontab -l

# Check cron logs (on Mac)
log stream --predicate 'eventMessage contains[cd] "cron"'

# Check cron logs (on Linux)
grep CRON /var/log/syslog | tail -20
```

---

## Option 3: GitHub Actions (Automated in the Cloud)

Create `.github/workflows/update-facebook.yml`:

```yaml
name: Update Facebook URLs

on:
  schedule:
    # Runs every day at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Allow manual trigger from GitHub UI

jobs:
  update-facebook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Update Facebook URLs
        env:
          NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_ID: ${{ secrets.FACEBOOK_APP_ID }}
          NEXT_PUBLIC_STRUBLOID_FACEBOOK_APP_SECRET: ${{ secrets.FACEBOOK_APP_SECRET }}
          NEXT_PUBLIC_STRUBLOID_FACEBOOK_USER_TOKEN: ${{ secrets.FACEBOOK_USER_TOKEN }}
        run: npm run update:facebook

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add backend/data/facebook.json
          git commit -m "chore: auto-refresh Facebook URLs" || echo "No changes to commit"
          git push
```

### Setup Instructions:

1. **Add secrets to GitHub**:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add three secrets:
     - `FACEBOOK_APP_ID`
     - `FACEBOOK_APP_SECRET`
     - `FACEBOOK_USER_TOKEN`

2. **Create the workflow file** (or use the template above):
   ```bash
   mkdir -p .github/workflows
   # Add the YAML file above
   ```

3. **Test it**: Go to Actions tab → "Update Facebook URLs" → "Run workflow" → Green ✅

**Pros**: Runs in the cloud, no local setup, auto-commits to repo
**Cons**: Requires GitHub secrets configuration

---

## Option 4: Next.js API Route (On-Demand + Scheduled)

Create `src/pages/api/refresh-facebook.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import { execSync } from "child_process";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security: only allow from localhost or with a secret token
  const token = req.query.token || req.headers.authorization?.split(" ")[1];
  const REFRESH_TOKEN = process.env.FACEBOOK_REFRESH_SECRET;

  if (!REFRESH_TOKEN || token !== REFRESH_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const scriptPath = path.join(process.cwd(), "scripts", "update-facebook-json.js");

    execSync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    return res.status(200).json({ success: true, message: "Facebook URLs refreshed" });
  } catch (error: any) {
    return res.status(500).json({
      error: "Failed to refresh URLs",
      details: error.message
    });
  }
}
```

### Add to `.env`:
```
FACEBOOK_REFRESH_SECRET=your-secret-token-here
```

### Call manually:
```bash
curl "http://localhost:3000/api/refresh-facebook?token=your-secret-token-here"
```

### Or set up a cron job to call it:
```bash
0 0 * * * curl -s "https://your-site.com/api/refresh-facebook?token=YOUR_SECRET_TOKEN"
```

**Pros**: Integrated into Next.js, can be triggered remotely
**Cons**: Requires server to be running

---

## Recommended Approach for Your Setup

### For **Development** (local):
- Use **cron job** (Option 2) for daily automatic refresh

### For **Production** (on Netlify/Vercel):
- Use **GitHub Actions** (Option 3) + auto-commit
- Or integrate refresh into your deployment pipeline

### For **Testing**:
```bash
# Run manually anytime
npm run update:facebook
```

---

## How to Know It's Working

1. **Check the timestamp** in `backend/data/facebook.json`:
   ```bash
   grep timestamp backend/data/facebook.json
   ```
   Should update each time you run the script.

2. **Check image URLs**:
   ```bash
   grep "scontent" backend/data/facebook.json | head -1
   ```
   Should show active CDN URLs like: `https://scontent.fXXX-X.fna.fbcdn.net/v/...`

3. **Test in browser**:
   - Visit `/website` page
   - Right-click hero image → "Open image in new tab"
   - Should load successfully (not 403 error)

---

## Troubleshooting

### "command not found: crontab"
You're on Windows. Use **Option 3 (GitHub Actions)** instead.

### Cron job not running
```bash
# Check if Node is in your PATH
which node
# If empty, use full path in crontab:
0 0 * * * /usr/bin/node /path/to/scripts/update-facebook-json.js
```

### GitHub Actions failing
- Check workflow logs in Actions tab
- Verify secrets are set correctly
- Make sure `.env` variables match secret names

---

## Next Steps

1. **Choose your method** (cron, GitHub Actions, or manual npm script)
2. **Test once**: Run `npm run update:facebook` to verify it works
3. **Set up your chosen automation**
4. **Monitor**: Check that images stay fresh and don't 404

