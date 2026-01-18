/**
 * PocketBase API Integration
 * Replaces Builder.io REST API with PocketBase queries
 */

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  status: string;
}

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';
const SITE = import.meta.env.VITE_APP_SITE || 'falcon-core';

/**
 * Fetch articles from PocketBase with filters
 */
export async function getArticles(
  category?: string,
  limit = 50,
  page = 1
): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    
    // Filter by site and published status
    let filter = `site = "${SITE}" && status = "published"`;
    
    if (category && category !== 'all') {
      filter += ` && category = "${category}"`;
    }

    params.append('filter', filter);
    params.append('sort', '-date');
    params.append('limit', limit.toString());
    params.append('page', page.toString());

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/articles/records?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform PocketBase records to Article interface
    return (data.items || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      featured_image: item.featured_image 
        ? `${POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item.featured_image}`
        : 'https://via.placeholder.com/600x400?text=No+Image',
      author: item.author,
      date: item.date,
      category: item.category,
      readTime: item.readTime || 5,
      tags: Array.isArray(item.tags) ? item.tags : [],
      featured: item.featured || false,
      status: item.status,
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const params = new URLSearchParams();
    params.append('filter', `slug = "${slug}" && site = "${SITE}"`);

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/articles/records?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    const data = await response.json();
    const item = data.items?.[0];

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      featured_image: item.featured_image
        ? `${POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item.featured_image}`
        : 'https://via.placeholder.com/600x400?text=No+Image',
      author: item.author,
      date: item.date,
      category: item.category,
      readTime: item.readTime || 5,
      tags: Array.isArray(item.tags) ? item.tags : [],
      featured: item.featured || false,
      status: item.status,
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Get related articles by category
 */
export async function getRelatedArticles(
  category: string,
  excludeSlug?: string,
  limit = 3
): Promise<Article[]> {
  try {
    const articles = await getArticles(category, limit + 1);
    return articles
      .filter((article) => article.slug !== excludeSlug)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams();
    params.append(
      'filter',
      `(title ~ "${query}" || excerpt ~ "${query}" || tags ~ "${query}") && site = "${SITE}" && status = "published"`
    );
    params.append('sort', '-date');

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/articles/records?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      featured_image: item.featured_image
        ? `${POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/${item.featured_image}`
        : 'https://via.placeholder.com/600x400?text=No+Image',
      author: item.author,
      date: item.date,
      category: item.category,
      readTime: item.readTime || 5,
      tags: Array.isArray(item.tags) ? item.tags : [],
      featured: item.featured || false,
      status: item.status,
    }));
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}
