import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calculator, Smartphone, Globe, Share2, Palette, Code, Database,
  ArrowRight, ArrowLeft, Check, FileText, CreditCard, Rocket,
  Building2, Layers, Zap, Clock, Shield, Star, ChevronDown,
  User, Mail, Phone, MessageSquare, CheckCircle2, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Service Types
type ServiceType = 'app' | 'website' | 'social' | 'custom';

// Calculator Step
type Step = 'select' | 'configure' | 'quote' | 'contract' | 'checkout';

// Configuration Options
interface AppConfig {
  platforms: ('ios' | 'android' | 'web')[];
  screens: number;
  complexity: 'simple' | 'medium' | 'complex';
  features: string[];
}

interface WebsiteConfig {
  pages: number;
  type: 'landing' | 'corporate' | 'ecommerce';
  features: string[];
}

interface SocialConfig {
  platforms: number;
  postsPerMonth: number;
  includesDesign: boolean;
  includesAds: boolean;
}

// Pricing Data
const pricing = {
  app: {
    basePerScreen: 500,
    complexity: {
      simple: 1,
      medium: 1.5,
      complex: 2.5
    },
    platforms: {
      ios: 1,
      android: 1,
      web: 0.8
    },
    features: {
      auth: 800,
      payments: 1200,
      notifications: 600,
      analytics: 500,
      chat: 1500,
      maps: 800,
      ai: 2500,
      api: 1000
    }
  },
  website: {
    basePerPage: 400,
    type: {
      landing: 1,
      corporate: 1.3,
      ecommerce: 2
    },
    features: {
      seo: 500,
      cms: 800,
      multilang: 600,
      blog: 400,
      contact: 200,
      booking: 1000,
      payments: 1200,
      analytics: 300
    }
  },
  social: {
    basePerPlatform: 300,
    basePerPost: 50,
    design: 500,
    ads: 800
  }
};

const QuoteCalculator = () => {
  const { t, language } = useLanguage();

  // State
  const [step, setStep] = useState<Step>('select');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [appConfig, setAppConfig] = useState<AppConfig>({
    platforms: ['ios', 'android'],
    screens: 10,
    complexity: 'medium',
    features: []
  });
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
    pages: 5,
    type: 'corporate',
    features: []
  });
  const [socialConfig, setSocialConfig] = useState<SocialConfig>({
    platforms: 3,
    postsPerMonth: 20,
    includesDesign: true,
    includesAds: false
  });

  // Contact Info
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [quoteId, setQuoteId] = useState('');

  // Calculate Price
  const calculatedPrice = useMemo(() => {
    if (serviceType === 'app') {
      let base = appConfig.screens * pricing.app.basePerScreen;
      base *= pricing.app.complexity[appConfig.complexity];

      // Platform multiplier
      const platformMultiplier = appConfig.platforms.reduce((acc, p) =>
        acc + pricing.app.platforms[p], 0);
      base *= Math.max(1, platformMultiplier * 0.7);

      // Features
      const featuresTotal = appConfig.features.reduce((acc, f) =>
        acc + (pricing.app.features[f as keyof typeof pricing.app.features] || 0), 0);

      return Math.round(base + featuresTotal);
    }

    if (serviceType === 'website') {
      let base = websiteConfig.pages * pricing.website.basePerPage;
      base *= pricing.website.type[websiteConfig.type];

      // Features
      const featuresTotal = websiteConfig.features.reduce((acc, f) =>
        acc + (pricing.website.features[f as keyof typeof pricing.website.features] || 0), 0);

      return Math.round(base + featuresTotal);
    }

    if (serviceType === 'social') {
      let total = socialConfig.platforms * pricing.social.basePerPlatform;
      total += socialConfig.postsPerMonth * pricing.social.basePerPost;
      if (socialConfig.includesDesign) total += pricing.social.design;
      if (socialConfig.includesAds) total += pricing.social.ads;

      return Math.round(total);
    }

    return 0;
  }, [serviceType, appConfig, websiteConfig, socialConfig]);

  // Generate Quote
  const generateQuote = () => {
    const id = `QT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setQuoteId(id);
    setQuoteGenerated(true);
    setStep('quote');
  };

  // Service Cards
  const services = [
    {
      id: 'app',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      title: language === 'ar' ? 'تطوير تطبيقات' : 'App Development',
      desc: language === 'ar' ? 'iOS, Android, Web Apps' : 'iOS, Android, Web Apps',
      startPrice: 5000
    },
    {
      id: 'website',
      icon: Globe,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      title: language === 'ar' ? 'تطوير مواقع' : 'Website Development',
      desc: language === 'ar' ? 'مواقع احترافية ومتاجر' : 'Professional sites & stores',
      startPrice: 2000
    },
    {
      id: 'social',
      icon: Share2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      title: language === 'ar' ? 'إدارة سوشيال ميديا' : 'Social Media Management',
      desc: language === 'ar' ? 'محتوى وإعلانات' : 'Content & Advertising',
      startPrice: 800
    }
  ];

  // App Features
  const appFeatures = [
    { id: 'auth', label: language === 'ar' ? 'تسجيل دخول / مستخدمين' : 'User Auth', icon: User },
    { id: 'payments', label: language === 'ar' ? 'بوابة دفع' : 'Payments', icon: CreditCard },
    { id: 'notifications', label: language === 'ar' ? 'إشعارات' : 'Push Notifications', icon: MessageSquare },
    { id: 'analytics', label: language === 'ar' ? 'تحليلات' : 'Analytics', icon: Database },
    { id: 'chat', label: language === 'ar' ? 'محادثة فورية' : 'Real-time Chat', icon: MessageSquare },
    { id: 'maps', label: language === 'ar' ? 'خرائط وموقع' : 'Maps & Location', icon: Globe },
    { id: 'ai', label: language === 'ar' ? 'ذكاء اصطناعي' : 'AI Features', icon: Sparkles },
    { id: 'api', label: language === 'ar' ? 'تكامل API' : 'API Integration', icon: Code }
  ];

  // Website Features
  const websiteFeatures = [
    { id: 'seo', label: language === 'ar' ? 'تحسين محركات البحث' : 'SEO Optimization', icon: Zap },
    { id: 'cms', label: language === 'ar' ? 'نظام إدارة محتوى' : 'CMS Dashboard', icon: Layers },
    { id: 'multilang', label: language === 'ar' ? 'متعدد اللغات' : 'Multi-language', icon: Globe },
    { id: 'blog', label: language === 'ar' ? 'مدونة' : 'Blog Section', icon: FileText },
    { id: 'contact', label: language === 'ar' ? 'نموذج تواصل' : 'Contact Form', icon: Mail },
    { id: 'booking', label: language === 'ar' ? 'نظام حجز' : 'Booking System', icon: Clock },
    { id: 'payments', label: language === 'ar' ? 'بوابة دفع' : 'Payment Gateway', icon: CreditCard },
    { id: 'analytics', label: language === 'ar' ? 'تحليلات' : 'Analytics', icon: Database }
  ];

  // Render Step Content
  const renderStepContent = () => {
    switch (step) {
      case 'select':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
                <Calculator className="w-3 h-3 mr-1" />
                {language === 'ar' ? 'حاسبة الأسعار الذكية' : 'Smart Quote Calculator'}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">
                {language === 'ar' ? 'احسب تكلفة مشروعك فوراً' : 'Calculate Your Project Cost Instantly'}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'اختر نوع الخدمة وخصص متطلباتك للحصول على عرض سعر فوري'
                  : 'Select your service type and customize your requirements for an instant quote'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                        serviceType === service.id ? 'border-2 border-primary shadow-lg' : ''
                      }`}
                      onClick={() => {
                        setServiceType(service.id as ServiceType);
                        setStep('configure');
                      }}
                    >
                      <CardContent className="pt-6 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${service.color} p-4 mb-4`}>
                          <IconComponent className="w-full h-full text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                        <p className="text-sm">
                          {language === 'ar' ? 'يبدأ من' : 'Starting at'}{' '}
                          <span className="font-bold text-primary">${service.startPrice.toLocaleString()}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      case 'configure':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <Button variant="ghost" onClick={() => setStep('select')} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Configuration Panel */}
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {language === 'ar' ? 'خصص مشروعك' : 'Customize Your Project'}
                </h2>

                {serviceType === 'app' && (
                  <div className="space-y-6">
                    {/* Platforms */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'المنصات' : 'Platforms'}
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {(['ios', 'android', 'web'] as const).map((platform) => (
                          <Badge
                            key={platform}
                            variant={appConfig.platforms.includes(platform) ? 'default' : 'outline'}
                            className="cursor-pointer px-4 py-2 text-sm"
                            onClick={() => {
                              setAppConfig(prev => ({
                                ...prev,
                                platforms: prev.platforms.includes(platform)
                                  ? prev.platforms.filter(p => p !== platform)
                                  : [...prev.platforms, platform]
                              }));
                            }}
                          >
                            {platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Web App'}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Screens */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'عدد الشاشات' : 'Number of Screens'}: <span className="text-primary">{appConfig.screens}</span>
                      </Label>
                      <Slider
                        value={[appConfig.screens]}
                        onValueChange={([value]) => setAppConfig(prev => ({ ...prev, screens: value }))}
                        min={5}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5</span>
                        <span>50+</span>
                      </div>
                    </div>

                    {/* Complexity */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'مستوى التعقيد' : 'Complexity Level'}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['simple', 'medium', 'complex'] as const).map((level) => (
                          <Card
                            key={level}
                            className={`cursor-pointer text-center p-3 ${
                              appConfig.complexity === level ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setAppConfig(prev => ({ ...prev, complexity: level }))}
                          >
                            <p className="font-medium text-sm">
                              {level === 'simple' ? (language === 'ar' ? 'بسيط' : 'Simple') :
                               level === 'medium' ? (language === 'ar' ? 'متوسط' : 'Medium') :
                               (language === 'ar' ? 'معقد' : 'Complex')}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'الميزات الإضافية' : 'Additional Features'}
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {appFeatures.map((feature) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div
                              key={feature.id}
                              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                appConfig.features.includes(feature.id)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => {
                                setAppConfig(prev => ({
                                  ...prev,
                                  features: prev.features.includes(feature.id)
                                    ? prev.features.filter(f => f !== feature.id)
                                    : [...prev.features, feature.id]
                                }));
                              }}
                            >
                              <FeatureIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm">{feature.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {serviceType === 'website' && (
                  <div className="space-y-6">
                    {/* Pages */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'عدد الصفحات' : 'Number of Pages'}: <span className="text-primary">{websiteConfig.pages}</span>
                      </Label>
                      <Slider
                        value={[websiteConfig.pages]}
                        onValueChange={([value]) => setWebsiteConfig(prev => ({ ...prev, pages: value }))}
                        min={1}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'نوع الموقع' : 'Website Type'}
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['landing', 'corporate', 'ecommerce'] as const).map((type) => (
                          <Card
                            key={type}
                            className={`cursor-pointer text-center p-3 ${
                              websiteConfig.type === type ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setWebsiteConfig(prev => ({ ...prev, type }))}
                          >
                            <p className="font-medium text-sm">
                              {type === 'landing' ? (language === 'ar' ? 'صفحة هبوط' : 'Landing') :
                               type === 'corporate' ? (language === 'ar' ? 'شركات' : 'Corporate') :
                               (language === 'ar' ? 'متجر' : 'E-commerce')}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'الميزات الإضافية' : 'Additional Features'}
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {websiteFeatures.map((feature) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div
                              key={feature.id}
                              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                websiteConfig.features.includes(feature.id)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => {
                                setWebsiteConfig(prev => ({
                                  ...prev,
                                  features: prev.features.includes(feature.id)
                                    ? prev.features.filter(f => f !== feature.id)
                                    : [...prev.features, feature.id]
                                }));
                              }}
                            >
                              <FeatureIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm">{feature.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {serviceType === 'social' && (
                  <div className="space-y-6">
                    {/* Platforms */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'عدد المنصات' : 'Number of Platforms'}: <span className="text-primary">{socialConfig.platforms}</span>
                      </Label>
                      <Slider
                        value={[socialConfig.platforms]}
                        onValueChange={([value]) => setSocialConfig(prev => ({ ...prev, platforms: value }))}
                        min={1}
                        max={6}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'ar' ? 'Instagram, Twitter, TikTok, LinkedIn, Facebook, Snapchat' : 'Instagram, Twitter, TikTok, LinkedIn, Facebook, Snapchat'}
                      </p>
                    </div>

                    {/* Posts */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        {language === 'ar' ? 'عدد المنشورات شهرياً' : 'Posts per Month'}: <span className="text-primary">{socialConfig.postsPerMonth}</span>
                      </Label>
                      <Slider
                        value={[socialConfig.postsPerMonth]}
                        onValueChange={([value]) => setSocialConfig(prev => ({ ...prev, postsPerMonth: value }))}
                        min={4}
                        max={60}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${
                          socialConfig.includesDesign ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSocialConfig(prev => ({ ...prev, includesDesign: !prev.includesDesign }))}
                      >
                        <Checkbox checked={socialConfig.includesDesign} />
                        <div>
                          <p className="font-medium">{language === 'ar' ? 'تصميم جرافيك' : 'Graphic Design'}</p>
                          <p className="text-sm text-muted-foreground">+$500/{language === 'ar' ? 'شهر' : 'month'}</p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${
                          socialConfig.includesAds ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSocialConfig(prev => ({ ...prev, includesAds: !prev.includesAds }))}
                      >
                        <Checkbox checked={socialConfig.includesAds} />
                        <div>
                          <p className="font-medium">{language === 'ar' ? 'إدارة الإعلانات' : 'Ads Management'}</p>
                          <p className="text-sm text-muted-foreground">+$800/{language === 'ar' ? 'شهر' : 'month'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Preview */}
              <div>
                <Card className="sticky top-24 bg-gradient-to-br from-card to-card/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'عرض السعر' : 'Price Preview'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'ar' ? 'التكلفة التقديرية' : 'Estimated Cost'}
                      </p>
                      <div className="text-5xl font-bold text-primary mb-2">
                        ${calculatedPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {serviceType === 'social'
                          ? (language === 'ar' ? '/شهرياً' : '/month')
                          : (language === 'ar' ? 'لمرة واحدة' : 'one-time')}
                      </p>
                    </div>

                    <div className="border-t border-border/50 pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{language === 'ar' ? 'دعم فني مجاني لمدة شهر' : 'Free support for 1 month'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{language === 'ar' ? 'تعديلات مجانية خلال التطوير' : 'Free revisions during development'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{language === 'ar' ? 'ضمان الرضا' : 'Satisfaction guarantee'}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600"
                      size="lg"
                      onClick={generateQuote}
                    >
                      {language === 'ar' ? 'احصل على عرض سعر رسمي' : 'Get Official Quote'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'quote':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {language === 'ar' ? 'عرض السعر جاهز!' : 'Your Quote is Ready!'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'رقم العرض' : 'Quote ID'}: <span className="font-mono font-bold">{quoteId}</span>
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'ملخص العرض' : 'Quote Summary'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">{language === 'ar' ? 'نوع الخدمة' : 'Service Type'}</span>
                    <span className="font-medium">
                      {serviceType === 'app' ? (language === 'ar' ? 'تطوير تطبيق' : 'App Development') :
                       serviceType === 'website' ? (language === 'ar' ? 'تطوير موقع' : 'Website Development') :
                       (language === 'ar' ? 'إدارة سوشيال ميديا' : 'Social Media')}
                    </span>
                  </div>

                  {serviceType === 'app' && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">{language === 'ar' ? 'المنصات' : 'Platforms'}</span>
                        <span className="font-medium">{appConfig.platforms.join(', ')}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">{language === 'ar' ? 'عدد الشاشات' : 'Screens'}</span>
                        <span className="font-medium">{appConfig.screens}</span>
                      </div>
                    </>
                  )}

                  {serviceType === 'website' && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">{language === 'ar' ? 'عدد الصفحات' : 'Pages'}</span>
                        <span className="font-medium">{websiteConfig.pages}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">{language === 'ar' ? 'نوع الموقع' : 'Type'}</span>
                        <span className="font-medium">{websiteConfig.type}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center py-4 bg-primary/5 rounded-lg px-4">
                    <span className="font-bold text-lg">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="font-bold text-2xl text-primary">
                      ${calculatedPrice.toLocaleString()}
                      {serviceType === 'social' && <span className="text-sm text-muted-foreground">/{language === 'ar' ? 'شهر' : 'mo'}</span>}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'أدخل بياناتك للمتابعة مع العقد الرقمي' : 'Enter your details to proceed with the digital contract'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</Label>
                      <Input
                        id="name"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{language === 'ar' ? 'رقم الجوال' : 'Phone'} *</Label>
                      <Input
                        id="phone"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+966 5XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">{language === 'ar' ? 'اسم الشركة (اختياري)' : 'Company (Optional)'}</Label>
                      <Input
                        id="company"
                        value={contactInfo.company}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={language === 'ar' ? 'اسم شركتك' : 'Company name'}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-blue-600"
                    size="lg"
                    onClick={() => setStep('contract')}
                    disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                  >
                    {language === 'ar' ? 'متابعة للعقد الرقمي' : 'Proceed to Digital Contract'}
                    <FileText className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'contract':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {language === 'ar' ? 'العقد الرقمي' : 'Digital Contract'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'راجع واقبل الشروط للمتابعة' : 'Review and accept terms to proceed'}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{language === 'ar' ? 'اتفاقية نطاق العمل' : 'Scope of Work Agreement'}</CardTitle>
                    <CardDescription>{language === 'ar' ? 'رقم العقد' : 'Contract'}: {quoteId}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    {language === 'ar' ? 'جاهز للتوقيع' : 'Ready to Sign'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm">
                  <h4 className="font-bold mb-2">{language === 'ar' ? '1. نطاق العمل' : '1. Scope of Work'}</h4>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar'
                      ? `تتعهد فالكون كور بتقديم خدمات ${serviceType === 'app' ? 'تطوير تطبيق' : serviceType === 'website' ? 'تطوير موقع' : 'إدارة سوشيال ميديا'} وفق المواصفات المحددة في عرض السعر رقم ${quoteId}.`
                      : `Falcon Core agrees to provide ${serviceType === 'app' ? 'App Development' : serviceType === 'website' ? 'Website Development' : 'Social Media Management'} services as specified in Quote #${quoteId}.`
                    }
                  </p>

                  <h4 className="font-bold mb-2">{language === 'ar' ? '2. السعر وشروط الدفع' : '2. Price & Payment Terms'}</h4>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar'
                      ? `إجمالي المشروع: $${calculatedPrice.toLocaleString()} دولار أمريكي. الدفعة الأولى 50% عند التوقيع، والباقي عند التسليم.`
                      : `Total project value: $${calculatedPrice.toLocaleString()} USD. 50% due upon signing, balance upon delivery.`
                    }
                  </p>

                  <h4 className="font-bold mb-2">{language === 'ar' ? '3. الجدول الزمني' : '3. Timeline'}</h4>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar'
                      ? 'يبدأ المشروع خلال 48 ساعة من استلام الدفعة الأولى. مدة التنفيذ المقدرة ستُحدد بناءً على المواصفات النهائية.'
                      : 'Project commences within 48 hours of receiving initial payment. Estimated completion timeline will be confirmed based on final specifications.'
                    }
                  </p>

                  <h4 className="font-bold mb-2">{language === 'ar' ? '4. التعديلات' : '4. Revisions'}</h4>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar'
                      ? 'يشمل السعر 3 جولات تعديلات مجانية. التعديلات الإضافية تُسعّر بشكل منفصل.'
                      : 'Price includes 3 rounds of free revisions. Additional revisions will be quoted separately.'
                    }
                  </p>

                  <h4 className="font-bold mb-2">{language === 'ar' ? '5. السرية' : '5. Confidentiality'}</h4>
                  <p className="text-muted-foreground">
                    {language === 'ar'
                      ? 'تلتزم فالكون كور بالحفاظ على سرية جميع المعلومات المقدمة من العميل.'
                      : 'Falcon Core commits to maintaining confidentiality of all client-provided information.'
                    }
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    {language === 'ar'
                      ? 'أوافق على شروط العقد والسياسة الخاصة بفالكون كور. أفهم أن هذا يمثل اتفاقية ملزمة قانونياً.'
                      : 'I agree to the contract terms and Falcon Core\'s policies. I understand this represents a legally binding agreement.'
                    }
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep('quote')} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                size="lg"
                onClick={() => setStep('checkout')}
                disabled={!acceptedTerms}
              >
                {language === 'ar' ? 'التوقيع والدفع' : 'Sign & Pay'}
                <CreditCard className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 'checkout':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'تم توقيع العقد بنجاح!' : 'Contract Signed Successfully!'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'ar'
                ? 'الآن أكمل الدفع لبدء المشروع'
                : 'Now complete payment to start your project'
              }
            </p>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'الدفعة الأولى (50%)' : 'Initial Payment (50%)'}</p>
                    <p className="text-3xl font-bold text-primary">${Math.round(calculatedPrice * 0.5).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{language === 'ar' ? 'رقم العقد' : 'Contract'}</p>
                    <p className="font-mono font-bold">{quoteId}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-blue-600"
                  size="lg"
                  asChild
                >
                  <a href={`https://buy.stripe.com/custom?quote=${quoteId}&amount=${Math.round(calculatedPrice * 0.5)}`}>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {language === 'ar' ? 'الدفع عبر Stripe' : 'Pay with Stripe'}
                  </a>
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {language === 'ar' ? 'دفع آمن' : 'Secure'}
                  </span>
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>mada</span>
                  <span>Apple Pay</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-6 text-sm">
              <Link to="/portal" className="text-primary hover:underline">
                {language === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
              </Link>
              <Link to="/contact" className="text-primary hover:underline">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Support'}
              </Link>
            </div>
          </motion.div>
        );
    }
  };

  // Progress Indicator
  const steps = [
    { id: 'select', label: language === 'ar' ? 'اختر الخدمة' : 'Select', icon: Layers },
    { id: 'configure', label: language === 'ar' ? 'خصص' : 'Configure', icon: Calculator },
    { id: 'quote', label: language === 'ar' ? 'عرض السعر' : 'Quote', icon: FileText },
    { id: 'contract', label: language === 'ar' ? 'العقد' : 'Contract', icon: Shield },
    { id: 'checkout', label: language === 'ar' ? 'الدفع' : 'Pay', icon: CreditCard }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Progress Bar */}
          {step !== 'select' && (
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-between">
                {steps.map((s, index) => {
                  const StepIcon = s.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrent = s.id === step;

                  return (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {s.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default QuoteCalculator;
