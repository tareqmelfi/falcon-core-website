import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ArticleHeroSectionProps {
  image: string;
  title: string;
  category: string;
  date: string;
  isArabic?: boolean;
}

// Helper function to detect Arabic content
function detectArabicContent(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

export function ArticleHeroSection({
  image,
  title,
  category,
  date,
  isArabic: forcedArabic,
}: ArticleHeroSectionProps) {
  // Auto-detect Arabic if not explicitly set
  const isArabic = useMemo(() => {
    if (forcedArabic !== undefined) return forcedArabic;
    return detectArabicContent(title);
  }, [title, forcedArabic]);

  return (
    <section
      className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden group"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Image with Zoom Effect */}
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradient Overlay - Bottom to Top */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      {/* Category Badge - Top corner based on direction */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`absolute top-6 z-10 ${isArabic ? 'left-6' : 'right-6'}`}
      >
        <Badge
          className={`bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold ${isArabic ? 'font-arabic' : ''}`}
        >
          {category}
        </Badge>
      </motion.div>

      {/* Content - Bottom positioned based on direction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 max-w-4xl ${isArabic ? 'mr-auto text-right' : 'ml-0 text-left'}`}
      >
        {/* Main Title */}
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg ${isArabic ? 'font-arabic' : 'font-rubik'}`}
          style={{ fontFamily: isArabic ? "'Rubik', 'Noto Sans Arabic', sans-serif" : "'Rubik', sans-serif" }}
        >
          {title}
        </h1>

        {/* Subtitle Date */}
        <p
          className={`text-base md:text-lg text-gray-200 drop-shadow-md ${isArabic ? 'font-arabic' : ''}`}
          style={{ fontFamily: isArabic ? "'Noto Sans Arabic', sans-serif" : "'Inter', sans-serif" }}
        >
          {isArabic ? 'نشر في ' : 'Published on '}
          {new Date(date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>
    </section>
  );
}
