# Builder.io Visual CMS Integration Guide

This guide explains how to use Builder.io's Visual CMS to create and edit pages on your Falcon Core website without writing code.

---

## Table of Contents

1. [What is Builder.io?](#what-is-builderio)
2. [Pricing & Plans](#pricing--plans)
3. [Getting Started](#getting-started)
4. [Creating Your First Visual Page](#creating-your-first-visual-page)
5. [Working with the Visual Editor](#working-with-the-visual-editor)
6. [Publishing & Preview](#publishing--preview)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

---

## What is Builder.io?

Builder.io is a Visual CMS (Content Management System) that lets you:

- **Create pages visually** using drag-and-drop
- **Edit content** without touching code
- **A/B test** different designs (Growth plan and above)
- **Localize content** for different languages (Growth plan and above)
- **Schedule** content publication
- **Collaborate** with team members

**Key Benefits:**
- ✅ No coding required for content editors
- ✅ Real-time preview of changes
- ✅ Works alongside your existing code
- ✅ SEO-friendly content
- ✅ Fast performance

---

## Pricing & Plans

Builder.io offers a generous free tier and affordable paid plans:

### Free Plan (Perfect for getting started!)
- **Cost:** $0/month
- **Includes:**
  - 1 space
  - Unlimited content entries
  - Visual editing
  - Basic analytics
  - Community support
  - Generous bandwidth limits

### Basic Plan
- **Cost:** ~$19/user/month
- **Includes:**
  - Everything in Free
  - More visual views
  - Activity history
  - Team collaboration

### Growth Plan
- **Cost:** ~$39/user/month
- **Includes:**
  - Everything in Basic
  - A/B testing
  - Localization
  - Scheduling
  - Advanced analytics
  - Priority support

### Enterprise
- **Cost:** Custom pricing
- **Includes:**
  - Everything in Growth
  - SSO
  - Private plugins
  - SLA guarantees
  - Dedicated support

**Note:** Pricing is per user/month and may change. Check the latest pricing at: https://www.builder.io/pricing

**Recommendation:** Start with the **Free plan** - it's very generous and perfect for most websites!

---

## Getting Started

### Step 1: Create a Builder.io Account

1. Go to [https://builder.io](https://builder.io)
2. Click "Sign Up" (top right)
3. Sign up with:
   - Email and password, OR
   - Google account, OR
   - GitHub account
4. Complete the onboarding wizard

### Step 2: Get Your Public API Key

1. Once logged in, go to your **Account Settings**
2. Click on **Space Settings** (left sidebar)
3. Click on **API Keys** tab
4. Find your **Public API Key** (it starts with a random string of letters/numbers)
5. Copy this key - you'll need it in the next step

### Step 3: Add API Key to Your Project

**On Your Laptop:**

1. Open your project folder in a terminal/command prompt
2. Create a file called `.env.local` in the root of your project (if it doesn't exist)
3. Add this line to the file:
   ```env
   VITE_BUILDER_PUBLIC_KEY=paste-your-api-key-here
   ```
4. Replace `paste-your-api-key-here` with the API key you copied
5. Save the file

**Example `.env.local` file:**
```env
# Builder.io
VITE_BUILDER_PUBLIC_KEY=a1b2c3d4e5f6g7h8i9j0

# PocketBase (if you're using it)
VITE_POCKETBASE_URL=http://localhost:8090
```

### Step 4: Install Dependencies

**On Your Laptop (in your project folder):**

```bash
# Install all dependencies (including Builder.io SDK)
pnpm install

# Or if you use npm
npm install
```

**Important:** You do NOT need to install dependencies on your server. When you deploy to Netlify, Vercel, or your own server, the deployment process automatically installs dependencies for you.

### Step 5: Start Your Development Server

```bash
# Start the dev server
pnpm dev

# Or if you use npm
npm run dev
```

Your site should now be running at `http://localhost:8080` (or the port shown in your terminal).

---

## Creating Your First Visual Page

### Step 1: Create a Page Model (One-time setup)

1. Go to [https://builder.io](https://builder.io)
2. Click on your space name (top left)
3. Click **Models** in the left sidebar
4. Click **+ New Model**
5. Choose **Page** as the model type
6. Click **Create Model**

### Step 2: Create a New Page

1. In Builder.io, click **Content** in the left sidebar
2. Click **+ New** (top right)
3. Select **Page** model
4. Give your page a name (e.g., "Landing Page")
5. Set the **URL path** (e.g., `/builder/landing`)
   - **Important:** Pages created in Builder.io should use the `/builder/` prefix
   - Example: `/builder/landing`, `/builder/about-us`, `/builder/pricing`
6. Click **Create**

### Step 3: Design Your Page

You're now in the Visual Editor! Here's how to use it:

#### Adding Content

1. **Click "Add Block"** button (left sidebar)
2. Choose from built-in components:
   - **Text**: Headings, paragraphs
   - **Image**: Add images
   - **Button**: Call-to-action buttons
   - **Section**: Container for other blocks
   - **Columns**: Multi-column layouts
   - **Video**: Embed videos
   - And many more!

3. **Drag and drop** blocks onto your page

#### Editing Content

1. **Click on any element** on the page to select it
2. Edit properties in the **right sidebar**:
   - Text content
   - Colors
   - Spacing (padding, margin)
   - Typography
   - Responsive settings
   - And more!

#### Styling Tips

- Use the **Design** tab (right sidebar) to change colors, fonts, spacing
- Use the **Data** tab to add dynamic content
- Use the **Options** tab for advanced settings

### Step 4: Preview Your Page

1. Make sure your local dev server is running (`pnpm dev`)
2. In Builder.io editor, click the **Preview** button (top right)
3. You can switch between:
   - Desktop view
   - Tablet view
   - Mobile view

### Step 5: Publish Your Page

1. When you're happy with your page, click **Publish** (top right)
2. Choose **Publish Now** or schedule for later
3. Click **Publish**

Your page is now live! Visit it at:
- Local: `http://localhost:8080/builder/landing` (replace with your path)
- Production: `https://yourdomain.com/builder/landing`

---

## Working with the Visual Editor

### Understanding the Interface

**Left Sidebar:**
- **Blocks**: Drag-and-drop components
- **Layers**: See your page structure
- **Data**: Add data bindings
- **Insert Code**: Add custom HTML/CSS

**Center Canvas:**
- Preview of your page
- Click elements to select and edit
- Drag to move elements
- Resize elements by dragging edges

**Right Sidebar:**
- **Style**: Visual styling controls
- **Options**: Element-specific settings
- **Advanced**: Custom CSS, animations

### Responsive Design

Builder.io makes responsive design easy:

1. **Click the device icons** (top of canvas) to switch views:
   - 💻 Desktop
   - 📱 Tablet
   - 📱 Mobile

2. **Override styles per device:**
   - Select an element
   - Switch to mobile view
   - Change the styling
   - Changes only apply to that device size

### Using Sections and Columns

**Sections:**
- Full-width containers
- Perfect for hero sections, content blocks
- Can have background colors/images

**Columns:**
- Create multi-column layouts
- Responsive by default (stack on mobile)
- Adjust column width ratios

### Adding Images

1. Click **Add Block** → **Image**
2. Click the image placeholder
3. Click **Choose File** or paste an image URL
4. Adjust size and position
5. Add alt text for SEO (Options tab)

### Adding Buttons/Links

1. Click **Add Block** → **Button**
2. Set button text
3. Set link URL:
   - Internal page: `/contact`
   - External: `https://example.com`
   - Email: `mailto:info@fc.sa`
4. Style the button (colors, size, etc.)

---

## Publishing & Preview

### Preview Your Changes

Before publishing:

1. Click **Preview** (top right)
2. Test your page on different devices
3. Click links to ensure they work
4. Check spelling and content

### Publishing Options

**Publish Now:**
- Immediately makes your changes live
- Overwrites the current published version

**Schedule for Later:**
- Set a date and time to publish
- Perfect for planned releases

**Save as Draft:**
- Save your work without publishing
- Come back and edit later

### Unpublishing a Page

1. Open your page in Builder.io
2. Click the **•••** menu (top right)
3. Select **Unpublish**
4. Confirm

The page will return a 404 error until you publish it again.

---

## Advanced Features

### A/B Testing (Growth Plan+)

Test different versions of your page to see which performs better:

1. Create your page
2. Click **Create Variant** (top bar)
3. Name your variant (e.g., "Version B")
4. Edit the variant
5. Set traffic split (50/50, 80/20, etc.)
6. Publish both variants
7. View analytics to see which performs better

### Localization (Growth Plan+)

Create different versions for different languages:

1. Open your page
2. Click **Localize** (top bar)
3. Select target language
4. Translate content
5. Publish

### Custom Components

Register your React components so editors can use them:

1. Open `client/lib/builder.ts`
2. Import your component
3. Register it:
   ```ts
   import { Builder } from '@builder.io/react';
   import MyComponent from '@/components/MyComponent';

   Builder.registerComponent(MyComponent, {
     name: 'My Component',
     inputs: [
       { name: 'title', type: 'string' },
       { name: 'description', type: 'longText' }
     ]
   });
   ```
4. Now editors can drag "My Component" into Builder

### Targeting & Personalization

Show different content to different users:

1. Select an element
2. Click **Targeting** (right sidebar)
3. Add targeting rules:
   - URL parameters
   - Device type
   - Location
   - Custom data
4. Show/hide based on conditions

---

## Troubleshooting

### "Cannot connect to preview"

**Problem:** Builder.io can't preview your local site

**Solutions:**
1. Make sure your dev server is running (`pnpm dev`)
2. Check the preview URL in Builder.io settings matches your local URL
3. Go to Builder.io → Space Settings → Preview URLs
4. Add: `http://localhost:8080`

### "Page not loading / 404 error"

**Problem:** Your Builder.io page shows 404

**Solutions:**
1. Check the URL starts with `/builder/` (e.g., `/builder/landing`)
2. Make sure the page is published (not a draft)
3. Check your API key is correctly set in `.env.local`
4. Restart your dev server after adding the API key

### "API Key not found" warning

**Problem:** Console shows "Builder.io Public API Key not found"

**Solutions:**
1. Create `.env.local` file in project root
2. Add: `VITE_BUILDER_PUBLIC_KEY=your-key-here`
3. Get your key from: https://builder.io/account/space
4. Restart dev server

### Changes not appearing

**Problem:** Edits in Builder.io don't show on your site

**Solutions:**
1. Make sure you clicked **Publish** in Builder.io
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Check you're viewing the correct URL

### Styling looks different than expected

**Problem:** Page looks different in Builder.io vs your site

**Solutions:**
1. Builder.io uses your site's CSS
2. Make sure your site is running when previewing
3. Check for conflicting CSS in your project
4. Use Builder's style controls instead of custom CSS when possible

---

## Next Steps

### Recommended Learning Path

1. **Week 1:**
   - Create your first simple page
   - Experiment with different blocks
   - Practice editing and publishing

2. **Week 2:**
   - Create a more complex landing page
   - Use sections and columns
   - Add images and buttons

3. **Week 3:**
   - Explore data bindings
   - Try responsive design
   - Experiment with animations

4. **Month 2+:**
   - Register custom components
   - Explore A/B testing (if on Growth plan)
   - Set up localization (if needed)

### Useful Resources

- **Builder.io Documentation:** https://www.builder.io/c/docs
- **Video Tutorials:** https://www.builder.io/c/docs/videos
- **Community Forum:** https://forum.builder.io
- **YouTube Channel:** https://www.youtube.com/@builder-io
- **Help & Support:** https://www.builder.io/support

### Tips for Success

1. **Start Simple:** Don't try to use all features at once
2. **Use Templates:** Builder.io has pre-made templates you can customize
3. **Preview Often:** Check how your page looks as you build
4. **Mobile First:** Design for mobile, then enhance for desktop
5. **Save Often:** Builder.io auto-saves, but publish drafts to be safe

### Getting Help

- **Builder.io Support:** support@builder.io
- **Community Slack:** Join at https://www.builder.io/c/community
- **Documentation:** https://www.builder.io/c/docs

---

## FAQ

**Q: Can I edit my existing pages (Home, About, Contact) in Builder.io?**
A: Those pages are coded in React. You can recreate them in Builder.io, or add Builder.io sections to them. New pages should be created in Builder.io under the `/builder/` path.

**Q: What happens if Builder.io is down?**
A: Your coded pages (Home, About, Contact, etc.) will still work. Only Builder.io-created pages would be affected. Builder.io has 99.9%+ uptime.

**Q: Can multiple people edit at the same time?**
A: Yes! Builder.io supports real-time collaboration. You can see who else is editing.

**Q: How do I move from Free to a paid plan?**
A: Go to Builder.io → Account Settings → Billing → Choose your plan.

**Q: Can I export my Builder.io pages to code?**
A: Yes! You can export to React, HTML, or JSON. This gives you full control and portability.

**Q: Will Builder.io slow down my website?**
A: No! Builder.io is optimized for performance. Content is cached and served via CDN.

---

## Summary

You now have Builder.io Visual CMS integrated into your Falcon Core website! 🎉

**Quick Start Checklist:**
- ✅ Created Builder.io account
- ✅ Got Public API Key
- ✅ Added key to `.env.local`
- ✅ Installed dependencies (`pnpm install`)
- ✅ Started dev server (`pnpm dev`)
- ✅ Created first page in Builder.io
- ✅ Published and viewed your page

**Next Steps:**
1. Create a landing page for a marketing campaign
2. Experiment with different layouts and designs
3. Share Builder.io access with your content team
4. Explore advanced features as you grow

For detailed deployment instructions, see `DEPLOYMENT.md`.

Happy building! 🚀
