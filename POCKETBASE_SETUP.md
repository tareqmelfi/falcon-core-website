# PocketBase Setup Guide

This guide explains how to set up PocketBase for local development and production deployment via Dokploy.

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Initial Data Migration](#initial-data-migration)
3. [Creating Collections](#creating-collections)
4. [Production Deployment](#production-deployment)
5. [Multi-Site Configuration](#multi-site-configuration)

---

## Local Development Setup

### Quick Start with Docker Compose

```bash
# Start PocketBase and other services
docker-compose up -d

# Access PocketBase admin panel
# URL: http://localhost:8090/_/
# Default email: admin@example.com
# Default password: admin123456
```

### Manual Installation (without Docker)

1. **Download PocketBase**
   ```bash
   # On macOS (Intel)
   curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.5/pocketbase_0.21.5_darwin_amd64.zip -o pb.zip && unzip pb.zip

   # On Linux
   curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.21.5/pocketbase_0.21.5_linux_amd64.zip -o pb.zip && unzip pb.zip

   # On Windows
   # Download from: https://github.com/pocketbase/pocketbase/releases
   ```

2. **Run PocketBase**
   ```bash
   ./pocketbase serve
   ```

3. **Access Admin Panel**
   - Open: http://localhost:8090/_/
   - Create admin account on first visit

4. **Update .env.local**
   ```env
   VITE_POCKETBASE_URL=http://localhost:8090
   POCKETBASE_URL=http://localhost:8090
   ```

---

## Creating Collections

### Step 1: Access PocketBase Admin

1. Go to http://localhost:8090/_/
2. Log in with your admin credentials
3. Click **Collections** in the left sidebar

### Step 2: Create "articles" Collection

1. Click **Create new**
2. Enter name: `articles`
3. Choose type: **Base collection**
4. Add these fields:

| Field Name | Type | Required | Options |
|-----------|------|----------|---------|
| slug | Text | ✓ | Index, Searchable, Unique |
| title | Text | ✓ | Searchable |
| excerpt | Text | | Searchable |
| content | Editor | ✓ | |
| featured_image | File | | Single file |
| author | Text | | |
| date | Date | | |
| category | Text | | Searchable |
| readTime | Number | | Default: 5 |
| tags | JSON | | Default: [] |
| featured | Boolean | | Default: false |
| status | Select | ✓ | Options: draft, published |
| site | Text | ✓ | Searchable |

5. Click **Save**

### Step 3: Create Index for Performance

1. Go to **Collections → articles**
2. Click **API Rules** tab
3. Add index for faster queries:
   ```sql
   CREATE INDEX idx_articles_site_status ON articles(site, status)
   ```

---

## Initial Data Migration

### Option A: Seed via Script (Recommended)

```bash
# Run the seed script to populate articles
npx tsx server/scripts/seed-articles.ts
```

This will:
- Create 4 sample articles with `fc/` prefix
- Automatically skip duplicates
- Show progress in console

### Option B: Manual Import

1. Get the `collections_export.json` from your team
2. Go to PocketBase admin → Collections
3. Click the gear icon → **Import collections**
4. Upload the JSON file
5. Click **Import**

### Option C: Manual Data Entry

1. Go to http://localhost:8090/_/#/collections
2. Select `articles` collection
3. Click **New record**
4. Fill in article details:
   - **slug**: `fc/article-title` (must start with `fc/`)
   - **title**: Article title
   - **excerpt**: Short summary
   - **content**: Full article HTML content
   - **featured_image**: Upload or paste image URL
   - **author**: Author name
   - **date**: Publication date
   - **category**: Category (e.g., "AI & Technology")
   - **readTime**: Estimated read time in minutes
   - **tags**: JSON array: `["tag1", "tag2"]`
   - **status**: Select "published"
   - **site**: Enter `falcon-core` for main site
5. Click **Save**

---

## Production Deployment (Dokploy)

### Prerequisites
- Access to your VPS (core.matin.cloud)
- SSH credentials
- Dokploy installed and running

### Step 1: Configure Dokploy

1. Access Dokploy dashboard (on your VPS)
2. Create new **Organization**: "Falcon Core Holdings"
3. Create new **Project**: "fc.sa"
4. Create new **Service** with:
   - **Name**: `pocketbase`
   - **Docker Image**: `ghcr.io/pocketbase/pocketbase:latest`
   - **Port**: `8090`
   - **Domain**: `db.fc.sa`
   - **SSL**: Enabled (Let's Encrypt)

### Step 2: Configure Environment Variables

In Dokploy, set these environment variables for PocketBase service:

```env
PB_ENCRYPTION_KEY=your-random-secret-key-here
PB_ADMIN_EMAIL=admin@fc.sa
PB_ADMIN_PASSWORD=your-secure-password
```

### Step 3: Set up DNS

Add this DNS record:

```
db.fc.sa    CNAME    core.matin.cloud
```

Or if using A record:

```
db.fc.sa    A        72.60.182.102
```

### Step 4: Deploy

1. In Dokploy, click **Deploy**
2. Wait for PocketBase to start
3. Access at: https://db.fc.sa/_/
4. Create collections (same steps as local development)

### Step 5: Update App Configuration

Update environment variables in your React app deployment:

```env
VITE_POCKETBASE_URL=https://db.fc.sa
POCKETBASE_URL=https://db.fc.sa
```

---

## Multi-Site Configuration

### Setting Up Multiple Sites

Each site filters articles by the `site` field. To add a new site:

1. **In PocketBase**:
   - No new collections needed
   - Articles for new site use the same `articles` collection
   - Just set different `site` value (e.g., "agency", "projects")

2. **In Your App** (`client/config/sites.ts`):
   ```typescript
   export const SITES = {
     'falcon-core': {
       domain: 'fc.sa',
       name: 'Falcon Core',
       site_key: 'falcon-core'
     },
     'agency': {
       domain: 'agency.fc.sa',
       name: 'Agency',
       site_key: 'agency'
     },
     'projects': {
       domain: 'projects.fc.sa',
       name: 'Projects',
       site_key: 'projects'
     }
   };
   ```

3. **Add Article with New Site**:
   - In PocketBase admin
   - Create new article
   - Set `site` field to `"agency"` or `"projects"`
   - It will appear only on that site's domain

---

## Troubleshooting

### PocketBase not starting

```bash
# Check logs
docker-compose logs pocketbase

# Restart service
docker-compose restart pocketbase
```

### Can't access admin panel

- Ensure port 8090 is not in use: `lsof -i :8090`
- Check firewall rules
- Verify PocketBase is running: `curl http://localhost:8090/api/health`

### Articles not appearing

1. Check `site` field matches your configured site key
2. Verify `status` is set to `"published"`
3. Check browser console for API errors
4. Verify CORS is enabled in PocketBase settings

### Seed script fails

```bash
# Check PocketBase is running
curl http://localhost:8090/api/health

# Run with debug output
DEBUG=* npx tsx server/scripts/seed-articles.ts

# Check collection exists
# Go to: http://localhost:8090/_/#/collections
```

---

## File Uploads

PocketBase stores files in the instance directory. In production:

1. **Local Storage** (default)
   - Files stored on VPS disk
   - Included in backups
   - No extra config needed

2. **S3 Compatible Storage** (optional)
   ```env
   PB_S3_BUCKET=my-bucket
   PB_S3_REGION=us-east-1
   PB_S3_ACCESS_KEY=key
   PB_S3_SECRET_KEY=secret
   ```

---

## Backup & Recovery

### Automated Backups (Dokploy)

Dokploy includes daily automated backups. To restore:

1. In Dokploy dashboard
2. Go to Service → Backups
3. Click restore

### Manual Backup

```bash
# Backup local PocketBase
cp -r pocketbase_data pocketbase_backup_$(date +%Y%m%d)

# Or via Docker
docker exec falcon-core-pocketbase tar czf /pb_backup/backup_$(date +%Y%m%d).tar.gz /pb_data
```

---

## Security Best Practices

1. **Change Default Credentials**
   ```env
   PB_ADMIN_PASSWORD=use-a-strong-password
   ```

2. **Enable SSL/TLS**
   - Dokploy: Auto-configured via Let's Encrypt
   - Local: Use `https://localhost:8090` (self-signed)

3. **Restrict API Access**
   - Go to Collections → API Rules
   - Set read/write rules per role

4. **Regular Updates**
   ```bash
   # Update PocketBase image
   docker pull ghcr.io/pocketbase/pocketbase:latest
   docker-compose up -d pocketbase
   ```

---

## Next Steps

1. ✅ Start PocketBase locally (Docker Compose)
2. ✅ Create collections
3. ✅ Seed initial data
4. ✅ Test the app at `http://localhost:3000`
5. ⏭️ Deploy to Dokploy (VPS)
6. ⏭️ Set up custom domains
7. ⏭️ Add more articles/sites

---

## Reference

- **PocketBase Docs**: https://pocketbase.io
- **Docker Compose**: https://docs.docker.com/compose
- **Dokploy**: https://dokploy.io
- **API Docs**: http://localhost:8090/api/docs (when running)

