/**
 * Meta Tag Manager
 * 
 * Utility functions to dynamically manage Open Graph, Twitter Card, and other meta tags
 * for better social media sharing and SEO optimization.
 */

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  twitterHandle?: string;
}

/**
 * Get or create a meta tag by property or name
 */
function getOrCreateMetaTag(attr: 'property' | 'name', value: string): HTMLMetaElement {
  let tag = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  
  return tag;
}

/**
 * Set a meta tag's content
 */
function setMetaTag(attr: 'property' | 'name', key: string, content: string): void {
  const tag = getOrCreateMetaTag(attr, key);
  tag.content = content;
}

/**
 * Set Open Graph meta tags
 */
export function setOpenGraphTags(config: MetaTagsConfig): void {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedDate,
    modifiedDate,
  } = config;

  // Basic OG tags
  if (title) setMetaTag('property', 'og:title', title);
  if (description) setMetaTag('property', 'og:description', description);
  if (image) setMetaTag('property', 'og:image', image);
  if (url) setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'og:type', type);

  // Article-specific tags
  if (type === 'article') {
    if (publishedDate) setMetaTag('property', 'article:published_time', publishedDate);
    if (modifiedDate) setMetaTag('property', 'article:modified_time', modifiedDate);
  }
}

/**
 * Set Twitter Card meta tags
 */
export function setTwitterCardTags(config: MetaTagsConfig): void {
  const {
    title,
    description,
    image,
    twitterHandle,
  } = config;

  // Twitter Card type (use "summary_large_image" for articles with images)
  const cardType = image ? 'summary_large_image' : 'summary';
  setMetaTag('name', 'twitter:card', cardType);

  if (title) setMetaTag('name', 'twitter:title', title);
  if (description) setMetaTag('name', 'twitter:description', description);
  if (image) setMetaTag('name', 'twitter:image', image);
  if (twitterHandle) setMetaTag('name', 'twitter:creator', twitterHandle);
}

/**
 * Set canonical URL
 */
export function setCanonicalUrl(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = url;
}

/**
 * Set page title and basic meta tags
 */
export function setPageTitle(title: string): void {
  document.title = title;
  setMetaTag('name', 'og:title', title);
  setMetaTag('name', 'twitter:title', title);
}

/**
 * Comprehensive function to set all meta tags at once
 */
export function setMetaTags(config: MetaTagsConfig): void {
  // Ensure we have absolute URLs
  const baseUrl = window.location.origin;
  const absoluteUrl = config.url || window.location.href;
  const absoluteImage = config.image ? 
    (config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`) : 
    undefined;

  // Set page title
  if (config.title) {
    setPageTitle(config.title);
  }

  // Set description
  if (config.description) {
    setMetaTag('name', 'description', config.description);
  }

  // Set Open Graph tags
  setOpenGraphTags({
    ...config,
    url: absoluteUrl,
    image: absoluteImage,
  });

  // Set Twitter Card tags
  setTwitterCardTags({
    ...config,
    url: absoluteUrl,
    image: absoluteImage,
  });

  // Set canonical URL
  setCanonicalUrl(absoluteUrl);
}

/**
 * Set meta tags specifically for articles
 */
export function setArticleMetaTags(config: {
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
  const {
    title,
    excerpt,
    image,
    slug,
    date,
    modifiedDate,
    author,
    category,
  } = config;

  // Construct absolute URL
  const baseUrl = window.location.origin;
  const absoluteUrl = `${baseUrl}/articles/${slug}`;
  const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Set all meta tags
  setMetaTags({
    title: `${title} | Falcon Core`,
    description: excerpt,
    image: absoluteImage,
    url: absoluteUrl,
    type: 'article',
    publishedDate: new Date(date).toISOString(),
    modifiedDate: modifiedDate ? new Date(modifiedDate).toISOString() : undefined,
    author,
  });

  // Set additional article-specific tags
  if (category) {
    setMetaTag('property', 'article:section', category);
  }

  // Set article tags
  if (Array.isArray(config.tags) && config.tags.length > 0) {
    config.tags.forEach((tag) => {
      const tagElement = document.createElement('meta');
      tagElement.setAttribute('property', 'article:tag');
      tagElement.content = tag;
      document.head.appendChild(tagElement);
    });
  }
}

/**
 * Reset meta tags to default values
 */
export function resetMetaTags(): void {
  setMetaTags({
    title: 'Falcon Core - Venture Builder & Innovation Partner',
    description: 'Expert venture building, innovation partnerships, and digital transformation services.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F2e1b9087ef4e46cdb32b82db285f3f9e?format=webp&width=800',
    url: window.location.href,
  });
}

/**
 * Debug function to log current meta tags
 */
export function debugMetaTags(): void {
  console.log('=== Current Meta Tags ===');
  console.log('Page Title:', document.title);
  
  const ogTags = document.querySelectorAll('meta[property^="og:"]');
  console.log('Open Graph Tags:');
  ogTags.forEach((tag) => {
    console.log(`  ${tag.getAttribute('property')}: ${tag.getAttribute('content')}`);
  });

  const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
  console.log('Twitter Card Tags:');
  twitterTags.forEach((tag) => {
    console.log(`  ${tag.getAttribute('name')}: ${tag.getAttribute('content')}`);
  });

  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (canonical) {
    console.log('Canonical URL:', canonical.href);
  }
}

// Make debug function available globally for development
if (typeof window !== 'undefined') {
  (window as any).debugMetaTags = debugMetaTags;
}
