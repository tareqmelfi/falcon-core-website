/**
 * useMetaTags Hook
 * 
 * React hook to easily manage meta tags in components.
 * Automatically sets meta tags when component mounts and cleans up on unmount.
 */

import { useEffect } from 'react';
import { setMetaTags, setArticleMetaTags, resetMetaTags, MetaTagsConfig } from '@/lib/meta-manager';

/**
 * Hook to set page-level meta tags
 * 
 * @example
 * useMetaTags({
 *   title: 'My Page',
 *   description: 'Page description',
 *   image: 'https://...',
 * });
 */
export function useMetaTags(config: MetaTagsConfig): void {
  useEffect(() => {
    setMetaTags(config);

    // Cleanup: reset to defaults on unmount (optional)
    // return () => resetMetaTags();
  }, [config.title, config.description, config.image, config.url]);
}

/**
 * Hook to set article-specific meta tags
 * 
 * @example
 * useArticleMetaTags({
 *   title: 'Article Title',
 *   excerpt: 'Article excerpt...',
 *   image: 'https://...',
 *   slug: 'article-slug',
 *   date: '2024-12-20',
 *   author: 'John Doe',
 *   category: 'Technology',
 *   tags: ['tag1', 'tag2'],
 * });
 */
export function useArticleMetaTags(config: {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
  date: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  tags?: string[];
}): void {
  useEffect(() => {
    setArticleMetaTags(config);
  }, [
    config.title,
    config.excerpt,
    config.image,
    config.slug,
    config.date,
    config.modifiedDate,
    config.author,
    config.category,
  ]);
}

/**
 * Hook to reset meta tags to defaults
 */
export function useResetMetaTags(): void {
  useEffect(() => {
    return () => {
      resetMetaTags();
    };
  }, []);
}
