import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Globe, Shield, Zap, Building2, Code, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Product data
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
    stripeLink: 'https://buy.stripe.com/28EbJ2eqm86N9G8dg9f3a00',
  },
  {
    id: 'formation',
    code: 'FC-FORM-001',
    price: 1200,
    delivery: '7-10 days',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    popular: true,
    features: [
      'store.formation.feature1',
      'store.formation.feature2',
      'store.formation.feature3',
      'store.formation.feature4',
      'store.formation.feature5',
      'store.formation.feature6',
    ],
    stripeLink: 'https://buy.stripe.com/6oU28s5TQgDj9G87VPf3a01',
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
    stripeLink: 'https://buy.stripe.com/14A3cwfuq3Qx19Cgslf3a02',
  },
];

const Store = () => {
  const { t, language } = useLanguage();

  return (
    <Layout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('store.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        {t('store.popular')}
                      </Badge>
                    </div>
                  )}
                  <Card className={`h-full flex flex-col ${product.popular ? 'border-2 border-primary shadow-xl shadow-primary/20' : 'border-border/50'}`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${product.color} p-4 mb-4`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(`store.${product.id}.title`)}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {t(`store.${product.id}.subtitle`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">${product.price.toLocaleString()}</span>
                          <span className="text-muted-foreground text-sm">USD</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-2">
                          <Clock className="w-4 h-4" />
                          <span>{t('store.delivery')}: {product.delivery}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{t(feature)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button
                        asChild
                        className={`w-full ${product.popular ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90' : ''}`}
                        size="lg"
                      >
                        <a href={product.stripeLink} target="_blank" rel="noopener noreferrer">
                          {t('store.buy_now')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
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
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{t('store.guarantee.satisfaction_title')}</h3>
                <p className="text-sm text-muted-foreground">{t('store.guarantee.satisfaction_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('store.questions.title')}</h2>
          <p className="text-muted-foreground mb-6">{t('store.questions.subtitle')}</p>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              {t('store.questions.contact')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('store.portal.title')}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t('store.portal.subtitle')}</p>
          <Button asChild size="lg">
            <Link to="/portal">
              {t('store.portal.access')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default Store;
