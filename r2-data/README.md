# R2 Data Structure

This folder contains data to be uploaded to Cloudflare R2.

## Required R2 Structure

```
qariee-audio/                    (R2 Bucket Name)
├── metadata/
│   └── reciters.json            ⭐ Upload this file
│
├── audio/
│   ├── mishary-alafasy/
│   │   ├── 001.mp3
│   │   ├── 002.mp3
│   │   └── ... (114 files)
│   ├── abdul-basit/
│   │   └── ... (114 files)
│   └── sudais/
│       └── ... (114 files)
│
└── images/
    └── reciters/
        ├── mishary-alafasy.jpg
        ├── abdul-basit.jpg
        └── sudais.jpg
```

## Setup Instructions

### 1. Create Cloudflare R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Click **Create Bucket**
4. Name: `qariee-audio`
5. Location: Choose closest to your users (or default)
6. Click **Create Bucket**

### 2. Enable Public Access

**Option A: R2.dev Domain (Quick, for testing)**
1. Go to your bucket settings
2. Enable **Public Access**
3. Copy the R2.dev URL: `https://pub-xxxxx.r2.dev`
4. Update app config with this URL

**Option B: Custom Domain (Production)**
1. Go to bucket **Settings**
2. Under **Public Access**, click **Connect Domain**
3. Add domain: `cdn.qariee.com` (or subdomain of your choice)
4. Follow DNS setup instructions
5. Wait for DNS propagation

### 3. Upload Files to R2

**Using Cloudflare Dashboard:**
1. Open your bucket
2. Click **Upload**
3. Create folders: `metadata`, `audio`, `images`
4. Upload `reciters.json` to `metadata/` folder

**Using Rclone (Recommended for bulk uploads):**

Install Rclone:
```bash
# macOS
brew install rclone

# Or download from https://rclone.org/downloads/
```

Configure Rclone:
```bash
rclone config

# Choose: n (new remote)
# Name: r2
# Type: s3
# Provider: Cloudflare
# Access Key ID: [from R2 API tokens]
# Secret Access Key: [from R2 API tokens]
# Region: auto
# Endpoint: https://[account-id].r2.cloudflarestorage.com
```

Upload files:
```bash
# Upload metadata
rclone copy ./r2-data/metadata/ r2:qariee-audio/metadata/

# Upload audio (when ready)
rclone copy ./audio/ r2:qariee-audio/audio/ --progress

# Upload images (when ready)
rclone copy ./images/ r2:qariee-audio/images/ --progress
```

### 4. Get R2 API Tokens

1. Go to R2 → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Permissions: **Object Read & Write**
4. TTL: Choose duration
5. Click **Create API Token**
6. Save the **Access Key ID** and **Secret Access Key**

### 5. Update App Configuration

After uploading, update the CDN URL in app:

Edit: `/Users/yousef/dev/qariee/app/src/constants/config.ts`

```typescript
// Change from:
export const CDN_BASE_URL = 'https://cdn.qariee.com';

// To your R2 URL:
export const CDN_BASE_URL = 'https://pub-xxxxx.r2.dev';
// OR
export const CDN_BASE_URL = 'https://cdn.yourdomain.com';
```

### 6. Test URLs

After upload, test these URLs in browser:

```
https://pub-xxxxx.r2.dev/metadata/reciters.json
https://pub-xxxxx.r2.dev/images/reciters/mishary-alafasy.jpg
https://pub-xxxxx.r2.dev/audio/mishary-alafasy/001.mp3
```

## Current Status

- ✅ `metadata/reciters.json` - Created (3 reciters)
- ⏳ Audio files - Need to source
- ⏳ Reciter images - Need to source
- ⏳ R2 bucket - Need to create
- ⏳ Public access - Need to configure

## Next Steps

1. **Create R2 bucket** on Cloudflare
2. **Enable public access** (R2.dev URL for now)
3. **Upload reciters.json**
4. **Update app config** with R2 URL
5. **Test app** - should show 3 reciters
6. **Source audio files** for 3 reciters (114 surahs each)
7. **Get reciter photos** (3 images)
8. **Upload audio & images** to complete setup

## Audio File Sources (TODO)

Where to get Quran audio:
- EveryAyah.com
- Quran.com API
- Official reciter websites
- Islamic audio archives

## Cost Estimate

For 3 reciters × 114 surahs × ~5MB average:
- Storage: ~1.7 GB = **$0.03/month**
- Operations: Minimal for testing
- Egress: **$0** (free!)

**Total: < $0.05/month** for testing 🎉

## Notes

- Start with just `reciters.json` to test the app
- Add audio files gradually (large files)
- Use placeholder images initially if needed
- R2.dev URLs work immediately (no DNS wait)
