import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ArticleContentProps {
  content: string;
  isArabic?: boolean;
}

// Helper function to detect Arabic content
function detectArabicContent(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

export function ArticleContent({ content, isArabic: forcedArabic }: ArticleContentProps) {
  // Auto-detect Arabic if not explicitly set
  const isArabic = useMemo(() => {
    if (forcedArabic !== undefined) return forcedArabic;
    return detectArabicContent(content);
  }, [content, forcedArabic]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`prose prose-invert max-w-none mx-auto px-4 md:px-0 ${isArabic ? 'article-arabic' : ''}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <style>{`
        /* Base Article Styles */
        .article-content {
          font-family: 'Inter', 'Rubik', sans-serif;
        }

        .article-content h2 {
          font-family: 'Rubik', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
          scroll-margin-top: 100px;
        }

        .article-content h3 {
          font-family: 'Rubik', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #e5e7eb;
        }

        .article-content h4 {
          font-family: 'Rubik', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #d1d5db;
        }

        .article-content p {
          font-size: 1.125rem;
          line-height: 1.85;
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }

        .article-content strong {
          color: #f3f4f6;
          font-weight: 600;
        }

        .article-content em {
          color: #f3f4f6;
          font-style: italic;
        }

        .article-content a {
          color: #3b82f6;
          text-decoration: none;
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }

        .article-content a:hover {
          color: #60a5fa;
          border-bottom-color: rgba(96, 165, 250, 0.5);
        }

        .article-content ul {
          list-style-type: disc;
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-content ul li {
          margin-bottom: 0.75rem;
          color: #d1d5db;
          line-height: 1.85;
        }

        .article-content ul li::marker {
          color: #3b82f6;
          font-weight: 600;
        }

        .article-content ol {
          list-style-type: decimal;
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-content ol li {
          margin-bottom: 0.75rem;
          color: #d1d5db;
          line-height: 1.85;
        }

        .article-content ol li::marker {
          color: #3b82f6;
          font-weight: 600;
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .article-content table th {
          background-color: #1f2937;
          color: #60a5fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #374151;
        }

        .article-content table td {
          padding: 1rem;
          color: #d1d5db;
          border-bottom: 1px solid #374151;
        }

        .article-content table tr:hover {
          background-color: rgba(59, 130, 246, 0.05);
        }

        .article-content blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1.5rem;
          margin: 2rem 0;
          background-color: rgba(59, 130, 246, 0.05);
          border-radius: 0.375rem;
          font-style: italic;
          color: #e5e7eb;
        }

        .article-content code {
          background-color: #1f2937;
          color: #60a5fa;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875em;
        }

        .article-content pre {
          background-color: #0f172a;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }

        .article-content pre code {
          background-color: transparent;
          color: #a1a1a1;
          padding: 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 2rem 0;
          border: 1px solid #374151;
        }

        .article-content hr {
          border: none;
          border-top: 1px solid #374151;
          margin: 3rem 0;
        }

        /* Arabic RTL Styles */
        .article-arabic .article-content {
          font-family: 'Noto Sans Arabic', sans-serif;
          direction: rtl;
          text-align: right;
        }

        .article-arabic .article-content h2,
        .article-arabic .article-content h3,
        .article-arabic .article-content h4 {
          font-family: 'Rubik', 'Noto Sans Arabic', sans-serif;
          text-align: right;
        }

        .article-arabic .article-content ul,
        .article-arabic .article-content ol {
          padding-left: 0;
          padding-right: 1.5rem;
        }

        .article-arabic .article-content blockquote {
          border-left: none;
          border-right: 4px solid #3b82f6;
          padding-left: 0;
          padding-right: 1.5rem;
        }

        .article-arabic .article-content table th,
        .article-arabic .article-content table td {
          text-align: right;
        }
      `}</style>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.article>
  );
}
