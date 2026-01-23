import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Tag, Share2, Bookmark, ChevronDown, ChevronUp, Building2, DollarSign, Shield, Globe, FileText, CheckCircle2, AlertCircle, MapPin, Scale, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useArticleMetaTags } from '@/hooks/useMetaTags';

const WyomingBusinessGuide = () => {
  const { language, dir } = useLanguage();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  const isArabic = language === 'ar';

  // Meta tags
  useArticleMetaTags({
    title: isArabic
      ? 'الدليل الشامل لتأسيس شركة في وايومنغ 2025'
      : 'Complete Guide to Wyoming LLC Formation 2025',
    excerpt: isArabic
      ? 'كل ما تحتاج معرفته عن تأسيس شركة في ولاية وايومنغ الأمريكية - الضرائب، الخصوصية، التكاليف، والمتطلبات'
      : 'Everything you need to know about forming a company in Wyoming - taxes, privacy, costs, and requirements',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
    slug: 'wyoming-business-guide-2025',
    date: '2025-01-20',
    author: 'Falcon Core',
    category: 'Business Formation',
    tags: ['Wyoming', 'LLC', 'Business Formation', 'USA', 'Tax Planning'],
  });

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tableOfContents = isArabic ? [
    { id: 'intro', title: 'مقدمة' },
    { id: 'why-wyoming', title: 'لماذا وايومنغ؟' },
    { id: 'entity-types', title: 'أنواع الكيانات' },
    { id: 'taxes', title: 'النظام الضريبي' },
    { id: 'privacy', title: 'الخصوصية والحماية' },
    { id: 'formation-process', title: 'خطوات التأسيس' },
    { id: 'costs', title: 'التكاليف والرسوم' },
    { id: 'banking', title: 'فتح الحساب البنكي' },
    { id: 'compliance', title: 'الامتثال السنوي' },
    { id: 'faq', title: 'الأسئلة الشائعة' },
  ] : [
    { id: 'intro', title: 'Introduction' },
    { id: 'why-wyoming', title: 'Why Wyoming?' },
    { id: 'entity-types', title: 'Entity Types' },
    { id: 'taxes', title: 'Tax System' },
    { id: 'privacy', title: 'Privacy & Protection' },
    { id: 'formation-process', title: 'Formation Process' },
    { id: 'costs', title: 'Costs & Fees' },
    { id: 'banking', title: 'Banking Setup' },
    { id: 'compliance', title: 'Annual Compliance' },
    { id: 'faq', title: 'FAQ' },
  ];

  return (
    <Layout>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isArabic ? 'العودة للمقالات' : 'Back to Articles'}
            </Link>

            <Badge className="mb-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
              <MapPin className="w-3 h-3 mr-1" />
              {isArabic ? 'دليل شامل' : 'Comprehensive Guide'}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {isArabic
                ? 'الدليل الشامل لتأسيس شركة في وايومنغ 2025'
                : 'Complete Guide to Wyoming LLC Formation 2025'}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {isArabic
                ? 'كل ما تحتاج معرفته عن تأسيس شركة في ولاية وايومنغ الأمريكية - من الضرائب والخصوصية إلى التكاليف والمتطلبات القانونية'
                : 'Everything you need to know about forming a company in Wyoming, USA - from taxes and privacy to costs and legal requirements'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{isArabic ? 'يناير 2025' : 'January 2025'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{isArabic ? '25 دقيقة للقراءة' : '25 min read'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Falcon Core</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {isArabic ? 'محتويات المقالة' : 'Table of Contents'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <nav className="space-y-1">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block py-2 px-3 text-sm rounded-md transition-colors ${
                            activeSection === item.id
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>

                    <div className="mt-6 pt-6 border-t">
                      <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
                        <Link to="/store/wyoming-llc">
                          {isArabic ? 'ابدأ التأسيس الآن' : 'Start Formation Now'}
                          {isArabic ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Article Content */}
            <article className={`lg:col-span-3 prose prose-lg dark:prose-invert max-w-none ${isArabic ? 'prose-ar' : ''}`} dir={dir}>

              {/* Introduction */}
              <section id="intro" className="scroll-mt-24">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                  <Globe className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'مقدمة' : 'Introduction'}
                </h2>

                {isArabic ? (
                  <div className="space-y-4">
                    <p>
                      تُعد ولاية وايومنغ واحدة من أكثر الولايات جاذبية لرواد الأعمال والمستثمرين حول العالم لتأسيس شركاتهم.
                      بفضل قوانينها المرنة والداعمة للأعمال، وغياب ضريبة الدخل على الشركات والأفراد، أصبحت الخيار الأول للكثيرين.
                    </p>
                    <p>
                      هذا الدليل يقدم لك كل ما تحتاج معرفته لتأسيس شركتك في وايومنغ، سواء كنت رائد أعمال سعودي،
                      أو مستثمر من أي دولة أخرى تبحث عن بيئة أعمال آمنة ومستقرة.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Wyoming has become one of the most attractive states for entrepreneurs and investors
                      worldwide to establish their companies. With its flexible business-friendly laws and
                      absence of corporate and personal income tax, it has become the first choice for many.
                    </p>
                    <p>
                      This guide provides everything you need to know to establish your company in Wyoming,
                      whether you're a Saudi entrepreneur or an investor from any other country looking for
                      a safe and stable business environment.
                    </p>
                  </div>
                )}
              </section>

              {/* Why Wyoming */}
              <section id="why-wyoming" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'لماذا وايومنغ؟' : 'Why Wyoming?'}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 not-prose mb-6">
                  {[
                    {
                      icon: DollarSign,
                      titleEn: 'Zero State Income Tax',
                      titleAr: 'صفر ضريبة دخل',
                      descEn: 'No corporate or personal income tax at the state level',
                      descAr: 'لا ضريبة دخل على الشركات أو الأفراد على مستوى الولاية',
                    },
                    {
                      icon: Shield,
                      titleEn: 'Asset Protection',
                      titleAr: 'حماية الأصول',
                      descEn: 'Strongest charging order protection in the USA',
                      descAr: 'أقوى حماية لأوامر الشحن في الولايات المتحدة',
                    },
                    {
                      icon: FileText,
                      titleEn: 'Privacy Protection',
                      titleAr: 'حماية الخصوصية',
                      descEn: 'No public disclosure of member/owner information',
                      descAr: 'لا يُشترط الإفصاح عن معلومات الأعضاء/المالكين',
                    },
                    {
                      icon: Scale,
                      titleEn: 'Business-Friendly Laws',
                      titleAr: 'قوانين صديقة للأعمال',
                      descEn: 'Flexible LLC statutes and minimal regulations',
                      descAr: 'قوانين مرنة وتنظيمات بسيطة',
                    },
                  ].map((benefit, index) => (
                    <Card key={index} className="bg-emerald-500/5 border-emerald-500/20">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <benefit.icon className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            {isArabic ? benefit.titleAr : benefit.titleEn}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {isArabic ? benefit.descAr : benefit.descEn}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {isArabic ? (
                  <p>
                    وايومنغ كانت أول ولاية في أمريكا تُنشئ نظام الشركات ذات المسؤولية المحدودة (LLC) عام 1977،
                    ومنذ ذلك الحين طورت إطاراً قانونياً متقدماً يحمي أصحاب الأعمال ويوفر لهم المرونة في إدارة شركاتهم.
                  </p>
                ) : (
                  <p>
                    Wyoming was the first state in America to create the LLC structure in 1977, and since then
                    has developed an advanced legal framework that protects business owners and provides them
                    with flexibility in managing their companies.
                  </p>
                )}
              </section>

              {/* Entity Types */}
              <section id="entity-types" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'أنواع الكيانات التجارية' : 'Business Entity Types'}
                </h2>

                <div className="not-prose">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-3 text-start border">{isArabic ? 'نوع الكيان' : 'Entity Type'}</th>
                          <th className="p-3 text-start border">{isArabic ? 'المميزات' : 'Advantages'}</th>
                          <th className="p-3 text-start border">{isArabic ? 'الأفضل لـ' : 'Best For'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 border font-medium">LLC</td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'مرونة ضريبية، حماية المسؤولية، إدارة بسيطة'
                              : 'Tax flexibility, liability protection, simple management'}
                          </td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'معظم الأعمال الصغيرة والمتوسطة'
                              : 'Most small to medium businesses'}
                          </td>
                        </tr>
                        <tr className="bg-muted/30">
                          <td className="p-3 border font-medium">C-Corporation</td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'جذب المستثمرين، أسهم قابلة للتداول'
                              : 'Attract investors, tradeable shares'}
                          </td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'الشركات الناشئة التي تسعى للتمويل'
                              : 'Startups seeking funding'}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 border font-medium">S-Corporation</td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'تجنب الازدواج الضريبي'
                              : 'Avoid double taxation'}
                          </td>
                          <td className="p-3 border text-sm">
                            {isArabic
                              ? 'مواطنو ومقيمو أمريكا فقط'
                              : 'US citizens/residents only'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg not-prose">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-500 mb-1">
                        {isArabic ? 'توصيتنا' : 'Our Recommendation'}
                      </h4>
                      <p className="text-sm">
                        {isArabic
                          ? 'لمعظم رواد الأعمال غير المقيمين في أمريكا، نوصي بتأسيس LLC في وايومنغ لأنها توفر أفضل توازن بين الحماية والمرونة والتكلفة.'
                          : 'For most non-US resident entrepreneurs, we recommend forming a Wyoming LLC as it provides the best balance of protection, flexibility, and cost.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tax System */}
              <section id="taxes" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'النظام الضريبي' : 'Tax System'}
                </h2>

                {isArabic ? (
                  <div className="space-y-4">
                    <p>
                      تتميز وايومنغ بنظام ضريبي فريد يجعلها من أكثر الولايات جاذبية للأعمال:
                    </p>
                    <ul className="list-disc pr-6 space-y-2">
                      <li><strong>صفر ضريبة دخل:</strong> لا توجد ضريبة دخل على الشركات أو الأفراد على مستوى الولاية</li>
                      <li><strong>لا ضريبة امتياز:</strong> لا توجد رسوم امتياز سنوية على الشركات</li>
                      <li><strong>لا ضريبة مبيعات:</strong> على الخدمات الرقمية والاستشارات</li>
                      <li><strong>ضرائب فيدرالية:</strong> تخضع للضرائب الفيدرالية الأمريكية حسب النشاط</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Wyoming features a unique tax system that makes it one of the most attractive states for business:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Zero Income Tax:</strong> No corporate or personal income tax at the state level</li>
                      <li><strong>No Franchise Tax:</strong> No annual franchise fees on companies</li>
                      <li><strong>No Sales Tax:</strong> On digital services and consulting</li>
                      <li><strong>Federal Taxes:</strong> Subject to US federal taxes based on activity</li>
                    </ul>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg not-prose">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-500 mb-1">
                        {isArabic ? 'للمقيمين خارج أمريكا' : 'For Non-US Residents'}
                      </h4>
                      <p className="text-sm">
                        {isArabic
                          ? 'إذا كان عملك لا يحقق دخلاً مرتبطاً فعلياً بالولايات المتحدة (ECI)، فقد لا تكون ملزماً بدفع ضرائب فيدرالية أمريكية. استشر محاسباً متخصصاً في الضرائب الدولية.'
                          : 'If your business does not generate Effectively Connected Income (ECI) in the US, you may not be required to pay US federal taxes. Consult a tax professional specializing in international taxation.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Privacy & Protection */}
              <section id="privacy" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'الخصوصية والحماية' : 'Privacy & Protection'}
                </h2>

                {isArabic ? (
                  <div className="space-y-4">
                    <p>
                      توفر وايومنغ مستوى عالٍ من الخصوصية لأصحاب الشركات:
                    </p>
                    <ul className="list-disc pr-6 space-y-2">
                      <li><strong>عدم الإفصاح العام:</strong> لا يُشترط الكشف عن أسماء الأعضاء أو المديرين في السجلات العامة</li>
                      <li><strong>وكيل مسجل:</strong> يمكن استخدام وكيل مسجل لحماية عنوانك الشخصي</li>
                      <li><strong>حماية الأصول:</strong> قوانين صارمة تحمي أصول الشركة من المطالبات الشخصية</li>
                      <li><strong>أوامر الشحن:</strong> أقوى حماية في أمريكا ضد دائني الأعضاء الأفراد</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Wyoming provides a high level of privacy for company owners:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>No Public Disclosure:</strong> Member or manager names are not required in public records</li>
                      <li><strong>Registered Agent:</strong> A registered agent can be used to protect your personal address</li>
                      <li><strong>Asset Protection:</strong> Strong laws protect company assets from personal claims</li>
                      <li><strong>Charging Order:</strong> Strongest protection in America against individual member creditors</li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Formation Process */}
              <section id="formation-process" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <FileText className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'خطوات التأسيس' : 'Formation Process'}
                </h2>

                <div className="not-prose space-y-4">
                  {[
                    {
                      step: 1,
                      titleEn: 'Choose Company Name',
                      titleAr: 'اختيار اسم الشركة',
                      descEn: 'Verify name availability with Wyoming Secretary of State. Must include "LLC" designation.',
                      descAr: 'التحقق من توفر الاسم لدى وزير خارجية وايومنغ. يجب أن يتضمن "LLC".',
                    },
                    {
                      step: 2,
                      titleEn: 'Appoint Registered Agent',
                      titleAr: 'تعيين وكيل مسجل',
                      descEn: 'Required Wyoming address for legal correspondence. We provide this service.',
                      descAr: 'عنوان وايومنغ مطلوب للمراسلات القانونية. نوفر هذه الخدمة.',
                    },
                    {
                      step: 3,
                      titleEn: 'File Articles of Organization',
                      titleAr: 'تقديم عقد التأسيس',
                      descEn: 'Submit formation documents to Wyoming Secretary of State. $100 state fee.',
                      descAr: 'تقديم وثائق التأسيس لوزير خارجية وايومنغ. رسوم الولاية $100.',
                    },
                    {
                      step: 4,
                      titleEn: 'Create Operating Agreement',
                      titleAr: 'إنشاء اتفاقية التشغيل',
                      descEn: 'Internal document defining ownership, management, and profit distribution.',
                      descAr: 'وثيقة داخلية تحدد الملكية والإدارة وتوزيع الأرباح.',
                    },
                    {
                      step: 5,
                      titleEn: 'Obtain EIN',
                      titleAr: 'الحصول على رقم EIN',
                      descEn: 'Federal Tax ID from IRS. Required for banking and tax filing.',
                      descAr: 'رقم ضريبي فيدرالي من مصلحة الضرائب. مطلوب للبنوك والضرائب.',
                    },
                    {
                      step: 6,
                      titleEn: 'Open Bank Account',
                      titleAr: 'فتح حساب بنكي',
                      descEn: 'US business bank account for operations. We assist with introduction.',
                      descAr: 'حساب بنكي تجاري أمريكي للعمليات. نساعد في التقديم.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">
                          {isArabic ? item.titleAr : item.titleEn}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? item.descAr : item.descEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Costs */}
              <section id="costs" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'التكاليف والرسوم' : 'Costs & Fees'}
                </h2>

                <div className="not-prose">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-3 text-start border">{isArabic ? 'البند' : 'Item'}</th>
                          <th className="p-3 text-start border">{isArabic ? 'التكلفة' : 'Cost'}</th>
                          <th className="p-3 text-start border">{isArabic ? 'ملاحظات' : 'Notes'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 border">{isArabic ? 'رسوم التأسيس (الولاية)' : 'State Filing Fee'}</td>
                          <td className="p-3 border font-medium">$100</td>
                          <td className="p-3 border text-sm text-muted-foreground">{isArabic ? 'مرة واحدة' : 'One-time'}</td>
                        </tr>
                        <tr className="bg-muted/30">
                          <td className="p-3 border">{isArabic ? 'الوكيل المسجل' : 'Registered Agent'}</td>
                          <td className="p-3 border font-medium">$50-150/year</td>
                          <td className="p-3 border text-sm text-muted-foreground">{isArabic ? 'سنوياً' : 'Annual'}</td>
                        </tr>
                        <tr>
                          <td className="p-3 border">{isArabic ? 'التقرير السنوي' : 'Annual Report'}</td>
                          <td className="p-3 border font-medium">$60</td>
                          <td className="p-3 border text-sm text-muted-foreground">{isArabic ? 'سنوياً' : 'Annual'}</td>
                        </tr>
                        <tr className="bg-muted/30">
                          <td className="p-3 border">{isArabic ? 'رقم EIN' : 'EIN Number'}</td>
                          <td className="p-3 border font-medium">{isArabic ? 'مجاني' : 'Free'}</td>
                          <td className="p-3 border text-sm text-muted-foreground">{isArabic ? 'من IRS' : 'From IRS'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Banking */}
              <section id="banking" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'فتح الحساب البنكي' : 'Banking Setup'}
                </h2>

                {isArabic ? (
                  <div className="space-y-4">
                    <p>
                      فتح حساب بنكي أمريكي لشركة LLC يمكن أن يكون تحدياً للمقيمين خارج أمريكا، لكن هناك عدة خيارات:
                    </p>
                    <h4 className="font-semibold mt-6">البنوك التقليدية:</h4>
                    <ul className="list-disc pr-6 space-y-2">
                      <li><strong>Mercury:</strong> بنك رقمي صديق للشركات الناشئة، يقبل المقيمين خارج أمريكا</li>
                      <li><strong>Relay:</strong> خيار آخر للأعمال الصغيرة</li>
                      <li><strong>Wise Business:</strong> حساب متعدد العملات مع IBAN أمريكي</li>
                    </ul>
                    <h4 className="font-semibold mt-6">المتطلبات:</h4>
                    <ul className="list-disc pr-6 space-y-2">
                      <li>عقد التأسيس (Articles of Organization)</li>
                      <li>اتفاقية التشغيل (Operating Agreement)</li>
                      <li>رقم EIN</li>
                      <li>جواز السفر للأعضاء</li>
                      <li>إثبات العنوان</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>
                      Opening a US bank account for an LLC can be challenging for non-US residents, but there are several options:
                    </p>
                    <h4 className="font-semibold mt-6">Traditional Banks:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Mercury:</strong> Digital bank friendly to startups, accepts non-US residents</li>
                      <li><strong>Relay:</strong> Another option for small businesses</li>
                      <li><strong>Wise Business:</strong> Multi-currency account with US IBAN</li>
                    </ul>
                    <h4 className="font-semibold mt-6">Requirements:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Articles of Organization</li>
                      <li>Operating Agreement</li>
                      <li>EIN Number</li>
                      <li>Passport for all members</li>
                      <li>Proof of address</li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Compliance */}
              <section id="compliance" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'الامتثال السنوي' : 'Annual Compliance'}
                </h2>

                {isArabic ? (
                  <div className="space-y-4">
                    <p>للحفاظ على شركتك في وضع جيد، يجب الالتزام بالمتطلبات التالية:</p>
                    <ul className="list-disc pr-6 space-y-2">
                      <li><strong>التقرير السنوي:</strong> يجب تقديمه في الذكرى السنوية للتأسيس. رسوم $60</li>
                      <li><strong>تقرير BOI:</strong> تقرير معلومات الملكية المفيدة لـ FinCEN (متطلب فيدرالي جديد)</li>
                      <li><strong>الضرائب الفيدرالية:</strong> حسب نوع النشاط وحجم الدخل</li>
                      <li><strong>تجديد الوكيل المسجل:</strong> سنوياً</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p>To keep your company in good standing, you must comply with the following requirements:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Annual Report:</strong> Must be filed on the anniversary of formation. $60 fee</li>
                      <li><strong>BOI Report:</strong> Beneficial Ownership Information report to FinCEN (new federal requirement)</li>
                      <li><strong>Federal Taxes:</strong> Depending on activity type and income level</li>
                      <li><strong>Registered Agent Renewal:</strong> Annually</li>
                    </ul>
                  </div>
                )}
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-24 mt-12">
                <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
                  <AlertCircle className="w-6 h-6 text-emerald-500" />
                  {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                </h2>

                <Accordion type="single" collapsible className="not-prose">
                  {[
                    {
                      qEn: 'Can non-US residents form a Wyoming LLC?',
                      qAr: 'هل يمكن لغير المقيمين في أمريكا تأسيس شركة LLC في وايومنغ؟',
                      aEn: 'Yes! Wyoming does not require US citizenship or residency to form an LLC. Anyone from any country can be a member or manager of a Wyoming LLC.',
                      aAr: 'نعم! لا تشترط وايومنغ الجنسية الأمريكية أو الإقامة لتأسيس LLC. يمكن لأي شخص من أي دولة أن يكون عضواً أو مديراً في LLC وايومنغ.',
                    },
                    {
                      qEn: 'Do I need to visit Wyoming to form my LLC?',
                      qAr: 'هل أحتاج لزيارة وايومنغ لتأسيس شركتي؟',
                      aEn: 'No. The entire formation process can be done remotely. You do not need to visit Wyoming or the United States.',
                      aAr: 'لا. يمكن إتمام عملية التأسيس بالكامل عن بُعد. لا تحتاج لزيارة وايومنغ أو الولايات المتحدة.',
                    },
                    {
                      qEn: 'How long does formation take?',
                      qAr: 'كم يستغرق التأسيس؟',
                      aEn: 'Standard processing is 10-15 business days. Expedited processing (1-3 days) is available for an additional fee.',
                      aAr: 'المعالجة القياسية 10-15 يوم عمل. المعالجة السريعة (1-3 أيام) متاحة برسوم إضافية.',
                    },
                    {
                      qEn: 'What is a Registered Agent?',
                      qAr: 'ما هو الوكيل المسجل؟',
                      aEn: 'A registered agent is a person or company with a physical Wyoming address who receives legal documents and official correspondence on behalf of your LLC.',
                      aAr: 'الوكيل المسجل هو شخص أو شركة لها عنوان فعلي في وايومنغ تستلم الوثائق القانونية والمراسلات الرسمية نيابة عن شركتك.',
                    },
                    {
                      qEn: 'Will I pay US taxes on income earned outside the US?',
                      qAr: 'هل سأدفع ضرائب أمريكية على الدخل المكتسب خارج أمريكا؟',
                      aEn: 'Generally, if you are not a US person and your LLC does not conduct business within the US (no ECI), you may not owe US federal income tax. Consult a tax professional for your specific situation.',
                      aAr: 'بشكل عام، إذا لم تكن شخصاً أمريكياً ولم تمارس شركتك أعمالاً داخل أمريكا (لا يوجد ECI)، قد لا تكون مديناً بضريبة الدخل الفيدرالية الأمريكية. استشر متخصصاً ضريبياً لوضعك المحدد.',
                    },
                  ].map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-start">
                        {isArabic ? faq.qAr : faq.qEn}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {isArabic ? faq.aAr : faq.aEn}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* CTA */}
              <section className="mt-16 not-prose">
                <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      {isArabic ? 'جاهز لتأسيس شركتك؟' : 'Ready to Form Your Company?'}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                      {isArabic
                        ? 'دعنا نساعدك في تأسيس شركة Wyoming LLC الخاصة بك. نحن نتولى جميع الأوراق والإجراءات نيابة عنك.'
                        : 'Let us help you form your Wyoming LLC. We handle all the paperwork and procedures on your behalf.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                        <Link to="/store/wyoming-llc">
                          {isArabic ? 'ابدأ التأسيس الآن' : 'Start Formation Now'}
                          {isArabic ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link to="/contact">
                          {isArabic ? 'تواصل معنا' : 'Contact Us'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WyomingBusinessGuide;
