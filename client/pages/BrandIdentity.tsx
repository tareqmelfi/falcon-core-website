import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const BrandIdentity = () => {
  const { t, dir } = useLanguage();
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, colorName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(colorName);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
              {t('brand_identity.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('brand_identity.description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Typography Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.typography')}</h2>
            <p className="text-muted-foreground">Font families, sizes, and weights used across the platform</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Font Family</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2">English: Inter</p>
                  <p className="text-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Arabic: Cairo</p>
                  <p className="text-2xl" style={{ fontFamily: 'Cairo, sans-serif' }}>السلام عليكم ورحمة الله وبركاته</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">Font Sizes & Weights</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">H1 - 2.25rem / 36px | Bold (700)</p>
                  <h1 className="text-4xl font-bold">Building the Future</h1>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">H2 - 1.875rem / 30px | Bold (700)</p>
                  <h2 className="text-3xl font-bold">Our Services</h2>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">H3 - 1.5rem / 24px | Bold (700)</p>
                  <h3 className="text-2xl font-bold">Design System</h3>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Body - 1rem / 16px | Regular (400)</p>
                  <p className="text-base">This is body text used for paragraphs and general content throughout the application.</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Caption - 0.875rem / 14px | Regular (400)</p>
                  <p className="text-sm">Caption text for metadata and secondary information.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.colors')}</h2>
            <p className="text-muted-foreground">Complete color palette for consistent visual identity</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Primary Color */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: '#3B82F6' }}
                onClick={() => copyToClipboard('#3B82F6', 'primary')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'primary' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70 hover:text-white" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_primary')}</p>
              <p className="text-sm text-muted-foreground">#3B82F6</p>
            </motion.div>

            {/* Background Dark */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: '#0a0a0a' }}
                onClick={() => copyToClipboard('#0a0a0a', 'bg-dark')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'bg-dark' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70 hover:text-white" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_background')}</p>
              <p className="text-sm text-muted-foreground">#0a0a0a</p>
            </motion.div>

            {/* Background Gradient */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundImage: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)' }}
                onClick={() => copyToClipboard('linear-gradient(to bottom, #0a0a0a, #1a1a2e)', 'bg-gradient')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'bg-gradient' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70 hover:text-white" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_gradient')}</p>
              <p className="text-sm text-muted-foreground">Gradient</p>
            </motion.div>

            {/* Text Primary */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: '#f8f8f8' }}
                onClick={() => copyToClipboard('#f8f8f8', 'text-primary')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'text-primary' ? (
                    <Check className="w-5 h-5 text-black" />
                  ) : (
                    <Copy className="w-5 h-5 text-black/70 hover:text-black" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_text_primary')}</p>
              <p className="text-sm text-muted-foreground">#f8f8f8</p>
            </motion.div>

            {/* Text Secondary */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
                style={{ backgroundColor: '#a1a1a1' }}
                onClick={() => copyToClipboard('#a1a1a1', 'text-secondary')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'text-secondary' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70 hover:text-white" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_text_secondary')}</p>
              <p className="text-sm text-muted-foreground">#a1a1a1</p>
            </motion.div>

            {/* Accent/Border */}
            <motion.div variants={item}>
              <div
                className="h-32 rounded-lg mb-4 border border-white/20 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: '#2a2a2a' }}
                onClick={() => copyToClipboard('#2a2a2a', 'border')}
              >
                <div className="h-full flex items-end justify-end p-3">
                  {copiedColor === 'border' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/70 hover:text-white" />
                  )}
                </div>
              </div>
              <p className="font-semibold">{t('brand_identity.color_border')}</p>
              <p className="text-sm text-muted-foreground">#2a2a2a</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Spacing System */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.spacing')}</h2>
            <p className="text-muted-foreground">Consistent spacing scale for layouts and components</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8"
          >
            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Spacing Scale (Base Unit: 4px)</h3>
              <div className="space-y-4">
                {[
                  { name: 'xs', value: '4px', rem: '0.25rem' },
                  { name: 'sm', value: '8px', rem: '0.5rem' },
                  { name: 'md', value: '12px', rem: '0.75rem' },
                  { name: 'lg', value: '16px', rem: '1rem' },
                  { name: 'xl', value: '24px', rem: '1.5rem' },
                  { name: '2xl', value: '32px', rem: '2rem' },
                  { name: '3xl', value: '48px', rem: '3rem' },
                  { name: '4xl', value: '64px', rem: '4rem' }
                ].map((space) => (
                  <div key={space.name} className="flex items-center gap-4">
                    <div
                      className="bg-primary rounded-full"
                      style={{ width: space.value, height: '8px' }}
                    />
                    <div>
                      <p className="font-semibold">{space.name}: {space.value} ({space.rem})</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animation Patterns */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.animations')}</h2>
            <p className="text-muted-foreground">Standardized motion and animation patterns</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Page Load Animation</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">Duration: 0.8s</p>
                <p className="text-muted-foreground">Easing: ease-out</p>
                <p className="text-muted-foreground">Type: Fade in + Slide up</p>
                <div className="h-20 bg-primary/10 rounded-lg mt-6 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 bg-primary rounded-lg"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Hover State Animation</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">Duration: 0.3s</p>
                <p className="text-muted-foreground">Easing: ease-in-out</p>
                <p className="text-muted-foreground">Type: Scale + Opacity shift</p>
                <div className="h-20 bg-primary/10 rounded-lg mt-6 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
                  >
                    Hover Me
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Stagger Container</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">Stagger Duration: 0.1s</p>
                <p className="text-muted-foreground">Child Animation: Fade + Slide</p>
                <p className="text-muted-foreground">Used for: Lists, grids, cards</p>
                <div className="h-20 bg-primary/10 rounded-lg mt-6 flex items-center justify-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="w-3 h-3 bg-primary rounded-full"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-3 h-3 bg-primary rounded-full"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-3 h-3 bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Viewport Scroll Animation</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">Duration: 0.6s</p>
                <p className="text-muted-foreground">Trigger: Element in viewport</p>
                <p className="text-muted-foreground">Type: Fade + Direction-based slide</p>
                <div className="h-20 bg-primary/10 rounded-lg mt-6 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-primary rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Effects */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.interactive_effects')}</h2>
            <p className="text-muted-foreground">Interactive mouse and click effects for enhanced UX</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Particle System</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">• 100 particles with dynamic movement</p>
                <p className="text-muted-foreground">• Connection radius: 150px</p>
                <p className="text-muted-foreground">• Mouse interaction radius: 200px</p>
                <p className="text-muted-foreground">• Color: Cornflower blue (rgba(100, 149, 237))</p>
                <p className="text-muted-foreground mt-4">Hover: Repulsion effect</p>
                <p className="text-muted-foreground">Click: Attraction effect</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Click Feedback</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">Scale: 1.0 → 0.98 → 1.0</p>
                <p className="text-muted-foreground">Duration: 0.1s (instant)</p>
                <p className="text-muted-foreground">Used on: Buttons, cards, interactive elements</p>
                <p className="text-muted-foreground">Effect: Water ripple or light burst</p>
                <div className="h-12 bg-primary/10 rounded-lg mt-6 flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
                  >
                    Click Me
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Components Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.components')}</h2>
            <p className="text-muted-foreground">UI component patterns and button variants</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Button Variants</h3>
              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90">Primary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-background/40 backdrop-blur border border-black/10 rounded-lg p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Card Component</h3>
              <Card className="bg-background/50 border-black/10">
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>This is a card component with title and description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card content goes here with consistent padding and spacing.</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Responsive Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-2">{t('brand_identity.responsive')}</h2>
            <p className="text-muted-foreground">Responsive breakpoints and layout guidelines</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-background/40 backdrop-blur border border-white/10 rounded-lg p-8"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">Breakpoints</h3>
            <div className="space-y-4">
              {[
                { name: 'Mobile (xs)', size: '0px - 640px' },
                { name: 'Tablet (sm)', size: '640px - 768px' },
                { name: 'Landscape Tablet (md)', size: '768px - 1024px' },
                { name: 'Desktop (lg)', size: '1024px - 1280px' },
                { name: 'Large Desktop (xl)', size: '1280px+' }
              ].map((bp) => (
                <div key={bp.name} className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="font-semibold">{bp.name}</span>
                  <span className="text-muted-foreground">{bp.size}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to create with our design system?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">This guide ensures consistency across all pages, components, and interactions. Use it as your reference for all design decisions.</p>
            <Button size="lg" className="text-lg px-8 h-14 rounded-full">
              Explore the Website
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BrandIdentity;
