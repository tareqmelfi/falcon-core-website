import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check, Clock, Globe, Shield, Zap, Building2, ArrowRight, Star,
  FileText, Phone, Mail, CreditCard, MapPin, Lock, Users, Scale,
  Briefcase, TrendingUp, ChevronDown, ChevronUp, HelpCircle,
  DollarSign, Calendar, AlertCircle, CheckCircle2, Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Wyoming LLC Formation Packages - Based on Strategic Document
const formationPackages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 297,
    stateFee: 100,
    processing: '10-15',
    processingLabel: 'business days',
    features: [
      { key: 'articles', included: true },
      { key: 'name_check', included: true },
      { key: 'digital_docs', included: true },
      { key: 'operating_agreement', value: 'basic_template' },
      { key: 'registered_agent', value: 'add_149' },
      { key: 'ein', value: 'add_149' },
      { key: 'banking_guide', included: false },
      { key: 'banking_assistance', included: false },
      { key: 'virtual_address', included: false },
      { key: 'us_phone', included: false },
      { key: 'strategy_call', included: false },
      { key: 'tax_consultation', included: false },
      { key: 'support', value: '30_day_email' },
      { key: 'compliance_dashboard', included: false },
    ],
    popular: false,
    color: 'border-border/50'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 497,
    stateFee: 100,
    processing: '5-7',
    processingLabel: 'business days',
    features: [
      { key: 'articles', included: true },
      { key: 'name_check', included: true },
      { key: 'digital_docs', included: true },
      { key: 'operating_agreement', value: 'customized' },
      { key: 'registered_agent', value: 'included_1yr' },
      { key: 'ein', value: 'included' },
      { key: 'banking_guide', included: true },
      { key: 'banking_assistance', included: false },
      { key: 'virtual_address', included: false },
      { key: 'us_phone', included: false },
      { key: 'strategy_call', included: false },
      { key: 'tax_consultation', included: false },
      { key: 'support', value: '90_day_whatsapp' },
      { key: 'compliance_dashboard', included: false },
    ],
    popular: true,
    color: 'border-2 border-primary shadow-xl shadow-primary/20'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 997,
    stateFee: 100,
    processing: '1-3',
    processingLabel: 'business days',
    features: [
      { key: 'articles', included: true },
      { key: 'name_check', included: true },
      { key: 'digital_docs', included: true },
      { key: 'operating_agreement', value: 'customized_review' },
      { key: 'registered_agent', value: 'included_1yr' },
      { key: 'ein', value: 'included' },
      { key: 'banking_guide', included: true },
      { key: 'banking_assistance', value: 'hands_on' },
      { key: 'virtual_address', value: 'included_1yr' },
      { key: 'us_phone', value: 'included_1yr' },
      { key: 'strategy_call', value: '60_min' },
      { key: 'tax_consultation', value: '30_min' },
      { key: 'support', value: '12_month_priority' },
      { key: 'compliance_dashboard', value: 'lifetime' },
    ],
    popular: false,
    color: 'border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent'
  }
];

// Add-on Services
const addOnServices = [
  { id: 'expedited_5_7', name: 'Expedited Processing (5-7 days)', price: 75, forPackages: ['basic'] },
  { id: 'rush_1_3', name: 'Rush Processing (1-3 days)', price: 150, forPackages: ['basic', 'standard'] },
  { id: 'ein_standalone', name: 'EIN Procurement', price: 149, forPackages: ['basic'] },
  { id: 'operating_custom', name: 'Custom Operating Agreement', price: 149, forPackages: ['basic'] },
  { id: 'compliance_annual', name: 'Annual Compliance Package', price: 199, annual: true },
  { id: 'good_standing', name: 'Certificate of Good Standing', price: 75 },
  { id: 'apostille', name: 'Apostille Service', price: 199 },
];

// Why Wyoming Benefits
const wyomingBenefits = [
  {
    icon: DollarSign,
    title: 'zero_tax',
    desc: 'zero_tax_desc'
  },
  {
    icon: Lock,
    title: 'privacy',
    desc: 'privacy_desc'
  },
  {
    icon: Shield,
    title: 'asset_protection',
    desc: 'asset_protection_desc'
  },
  {
    icon: FileText,
    title: 'no_franchise',
    desc: 'no_franchise_desc'
  },
  {
    icon: Calendar,
    title: 'lifetime',
    desc: 'lifetime_desc'
  }
];

// Entity Types
const entityTypes = [
  {
    id: 'llc',
    icon: Building2,
    recommended: true,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'scorp',
    icon: TrendingUp,
    recommended: false,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ccorp',
    icon: Briefcase,
    recommended: false,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'nonprofit',
    icon: Users,
    recommended: false,
    color: 'from-orange-500 to-red-500'
  }
];

// FAQs
const faqs = [
  { category: 'formation', questions: ['how_long', 'one_time_fee', 'visit_us', 'non_us_citizen', 'registered_agent', 'signature'] },
  { category: 'banking', questions: ['us_bank_nonresident', 'need_ein', 'ein_time'] },
  { category: 'compliance', questions: ['ongoing_requirements', 'us_taxes', 'miss_deadline'] },
  { category: 'pricing', questions: ['hidden_fees', 'upgrade_later', 'refunds'] }
];

const Store = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState('llc');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section - Stage 1: Discovery */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-500">
                <MapPin className="w-3 h-3 mr-1" />
                {language === 'ar' ? 'متخصصون في وايومنغ حصرياً' : 'Wyoming Specialists'}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {language === 'ar'
                  ? 'أطلق إمبراطوريتك التجارية الأمريكية'
                  : 'Launch Your US Business Empire'}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                {language === 'ar'
                  ? 'من الرياض إلى وايومنغ في أيام، لا أشهر.'
                  : 'From Riyadh to Wyoming in Days, Not Months.'}
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'تأسيس شركة وايومنغ LLC مصمم حصرياً لرواد الأعمال العرب. خبرة متميزة. دعم ثنائي اللغة. بدون تعقيد.'
                  : 'Wyoming LLC formation designed exclusively for Arab entrepreneurs. Premium expertise. Bilingual support. Zero confusion.'}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Button size="lg" className="text-lg px-8 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" onClick={() => navigate('/order-intake')}>
                  {language === 'ar' ? 'ابدأ شركتك الآن' : 'Start Your Wyoming LLC'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 rounded-full" asChild>
                  <a href="#why-wyoming">
                    {language === 'ar' ? 'لماذا وايومنغ؟' : 'Learn Why Wyoming'}
                  </a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <span>{language === 'ar' ? 'المتخصص الأول في وايومنغ لرواد GCC' : "Wyoming's #1 for GCC Entrepreneurs"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>{language === 'ar' ? 'دعم ثنائي اللغة' : 'Bilingual Support'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>{language === 'ar' ? 'آمن ومتوافق' : 'Secure & Compliant'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Wyoming Section - Stage 2: Education */}
        <section id="why-wyoming" className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'ar' ? 'لماذا يختار رواد الأعمال الأذكياء وايومنغ؟' : 'Why Smart Entrepreneurs Choose Wyoming'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {language === 'ar'
                  ? 'وايومنغ ليست مجرد ولاية أخرى — إنها السر الأفضل في أمريكا لحماية الأصول وخصوصية الأعمال.'
                  : "Wyoming isn't just another state—it's America's best-kept secret for asset protection and business privacy."}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {wyomingBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                          <IconComponent className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          {t(`store.wyoming.${benefit.title}`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`store.wyoming.${benefit.desc}`)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Entity Comparison Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'ar' ? 'أي نوع كيان يناسبك؟' : 'Which Entity Type is Right for You?'}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {entityTypes.map((entity) => {
                const IconComponent = entity.icon;
                const isSelected = selectedEntity === entity.id;
                return (
                  <motion.div
                    key={entity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all h-full ${
                        isSelected ? 'border-2 border-primary shadow-lg' : 'border-border/50 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedEntity(entity.id)}
                    >
                      <CardContent className="pt-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${entity.color} p-3 mb-4`}>
                          <IconComponent className="w-full h-full text-white" />
                        </div>
                        {entity.recommended && (
                          <Badge className="mb-2 bg-emerald-500">
                            {language === 'ar' ? 'موصى به' : 'Recommended'}
                          </Badge>
                        )}
                        <h3 className="font-bold text-lg mb-2">{t(`store.entity.${entity.id}.title`)}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{t(`store.entity.${entity.id}.best_for`)}</p>
                        <p className="text-sm text-muted-foreground">{t(`store.entity.${entity.id}.desc`)}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                {language === 'ar' ? 'غير متأكد أي كيان يناسبك؟' : 'Not sure which entity is right for you?'}
              </p>
              <Button variant="outline" asChild>
                <Link to="/contact">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'احجز استشارة مجانية 15 دقيقة' : 'Book a Free 15-Min Consultation'}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section - Stage 3: Package Selection */}
        <section id="pricing" className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'ar' ? 'اختر باقة التأسيس' : 'Choose Your Formation Package'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'ar'
                  ? 'اختر مستوى الخدمة الذي يناسب احتياجات عملك. جميع الباقات تشمل تخصصنا في وايومنغ ودعمنا ثنائي اللغة.'
                  : 'Select the level of service that matches your business needs. All packages include our Wyoming specialization and bilingual support.'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {formationPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4">
                        <Star className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                      </Badge>
                    </div>
                  )}
                  <Card className={`h-full flex flex-col ${pkg.color}`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                      <div className="mt-4">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold">${pkg.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          + ${pkg.stateFee} {language === 'ar' ? 'رسوم الولاية' : 'State Fee'}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-sm text-primary mt-2">
                          <Clock className="w-4 h-4" />
                          <span>{pkg.processing} {language === 'ar' ? 'أيام عمل' : pkg.processingLabel}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-sm">{language === 'ar' ? 'تقديم عقد التأسيس' : 'Articles of Organization Filing'}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-sm">{language === 'ar' ? 'فحص توفر الاسم' : 'Name Availability Check'}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-sm">{language === 'ar' ? 'تسليم المستندات رقمياً' : 'Digital Document Delivery'}</span>
                        </li>

                        {/* Operating Agreement */}
                        <li className="flex items-center gap-2">
                          {pkg.features.find(f => f.key === 'operating_agreement')?.value === 'basic_template' ? (
                            <>
                              <Check className="w-5 h-5 text-muted-foreground shrink-0" />
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'قالب اتفاقية تشغيل أساسي' : 'Basic Operating Agreement Template'}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'اتفاقية تشغيل مخصصة' : 'Customized Operating Agreement'}</span>
                            </>
                          )}
                        </li>

                        {/* Registered Agent */}
                        <li className="flex items-center gap-2">
                          {pkg.features.find(f => f.key === 'registered_agent')?.value === 'add_149' ? (
                            <>
                              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'وكيل مسجل +$149' : 'Registered Agent +$149'}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'وكيل مسجل (السنة الأولى)' : 'Registered Agent (1st Year)'}</span>
                            </>
                          )}
                        </li>

                        {/* EIN */}
                        <li className="flex items-center gap-2">
                          {pkg.features.find(f => f.key === 'ein')?.value === 'add_149' ? (
                            <>
                              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'رقم ضريبي EIN +$149' : 'EIN Procurement +$149'}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'رقم ضريبي فيدرالي EIN' : 'Federal EIN Included'}</span>
                            </>
                          )}
                        </li>

                        {/* Banking Guide */}
                        <li className="flex items-center gap-2">
                          {pkg.features.find(f => f.key === 'banking_guide')?.included ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'دليل فتح الحساب البنكي' : 'Banking Setup Guide'}</span>
                            </>
                          ) : (
                            <>
                              <span className="w-5 h-5 shrink-0" />
                              <span className="text-sm text-muted-foreground line-through">{language === 'ar' ? 'دليل فتح الحساب' : 'Banking Guide'}</span>
                            </>
                          )}
                        </li>

                        {/* Premium Features */}
                        {pkg.id === 'premium' && (
                          <>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'مساعدة فتح حساب بنكي' : 'Banking Application Assistance'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'عنوان بريدي أمريكي (سنة)' : 'US Virtual Address (1st Year)'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'رقم هاتف أمريكي (سنة)' : 'US Phone Number (1st Year)'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'مكالمة استراتيجية 60 دقيقة' : '60-Min Strategy Call'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'استشارة ضريبية 30 دقيقة' : '30-Min Tax Consultation'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                              <span className="text-sm">{language === 'ar' ? 'لوحة الالتزام مدى الحياة' : 'Lifetime Compliance Dashboard'}</span>
                            </li>
                          </>
                        )}

                        {/* Support Level */}
                        <li className="flex items-center gap-2 pt-2 border-t border-border/50 mt-2">
                          <Mail className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm font-medium">
                            {pkg.id === 'basic' && (language === 'ar' ? 'دعم بريدي 30 يوم' : '30-Day Email Support')}
                            {pkg.id === 'standard' && (language === 'ar' ? 'دعم واتساب 90 يوم' : '90-Day WhatsApp Support')}
                            {pkg.id === 'premium' && (language === 'ar' ? 'دعم أولوية 12 شهر' : '12-Month Priority Support')}
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-4">
                      <Button
                        className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-primary to-blue-600' : ''}`}
                        size="lg"
                        onClick={() => navigate(`/order-intake?package=${pkg.id}`)}
                      >
                        {language === 'ar' ? `اطلب ${pkg.name}` : `Order ${pkg.name}`}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pricing Notes */}
            <div className="max-w-3xl mx-auto mt-12 text-center">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{language === 'ar' ? 'دفعة واحدة، بدون رسوم خفية' : 'One-Time Fee. No Hidden Charges.'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{language === 'ar' ? 'ضمان استرداد الأموال' : 'Money-Back Guarantee'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add-On Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'خدمات إضافية' : 'Add-On Services'}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {addOnServices.map((addon) => (
                <Card key={addon.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{language === 'ar' ? t(`store.addon.${addon.id}`) : addon.name}</p>
                        {addon.annual && <Badge variant="outline" className="mt-1 text-xs">{language === 'ar' ? '/سنوياً' : '/year'}</Badge>}
                      </div>
                      <span className="font-bold text-primary">${addon.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="formation" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="formation">{language === 'ar' ? 'التأسيس' : 'Formation'}</TabsTrigger>
                  <TabsTrigger value="banking">{language === 'ar' ? 'البنوك' : 'Banking'}</TabsTrigger>
                  <TabsTrigger value="compliance">{language === 'ar' ? 'الالتزام' : 'Compliance'}</TabsTrigger>
                  <TabsTrigger value="pricing">{language === 'ar' ? 'الأسعار' : 'Pricing'}</TabsTrigger>
                </TabsList>

                {faqs.map((category) => (
                  <TabsContent key={category.category} value={category.category} className="space-y-4">
                    {category.questions.map((q) => (
                      <Card key={q} className="overflow-hidden">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                          onClick={() => toggleFaq(`${category.category}-${q}`)}
                        >
                          <span className="font-medium">{t(`store.faq.${category.category}.${q}.q`)}</span>
                          {expandedFaq === `${category.category}-${q}` ? (
                            <ChevronUp className="w-5 h-5 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 shrink-0" />
                          )}
                        </button>
                        {expandedFaq === `${category.category}-${q}` && (
                          <div className="px-4 pb-4 text-muted-foreground">
                            {t(`store.faq.${category.category}.${q}.a`)}
                          </div>
                        )}
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-500/10 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'جاهز لبدء مشروعك الأمريكي؟' : 'Ready to Launch Your US Business?'}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'انضم إلى مئات رواد الأعمال العرب الذين أسسوا شركاتهم في وايومنغ معنا.'
                : 'Join hundreds of Arab entrepreneurs who launched their Wyoming LLC with us.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="text-lg px-8 h-14 bg-gradient-to-r from-emerald-500 to-teal-600" onClick={() => navigate('/order-intake')}>
                {language === 'ar' ? 'ابدأ التأسيس الآن' : 'Start Formation Now'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'ar' ? 'تحدث مع مستشار' : 'Talk to an Advisor'}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Portal CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('store.portal.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t('store.portal.subtitle')}</p>
            <Button asChild size="lg" variant="outline">
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
