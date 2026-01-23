import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check, Clock, Globe, Shield, Zap, Building2, Code, MessageSquare,
  ArrowRight, Star, MapPin, Workflow, Cloud, Megaphone, Bot,
  ShoppingCart, Calculator, Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Products - All go to detail pages (no direct purchase)
const products = [
  {
    id: 'advisory',
    code: 'FC-ADV-001',
    price: 250,
    delivery: '3-5 days',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    popular: false,
    features: [
      'store.advisory.feature1',
      'store.advisory.feature2',
      'store.advisory.feature3',
      'store.advisory.feature4',
      'store.advisory.feature5',
    ],
    link: '/store/advisory',
  },
  {
    id: 'wyoming',
    code: 'FC-WY-001',
    price: 297,
    priceNote: '+ $100 state fee',
    delivery: '1-15 days',
    deliveryNote: 'based on package',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    popular: true,
    features: [
      'store.wyoming.feature1',
      'store.wyoming.feature2',
      'store.wyoming.feature3',
      'store.wyoming.feature4',
      'store.wyoming.feature5',
    ],
    link: '/store/wyoming-llc',
    badge: 'Wyoming LLC',
  },
  {
    id: 'website',
    code: 'FC-WEB-001',
    price: 3500,
    delivery: '14 days',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    popular: false,
    features: [
      'store.website.feature1',
      'store.website.feature2',
      'store.website.feature3',
      'store.website.feature4',
      'store.website.feature5',
      'store.website.feature6',
    ],
    link: '/store/website-package',
  },
];

// Services that can be productized
const services = [
  {
    id: 'automation',
    icon: Workflow,
    color: 'from-orange-500 to-amber-500',
    priceFrom: 1500,
    link: '/store/services/automation',
  },
  {
    id: 'ai_agents',
    icon: Bot,
    color: 'from-violet-500 to-purple-500',
    priceFrom: 2000,
    link: '/store/services/ai-agents',
  },
  {
    id: 'marketing',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-500',
    priceFrom: 800,
    link: '/store/services/marketing',
  },
  {
    id: 'cloud',
    icon: Cloud,
    color: 'from-sky-500 to-blue-500',
    priceFrom: 500,
    link: '/store/services/cloud',
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500',
    priceFrom: 3000,
    link: '/store/services/ecommerce',
  },
  {
    id: 'rapid_product_dev',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    priceFrom: 5000,
    link: '/store/services/rapid-dev',
  },
];

const Store = () => {
  const { t, language, dir } = useLanguage();
  const navigate = useNavigate();

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              <Zap className="w-3 h-3 mr-1" />
              {t('store.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('store.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('store.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{t('store.trust.secure')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>{t('store.trust.global')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{t('store.trust.fast')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'ar' ? 'المنتجات الجاهزة' : 'Ready-to-Buy Products'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'خدمات محددة بأسعار واضحة' : 'Fixed-price solutions with clear deliverables'}
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {products.map((product) => {
              const IconComponent = product.icon;
              return (
                <motion.div
                  key={product.id}
                  variants={item}
                  className="relative cursor-pointer group"
                  onClick={() => navigate(product.link)}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        {t('store.popular')}
                      </Badge>
                    </div>
                  )}
                  <Card className={`h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${product.popular ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border-border/50 group-hover:border-primary/50'}`}>
                    <CardHeader className="text-center pb-4">
                      {product.badge && (
                        <Badge variant="outline" className="w-fit mx-auto mb-2 border-emerald-500/50 text-emerald-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {product.badge}
                        </Badge>
                      )}
                      <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${product.color} p-3 mb-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {t(`store.${product.id}.title`)}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {t(`store.${product.id}.subtitle`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* Price */}
                      <div className="text-center mb-4">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-sm text-muted-foreground">{language === 'ar' ? 'من' : 'from'}</span>
                          <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                        </div>
                        {product.priceNote && (
                          <span className="text-xs text-muted-foreground">{product.priceNote}</span>
                        )}
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3" />
                          <span>{t('store.delivery')}: {product.delivery}</span>
                        </div>
                        {product.deliveryNote && (
                          <span className="text-xs text-muted-foreground">({product.deliveryNote})</span>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {product.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-xs">{t(feature)}</span>
                          </li>
                        ))}
                        {product.features.length > 4 && (
                          <li className="text-xs text-primary font-medium">
                            +{product.features.length - 4} {language === 'ar' ? 'المزيد' : 'more'}
                          </li>
                        )}
                      </ul>
                    </CardContent>
                    <div className="p-4 pt-0">
                      <Button
                        className={`w-full ${product.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700' : ''}`}
                      >
                        {t('store.view_details')}
                        <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              {language === 'ar' ? 'خدمات متخصصة' : 'Professional Services'}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'ar' ? 'خدمات الأعمال' : 'Business Services'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'حلول مخصصة لاحتياجات عملك' : 'Custom solutions tailored to your needs'}
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
          >
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={item}
                  className="cursor-pointer group"
                  onClick={() => navigate(service.link)}
                >
                  <Card className="h-full text-center p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-primary/50">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${service.color} p-2.5 mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {t(`services.${service.id}`)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'من' : 'from'} ${service.priceFrom.toLocaleString()}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button variant="outline" asChild>
              <Link to="/services">
                {language === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quote Calculator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-3xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 bg-gradient-to-br from-primary/10 to-blue-500/10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-4 mb-4">
                    <Calculator className="w-full h-full text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'ar' ? 'حاسبة التكاليف' : 'Cost Calculator'}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'ar'
                      ? 'احسب تكاليف تأسيس شركتك في أمريكا بناءً على احتياجاتك'
                      : 'Estimate your US business formation costs based on your specific needs'}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {language === 'ar' ? 'تقدير فوري للتكاليف' : 'Instant cost estimate'}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {language === 'ar' ? 'مقارنة الولايات' : 'State comparison'}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {language === 'ar' ? 'خيارات مخصصة' : 'Custom options'}
                    </li>
                  </ul>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="font-semibold mb-2">
                    {language === 'ar' ? 'لست متأكداً مما تحتاج؟' : 'Not sure what you need?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {language === 'ar'
                      ? 'استخدم حاسبتنا للحصول على تقدير مخصص أو تواصل مع فريقنا'
                      : 'Use our calculator for a custom estimate or talk to our team'}
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full" asChild>
                      <Link to="/quote">
                        <Calculator className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'احسب التكلفة' : 'Calculate Cost'}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/contact">
                        {language === 'ar' ? 'تحدث مع خبير' : 'Talk to an Expert'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Trust/Guarantee Section */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold mb-8">{t('store.guarantee.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('store.guarantee.secure_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('store.guarantee.secure_desc')}</p>
              </div>
              <div className="p-6">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('store.guarantee.delivery_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('store.guarantee.delivery_desc')}</p>
              </div>
              <div className="p-6">
                <Star className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('store.guarantee.satisfaction_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('store.guarantee.satisfaction_desc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <h2 className="text-2xl font-bold mb-4">{t('store.questions.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('store.questions.subtitle')}</p>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                {t('store.questions.contact')}
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">{t('store.portal.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('store.portal.subtitle')}</p>
              </div>
              <Button asChild>
                <Link to="/portal">
                  {t('store.portal.access')}
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Store;
