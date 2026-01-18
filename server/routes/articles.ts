import { Router, Request, Response } from "express";
import pb from "../lib/pocketbase";

const router = Router();

// Fallback hardcoded data for development when PocketBase is not available
interface MultilingualArticle {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  image: string;
  author: { en: string; ar: string };
  date: string;
  category: { en: string; ar: string };
  readTime: number;
  tags: { en: string[]; ar: string[] };
  featured: boolean;
}

// Fallback articles data (for development without PocketBase)
const fallbackArticles: MultilingualArticle[] = [
  {
    id: "1",
    slug: "fc/future-of-ai-in-business",
    title: {
      en: "The Future of AI in Business Automation",
      ar: "مستقبل الذكاء الاصطناعي في أتمتة الأعمال"
    },
    excerpt: {
      en: "Explore how artificial intelligence is revolutionizing business processes and automation strategies.",
      ar: "استكشف كيف يُحدث الذكاء الاصطناعي ثورة في عمليات الأعمال واستراتيجيات الأتمتة."
    },
    content: {
      en: `<h2>Introduction</h2><p>Artificial Intelligence is transforming the business landscape at an unprecedented pace. From automating routine tasks to enabling complex decision-making, AI has become indispensable for modern enterprises.</p>`,
      ar: `<h2>مقدمة</h2><p>يقوم الذكاء الاصطناعي بتحويل مشهد الأعمال بوتيرة غير مسبوقة.</p>`
    },
    image: "https://images.unsplash.com/photo-1677442136019-cecf46e53de4?auto=format&fit=crop&q=80&w=1000",
    author: {
      en: "Ahmed Al-Rashid",
      ar: "أحمد الراشد"
    },
    date: "2024-12-20",
    category: {
      en: "AI & Technology",
      ar: "الذكاء الاصطناعي والتقنية"
    },
    readTime: 7,
    tags: {
      en: ["AI", "Automation", "Business"],
      ar: ["الذكاء الاصطناعي", "الأتمتة", "الأعمال"]
    },
    featured: true
  }
];

// Helper function to transform article data
function transformArticle(article: any, lang: string = 'en') {
  const language = lang === 'ar' ? 'ar' : 'en';
  
  // Handle both PocketBase format and fallback format
  if (article.title && typeof article.title === 'object') {
    // Fallback format (multilingual object)
    return {
      id: article.id,
      slug: article.slug,
      title: article.title[language],
      excerpt: article.excerpt[language],
      content: article.content[language],
      featured_image: article.image || article.featured_image,
      author: article.author[language] || article.author,
      date: article.date,
      category: article.category[language] || article.category,
      readTime: article.readTime,
      tags: article.tags[language] || article.tags || [],
      featured: article.featured
    };
  } else {
    // PocketBase format (single language)
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featured_image,
      author: article.author,
      date: article.date,
      category: article.category,
      readTime: article.readTime || 5,
      tags: Array.isArray(article.tags) ? article.tags : [],
      featured: article.featured || false,
      status: article.status
    };
  }
}

// GET /api/articles - Get all articles
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = parseInt(req.query.offset as string) || 0;
    const lang = req.query.lang as string || 'en';
    const site = req.query.site as string || 'falcon-core';

    // Try to fetch from PocketBase
    const filter = `site = "${site}" && status = "published"`;
    const records = await pb.collection('articles').getList(offset, limit, {
      filter,
      sort: '-date'
    }).catch(() => null);

    let articles: any[] = [];

    if (records && records.items) {
      // Successfully fetched from PocketBase
      articles = records.items.map((item: any) => transformArticle(item, lang));
    } else {
      // Fallback to hardcoded data
      console.warn('PocketBase not available, using fallback data');
      articles = fallbackArticles.map(a => transformArticle(a, lang));
      articles = articles.slice(offset, offset + limit);
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return fallback data on error
    res.json(fallbackArticles.map(a => transformArticle(a)));
  }
});

// GET /api/articles/search - Search articles
router.get("/search/query", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const lang = req.query.lang as string || 'en';
    const site = req.query.site as string || 'falcon-core';

    if (!query) {
      return res.json([]);
    }

    // Try PocketBase search
    const filter = `(title ~ "${query}" || excerpt ~ "${query}") && site = "${site}" && status = "published"`;
    const records = await pb.collection('articles').getFullList({
      filter,
      sort: '-date'
    }).catch(() => null);

    let results: any[] = [];

    if (records) {
      results = records.map((item: any) => transformArticle(item, lang));
    } else {
      // Fallback search
      const transformedArticles = fallbackArticles.map(a => transformArticle(a, lang));
      results = transformedArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        (article.tags && article.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.json([]);
  }
});

// GET /api/articles/category/:category - Get articles by category
router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as string || 'en';
    const site = req.query.site as string || 'falcon-core';
    const category = req.params.category;

    // Try PocketBase
    const filter = `category = "${category}" && site = "${site}" && status = "published"`;
    const records = await pb.collection('articles').getFullList({
      filter,
      sort: '-date'
    }).catch(() => null);

    let articles: any[] = [];

    if (records) {
      articles = records.map((item: any) => transformArticle(item, lang));
    } else {
      // Fallback
      const transformedArticles = fallbackArticles.map(a => transformArticle(a, lang));
      articles = transformedArticles.filter(a => a.category === category);
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.json([]);
  }
});

// GET /api/articles/:slug - Get specific article
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const lang = req.query.lang as string || 'en';
    const site = req.query.site as string || 'falcon-core';
    const slug = req.params.slug;

    // Try PocketBase
    const filter = `slug = "${slug}" && site = "${site}"`;
    const records = await pb.collection('articles').getList(0, 1, {
      filter
    }).catch(() => null);

    let article: any = null;

    if (records && records.items && records.items.length > 0) {
      article = transformArticle(records.items[0], lang);
    } else {
      // Fallback
      const fallbackArticle = fallbackArticles.find(a => a.slug === slug);
      if (fallbackArticle) {
        article = transformArticle(fallbackArticle, lang);
      }
    }

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Get related articles
    let relatedArticles: any[] = [];
    if (article.category) {
      const filter = `category = "${article.category}" && slug != "${slug}" && site = "${site}" && status = "published"`;
      const related = await pb.collection('articles').getList(0, 3, {
        filter,
        sort: '-date'
      }).catch(() => null);

      if (related && related.items) {
        relatedArticles = related.items.map((item: any) => transformArticle(item, lang));
      } else {
        // Fallback related
        const transformedArticles = fallbackArticles.map(a => transformArticle(a, lang));
        relatedArticles = transformedArticles
          .filter(a => a.category === article.category && a.slug !== slug)
          .slice(0, 3);
      }
    }

    res.json({
      ...article,
      related: relatedArticles
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

export default router;
