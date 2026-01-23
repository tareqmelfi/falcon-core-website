import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Building2, MessageSquare, Globe, Check, Loader2, ArrowRight, ArrowLeft,
  User, Mail, Phone, MapPin, FileText, AlertCircle
} from 'lucide-react';

// Product configurations with required fields
const productConfigs = {
  'FC-ADV-001': {
    id: 'advisory',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    steps: ['contact', 'details'],
  },
  'FC-FORM-001': {
    id: 'formation',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    steps: ['contact', 'company', 'preferences'],
  },
  'FC-WEB-001': {
    id: 'website',
    icon: Globe,
    color: 'from-purple-500 to-pink-500',
    steps: ['contact', 'project', 'design'],
  },
};

interface FormData {
  // Contact Info
  fullName: string;
  email: string;
  phone: string;
  country: string;

  // Advisory specific
  companyName?: string;
  topic?: string;
  preferredDate?: string;
  preferredTime?: string;
  additionalNotes?: string;

  // LLC Formation specific
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  companyName1?: string;
  companyName2?: string;
  companyName3?: string;
  businessType?: string;
  businessPurpose?: string;
  needEIN?: boolean;
  needBankAccount?: boolean;

  // Website specific
  projectDescription?: string;
  referenceWebsites?: string;
  preferredColors?: string;
  hasLogo?: boolean;
  logoUrl?: string;
  initialContent?: string;
}

const OrderIntake = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order');
  const productCode = searchParams.get('product') || 'FC-FORM-001';

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
  });

  const config = productConfigs[productCode as keyof typeof productConfigs] || productConfigs['FC-FORM-001'];
  const IconComponent = config.icon;
  const totalSteps = config.steps.length;

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Send data to API
      const response = await fetch('/api/order-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productCode,
          formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    setIsSubmitting(false);
  };

  // Success Screen
  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {language === 'ar' ? 'تم استلام بياناتك!' : 'Information Received!'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {language === 'ar'
                  ? 'شكراً لك! سيتواصل معك فريقنا قريباً لبدء العمل على طلبك.'
                  : 'Thank you! Our team will contact you soon to start working on your order.'}
              </p>
              <Button onClick={() => navigate('/portal')}>
                {language === 'ar' ? 'متابعة طلبك' : 'Track Your Order'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render step content based on product type
  const renderStepContent = () => {
    const step = config.steps[currentStep];

    // Contact Information (all products)
    if (step === 'contact') {
      return (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                placeholder={language === 'ar' ? 'كما في جواز السفر' : 'As shown on passport'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+966 5XX XXX XXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">
                {language === 'ar' ? 'الدولة *' : 'Country *'}
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                required
              />
            </div>
          </div>
        </div>
      );
    }

    // Advisory Details
    if (step === 'details' && config.id === 'advisory') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              {language === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (optional)'}
            </Label>
            <Input
              id="companyName"
              value={formData.companyName || ''}
              onChange={(e) => updateFormData('companyName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">
              {language === 'ar' ? 'الموضوع المراد مناقشته *' : 'Topic to Discuss *'}
            </Label>
            <Textarea
              id="topic"
              value={formData.topic || ''}
              onChange={(e) => updateFormData('topic', e.target.value)}
              placeholder={language === 'ar' ? 'صف ما تريد مناقشته...' : 'Describe what you want to discuss...'}
              rows={4}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">
                {language === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}
              </Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate || ''}
                onChange={(e) => updateFormData('preferredDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime">
                {language === 'ar' ? 'الوقت المفضل' : 'Preferred Time'}
              </Label>
              <Input
                id="preferredTime"
                type="time"
                value={formData.preferredTime || ''}
                onChange={(e) => updateFormData('preferredTime', e.target.value)}
              />
            </div>
          </div>
        </div>
      );
    }

    // LLC Formation - Company Info
    if (step === 'company' && config.id === 'formation') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {language === 'ar' ? 'أسماء الشركة المقترحة' : 'Proposed Company Names'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? 'اقترح 3 أسماء مرتبة حسب الأفضلية. سنتحقق من توفرها.'
                    : 'Suggest 3 names in order of preference. We will check availability.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="companyName1">
                {language === 'ar' ? 'الاسم المفضل الأول *' : 'First Choice Name *'}
              </Label>
              <Input
                id="companyName1"
                value={formData.companyName1 || ''}
                onChange={(e) => updateFormData('companyName1', e.target.value)}
                placeholder="Example Holdings LLC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName2">
                {language === 'ar' ? 'الاسم البديل الثاني *' : 'Second Choice Name *'}
              </Label>
              <Input
                id="companyName2"
                value={formData.companyName2 || ''}
                onChange={(e) => updateFormData('companyName2', e.target.value)}
                placeholder="Example Ventures LLC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName3">
                {language === 'ar' ? 'الاسم البديل الثالث *' : 'Third Choice Name *'}
              </Label>
              <Input
                id="companyName3"
                value={formData.companyName3 || ''}
                onChange={(e) => updateFormData('companyName3', e.target.value)}
                placeholder="Example Group LLC"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">
              {language === 'ar' ? 'نوع النشاط *' : 'Business Type *'}
            </Label>
            <Input
              id="businessType"
              value={formData.businessType || ''}
              onChange={(e) => updateFormData('businessType', e.target.value)}
              placeholder={language === 'ar' ? 'مثال: تقنية، استشارات، تجارة...' : 'e.g., Technology, Consulting, Trading...'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPurpose">
              {language === 'ar' ? 'الغرض من الشركة *' : 'Business Purpose *'}
            </Label>
            <Textarea
              id="businessPurpose"
              value={formData.businessPurpose || ''}
              onChange={(e) => updateFormData('businessPurpose', e.target.value)}
              placeholder={language === 'ar'
                ? 'صف النشاط الرئيسي للشركة...'
                : 'Describe the main business activity...'}
              rows={3}
              required
            />
          </div>
        </div>
      );
    }

    // LLC Formation - Preferences
    if (step === 'preferences' && config.id === 'formation') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">
              {language === 'ar' ? 'تاريخ الميلاد *' : 'Date of Birth *'}
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              {language === 'ar' ? 'العنوان الكامل *' : 'Full Address *'}
            </Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder={language === 'ar' ? 'الشارع، رقم المبنى' : 'Street, Building Number'}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">
                {language === 'ar' ? 'المدينة *' : 'City *'}
              </Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => updateFormData('city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">
                {language === 'ar' ? 'المنطقة/الولاية' : 'State/Province'}
              </Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => updateFormData('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">
                {language === 'ar' ? 'الرمز البريدي' : 'Zip Code'}
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode || ''}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="needEIN"
                checked={formData.needEIN || false}
                onCheckedChange={(checked) => updateFormData('needEIN', checked as boolean)}
              />
              <Label htmlFor="needEIN" className="text-sm font-normal cursor-pointer">
                {language === 'ar'
                  ? 'أحتاج رقم تعريف ضريبي EIN (مطلوب للحسابات البنكية)'
                  : 'I need an EIN (Required for bank accounts)'}
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="needBankAccount"
                checked={formData.needBankAccount || false}
                onCheckedChange={(checked) => updateFormData('needBankAccount', checked as boolean)}
              />
              <Label htmlFor="needBankAccount" className="text-sm font-normal cursor-pointer">
                {language === 'ar'
                  ? 'أحتاج مساعدة في فتح حساب بنكي أمريكي'
                  : 'I need help opening a US bank account'}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">
              {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes || ''}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              placeholder={language === 'ar'
                ? 'أي معلومات أو طلبات إضافية...'
                : 'Any additional information or requests...'}
              rows={3}
            />
          </div>
        </div>
      );
    }

    // Website - Project Details
    if (step === 'project' && config.id === 'website') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectDescription">
              {language === 'ar' ? 'وصف المشروع *' : 'Project Description *'}
            </Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription || ''}
              onChange={(e) => updateFormData('projectDescription', e.target.value)}
              placeholder={language === 'ar'
                ? 'صف فكرة الموقع، الهدف منه، والجمهور المستهدف...'
                : 'Describe the website idea, its purpose, and target audience...'}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceWebsites">
              {language === 'ar' ? 'مواقع مرجعية (Inspiration)' : 'Reference Websites (Inspiration)'}
            </Label>
            <Textarea
              id="referenceWebsites"
              value={formData.referenceWebsites || ''}
              onChange={(e) => updateFormData('referenceWebsites', e.target.value)}
              placeholder={language === 'ar'
                ? 'أدخل روابط مواقع تعجبك...'
                : 'Enter links to websites you like...'}
              rows={3}
            />
          </div>
        </div>
      );
    }

    // Website - Design Preferences
    if (step === 'design' && config.id === 'website') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferredColors">
              {language === 'ar' ? 'الألوان المفضلة' : 'Preferred Colors'}
            </Label>
            <Input
              id="preferredColors"
              value={formData.preferredColors || ''}
              onChange={(e) => updateFormData('preferredColors', e.target.value)}
              placeholder={language === 'ar' ? 'مثال: أزرق، ذهبي، أبيض' : 'e.g., Blue, Gold, White'}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="hasLogo"
              checked={formData.hasLogo || false}
              onCheckedChange={(checked) => updateFormData('hasLogo', checked as boolean)}
            />
            <Label htmlFor="hasLogo" className="text-sm font-normal cursor-pointer">
              {language === 'ar' ? 'لدي شعار جاهز' : 'I have a logo ready'}
            </Label>
          </div>

          {formData.hasLogo && (
            <div className="space-y-2">
              <Label htmlFor="logoUrl">
                {language === 'ar' ? 'رابط الشعار أو أرفقه لاحقاً' : 'Logo URL or attach later'}
              </Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl || ''}
                onChange={(e) => updateFormData('logoUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="initialContent">
              {language === 'ar' ? 'المحتوى الأولي' : 'Initial Content'}
            </Label>
            <Textarea
              id="initialContent"
              value={formData.initialContent || ''}
              onChange={(e) => updateFormData('initialContent', e.target.value)}
              placeholder={language === 'ar'
                ? 'أي نصوص أو معلومات تريد تضمينها في الموقع...'
                : 'Any text or information you want to include on the website...'}
              rows={4}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const getStepTitle = (step: string) => {
    const titles: Record<string, { ar: string; en: string }> = {
      contact: { ar: 'معلومات التواصل', en: 'Contact Information' },
      details: { ar: 'تفاصيل الجلسة', en: 'Session Details' },
      company: { ar: 'معلومات الشركة', en: 'Company Information' },
      preferences: { ar: 'التفضيلات والمتطلبات', en: 'Preferences & Requirements' },
      project: { ar: 'تفاصيل المشروع', en: 'Project Details' },
      design: { ar: 'تفضيلات التصميم', en: 'Design Preferences' },
    };
    return language === 'ar' ? titles[step]?.ar : titles[step]?.en;
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${config.color} p-4 mb-4`}>
                <IconComponent className="w-full h-full text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {language === 'ar' ? 'أكمل معلومات طلبك' : 'Complete Your Order Information'}
              </h1>
              {orderId && (
                <Badge variant="outline" className="mb-2">
                  {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'} {orderId}
                </Badge>
              )}
              <p className="text-muted-foreground">
                {language === 'ar'
                  ? 'نحتاج بعض المعلومات لبدء العمل على طلبك'
                  : 'We need some information to start working on your order'}
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {config.steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  {index < config.steps.length - 1 && (
                    <div className={`w-12 h-1 rounded ${index < currentStep ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>{getStepTitle(config.steps[currentStep])}</CardTitle>
                <CardDescription>
                  {language === 'ar'
                    ? `الخطوة ${currentStep + 1} من ${totalSteps}`
                    : `Step ${currentStep + 1} of ${totalSteps}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </Button>

                  {currentStep < totalSteps - 1 ? (
                    <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                      {language === 'ar' ? 'التالي' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-primary to-blue-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {language === 'ar' ? 'إرسال البيانات' : 'Submit Information'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderIntake;
