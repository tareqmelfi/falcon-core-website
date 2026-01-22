import { Handler } from '@netlify/functions';

// Builder.io API configuration
const BUILDER_API_KEY = process.env.BUILDER_PRIVATE_KEY || 'bpk-5abb7d3d3b494a5fa7f4b34e3db52f87';
const BUILDER_PUBLIC_KEY = process.env.VITE_BUILDER_PUBLIC_KEY || '4a2cb5bf56834399b5a569ae235d6a41';

// Claude API configuration (for translation)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface Article {
  id: string;
  name: string;
  data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    readTime: number;
    featured_image: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
  };
}

// Function to translate text using Claude API
async function translateWithClaude(text: string, targetLang: 'ar' | 'en'): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
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
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${langName}. Maintain all HTML formatting, links, and structure. Only return the translated text, nothing else:\n\n${text}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Function to create a new article in Builder.io
async function createArticleInBuilder(articleData: Article['data']): Promise<any> {
  const response = await fetch(`https://builder.io/api/v1/write/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BUILDER_API_KEY}`
    },
    body: JSON.stringify({
      name: articleData.title,
      published: 'published',
      data: articleData
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Builder.io API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Check if Arabic text exists
function hasArabicText(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');

    // This webhook is triggered by Builder.io when a new article is published
    // The payload contains the article data
    const article = payload.newValue || payload;

    if (!article || !article.data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid article data' })
      };
    }

    const articleData = article.data;
    const isArabic = hasArabicText(articleData.title);
    const targetLang = isArabic ? 'en' : 'ar';

    console.log(`Translating article "${articleData.title}" to ${targetLang}`);

    // Translate all text fields
    const [
      translatedTitle,
      translatedExcerpt,
      translatedContent,
      translatedCategory
    ] = await Promise.all([
      translateWithClaude(articleData.title, targetLang),
      translateWithClaude(articleData.excerpt, targetLang),
      translateWithClaude(articleData.content, targetLang),
      translateWithClaude(articleData.category, targetLang)
    ]);

    // Create new slug for translated article
    const slugPrefix = targetLang === 'ar' ? 'ar-' : 'en-';
    const translatedSlug = slugPrefix + articleData.slug.replace(/^(ar-|en-)/, '');

    // Create the translated article
    const translatedArticle = {
      ...articleData,
      title: translatedTitle,
      excerpt: translatedExcerpt,
      content: translatedContent,
      category: translatedCategory,
      slug: translatedSlug,
      seoTitle: translatedTitle,
      seoDescription: translatedExcerpt
    };

    // Save to Builder.io
    const result = await createArticleInBuilder(translatedArticle);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: `Article translated to ${targetLang}`,
        originalTitle: articleData.title,
        translatedTitle: translatedTitle,
        articleId: result.id
      })
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Translation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};
