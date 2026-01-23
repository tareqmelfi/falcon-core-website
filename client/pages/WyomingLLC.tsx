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
  DollarSign, Calendar, AlertCircle, CheckCircle2, Award, X, BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Wyoming LLC Formation Packages
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

// Entity Types Comparison
const entityTypes = [
  {
    type: 'LLC',
    icon: Building2,
    bestFor: 'Most businesses (90%)',
    bestForAr: 'معظم الأعمال (90%)',
    description: 'Flexible structure with pass-through taxation and liability protection. Ideal for most entrepreneurs.',
    descriptionAr: 'هيكل مرن مع ضرائب عابرة وحماية المسؤولية. مثالي لمعظم رواد الأعمال.',
    recommended: true,
  },
  {
    type: 'S-Corp',
    icon: Briefcase,
    bestFor: 'Active businesses $100K+ profit',
    bestForAr: 'أعمال نشطة بأرباح +$100K',
    description: 'Tax advantages for owners who work in the business. Requires US tax filing.',
    descriptionAr: 'مزايا ضريبية للمالكين العاملين بالشركة. تتطلب إقرار ضريبي أمريكي.',
    recommended: false,
  },
  {
    type: 'C-Corp',
    icon: TrendingUp,
    bestFor: 'Venture-backed startups',
    bestForAr: 'الشركات الناشئة الممولة',
    description: 'Required for VC funding. Double taxation but unlimited growth potential.',
    descriptionAr: 'مطلوبة لتمويل رأس المال المخاطر. ضريبة مزدوجة لكن نمو غير محدود.',
    recommended: false,
  },
  {
    type: 'Nonprofit',
    icon: Users,
    bestFor: 'Charitable organizations',
    bestForAr: 'المنظمات الخيرية',
    description: 'Tax-exempt status for organizations serving public benefit.',
    descriptionAr: 'حالة معفاة من الضرائب للمنظمات الخيرية.',
    recommended: false,
  },
];

// FAQ Data
const faqData = {
  formation: [
    {
      q: 'How long does it take to form a Wyoming LLC?',
      qAr: 'كم يستغرق تأسيس شركة وايومنغ LLC؟',
      a: 'Processing time depends on your package: Basic (10-15 days), Standard (5-7 days), Premium (1-3 days). These are business days after we receive your complete information.',
      aAr: 'يعتمد وقت المعالجة على باقتك: الأساسية (10-15 يوم)، القياسية (5-7 أيام)، المميزة (1-3 أيام). هذه أيام عمل بعد استلام معلوماتك الكاملة.',
    },
    {
      q: 'Is this a one-time fee or recurring?',
      qAr: 'هل هذه رسوم لمرة واحدة أم متكررة؟',
      a: 'Our service fee is one-time. The only recurring costs are: Wyoming annual report ($60/year), Registered Agent renewal ($149/year if not included in your package).',
      aAr: 'رسوم خدمتنا لمرة واحدة. التكاليف المتكررة الوحيدة هي: التقرير السنوي لوايومنغ ($60/سنة)، تجديد الوكيل المسجل ($149/سنة إن لم يكن مشمولاً).',
    },
    {
      q: 'Do I need to visit the US to form an LLC?',
      qAr: 'هل أحتاج لزيارة أمريكا لتأسيس LLC؟',
      a: 'No! The entire process is handled remotely. You don\'t need to visit the US, and you don\'t need a US address or phone number (we can provide these).',
      aAr: 'لا! العملية بأكملها تتم عن بُعد. لا تحتاج لزيارة أمريكا، ولا تحتاج عنوان أو رقم هاتف أمريكي (يمكننا توفير هذه).',
    },
    {
      q: 'Can non-US citizens form a Wyoming LLC?',
      qAr: 'هل يمكن لغير المواطنين الأمريكيين تأسيس Wyoming LLC؟',
      a: 'Absolutely. There are no citizenship or residency requirements to form a Wyoming LLC. Our service is specifically designed for international entrepreneurs.',
      aAr: 'بالتأكيد. لا توجد متطلبات جنسية أو إقامة لتأسيس Wyoming LLC. خدمتنا مصممة خصيصاً لرواد الأعمال الدوليين.',
    },
  ],
  banking: [
    {
      q: 'Can I open a US bank account as a non-resident?',
      qAr: 'هل يمكنني فتح حساب بنكي أمريكي كغير مقيم؟',
      a: 'Yes! Many US banks accept non-resident LLC owners. Our Premium package includes hands-on assistance with bank applications.',
      aAr: 'نعم! العديد من البنوك الأمريكية تقبل مالكي LLC غير المقيمين. باقتنا المميزة تشمل مساعدة عملية في طلبات البنوك.',
    },
    {
      q: 'Do I need an EIN to open a bank account?',
      qAr: 'هل أحتاج EIN لفتح حساب بنكي؟',
      a: 'Yes, a Federal EIN (Employer Identification Number) is required for US business banking. It\'s included in Standard and Premium packages.',
      aAr: 'نعم، الرقم الضريبي الفيدرالي EIN مطلوب للخدمات المصرفية التجارية الأمريكية. مشمول في الباقات القياسية والمميزة.',
    },
    {
      q: 'How long does it take to get an EIN?',
      qAr: 'كم يستغرق الحصول على EIN؟',
      a: 'For non-US residents, the IRS processes EINs via fax, taking 4-6 weeks. We handle the entire application process for you.',
      aAr: 'لغير المقيمين الأمريكيين، تعالج IRS أرقام EIN عبر الفاكس، وتستغرق 4-6 أسابيع. نتولى عملية التقديم بالكامل.',
    },
  ],
  compliance: [
    {
      q: 'What are the ongoing compliance requirements?',
      qAr: 'ما هي متطلبات الالتزام المستمرة؟',
      a: 'Wyoming LLCs must file an Annual Report (due on the first day of the anniversary month). The filing fee is $60. We send reminders and can file for you.',
      aAr: 'يجب على شركات وايومنغ LLC تقديم تقرير سنوي (مستحق في اليوم الأول من شهر الذكرى السنوية). رسوم التقديم $60. نرسل تذكيرات ونقدمه نيابة عنك.',
    },
    {
      q: 'Will I need to pay US taxes?',
      qAr: 'هل سأحتاج لدفع ضرائب أمريكية؟',
      a: 'It depends on your activities. A foreign-owned LLC with no US income typically owes no US federal tax, but must file Form 5472. We recommend consulting a US tax professional.',
      aAr: 'يعتمد على أنشطتك. LLC المملوكة أجنبياً بدون دخل أمريكي عادة لا تدين بضريبة فيدرالية، لكن يجب تقديم Form 5472. ننصح باستشارة محترف ضرائب.',
    },
  ],
  pricing: [
    {
      q: 'Are there any hidden fees?',
      qAr: 'هل هناك رسوم خفية؟',
      a: 'No hidden fees. Our pricing is transparent: package fee + $100 state filing fee. Additional services are clearly priced as add-ons.',
      aAr: 'لا رسوم خفية. تسعيرنا شفاف: رسوم الباقة + $100 رسوم تسجيل الولاية. الخدمات الإضافية مسعرة بوضوح.',
    },
    {
      q: 'Can I upgrade my package later?',
      qAr: 'هل يمكنني ترقية باقتي لاحقاً؟',
      a: 'Yes! You can purchase add-on services anytime. Start with Basic and add EIN or Registered Agent later.',
      aAr: 'نعم! يمكنك شراء خدمات إضافية في أي وقت. ابدأ بالأساسية وأضف EIN أو الوكيل المسجل لاحقاً.',
    },
    {
      q: 'What is your refund policy?',
      qAr: 'ما هي سياسة الاسترداد؟',
      a: 'If we haven\'t filed with the state yet, you\'re eligible for a full refund minus a $50 processing fee. Once filed, state fees are non-refundable.',
      aAr: 'إذا لم نكن قد قدمنا للولاية بعد، تستحق استرداد كامل ناقص $50 رسوم معالجة. بعد التقديم، رسوم الولاية غير قابلة للاسترداد.',
    },
  ],
};

// Why Wyoming Benefits
const wyomingBenefits = [
  {
    icon: DollarSign,
    title: 'Zero State Income Tax',
    titleAr: 'صفر ضريبة دخل للولاية',
    description: 'Keep more of what you earn. Wyoming has no state corporate or personal income tax.',
    descriptionAr: 'احتفظ بالمزيد من أرباحك. وايومنغ ليس لديها ضريبة دخل على الشركات أو الأفراد.',
  },
  {
    icon: Lock,
    title: 'Strongest Privacy Laws',
    titleAr: 'أقوى قوانين الخصوصية',
    description: 'Member names aren\'t required in public filings. Your business stays private.',
    descriptionAr: 'أسماء الأعضاء غير مطلوبة في التسجيلات العامة. شركتك تبقى خاصة.',
  },
  {
    icon: Shield,
    title: 'Asset Protection',
    titleAr: 'حماية الأصول',
    description: 'Charging order protection is the only remedy for creditors against LLC interests.',
    descriptionAr: 'أمر الحجز هو العلاج الوحيد للدائنين ضد حصص LLC.',
  },
  {
    icon: Calendar,
    title: 'No Franchise Tax',
    titleAr: 'لا ضريبة امتياز',
    description: 'Unlike Delaware, Wyoming has no franchise tax. Save hundreds annually.',
    descriptionAr: 'على عكس ديلاوير، وايومنغ ليس لديها ضريبة امتياز. وفر المئات سنوياً.',
  },
  {
    icon: Award,
    title: 'Lifetime LLC',
    titleAr: 'LLC مدى الحياة',
    description: 'No need to renew your LLC annually. File once, own it for life.',
    descriptionAr: 'لا حاجة لتجديد شركتك سنوياً. سجل مرة واحدة، امتلكها للأبد.',
  },
];

const WyomingLLC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('formation');

  const getFeatureDisplay = (feature: any, language: string) => {
    if (feature.included === true) return { icon: Check, text: '', className: 'text-green-500' };
    if (feature.included === false) return { icon: X, text: '', className: 'text-gray-400' };

    const valueMap: Record<string, { en: string; ar: string }> = {
      'basic_template': { en: 'Basic Template', ar: 'قالب أساسي' },
      'customized': { en: 'Customized', ar: 'مخصص' },
      'customized_review': { en: 'Customized + Legal Review', ar: 'مخصص + مراجعة قانونية' },
      'add_149': { en: '+$149', ar: '+$149' },
      'included': { en: 'Included', ar: 'مشمول' },
      'included_1yr': { en: 'Included (1 Year)', ar: 'مشمول (سنة)' },
      'hands_on': { en: 'Hands-on Assistance', ar: 'مساعدة عملية' },
      '60_min': { en: '60-min Call', ar: 'مكالمة 60 دقيقة' },
      '30_min': { en: '30-min Call', ar: 'مكالمة 30 دقيقة' },
      '30_day_email': { en: '30-Day Email', ar: 'إيميل 30 يوم' },
      '90_day_whatsapp': { en: '90-Day WhatsApp', ar: 'واتساب 90 يوم' },
      '12_month_priority': { en: '12-Month Priority', ar: 'أولوية 12 شهر' },
      'lifetime': { en: 'Lifetime Access', ar: 'وصول مدى الحياة' },
    };

    const display = valueMap[feature.value] || { en: feature.value, ar: feature.value };
    return { icon: Check, text: language === 'ar' ? display.ar : display.en, className: 'text-green-500' };
  };

  const featureLabels: Record<string, { en: string; ar: string }> = {
    'articles': { en: 'Articles of Organization', ar: 'وثائق التأسيس' },
    'name_check': { en: 'Name Availability Check', ar: 'فحص توفر الاسم' },
    'digital_docs': { en: 'Digital Document Delivery', ar: 'تسليم المستندات رقمياً' },
    'operating_agreement': { en: 'Operating Agreement', ar: 'اتفاقية التشغيل' },
    'registered_agent': { en: 'Registered Agent', ar: 'الوكيل المسجل' },
    'ein': { en: 'Federal EIN', ar: 'الرقم الضريبي EIN' },
    'banking_guide': { en: 'US Banking Guide', ar: 'دليل البنوك الأمريكية' },
    'banking_assistance': { en: 'Bank Account Assistance', ar: 'مساعدة الحساب البنكي' },
    'virtual_address': { en: 'US Virtual Address', ar: 'عنوان أمريكي افتراضي' },
    'us_phone': { en: 'US Phone Number', ar: 'رقم هاتف أمريكي' },
    'strategy_call': { en: 'Strategy Consultation', ar: 'استشارة استراتيجية' },
    'tax_consultation': { en: 'Tax Consultation', ar: 'استشارة ضريبية' },
    'support': { en: 'Support', ar: 'الدعم' },
    'compliance_dashboard': { en: 'Compliance Dashboard', ar: 'لوحة الالتزام' },
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-500">
                <MapPin className="w-3 h-3 mr-1" />
                Wyoming LLC Formation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === 'ar' ? 'تأسيس شركة أمريكية في وايومنغ' : 'Form Your Wyoming LLC'}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {language === 'ar'
                  ? 'الولاية الأفضل لرواد الأعمال من الخليج والعالم العربي. صفر ضرائب، خصوصية قصوى، حماية أصول.'
                  : 'The best state for GCC and Arab entrepreneurs. Zero taxes, maximum privacy, asset protection.'}
              </p>

              {/* Learn More Link */}
              <Link
                to="/articles/wyoming-business-guide-2025"
                className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
              >
                <BookOpen className="w-4 h-4" />
                {language === 'ar' ? 'اقرأ الدليل الشامل لوايومنغ 2025' : 'Read the Complete Wyoming Guide 2025'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Why Wyoming */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'لماذا وايومنغ؟' : 'Why Wyoming?'}
            </h2>
            <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {wyomingBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                      <IconComponent className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {language === 'ar' ? benefit.titleAr : benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? benefit.descriptionAr : benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-2">
              {language === 'ar' ? 'اختر باقتك' : 'Choose Your Package'}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {language === 'ar' ? 'جميع الأسعار تشمل $100 رسوم تسجيل الولاية' : 'All prices include $100 state filing fee'}
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {formationPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                      </Badge>
                    </div>
                  )}
                  <Card className={`h-full flex flex-col ${pkg.color}`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <div className="flex items-baseline justify-center gap-1 mt-2">
                        <span className="text-4xl font-bold">${pkg.price}</span>
                        <span className="text-sm text-muted-foreground">+ $100</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-primary mt-2">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.processing} {language === 'ar' ? 'أيام عمل' : 'business days'}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => {
                          const display = getFeatureDisplay(feature, language);
                          const IconComponent = display.icon;
                          const label = featureLabels[feature.key];
                          return (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <IconComponent className={`w-4 h-4 shrink-0 ${display.className}`} />
                              <span className="flex-grow">{language === 'ar' ? label.ar : label.en}</span>
                              {display.text && (
                                <span className="text-xs text-muted-foreground">{display.text}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : ''}`}
                        onClick={() => navigate(`/order-intake?package=${pkg.id}`)}
                      >
                        {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Entity Type Comparison */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-2">
              {language === 'ar' ? 'أي نوع كيان يناسبك؟' : 'Which Entity Type is Right for You?'}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {language === 'ar' ? 'نوصي بـ LLC لـ 90% من عملائنا' : 'We recommend LLC for 90% of our clients'}
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {entityTypes.map((entity, index) => {
                const IconComponent = entity.icon;
                return (
                  <Card key={index} className={`${entity.recommended ? 'border-2 border-emerald-500' : ''}`}>
                    <CardHeader className="pb-2">
                      {entity.recommended && (
                        <Badge className="w-fit mb-2 bg-emerald-500">
                          {language === 'ar' ? 'موصى به' : 'Recommended'}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{entity.type}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-primary mb-2">
                        {language === 'ar' ? entity.bestForAr : entity.bestFor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? entity.descriptionAr : entity.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>

            <div className="max-w-3xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="formation">
                    {language === 'ar' ? 'التأسيس' : 'Formation'}
                  </TabsTrigger>
                  <TabsTrigger value="banking">
                    {language === 'ar' ? 'البنوك' : 'Banking'}
                  </TabsTrigger>
                  <TabsTrigger value="compliance">
                    {language === 'ar' ? 'الالتزام' : 'Compliance'}
                  </TabsTrigger>
                  <TabsTrigger value="pricing">
                    {language === 'ar' ? 'الأسعار' : 'Pricing'}
                  </TabsTrigger>
                </TabsList>

                {Object.entries(faqData).map(([key, questions]) => (
                  <TabsContent key={key} value={key}>
                    <div className="space-y-3">
                      {questions.map((faq, index) => (
                        <Card key={index} className="overflow-hidden">
                          <button
                            className="w-full p-4 text-left flex items-center justify-between"
                            onClick={() => setExpandedFaq(expandedFaq === `${key}-${index}` ? null : `${key}-${index}`)}
                          >
                            <span className="font-medium text-sm">
                              {language === 'ar' ? faq.qAr : faq.q}
                            </span>
                            {expandedFaq === `${key}-${index}` ? (
                              <ChevronUp className="w-4 h-4 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 shrink-0" />
                            )}
                          </button>
                          {expandedFaq === `${key}-${index}` && (
                            <div className="px-4 pb-4 text-sm text-muted-foreground">
                              {language === 'ar' ? faq.aAr : faq.a}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ar' ? 'جاهز لتأسيس شركتك؟' : 'Ready to Start Your Business?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {language === 'ar'
                ? 'ابدأ الآن وستكون شركتك جاهزة خلال أيام. فريقنا متخصص في خدمة رواد الأعمال من الخليج والعالم العربي.'
                : 'Start now and your company will be ready in days. Our team specializes in serving GCC and Arab entrepreneurs.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/order-intake?package=standard')}>
                {language === 'ar' ? 'ابدأ التأسيس' : 'Start Formation'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default WyomingLLC;
