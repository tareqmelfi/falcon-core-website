import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Check, Clock, Code, ArrowRight, ArrowLeft, Star,
  Laptop, Palette, Globe, Shield, Zap, Headphones,
  Mail, User, Building, Phone, FileText, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WebsitePackage = () => {
  const { language, dir } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    currentWebsite: '',
    requirements: '',
  });

  const features = [
    {
      icon: Palette,
      title: language === 'ar' ? 'تصميم مخصص' : 'Custom Design',
      desc: language === 'ar' ? 'تصميم فريد يعكس هوية علامتك التجارية' : 'Unique design reflecting your brand identity',
    },
    {
      icon: Laptop,
      title: language === 'ar' ? 'متجاوب بالكامل' : 'Fully Responsive',
      desc: language === 'ar' ? 'يعمل بشكل مثالي على جميع الأجهزة' : 'Works perfectly on all devices',
    },
    {
      icon: Globe,
      title: language === 'ar' ? 'نطاق + استضافة' : 'Domain + Hosting',
      desc: language === 'ar' ? 'السنة الأولى مجاناً' : 'First year included free',
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'شهادة SSL' : 'SSL Certificate',
      desc: language === 'ar' ? 'أمان وتشفير كامل' : 'Full security and encryption',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'سرعة عالية' : 'Fast Performance',
      desc: language === 'ar' ? 'تحسين للسرعة والأداء' : 'Optimized for speed',
    },
    {
      icon: Headphones,
      title: language === 'ar' ? 'جلسة تدريب' : 'Training Session',
      desc: language === 'ar' ? '30 دقيقة لإدارة الموقع' : '30 min site management training',
    },
  ];

  const included = [
    language === 'ar' ? 'حتى 7 صفحات' : 'Up to 7 pages',
    language === 'ar' ? 'تصميم قالب متميز' : 'Premium template customization',
    language === 'ar' ? 'نموذج اتصال' : 'Contact form',
    language === 'ar' ? 'تكامل وسائل التواصل' : 'Social media integration',
    language === 'ar' ? 'تحسين محركات البحث الأساسي' : 'Basic SEO optimization',
    language === 'ar' ? 'إحصائيات Google Analytics' : 'Google Analytics setup',
    language === 'ar' ? 'خريطة الموقع' : 'Sitemap & robots.txt',
    language === 'ar' ? 'ضمان الجودة' : 'Quality assurance testing',
  ];

  const process = [
    {
      step: 1,
      title: language === 'ar' ? 'البدء' : 'Kickoff',
      desc: language === 'ar' ? 'مكالمة تعريفية وجمع المتطلبات' : 'Discovery call and requirements gathering',
      duration: language === 'ar' ? 'يوم 1-2' : 'Day 1-2',
    },
    {
      step: 2,
      title: language === 'ar' ? 'التصميم' : 'Design',
      desc: language === 'ar' ? 'تصميم الواجهة والمراجعة' : 'UI design and review',
      duration: language === 'ar' ? 'يوم 3-5' : 'Day 3-5',
    },
    {
      step: 3,
      title: language === 'ar' ? 'التطوير' : 'Development',
      desc: language === 'ar' ? 'بناء الموقع بالكامل' : 'Full site build',
      duration: language === 'ar' ? 'يوم 6-10' : 'Day 6-10',
    },
    {
      step: 4,
      title: language === 'ar' ? 'المحتوى' : 'Content',
      desc: language === 'ar' ? 'إضافة النصوص والصور' : 'Adding text and images',
      duration: language === 'ar' ? 'يوم 11-12' : 'Day 11-12',
    },
    {
      step: 5,
      title: language === 'ar' ? 'الإطلاق' : 'Launch',
      desc: language === 'ar' ? 'المراجعة النهائية والإطلاق' : 'Final review and go-live',
      duration: language === 'ar' ? 'يوم 13-14' : 'Day 13-14',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to your backend
    // Then redirect to Stripe payment
    window.location.href = 'https://buy.stripe.com/14A3cwfuq3Qx19Cgslf3a02';
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/10" />
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/store" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Product Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Badge variant="outline" className="mb-4 border-purple-500/50 text-purple-500">
                  <Code className="w-3 h-3 mr-1" />
                  FC-WEB-001
                </Badge>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'ar' ? 'باقة موقع إلكتروني جاهز' : 'Ready-Made Website Package'}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {language === 'ar'
                    ? 'موقع إلكتروني احترافي جاهز خلال 14 يوماً. تصميم عصري، سريع، وآمن لعملك.'
                    : 'Professional website ready in 14 days. Modern design, fast, and secure for your business.'}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$3,500</span>
                  <span className="text-muted-foreground">USD</span>
                  <Badge variant="secondary" className="ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    14 {language === 'ar' ? 'يوم' : 'days'}
                  </Badge>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <feature.icon className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* What's Included */}
                <Card className="p-4 mb-6">
                  <h3 className="font-semibold mb-4">
                    {language === 'ar' ? 'ما يتضمنه' : "What's Included"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {included.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Process Timeline */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">
                    {language === 'ar' ? 'مراحل المشروع' : 'Project Timeline'}
                  </h3>
                  <div className="space-y-3">
                    {process.map((phase, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-sm font-bold text-purple-500">
                          {phase.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm">{phase.title}</h4>
                            <span className="text-xs text-muted-foreground">{phase.duration}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{phase.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Right: Order Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>
                      {showForm
                        ? (language === 'ar' ? 'تفاصيل الطلب' : 'Order Details')
                        : (language === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project')}
                    </CardTitle>
                    <CardDescription>
                      {showForm
                        ? (language === 'ar' ? 'أخبرنا عن متطلباتك' : 'Tell us about your requirements')
                        : (language === 'ar' ? 'احصل على موقعك الاحترافي' : 'Get your professional website')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showForm ? (
                      <div className="space-y-4">
                        {/* Summary Card */}
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium">{language === 'ar' ? 'باقة الموقع' : 'Website Package'}</span>
                            <span className="font-bold">$3,500</span>
                          </div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              {language === 'ar' ? 'تصميم مخصص' : 'Custom design'}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              {language === 'ar' ? 'حتى 7 صفحات' : 'Up to 7 pages'}
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              {language === 'ar' ? 'نطاق + استضافة (سنة)' : 'Domain + Hosting (1 year)'}
                            </li>
                            <li className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              {language === 'ar' ? 'جاهز خلال 14 يوم' : 'Ready in 14 days'}
                            </li>
                          </ul>
                        </div>

                        <Button onClick={() => setShowForm(true)} className="w-full bg-gradient-to-r from-purple-500 to-pink-600">
                          {language === 'ar' ? 'اطلب الآن' : 'Order Now'}
                          <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          {language === 'ar'
                            ? 'دفع 50% مقدماً، 50% عند الإطلاق'
                            : '50% upfront, 50% on launch'}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              <User className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'الاسم' : 'Name'} *
                            </Label>
                            <Input
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              <Mail className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'البريد' : 'Email'} *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'الهاتف' : 'Phone'}
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">
                              <Building className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'الشركة' : 'Company'}
                            </Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">
                            {language === 'ar' ? 'نوع النشاط' : 'Business Type'} *
                          </Label>
                          <select
                            id="businessType"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.businessType}
                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          >
                            <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                            <option value="ecommerce">{language === 'ar' ? 'تجارة إلكترونية' : 'E-commerce'}</option>
                            <option value="services">{language === 'ar' ? 'خدمات' : 'Services'}</option>
                            <option value="portfolio">{language === 'ar' ? 'معرض أعمال' : 'Portfolio'}</option>
                            <option value="corporate">{language === 'ar' ? 'شركات' : 'Corporate'}</option>
                            <option value="other">{language === 'ar' ? 'أخرى' : 'Other'}</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentWebsite">
                            {language === 'ar' ? 'الموقع الحالي (إن وجد)' : 'Current Website (if any)'}
                          </Label>
                          <Input
                            id="currentWebsite"
                            placeholder="https://..."
                            value={formData.currentWebsite}
                            onChange={(e) => setFormData({ ...formData, currentWebsite: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="requirements">
                            {language === 'ar' ? 'متطلبات إضافية' : 'Additional Requirements'}
                          </Label>
                          <Textarea
                            id="requirements"
                            rows={3}
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder={language === 'ar'
                              ? 'أخبرنا عن رؤيتك للموقع...'
                              : 'Tell us about your vision for the website...'}
                          />
                        </div>

                        {/* Contract Agreement */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="terms" className="mt-1" required />
                            <label htmlFor="terms" className="text-xs">
                              {language === 'ar'
                                ? 'أوافق على شروط الخدمة. سيتم إرسال العقد الإلكتروني للتوقيع قبل البدء.'
                                : 'I agree to the Terms of Service. Electronic contract will be sent for signature before starting.'}
                            </label>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">{language === 'ar' ? 'الدفعة الأولى (50%)' : 'First Payment (50%)'}</span>
                            <span className="font-bold">$1,750</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            {language === 'ar'
                              ? 'الدفعة الثانية ($1,750) عند إطلاق الموقع'
                              : 'Second payment ($1,750) due on launch'}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                            <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
                            {language === 'ar' ? 'رجوع' : 'Back'}
                          </Button>
                          <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600">
                            <Shield className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'ادفع $1,750' : 'Pay $1,750'}
                          </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" />
                          {language === 'ar' ? 'دفع آمن عبر Stripe' : 'Secure payment via Stripe'}
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'هل يمكنني إضافة صفحات إضافية؟' : 'Can I add more pages?'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'نعم! كل صفحة إضافية بـ $150. يمكنك الإضافة في أي وقت.'
                    : 'Yes! Each additional page is $150. You can add pages anytime.'}
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'ماذا عن التعديلات؟' : 'What about revisions?'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'تتضمن الباقة جولتين من التعديلات. تعديلات إضافية متاحة بسعر الساعة.'
                    : 'Package includes 2 revision rounds. Additional revisions available at hourly rate.'}
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'هل يمكنني إدارة الموقع بنفسي؟' : 'Can I manage the site myself?'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar'
                    ? 'بالتأكيد! نستخدم نظام سهل الاستخدام ونقدم تدريباً مجانياً.'
                    : 'Absolutely! We use an easy-to-use CMS and provide free training.'}
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default WebsitePackage;
