import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { builder, BuilderComponent } from '@/lib/builder';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * BuilderPage Component
 * 
 * This component fetches and renders content from Builder.io's Visual CMS.
 * It allows you to create pages visually without writing code.
 * 
 * How it works:
 * 1. Takes the current URL path
 * 2. Fetches content from Builder.io matching that path
 * 3. Renders the content using BuilderComponent
 * 4. Shows a 404 if no content is found
 * 
 * To create a page:
 * 1. Go to https://builder.io
 * 2. Create a new "page" entry
 * 3. Set the URL path (e.g., /landing-page)
 * 4. Design your page visually
 * 5. Publish
 * 6. Visit yoursite.com/landing-page
 */

interface BuilderContent {
  data?: {
    title?: string;
    description?: string;
  };
  id?: string;
}

const BuilderPage: React.FC = () => {
  const location = useLocation();
  const [content, setContent] = useState<BuilderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        // Fetch content from Builder.io matching the current URL
        const builderContent = await builder
          .get('page', {
            url: location.pathname,
            // Optionally fetch draft content if preview mode is enabled
            // options: { includeUnpublished: true }
          })
          .promise();

        if (builderContent) {
          setContent(builderContent);
          setNotFound(false);
        } else {
          setContent(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching Builder.io content:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [location.pathname]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !content) {
    return (
      <Layout>
        <section className="relative min-h-[60vh] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <div className="text-8xl font-bold text-primary/20">404</div>
            <h1 className="text-4xl md:text-5xl font-bold">Page Not Found</h1>
            <p className="text-xl text-muted-foreground">
              The page you're looking for doesn't exist or hasn't been published yet.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/">
                <Button size="lg" className="rounded-full">
                  Go Home
                </Button>
              </Link>
              <a
                href="https://builder.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full">
                  Create in Builder.io
                </Button>
              </a>
            </div>
          </motion.div>
        </section>
      </Layout>
    );
  }

  // Render the Builder.io content
  return (
    <Layout>
      <BuilderComponent model="page" content={content} />
    </Layout>
  );
};

export default BuilderPage;
