import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleHeroSection } from '@/components/ui/ArticleHeroSection';
import { ArticleMetadata } from '@/components/ui/ArticleMetadata';
import { ArticleContent } from '@/components/ui/ArticleContent';
import { getArticleBySlug, getRelatedArticles, Article } from '@/lib/builder';
import { useArticleMetaTags } from '@/hooks/useMetaTags';
import { toast } from 'sonner';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, dir } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  // Set meta tags when article loads
  useArticleMetaTags(
    article
      ? {
          title: article.title,
          excerpt: article.excerpt,
          image: article.featured_image,
          slug: article.slug.replace(/^fc\.sa\//, ''),
          date: article.date,
          author: article.author,
          category: article.category,
          tags: Array.isArray(article.tags)
            ? article.tags
            : typeof article.tags === 'string'
            ? article.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
            : [],
        }
      : {
          title: 'Article',
          excerpt: '',
          image: '',
          slug: '',
          date: new Date().toISOString(),
        }
  );

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        // Add fc.sa/ prefix to match Builder.io article slugs
        const fullSlug = `fc.sa/${slug}`;
        const data = await getArticleBySlug(fullSlug);

        if (!data) {
          console.warn(`Article not found with slug: ${fullSlug}`);
          toast.error('Article not found');
          setIsLoading(false);
          return;
        }

        setArticle(data);

        // Fetch related articles (using full slug for comparison)
        const related = await getRelatedArticles(data.category, fullSlug, 3);
        setRelatedArticles(related);
      } catch (error) {
        console.error('Error loading article:', error);
        toast.error('Error loading article');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="text-muted-foreground animate-pulse">
            {t('articles.loading') || 'Loading article...'}
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="text-3xl font-bold mb-4">{t('articles.not_found') || 'Article not found'}</h1>
          <Link to="/articles">
            <Button variant="outline" className="rounded-full">
              <ChevronLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('articles.back') || 'Back to Articles'}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-primary/20 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Back Button - Sticky Header */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/articles">
            <Button variant="ghost" className="rounded-full hover:bg-white/10">
              <ChevronLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('articles.back') || 'Back to Articles'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      <ArticleHeroSection
        image={article.featured_image}
        title={article.title}
        category={article.category}
        date={article.date}
      />

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Article Body */}
          <div className="max-w-4xl mx-auto">
            <ArticleContent content={article.content} />

            {/* Metadata Footer */}
            <ArticleMetadata
              author={article.author}
              authorBio={article.author_bio}
              date={article.date}
              readTime={article.readTime}
              tags={article.tags || []}
              category={article.category}
            />
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-20 border-t border-black/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12">Related Articles</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle, index) => {
                  // Strip fc.sa/ prefix from slug for URL
                  const relatedUrlSlug = relatedArticle.slug.replace(/^fc\.sa\//, '');
                  return (
                  <motion.div
                    key={relatedArticle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/articles/${relatedUrlSlug}`}>
                      <div className="h-48 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-primary/5">
                        <img
                          src={relatedArticle.featured_image}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 rounded-full bg-white/10 text-blue-400 text-xs font-semibold">
                            {relatedArticle.category}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {relatedArticle.readTime} min read
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>

                        <p className="text-sm text-gray-400 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(relatedArticle.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 border-t border-black/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Discover More Articles
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Explore our collection of technical articles and industry insights.
            </p>
            <Link to="/articles">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
                Browse All Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ArticleDetail;
