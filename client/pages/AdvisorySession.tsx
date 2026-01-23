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
  Check, Clock, MessageSquare, ArrowRight, ArrowLeft, Star,
  Calendar, Video, FileText, Mail, User, Building, Phone,
  Shield, Sparkles, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Calendly integration - Replace with your actual Calendly URL
const CALENDLY_URL = 'https://calendly.com/falconcore/advisory-session';

const AdvisorySession = () => {
  const { language, dir } = useLanguage();
  const [step, setStep] = useState<'info' | 'calendar' | 'payment'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    topic: '',
    questions: '',
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const features = [
    {
      icon: Video,
      title: language === 'ar' ? 'جلسة فيديو مباشرة' : 'Live Video Session',
      desc: language === 'ar' ? '90 دقيقة عبر Zoom أو Google Meet' : '90 minutes via Zoom or Google Meet',
    },
    {
      icon: FileText,
      title: language === 'ar' ? 'ملخص استراتيجي' : 'Strategy Memo',
      desc: language === 'ar' ? 'مذكرة مكتوبة خلال 48 ساعة' : 'Written memo within 48 hours',
    },
    {
      icon: Mail,
      title: language === 'ar' ? 'متابعة بالبريد' : 'Email Follow-up',
      desc: language === 'ar' ? 'أسئلة إضافية لمدة أسبوع' : 'Additional questions for 1 week',
    },
    {
      icon: Star,
      title: language === 'ar' ? 'أسعار تفضيلية' : 'Priority Rates',
      desc: language === 'ar' ? 'خصم على الخدمات المستقبلية' : 'Discount on future services',
    },
  ];

  const topics = [
    { value: 'us_expansion', label: language === 'ar' ? 'التوسع في السوق الأمريكي' : 'US Market Expansion' },
    { value: 'llc_formation', label: language === 'ar' ? 'تأسيس شركة LLC' : 'LLC Formation Strategy' },
    { value: 'tax_planning', label: language === 'ar' ? 'التخطيط الضريبي' : 'Tax Planning' },
    { value: 'banking', label: language === 'ar' ? 'فتح حساب بنكي أمريكي' : 'US Business Banking' },
    { value: 'compliance', label: language === 'ar' ? 'الامتثال القانوني' : 'Legal Compliance' },
    { value: 'other', label: language === 'ar' ? 'موضوع آخر' : 'Other Topic' },
  ];

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('calendar');
  };

  const handleCalendarSelect = () => {
    // In production, this would be triggered by Calendly webhook
    setSelectedSlot('Selected from Calendly');
    setStep('payment');
  };

  const handlePayment = () => {
    // Redirect to Stripe payment
    window.location.href = 'https://buy.stripe.com/28EbJ2eqm86N9G8dg9f3a00';
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/10" />
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
                <Badge variant="outline" className="mb-4 border-blue-500/50 text-blue-500">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  FC-ADV-001
                </Badge>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === 'ar' ? 'جلسة استشارية تنفيذية' : 'Executive Advisory Session'}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {language === 'ar'
                    ? 'جلسة استشارية مكثفة لمدة 90 دقيقة مع خبير في تأسيس الأعمال الأمريكية. احصل على إجابات واضحة وخطة عمل محددة.'
                    : 'An intensive 90-minute consultation with a US business formation expert. Get clear answers and a concrete action plan.'}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$250</span>
                  <span className="text-muted-foreground">USD</span>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <feature.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Process Steps */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">
                    {language === 'ar' ? 'كيف يعمل؟' : 'How it works'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'info' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">{language === 'ar' ? 'أخبرنا عنك' : 'Tell us about you'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'معلوماتك وموضوع الاستشارة' : 'Your info and consultation topic'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">{language === 'ar' ? 'اختر موعداً' : 'Pick a time'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'اختر الوقت المناسب لك' : 'Select a convenient time slot'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">{language === 'ar' ? 'أكد واحجز' : 'Confirm & Book'}</h4>
                        <p className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'الدفع وتأكيد الحجز' : 'Complete payment and confirm'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Right: Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>
                      {step === 'info' && (language === 'ar' ? 'معلوماتك' : 'Your Information')}
                      {step === 'calendar' && (language === 'ar' ? 'اختر موعداً' : 'Select a Time')}
                      {step === 'payment' && (language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')}
                    </CardTitle>
                    <CardDescription>
                      {step === 'info' && (language === 'ar' ? 'أخبرنا عن نفسك وعن استفسارك' : 'Tell us about yourself and your inquiry')}
                      {step === 'calendar' && (language === 'ar' ? 'اختر الوقت المناسب للجلسة' : 'Choose a convenient time for your session')}
                      {step === 'payment' && (language === 'ar' ? 'راجع التفاصيل وأكمل الدفع' : 'Review details and complete payment')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Step 1: Info Form */}
                    {step === 'info' && (
                      <form onSubmit={handleSubmitInfo} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              <User className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                            </Label>
                            <Input
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder={language === 'ar' ? 'محمد أحمد' : 'John Doe'}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              <Mail className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              <Phone className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">
                              <Building className="w-4 h-4 inline mr-1" />
                              {language === 'ar' ? 'اسم الشركة' : 'Company'}
                            </Label>
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder={language === 'ar' ? 'شركتك' : 'Your Company'}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="topic">
                            {language === 'ar' ? 'موضوع الاستشارة' : 'Consultation Topic'} *
                          </Label>
                          <select
                            id="topic"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                          >
                            <option value="">{language === 'ar' ? 'اختر موضوعاً' : 'Select a topic'}</option>
                            {topics.map((topic) => (
                              <option key={topic.value} value={topic.value}>{topic.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="questions">
                            {language === 'ar' ? 'أسئلتك أو استفساراتك' : 'Your Questions'}
                          </Label>
                          <Textarea
                            id="questions"
                            rows={4}
                            value={formData.questions}
                            onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                            placeholder={language === 'ar'
                              ? 'أخبرنا ما تريد مناقشته في الجلسة...'
                              : 'Tell us what you want to discuss in the session...'}
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          {language === 'ar' ? 'التالي: اختر موعداً' : 'Next: Choose a Time'}
                          <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
                        </Button>
                      </form>
                    )}

                    {/* Step 2: Calendar */}
                    {step === 'calendar' && (
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 text-center">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <p className="text-sm text-muted-foreground mb-4">
                            {language === 'ar'
                              ? 'اختر الموعد المناسب لك من التقويم'
                              : 'Select your preferred time from the calendar'}
                          </p>

                          {/* Calendly Embed - In production, use actual Calendly widget */}
                          <div className="border rounded-lg p-4 bg-background min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-4">
                                {language === 'ar' ? 'تقويم الحجز' : 'Booking Calendar'}
                              </p>
                              <Button onClick={handleCalendarSelect}>
                                {language === 'ar' ? 'اختر موعداً (للعرض)' : 'Select Time (Demo)'}
                              </Button>
                              <p className="text-xs text-muted-foreground mt-2">
                                Calendly widget loads here
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" onClick={() => setStep('info')} className="w-full">
                          <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
                          {language === 'ar' ? 'العودة' : 'Back'}
                        </Button>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 'payment' && (
                      <div className="space-y-4">
                        {/* Summary */}
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-green-500">
                              {language === 'ar' ? 'الموعد محجوز!' : 'Time Slot Reserved!'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar'
                              ? 'أكمل الدفع لتأكيد حجزك'
                              : 'Complete payment to confirm your booking'}
                          </p>
                        </div>

                        {/* Order Summary */}
                        <Card className="p-4">
                          <h4 className="font-semibold mb-3">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'الخدمة' : 'Service'}</span>
                              <span className="font-medium">Executive Advisory Session</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'المدة' : 'Duration'}</span>
                              <span>90 {language === 'ar' ? 'دقيقة' : 'minutes'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{language === 'ar' ? 'الموعد' : 'Date/Time'}</span>
                              <span>{selectedSlot}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-bold">
                                <span>{language === 'ar' ? 'المجموع' : 'Total'}</span>
                                <span>$250 USD</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Contract Agreement */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <input type="checkbox" id="terms" className="mt-1" required />
                            <label htmlFor="terms" className="text-sm">
                              {language === 'ar'
                                ? 'أوافق على شروط الخدمة وسياسة الإلغاء. سيتم إرسال العقد الإلكتروني بعد الدفع.'
                                : 'I agree to the Terms of Service and Cancellation Policy. Electronic contract will be sent after payment.'}
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setStep('calendar')} className="flex-1">
                            <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
                            {language === 'ar' ? 'العودة' : 'Back'}
                          </Button>
                          <Button onClick={handlePayment} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600">
                            <Shield className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'ادفع $250' : 'Pay $250'}
                          </Button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3" />
                          {language === 'ar' ? 'دفع آمن عبر Stripe' : 'Secure payment via Stripe'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AdvisorySession;
