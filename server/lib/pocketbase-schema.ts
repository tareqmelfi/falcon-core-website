/**
 * PocketBase Collection Schemas
 * 
 * This file defines the structure for all PocketBase collections.
 * Use this as reference when setting up PocketBase collections manually
 * or via import/export.
 */

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  tags: string[]; // JSON array
  featured: boolean;
  status: 'draft' | 'published';
  site: string; // 'falcon-core', 'agency', 'projects'
  created: string;
  updated: string;
}

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  content: string;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  status: 'draft' | 'published';
  site: string;
  created: string;
  updated: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
  featured_image?: string;
  category: string;
  site: string;
  created: string;
  updated: string;
}

export interface SiteConfigRecord {
  id: string;
  site_key: string;
  site_name: string;
  domain: string;
  logo_url?: string;
  description?: string;
  theme_color?: string;
  metadata?: string; // JSON field
  created: string;
  updated: string;
}

/**
 * PocketBase Collection Setup Instructions
 * 
 * Create these collections in your PocketBase admin panel:
 * 
 * 1. articles
 *    Fields:
 *      - slug (text, unique, required, searchable)
 *      - title (text, required, searchable)
 *      - excerpt (text, searchable)
 *      - content (editor/textarea, required)
 *      - featured_image (file, single)
 *      - author (text)
 *      - date (date)
 *      - category (text, searchable)
 *      - readTime (number, default: 5)
 *      - tags (json, default: "[]")
 *      - featured (bool, default: false)
 *      - status (select: draft, published; required, default: draft)
 *      - site (text, required, searchable) - identifies which site owns this
 *    Indexes:
 *      - CREATE INDEX idx_articles_site_status ON articles(site, status)
 * 
 * 2. pages
 *    Fields:
 *      - slug (text, unique, required)
 *      - title (text, required)
 *      - content (editor/textarea, required)
 *      - featured_image (file, single)
 *      - seo_title (text)
 *      - seo_description (text)
 *      - status (select: draft, published; default: draft)
 *      - site (text, required)
 * 
 * 3. services
 *    Fields:
 *      - slug (text, unique, required)
 *      - title (text, required)
 *      - description (textarea)
 *      - icon (text)
 *      - featured_image (file, single)
 *      - category (text)
 *      - site (text, required)
 * 
 * 4. site_config
 *    Fields:
 *      - site_key (text, unique, required)
 *      - site_name (text, required)
 *      - domain (text, unique)
 *      - logo_url (text)
 *      - description (textarea)
 *      - theme_color (text)
 *      - metadata (json)
 */

export const PocketBaseSchemaVersion = '1.0';
