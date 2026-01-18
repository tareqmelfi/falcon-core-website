import { builder } from '@builder.io/react';

/**
 * Builder.io SDK Initialization
 * 
 * This initializes the Builder.io Visual CMS SDK with your public API key.
 * The public key is safe to use in client-side code.
 * 
 * Space: Fc.sa Builder Publish
 * Model naming convention: fc.sa/[page-name]
 * 
 * How to get your API key:
 * 1. Go to https://builder.io (Account Settings)
 * 2. Click Space Settings → API Keys
 * 3. Copy your "Public API Key"
 * 4. Add it to your .env.local:
 *    VITE_BUILDER_PUBLIC_KEY=your-public-key-here
 */

// Get the public API key from environment variables
const builderApiKey = import.meta.env.VITE_BUILDER_PUBLIC_KEY;

// Initialize Builder.io
if (builderApiKey) {
  builder.init(builderApiKey);
} else {
  console.warn(
    '⚠️ Builder.io Public API Key not found. ' +
    'Add VITE_BUILDER_PUBLIC_KEY to your .env.local file to enable the Visual CMS. ' +
    'Get your key from: https://builder.io/account/space'
  );
}

// Export the builder instance for use throughout the app
export { builder };
export { BuilderComponent } from '@builder.io/react';

/**
 * Articles API Integration
 * Fetch articles from Builder.io CMS using REST API
 */

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  author_bio?: string;
  date: string;
  category: string;
  readTime: number;
  tags: string[] | string;
  views?: number;
  featured: boolean;
  status: string;
  seo_title?: string;
  seo_description?: string;
  modifiedDate?: string;
}

/**
 * Builder.io REST API Configuration
 */
const BUILDER_API_BASE = 'https://cdn.builder.io/api/v3/content';
// Note: Using model name 'article' instead of Model ID for REST API calls
// This is more reliable and doesn't require hardcoding a space-specific ID

/**
 * Helper function to fetch articles from Builder.io REST API
 */
async function fetchBuilderArticles(filters: {
  model?: string;
  status?: string;
  category?: string;
  slug?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<Article[]> {
  if (!builderApiKey) {
    console.error('❌ Builder.io API key not configured. Add VITE_BUILDER_PUBLIC_KEY to .env.local');
    return [];
  }

  try {
    console.log('🔄 fetchBuilderArticles() called');
    const params = new URLSearchParams();
    params.append('apiKey', builderApiKey);

    // Use model name or allow override
    const model = filters.model || 'article';

    // Add limit - default to 100 to get all articles
    params.append('limit', (filters.limit || 100).toString());

    if (filters.offset) {
      params.append('offset', filters.offset.toString());
    }

    // Note: Builder.io REST API filtering is done via JSON query parameter
    // For now, fetch all and filter in JavaScript code
    // This ensures we get all articles regardless of category/status

    // Build URL using model name (standard Builder.io API)
    const url = `${BUILDER_API_BASE}/${model}?${params.toString()}`;
    console.log('🔍 Fetching articles from Builder.io');
    console.log('   URL:', url.replace(builderApiKey, 'API_KEY_HIDDEN'));
    console.log('   API Key status:', builderApiKey ? '✅ Present' : '❌ Missing');
    console.log('   Model name:', model);
    console.log('   Limit param:', filters.limit || 100);
    console.log('   Category filter:', filters.category || 'none');
    console.log('   Status filter:', filters.status || 'none');

    console.log('📡 Sending fetch request...');

    let response;
    try {
      response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (fetchError) {
      console.error('❌ Fetch failed (network error):', fetchError);
      return [];
    }

    console.log('📊 API Response Status:', response.status, response.statusText);
    console.log('📊 Response OK:', response.ok);
    console.log('📊 Response headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
      'x-total-count': response.headers.get('x-total-count'),
    });

    // Try to get the response data regardless of status
    let data;
    const contentType = response.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('❌ API returned non-JSON response:', text.substring(0, 300));
      return [];
    }

    try {
      data = await response.json();
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      return [];
    }

    if (!response.ok) {
      console.error(`❌ Builder.io API returned error ${response.status}:`, response.statusText);
      console.error('Error details:', data);

      if (response.status === 404) {
        console.error('❌ Model "article" not found. Possible causes:');
        console.error('  1. Model name is wrong');
        console.error('  2. Space ID is incorrect');
        console.error('  3. API key belongs to different space');
      } else if (response.status === 401) {
        console.error('❌ Authentication failed. Check API key.');
      } else if (response.status === 403) {
        console.error('❌ Permission denied. Check API key permissions.');
      }

      return [];
    }

    console.log('✅ API call successful');
    console.log('📊 Full API response (first 500 chars):', JSON.stringify(data).substring(0, 500));
    console.log('📊 Data keys:', Object.keys(data));
    console.log('📊 Total results:', data.results?.length || 0);

    if (data.results && data.results.length > 0) {
      console.log('📋 First result structure:', JSON.stringify(data.results[0], null, 2).substring(0, 300));
    }

    const results = data.results || [];

    // Filter for fc.sa/ prefix and apply other filters
    const fcArticles = results
      .filter((item: any) => {
        const slug = item.data?.slug;
        const status = item.data?.status;

        // Must have fc.sa/ prefix
        if (!slug?.startsWith('fc.sa/')) {
          return false;
        }

        // Apply status filter if provided
        if (filters.status && status !== filters.status) {
          return false;
        }

        // Apply category filter if provided
        if (filters.category && item.data?.category !== filters.category) {
          return false;
        }

        return true;
      })
      .map((item: any) => ({
        id: item.id,
        ...item.data,
      })) as Article[];

    console.log(`✅ Found ${fcArticles.length} articles matching filters`);

    if (fcArticles.length > 0) {
      console.log('📚 Articles retrieved:');
      fcArticles.forEach((a, i) => {
        console.log(`   ${i + 1}. "${a.title}" (slug: ${a.slug}, category: ${a.category}, status: ${a.status})`);
      });
    } else if (results.length > 0) {
      console.warn(`⚠️ WARNING: Found ${results.length} total articles but NONE match the filters`);
      console.log('Raw articles in response:');
      results.forEach((r: any, i: number) => {
        console.log(`   ${i + 1}. slug="${r.data?.slug}", category="${r.data?.category}", status="${r.data?.status}"`);
      });
    }

    return fcArticles;
  } catch (error) {
    console.error('❌ Error fetching articles from Builder.io:', error);
    return [];
  }
}

/**
 * Get all articles from Builder.io
 * Falls back to hardcoded data if API fails
 */
export async function getArticles(category?: string, limit = 50): Promise<Article[]> {
  console.log('🔄 getArticles() called with category:', category, 'limit:', limit);

  const articles = await fetchBuilderArticles({
    model: 'article',
    status: 'published',
    category: category && category !== 'all' ? category : undefined,
    limit,
  });

  console.log('🔄 fetchBuilderArticles returned:', articles.length, 'articles');

  // Ensure all articles have featured_image (add default if missing)
  const articlesWithImages = articles.map(article => ({
    ...article,
    featured_image: article.featured_image || 'https://images.unsplash.com/photo-1677442136019-cecf46e53de4?auto=format&fit=crop&q=80&w=1000'
  }));

  console.log('🔄 After adding default images:', articlesWithImages.length, 'articles');

  // If we got articles, return them
  if (articlesWithImages.length > 0) {
    console.log(`✅ Returning ${articlesWithImages.length} articles from Builder.io API`);
    if (articlesWithImages.length <= 3) {
      articlesWithImages.forEach(a => {
        console.log(`   - ${a.title} (${a.slug})`);
      });
    }
    return articlesWithImages;
  }

  // Fallback: Return sample data for testing
  console.warn('⚠️ Using fallback article data - API returned no articles');
  console.warn('⚠️ This fallback returns only 1 article for testing. Check API connection.');

  const fallbackArticles: Article[] = [
    {
      id: '1',
      slug: 'fc.sa/future-of-ai-in-business',
      title: 'The Future of AI in Business Automation',
      excerpt: 'Explore how artificial intelligence is revolutionizing business processes and automation strategies.',
      content: '<h2>Introduction</h2><p>Artificial Intelligence is transforming the business landscape...</p>',
      featured_image: 'https://images.unsplash.com/photo-1677442136019-cecf46e53de4?auto=format&fit=crop&q=80&w=1000',
      author: 'Ahmed Al-Rashid',
      date: '2024-12-20',
      category: 'AI & Technology',
      readTime: 7,
      tags: ['AI', 'Automation', 'Business'],
      featured: true,
      status: 'published'
    }
  ];

  return category && category !== 'all'
    ? fallbackArticles.filter(a => a.category === category)
    : fallbackArticles.slice(0, limit);
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await fetchBuilderArticles({
    model: 'article',
    slug,
    status: 'published',
    limit: 1,
  });

  return articles.length > 0 ? articles[0] : null;
}

/**
 * Get related articles by category
 */
export async function getRelatedArticles(
  category: string,
  excludeSlug?: string,
  limit = 3
): Promise<Article[]> {
  const articles = await fetchBuilderArticles({
    model: 'article',
    category,
    status: 'published',
    limit: limit + 1, // Get one extra in case we need to exclude current article
  });

  return articles
    .filter((item: Article) => item.slug !== excludeSlug)
    .slice(0, limit);
}

/**
 * Search articles by title, excerpt, or tags
 */
export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const articles = await fetchBuilderArticles({
      model: 'article',
      status: 'published',
    });

    return articles.filter(
      (article) => {
        const tagsArray = Array.isArray(article.tags)
          ? article.tags
          : typeof article.tags === 'string'
          ? article.tags.split(',').map(t => t.trim())
          : [];

        return (
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          (tagsArray &&
            tagsArray.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
        );
      }
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

/**
 * Debug function - test the Builder.io API directly
 * Call from browser console: window.testBuilderAPI()
 */
if (typeof window !== 'undefined') {
  (window as any).testBuilderAPI = async () => {
    console.log('🧪 Testing Builder.io REST API...');
    console.log('🧪 Using model name: article');

    const apiKey = import.meta.env.VITE_BUILDER_PUBLIC_KEY;
    if (!apiKey) {
      console.error('❌ No API key found');
      return null;
    }

    const url = `https://cdn.builder.io/api/v3/content/article?apiKey=${apiKey}&limit=100`;
    console.log('🧪 URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

    try {
      const response = await fetch(url);
      console.log('📊 Response status:', response.status);
      const data = await response.json();

      console.log('📊 Total results:', data.results?.length || 0);

      if (data.results) {
        console.log('📚 Articles in response:');
        data.results.forEach((r: any, i: number) => {
          console.log(`   ${i + 1}. ${r.data?.slug} - ${r.data?.title} (status: ${r.data?.status})`);
        });
      }

      console.log('🧪 Full response:', data);
      return data;
    } catch (error) {
      console.error('❌ Test failed:', error);
      return null;
    }
  };

  console.log('💡 Tip: You can test the Builder.io API by calling window.testBuilderAPI() in the browser console');
}
