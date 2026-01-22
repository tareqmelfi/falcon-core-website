import { Handler } from '@netlify/functions';

// Builder.io API configuration
const BUILDER_PRIVATE_KEY = process.env.BUILDER_PRIVATE_KEY || 'bpk-5abb7d3d3b494a5fa7f4b34e3db52f87';
const BUILDER_PUBLIC_KEY = process.env.VITE_BUILDER_PUBLIC_KEY || '4a2cb5bf56834399b5a569ae235d6a41';

// Claude API configuration (for translation)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ArticleData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  featured_image: string;
  slug: string;
  date?: string;
}

// Function to translate text using Claude API
async function translateWithClaude(text: string, targetLang: 'ar' | 'en'): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured. Please set it in Netlify environment variables.');
  }

  const langName = targetLang === 'ar' ? 'Arabic' : 'English';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${langName}. Maintain all HTML formatting, links, and structure. Only return the translated text, nothing else:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Fetch all articles from Builder.io
async function fetchArticles(): Promise<any[]> {
  const response = await fetch(
    `https://cdn.builder.io/api/v3/content/article?apiKey=${BUILDER_PUBLIC_KEY}&limit=100`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
}

// Create a new article in Builder.io using Write API
async function createArticle(articleData: ArticleData): Promise<any> {
  const response = await fetch(`https://builder.io/api/v1/write/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUILDER_PRIVATE_KEY}`
    },
    body: JSON.stringify({
      name: articleData.title,
      published: 'published',
      data: articleData
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Builder.io Write API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Check if text contains Arabic characters
function hasArabicText(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

// Check if article is Arabic
function isArabicArticle(article: any): boolean {
  const data = article.data || {};
  return hasArabicText(data.title) || hasArabicText(data.category);
}

export const handler: Handler = async (event) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow GET (to check status) or POST (to trigger translation)
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Fetch all existing articles
    const articles = await fetchArticles();
    console.log(`Found ${articles.length} articles`);

    // Separate articles by language
    const arabicArticles = articles.filter(isArabicArticle);
    const englishArticles = articles.filter(a => !isArabicArticle(a));

    // Extract slugs (normalized without language prefix)
    const normalizeSlug = (slug: string) => {
      return slug.replace(/^(ar-|en-|fc\.sa\/)/, '').toLowerCase();
    };

    const arabicSlugs = new Set(arabicArticles.map(a => normalizeSlug(a.data?.slug || '')));
    const englishSlugs = new Set(englishArticles.map(a => normalizeSlug(a.data?.slug || '')));

    // Find articles that need translation
    const englishNeedingArabic = englishArticles.filter(a => {
      const slug = normalizeSlug(a.data?.slug || '');
      return !arabicSlugs.has(slug);
    });

    const arabicNeedingEnglish = arabicArticles.filter(a => {
      const slug = normalizeSlug(a.data?.slug || '');
      return !englishSlugs.has(slug);
    });

    // If GET request, just return status
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          total: articles.length,
          english: englishArticles.length,
          arabic: arabicArticles.length,
          englishNeedingArabicTranslation: englishNeedingArabic.map(a => ({
            id: a.id,
            title: a.data?.title,
            slug: a.data?.slug
          })),
          arabicNeedingEnglishTranslation: arabicNeedingEnglish.map(a => ({
            id: a.id,
            title: a.data?.title,
            slug: a.data?.slug
          })),
          anthropicKeyConfigured: !!ANTHROPIC_API_KEY
        })
      };
    }

    // POST request - perform translations
    if (!ANTHROPIC_API_KEY) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'ANTHROPIC_API_KEY not configured',
          message: 'Please set ANTHROPIC_API_KEY in Netlify environment variables to enable translations'
        })
      };
    }

    const results: any[] = [];

    // Translate English articles to Arabic
    for (const article of englishNeedingArabic) {
      try {
        const data = article.data as ArticleData;
        console.log(`Translating to Arabic: ${data.title}`);

        const [
          translatedTitle,
          translatedExcerpt,
          translatedContent,
          translatedCategory
        ] = await Promise.all([
          translateWithClaude(data.title, 'ar'),
          translateWithClaude(data.excerpt || '', 'ar'),
          translateWithClaude(data.content || '', 'ar'),
          translateWithClaude(data.category || '', 'ar')
        ]);

        const arabicSlug = 'fc.sa/' + normalizeSlug(data.slug) + '-ar';

        const translatedArticle: ArticleData = {
          title: translatedTitle,
          excerpt: translatedExcerpt,
          content: translatedContent,
          category: translatedCategory,
          author: data.author,
          readTime: data.readTime,
          featured_image: data.featured_image,
          slug: arabicSlug,
          date: data.date || new Date().toISOString()
        };

        const result = await createArticle(translatedArticle);
        results.push({
          success: true,
          original: data.title,
          translated: translatedTitle,
          language: 'ar',
          newId: result.id
        });

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        results.push({
          success: false,
          original: article.data?.title,
          language: 'ar',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Translate Arabic articles to English
    for (const article of arabicNeedingEnglish) {
      try {
        const data = article.data as ArticleData;
        console.log(`Translating to English: ${data.title}`);

        const [
          translatedTitle,
          translatedExcerpt,
          translatedContent,
          translatedCategory
        ] = await Promise.all([
          translateWithClaude(data.title, 'en'),
          translateWithClaude(data.excerpt || '', 'en'),
          translateWithClaude(data.content || '', 'en'),
          translateWithClaude(data.category || '', 'en')
        ]);

        const englishSlug = 'fc.sa/' + normalizeSlug(data.slug).replace(/-ar$/, '');

        const translatedArticle: ArticleData = {
          title: translatedTitle,
          excerpt: translatedExcerpt,
          content: translatedContent,
          category: translatedCategory,
          author: data.author,
          readTime: data.readTime,
          featured_image: data.featured_image,
          slug: englishSlug,
          date: data.date || new Date().toISOString()
        };

        const result = await createArticle(translatedArticle);
        results.push({
          success: true,
          original: data.title,
          translated: translatedTitle,
          language: 'en',
          newId: result.id
        });

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        results.push({
          success: false,
          original: article.data?.title,
          language: 'en',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Translation completed',
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
