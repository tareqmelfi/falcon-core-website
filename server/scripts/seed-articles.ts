/**
 * Seed Script: Migrate articles to PocketBase
 * 
 * This script takes the hardcoded articles and seeds them into
 * PocketBase collection 'articles'
 * 
 * Usage:
 *   npx tsx server/scripts/seed-articles.ts
 */

import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

interface ArticleData {
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
}

// Articles to seed
const articles: ArticleData[] = [
  {
    slug: 'fc/future-of-ai-in-business',
    title: 'The Future of AI in Business Automation',
    excerpt: 'Explore how artificial intelligence is revolutionizing business processes and automation strategies.',
    content: '<h2>Introduction</h2><p>Artificial Intelligence is transforming the business landscape at an unprecedented pace. From automating routine tasks to enabling complex decision-making, AI has become indispensable for modern enterprises.</p>',
    featured_image: 'https://images.unsplash.com/photo-1677442136019-cecf46e53de4?auto=format&fit=crop&q=80&w=1000',
    author: 'Ahmed Al-Rashid',
    date: '2024-12-20',
    category: 'AI & Technology',
    readTime: 7,
    tags: ['AI', 'Automation', 'Business']
  },
  {
    slug: 'fc/cloud-infrastructure-best-practices',
    title: 'Cloud Infrastructure: Best Practices for Scalability',
    excerpt: 'Learn essential best practices for building scalable and resilient cloud infrastructure.',
    content: '<h2>Understanding Cloud Infrastructure</h2><p>Cloud infrastructure forms the backbone of modern digital operations. Proper design and management are crucial for success.</p>',
    featured_image: 'https://images.unsplash.com/photo-1667482774604-7332c57e3f3e?auto=format&fit=crop&q=80&w=1000',
    author: 'Fatimah Al-Dosari',
    date: '2024-12-18',
    category: 'Cloud Computing',
    readTime: 6,
    tags: ['Cloud', 'Infrastructure', 'AWS']
  },
  {
    slug: 'fc/digital-marketing-trends-2024',
    title: 'Digital Marketing Trends Shaping 2024',
    excerpt: 'Discover the latest digital marketing trends and strategies that are dominating the industry.',
    content: '<h2>The Evolving Digital Landscape</h2><p>Digital marketing continues to evolve rapidly. Understanding current trends is essential for staying competitive.</p>',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-adf4e565db6d?auto=format&fit=crop&q=80&w=1000',
    author: 'Mohammed Al-Otaibi',
    date: '2024-12-15',
    category: 'Marketing',
    readTime: 5,
    tags: ['Marketing', 'Digital', 'Trends']
  },
  {
    slug: 'fc/cybersecurity-best-practices',
    title: 'Cybersecurity Best Practices for Modern Businesses',
    excerpt: 'Protect your business from cyber threats with these essential security practices and strategies.',
    content: '<h2>The Cybersecurity Landscape</h2><p>In today\'s digital world, cybersecurity is not optional—it\'s essential.</p>',
    featured_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    author: 'Sarah Al-Mansour',
    date: '2024-12-12',
    category: 'Security',
    readTime: 6,
    tags: ['Security', 'Cybersecurity', 'Best Practices']
  }
];

async function seedArticles() {
  const pocketbaseUrl = process.env.POCKETBASE_URL || 'http://localhost:8090';
  
  console.log(`🚀 Starting to seed articles to PocketBase at ${pocketbaseUrl}`);
  
  const pb = new PocketBase(pocketbaseUrl);

  try {
    console.log('📝 Preparing to seed articles...');
    
    for (const article of articles) {
      try {
        // Check if article already exists
        const existing = await pb.collection('articles')
          .getFirstListItem(`slug = "${article.slug}"`)
          .catch(() => null);

        if (existing) {
          console.log(`⏭️  Skipping "${article.slug}" (already exists)`);
          continue;
        }

        // Create article
        const created = await pb.collection('articles').create({
          ...article,
          tags: JSON.stringify(article.tags),
          status: 'published',
          site: 'falcon-core'
        });

        console.log(`✅ Seeded: "${article.title}"`);
      } catch (error) {
        console.error(`❌ Error seeding "${article.slug}":`, error);
      }
    }

    console.log('✨ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedArticles();
