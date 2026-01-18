# Deployment Guide

This guide explains how to deploy your Falcon Core website to production, including frontend hosting, database setup, domain configuration, and visual editing workflows.

---

## Table of Contents

1. [Frontend Deployment](#frontend-deployment)
2. [PocketBase Database Setup](#pocketbase-database-setup)
3. [Custom Domain Configuration](#custom-domain-configuration)
4. [Visual Editing Workflows](#visual-editing-workflows)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## Frontend Deployment

You have several options for deploying the frontend of your application:

### Option 1: Netlify (Recommended for Simplicity)

Netlify is already integrated with this project and offers the easiest deployment experience.

**Steps:**

1. **Connect Netlify MCP** (if not already connected):
   - In Builder.io, click "Connect to Netlify" in the MCP integrations panel
   - Authorize Netlify and select your team

2. **Deploy using Netlify MCP tools** (from Builder.io):
   - The Netlify integration can create a new site and deploy automatically
   - Or use the Netlify CLI/dashboard as described below

3. **Manual Netlify Deployment**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Build your project
   npm run build

   # Deploy
   netlify deploy --prod
   ```

4. **Configure Build Settings** (if using Netlify dashboard):
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
   - Node version: `18` or higher

### Option 2: Vercel

Vercel offers excellent performance and automatic deployments from Git.

**Steps:**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   # Build your project
   npm run build

   # Deploy with Vercel
   vercel --prod
   ```

3. **Or connect via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect the settings

### Option 3: Your Own VPS (Advanced)

If you prefer full control, you can host on your own server (DigitalOcean, Hetzner, AWS EC2, etc.).

**Requirements:**
- Ubuntu 20.04+ or similar Linux distribution
- Nginx or Apache for serving static files
- Node.js 18+ (for SSR if needed)

**Steps:**

1. **Build the project locally**:
   ```bash
   npm run build
   ```

2. **Upload the `dist/spa` folder** to your server:
   ```bash
   scp -r dist/spa/* user@your-server-ip:/var/www/falcon-core
   ```

3. **Configure Nginx** to serve the files:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/falcon-core;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json image/svg+xml;
       gzip_comp_level 9;
   }
   ```

4. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

---

## PocketBase Database Setup

PocketBase is a lightweight backend that you can host on your own server or use a managed service.

### Option 1: Self-Hosted PocketBase (Your Own Server)

**Requirements:**
- Ubuntu 20.04+ or similar Linux distribution
- Basic Linux command-line knowledge
- Nginx for reverse proxy (recommended)

**Steps:**

1. **Download PocketBase**:
   ```bash
   # SSH into your server
   ssh user@your-server-ip

   # Download PocketBase (check for latest version at pocketbase.io)
   wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip

   # Extract
   unzip pocketbase_0.22.0_linux_amd64.zip

   # Make it executable
   chmod +x pocketbase
   ```

2. **Create a systemd service** (to run PocketBase as a background service):
   ```bash
   sudo nano /etc/systemd/system/pocketbase.service
   ```

   Add this content:
   ```ini
   [Unit]
   Description=PocketBase
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/pocketbase
   ExecStart=/opt/pocketbase/pocketbase serve --http=127.0.0.1:8090
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

3. **Move PocketBase to /opt**:
   ```bash
   sudo mkdir -p /opt/pocketbase
   sudo mv pocketbase /opt/pocketbase/
   sudo chown -R www-data:www-data /opt/pocketbase
   ```

4. **Start the service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable pocketbase
   sudo systemctl start pocketbase
   ```

5. **Configure Nginx as reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name pb.yourdomain.com;  # Your PocketBase subdomain

       location / {
           proxy_pass http://127.0.0.1:8090;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

6. **Set up SSL with Certbot** (recommended):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d pb.yourdomain.com
   ```

7. **Access PocketBase Admin Panel**:
   - Go to `https://pb.yourdomain.com/_/`
   - Create your admin account
   - Set up collections as described in `POCKETBASE_SETUP.md`

### Option 2: PocketHost (Managed PocketBase Hosting)

[PocketHost](https://pockethost.io) offers managed PocketBase hosting if you prefer not to manage your own server.

**Steps:**
1. Sign up at [pockethost.io](https://pockethost.io)
2. Create a new PocketBase instance
3. Use the provided URL as your `POCKETBASE_URL`
4. Access the admin panel to set up collections

### Database Schema Setup

Refer to `POCKETBASE_SETUP.md` for the complete database schema. You'll need to create these collections:

- **articles**: Blog posts and articles
- **comments**: User comments on articles
- **contacts**: Contact form submissions
- **users**: User accounts (optional for authentication)

---

## Custom Domain Configuration

### Step 1: Purchase a Domain

You can buy a domain from:
- **Namecheap** (recommended for pricing)
- **GoDaddy**
- **Porkbun** (dev-friendly)
- **Google Domains** / **Cloudflare Registrar**

### Step 2: Configure DNS Records

You'll need to point your domain to your hosting provider.

#### For Netlify:

1. Go to your Netlify site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter your domain (e.g., `falconcore.sa`)
5. Netlify will provide DNS instructions

**OR** use Netlify DNS (easier):
- Point your domain's nameservers to Netlify:
  ```
  dns1.p01.nsone.net
  dns2.p01.nsone.net
  dns3.p01.nsone.net
  dns4.p01.nsone.net
  ```

#### For Vercel:

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow Vercel's DNS instructions

#### For Your Own Server (VPS):

Add these DNS records in your domain registrar's control panel:

```
Type: A Record
Name: @ (or blank)
Value: YOUR_SERVER_IP
TTL: 3600

Type: A Record
Name: www
Value: YOUR_SERVER_IP
TTL: 3600

Type: A Record (for PocketBase subdomain)
Name: pb
Value: YOUR_SERVER_IP
TTL: 3600
```

### Step 3: Enable HTTPS

- **Netlify/Vercel**: Automatic! They provide free SSL certificates.
- **Your Own Server**: Use Let's Encrypt with Certbot:
  ```bash
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```

### Step 4: Update Environment Variables

Update your environment variables to use your production domain:

```env
# .env.production (or in Netlify/Vercel dashboard)
VITE_POCKETBASE_URL=https://pb.yourdomain.com
```

---

## Visual Editing Workflows

You asked about moving the project to Figma for visual editing. Here's how design and visual editing work:

### Understanding the Workflow

**Figma → Code** (Design to Development):
- Figma is a **design tool** where you create mockups and prototypes
- You can use the **Builder.io Figma plugin** to convert Figma designs to code
- This is a **one-way process**: Design in Figma → Generate code → Import to Builder.io

**Code → Visual Editor** (Live Editing):
- You **cannot** convert existing code back to Figma for editing
- Instead, use **Builder.io** (already integrated in this project) for visual editing

### Option 1: Builder.io Visual Editor (Recommended)

Builder.io is already integrated with this project and allows you to visually edit pages without touching code.

**How to use:**

1. **Connect Builder.io MCP**:
   - In Builder.io Projects, the Builder CMS MCP should be available
   - Connect it to manage your content visually

2. **Create Visual Pages**:
   - Use Builder.io's drag-and-drop editor
   - Create new pages or sections
   - Publish changes that sync with your site

3. **Edit Existing Pages**:
   - Some components can be made "Builder-friendly" by wrapping them
   - You can create new "sections" in Builder that replace parts of your pages

**Limitations:**
- Not all code-based pages can be automatically converted to Builder
- Best for new content pages, landing pages, and marketing pages

### Option 2: Figma Plugin for New Designs

If you want to design new pages in Figma first:

1. **Design in Figma**:
   - Create your page design in Figma
   - Use the [Builder.io Figma Plugin](https://www.figma.com/community/plugin/747985167520967365/builder-io-ai-powered-figma-to-code-react-vue-tailwind-more)

2. **Convert to Code**:
   - Select your Figma frames
   - Use the Builder.io plugin to generate code
   - Import the generated code into your project

3. **Integrate**:
   - Add the generated components to your React app
   - Style with your existing Tailwind classes

### Option 3: Direct Code Editing

For full control, you can edit the code directly:

- **Components**: `client/components/`
- **Pages**: `client/pages/`
- **Styles**: Tailwind classes in components
- **Design System**: `client/pages/BrandIdentity.tsx` documents your design system

**Recommended Tools:**
- **VS Code** with Tailwind CSS IntelliSense extension
- **Builder.io Projects** (this platform) for AI-assisted coding
- **Hot Reload**: Changes appear instantly during development

### Recommended Approach

1. **For Marketing/Content Pages**: Use Builder.io visual editor
2. **For New Features**: Design in Figma → Convert with Builder.io plugin
3. **For Refinements**: Edit code directly in Builder.io Projects or VS Code

**Important Note:** "Code to Figma" is not a standard workflow. Once code is written, visual editing happens through:
- Builder.io CMS (for content)
- Direct code editing (for features)
- Figma (for new design concepts before coding)

---

## Environment Variables

### Development (.env.local)

Create a `.env.local` file in your project root:

```env
# PocketBase
VITE_POCKETBASE_URL=http://localhost:8090

# Optional: Server-side PocketBase URL (if different)
POCKETBASE_URL=http://localhost:8090

# Optional: Admin credentials for protected operations
POCKETBASE_ADMIN_EMAIL=admin@yourdomain.com
POCKETBASE_ADMIN_PASSWORD=your-secure-password
```

### Production

#### For Netlify/Vercel:

Add these environment variables in your hosting dashboard:

```env
VITE_POCKETBASE_URL=https://pb.yourdomain.com
POCKETBASE_URL=https://pb.yourdomain.com
```

#### For Your Own Server:

Create a `.env` file on your server (if running Node.js backend):

```env
POCKETBASE_URL=https://pb.yourdomain.com
POCKETBASE_ADMIN_EMAIL=admin@yourdomain.com
POCKETBASE_ADMIN_PASSWORD=your-secure-password
```

---

## Troubleshooting

### PocketBase Connection Issues

**Problem**: "Failed to connect to PocketBase"

**Solutions**:
- Check that PocketBase is running: `sudo systemctl status pocketbase`
- Verify the URL in environment variables matches your PocketBase server
- Check firewall rules allow connections on port 8090
- Ensure Nginx reverse proxy is correctly configured

### CORS Errors

**Problem**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: In PocketBase admin panel:
1. Go to Settings → Application
2. Add your frontend domain to "Allowed origins"
3. Example: `https://yourdomain.com`

### Domain Not Working

**Problem**: Domain doesn't load or shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions**:
- Wait 24-48 hours for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify DNS records
- Ensure nameservers are correctly set at your domain registrar
- Double-check A Record points to correct IP address

### SSL Certificate Issues

**Problem**: "Your connection is not private" or SSL errors

**Solutions**:
- For Netlify/Vercel: Check SSL settings in dashboard
- For your own server: Run `sudo certbot renew` to refresh certificate
- Verify Nginx is configured to use SSL (port 443)

### Build Failures

**Problem**: Build fails during deployment

**Solutions**:
- Check Node.js version (should be 18+)
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run typecheck`
- Clear cache and rebuild: `rm -rf node_modules dist && npm install && npm run build`

---

## Next Steps

After deployment:

1. **Install PocketBase SDK**:
   ```bash
   npm install pocketbase
   ```

2. **Set up your collections** in PocketBase (see `POCKETBASE_SETUP.md`)

3. **Update API routes** to use PocketBase instead of in-memory data:
   - See examples in `server/routes/articles.ts` (comments indicate where to integrate)
   - Import `pb` from `server/lib/pocketbase`
   - Replace in-memory arrays with `pb.collection('...').getFullList()`

4. **Test thoroughly**:
   - Verify all pages load correctly
   - Test contact form submissions
   - Test article comments
   - Verify language switching (EN/AR)

5. **Monitor and maintain**:
   - Set up regular PocketBase backups
   - Monitor server resources
   - Keep dependencies updated

---

## Support & Resources

- **PocketBase Documentation**: [pocketbase.io/docs](https://pocketbase.io/docs)
- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Builder.io Documentation**: [builder.io/c/docs](https://www.builder.io/c/docs)

For questions about this project, refer to:
- `POCKETBASE_SETUP.md` - Database schema and integration examples
- `AGENTS.md` - Development guidelines
- `README.md` - Project overview

Good luck with your deployment! 🚀
