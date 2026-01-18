import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ArticleMetadataProps {
  author: string;
  authorBio?: string;
  date: string;
  readTime: number;
  tags: string[] | string | null | undefined;
  category: string;
}

export function ArticleMetadata({
  author,
  authorBio,
  date,
  readTime,
  tags,
  category,
}: ArticleMetadataProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = document.querySelector('h1')?.textContent || 'Check this article';

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert tags to array if it's a string (comma-separated)
  const tagsArray = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
    ? tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-b border-black/10 py-12 my-12"
    >
      {/* Top Row: Author and Meta Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
        {/* Author Info */}
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-primary/80 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {author.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-lg">{author}</p>
            {authorBio && (
              <p className="text-sm text-muted-foreground mt-1">{authorBio}</p>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>📅 {formattedDate}</span>
          <span>⏱️ {readTime} min read</span>
          <span className="hidden md:inline">📁 {category}</span>
        </div>
      </div>

      {/* Tags */}
      {tagsArray && tagsArray.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tagsArray.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-sm text-primary border border-primary/20 hover:border-primary/50 transition-all"
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      )}

      {/* Share Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-foreground">Share:</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 transition-all text-sm font-medium"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 hover:border-secondary/50 transition-all text-sm font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('copy')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground border border-muted/50 hover:border-muted-foreground/50 transition-all text-sm font-medium"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </motion.button>
      </div>
    </motion.section>
  );
}
