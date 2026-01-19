import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { ArrowRight, Search } from 'lucide-react';
import { getArticles, Article } from '@/lib/builder';
import { toast } from 'sonner';

// Helper function to detect Arabic content in text
function hasArabicText(text: string): boolean {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

// Determine if an article is Arabic based on title and category
function isArabicArticle(article: Article): boolean {
  return hasArabicText(article.title) || hasArabicText(article.category);
}

const Articles = () => {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch articles from Builder.io
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        console.log('📄 Articles: Fetching for category:', selectedCategory, 'language:', language);
        const data = await getArticles(
          selectedCategory === 'all' ? undefined : selectedCategory
        );

        // Filter articles based on current language
        // Arabic articles show when site is Arabic, English articles when site is English
        const filteredByLanguage = data.filter(article => {
          const articleIsArabic = isArabicArticle(article);
          if (language === 'ar') {
            return articleIsArabic; // Show Arabic articles when site is Arabic
          } else {
            return !articleIsArabic; // Show English articles when site is English
          }
        });

        console.log('📄 Articles: Total', data.length, '→ Filtered for', language + ':', filteredByLanguage.length);
        setArticles(filteredByLanguage);
      } catch (error) {
        console.error('Error loading articles:', error);
        toast.error('Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory, language]);

  // Get unique categories from articles
  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];
  console.log('📂 Available categories:', categories);

  // Filter articles by search query
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('🔍 Filtered articles count:', filteredArticles.length, 'out of', articles.length);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-4 pt-20 pb-10">
        <div className="container mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              Articles & Insights
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Expert articles on AI, cloud computing, web development, and digital strategy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-12 relative border-b border-black/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-3 justify-center flex-wrap"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery('');
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-primary/10 text-foreground hover:bg-primary/20 border border-primary/20'
                }`}
              >
                {category === 'all' ? 'All Articles' : category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 border-b border-black/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-gray-400 mt-4">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No articles found.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredArticles.map((article) => {
                // Remove fc.sa/ prefix from slug for URL routing
                const urlSlug = article.slug.replace(/^fc\.sa\//, '');
                return (
                <motion.div
                  key={article.id}
                  variants={item}
                  className="group h-full"
                >
                  <Link to={`/articles/${urlSlug}`}>
                    <div className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Badge & Meta */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {article.readTime} min read
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors flex-grow">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
                          {article.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                              {article.author.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-300 leading-none">
                                {article.author}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(article.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-black/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-gray-400 text-lg">
              Subscribe to our newsletter for the latest insights on technology, AI, and digital transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-1 sm:flex-auto"
              />
              <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
