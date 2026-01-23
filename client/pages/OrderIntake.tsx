import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2, Check, Loader2, ArrowRight, ArrowLeft, User, Mail, Phone, MapPin,
  FileText, AlertCircle, Star, Shield, Clock, DollarSign, CreditCard,
  Globe, Users, Calendar, CheckCircle2, Lock, Zap
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

// Formation Packages Configuration
const formationPackages = {
  basic: {
    name: 'Basic',
    price: 297,
    stateFee: 100,
    processing: '10-15',
    features: ['articles', 'name_check', 'digital_docs', 'basic_operating'],
    addOns: ['ein', 'registered_agent'],
    color: 'border-border/50'
  },
  standard: {
    name: 'Standard',
    price: 497,
    stateFee: 100,
    processing: '5-7',
    features: ['articles', 'name_check', 'digital_docs', 'custom_operating', 'registered_agent_1yr', 'ein', 'banking_guide'],
    addOns: [],
    popular: true,
    color: 'border-primary'
  },
  premium: {
    name: 'Premium',
    price: 997,
    stateFee: 100,
    processing: '1-3',
    features: ['articles', 'name_check', 'digital_docs', 'custom_operating', 'registered_agent_1yr', 'ein', 'banking_guide', 'banking_assistance', 'virtual_address', 'us_phone', 'strategy_call', 'tax_consultation', 'compliance_dashboard'],
    addOns: [],
    color: 'border-amber-500'
  }
};

// Add-on Services
const addOnOptions = [
  { id: 'expedited_5_7', price: 75, forPackages: ['basic'] },
  { id: 'rush_1_3', price: 150, forPackages: ['basic', 'standard'] },
  { id: 'ein_standalone', price: 149, forPackages: ['basic'] },
  { id: 'registered_agent', price: 149, forPackages: ['basic'] },
  { id: 'apostille', price: 199, forPackages: ['basic', 'standard', 'premium'] },
  { id: 'good_standing', price: 75, forPackages: ['basic', 'standard', 'premium'] },
];

// Countries list for dropdown
const countries = [
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' } },
  { code: 'AE', name: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' } },
  { code: 'KW', name: { en: 'Kuwait', ar: 'الكويت' } },
  { code: 'QA', name: { en: 'Qatar', ar: 'قطر' } },
  { code: 'BH', name: { en: 'Bahrain', ar: 'البحرين' } },
  { code: 'OM', name: { en: 'Oman', ar: 'عمان' } },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر' } },
  { code: 'JO', name: { en: 'Jordan', ar: 'الأردن' } },
  { code: 'LB', name: { en: 'Lebanon', ar: 'لبنان' } },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة' } },
  { code: 'GB', name: { en: 'United Kingdom', ar: 'المملكة المتحدة' } },
  { code: 'OTHER', name: { en: 'Other', ar: 'أخرى' } },
];

interface MemberInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  ownershipPercent: number;
}

interface FormData {
  // Step 1: Package Selection
  selectedPackage: 'basic' | 'standard' | 'premium';
  selectedAddOns: string[];

  // Step 2: Company Information
  companyName1: string;
  companyName2: string;
  companyName3: string;
  businessType: string;
  businessPurpose: string;

  // Step 3: Owner/Member Information
  numberOfMembers: number;
  members: MemberInfo[];
  managementType: 'member' | 'manager';

  // Step 4: Services & Preferences
  needEIN: boolean;
  needBankAccount: boolean;
  needVirtualAddress: boolean;
  needUSPhone: boolean;
  preferredBank: string;
  additionalNotes: string;

  // Step 5: Payment & Agreement
  termsAccepted: boolean;
  privacyAccepted: boolean;
  communicationConsent: boolean;
}

const defaultMember: MemberInfo = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  passportNumber: '',
  nationality: '',
  address: '',
  city: '',
  country: '',
  zipCode: '',
  ownershipPercent: 100,
};

const OrderIntake = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialPackage = (searchParams.get('package') as 'basic' | 'standard' | 'premium') || 'standard';

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    selectedPackage: initialPackage,
    selectedAddOns: [],
    companyName1: '',
    companyName2: '',
    companyName3: '',
    businessType: '',
    businessPurpose: '',
    numberOfMembers: 1,
    members: [{ ...defaultMember }],
    managementType: 'member',
    needEIN: initialPackage !== 'basic',
    needBankAccount: initialPackage === 'premium',
    needVirtualAddress: initialPackage === 'premium',
    needUSPhone: initialPackage === 'premium',
    preferredBank: '',
    additionalNotes: '',
    termsAccepted: false,
    privacyAccepted: false,
    communicationConsent: true,
  });

  const steps = [
    { id: 'package', icon: Star, title: { en: 'Select Package', ar: 'اختر الباقة' } },
    { id: 'company', icon: Building2, title: { en: 'Company Details', ar: 'بيانات الشركة' } },
    { id: 'members', icon: Users, title: { en: 'Owner Information', ar: 'معلومات المالك' } },
    { id: 'services', icon: Shield, title: { en: 'Services', ar: 'الخدمات' } },
    { id: 'payment', icon: CreditCard, title: { en: 'Payment', ar: 'الدفع' } },
  ];

  const totalSteps = steps.length;
  const currentPackage = formationPackages[formData.selectedPackage];

  // Calculate total price
  const calculateTotal = () => {
    let total = currentPackage.price + currentPackage.stateFee;
    formData.selectedAddOns.forEach(addon => {
      const addOnItem = addOnOptions.find(a => a.id === addon);
      if (addOnItem) total += addOnItem.price;
    });
    return total;
  };

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMember = (index: number, field: keyof MemberInfo, value: string | number) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const addMember = () => {
    if (formData.members.length < 4) {
      const newOwnership = Math.floor(100 / (formData.members.length + 1));
      const newMembers = formData.members.map(m => ({ ...m, ownershipPercent: newOwnership }));
      newMembers.push({ ...defaultMember, ownershipPercent: 100 - (newOwnership * formData.members.length) });
      setFormData(prev => ({ ...prev, members: newMembers, numberOfMembers: prev.numberOfMembers + 1 }));
    }
  };

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      const equalShare = Math.floor(100 / newMembers.length);
      newMembers.forEach((m, i) => {
        m.ownershipPercent = i === newMembers.length - 1 ? 100 - (equalShare * (newMembers.length - 1)) : equalShare;
      });
      setFormData(prev => ({ ...prev, members: newMembers, numberOfMembers: prev.numberOfMembers - 1 }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Generate order ID
      const newOrderId = `FC-WY-${Date.now().toString(36).toUpperCase()}`;

      // Send data to API
      const response = await fetch('/api/order-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrderId,
          productType: 'wyoming-llc',
          package: formData.selectedPackage,
          formData,
          totalAmount: calculateTotal(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setOrderId(newOrderId);

        // Redirect to Stripe checkout
        const checkoutResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: newOrderId,
            package: formData.selectedPackage,
            addOns: formData.selectedAddOns,
            totalAmount: calculateTotal(),
            customerEmail: formData.members[0]?.email,
            customerName: formData.members[0]?.fullName,
          }),
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          setIsSubmitted(true);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Package
        return true;
      case 1: // Company
        return formData.companyName1 && formData.companyName2 && formData.companyName3 && formData.businessPurpose;
      case 2: // Members
        return formData.members.every(m => m.fullName && m.email && m.phone && m.dateOfBirth && m.country);
      case 3: // Services
        return true;
      case 4: // Payment
        return formData.termsAccepted && formData.privacyAccepted;
      default:
        return false;
    }
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
                {language === 'ar' ? 'تم استلام طلبك!' : 'Order Received!'}
              </h1>
              {orderId && (
                <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
                  {language === 'ar' ? 'رقم الطلب:' : 'Order ID:'} {orderId}
                </Badge>
              )}
              <p className="text-muted-foreground mb-8">
                {language === 'ar'
                  ? 'شكراً لك! سيتواصل معك فريقنا خلال 24 ساعة لبدء العمل على تأسيس شركتك.'
                  : 'Thank you! Our team will contact you within 24 hours to start working on your LLC formation.'}
              </p>
              <div className="space-y-3">
                <Button onClick={() => navigate('/portal')} className="w-full">
                  {language === 'ar' ? 'متابعة طلبك' : 'Track Your Order'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Step Content Renderers
  const renderPackageStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {(Object.entries(formationPackages) as [string, typeof formationPackages.basic][]).map(([key, pkg]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              formData.selectedPackage === key ? 'ring-2 ring-primary shadow-lg' : ''
            } ${pkg.popular ? 'border-2 border-primary' : ''}`}
            onClick={() => updateFormData('selectedPackage', key as 'basic' | 'standard' | 'premium')}
          >
            <CardHeader className="pb-2">
              {pkg.popular && (
                <Badge className="w-fit mb-2 bg-gradient-to-r from-orange-500 to-red-500">
                  <Star className="w-3 h-3 mr-1" />
                  {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </Badge>
              )}
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold">${pkg.price}</span>
                <span className="text-sm text-muted-foreground">+ ${pkg.stateFee} state fee</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-primary mb-3">
                <Clock className="w-4 h-4" />
                <span>{pkg.processing} {language === 'ar' ? 'أيام عمل' : 'business days'}</span>
              </div>
              <div className="space-y-2 text-sm">
                {pkg.features.slice(0, 5).map(feature => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-muted-foreground">
                      {language === 'ar' ? t(`intake.feature.${feature}`) : feature.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
                {pkg.features.length > 5 && (
                  <p className="text-primary text-xs">+{pkg.features.length - 5} more...</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons Section */}
      {addOnOptions.filter(a => a.forPackages.includes(formData.selectedPackage)).length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">
            {language === 'ar' ? 'خدمات إضافية (اختياري)' : 'Add-on Services (Optional)'}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {addOnOptions
              .filter(addon => addon.forPackages.includes(formData.selectedPackage))
              .map(addon => (
                <div
                  key={addon.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.selectedAddOns.includes(addon.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    const newAddOns = formData.selectedAddOns.includes(addon.id)
                      ? formData.selectedAddOns.filter(a => a !== addon.id)
                      : [...formData.selectedAddOns, addon.id];
                    updateFormData('selectedAddOns', newAddOns);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={formData.selectedAddOns.includes(addon.id)} />
                      <span className="font-medium">{t(`store.addon.${addon.id}`)}</span>
                    </div>
                    <span className="font-bold text-primary">+${addon.price}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
            <span className="text-primary text-2xl">${calculateTotal()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyStep = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">
              {language === 'ar' ? 'اقترح 3 أسماء لشركتك' : 'Suggest 3 Company Names'}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === 'ar'
                ? 'سنتحقق من توفرها ونسجل الاسم المتوفر. رتبها حسب الأفضلية.'
                : 'We\'ll check availability and register the first available name. List in order of preference.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'الاسم المفضل الأول *' : 'First Choice *'}</Label>
          <div className="flex gap-2">
            <Input
              value={formData.companyName1}
              onChange={(e) => updateFormData('companyName1', e.target.value)}
              placeholder="Example Holdings"
              className="flex-grow"
            />
            <span className="flex items-center text-muted-foreground px-3 bg-muted rounded-md">LLC</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'الاسم البديل الثاني *' : 'Second Choice *'}</Label>
          <div className="flex gap-2">
            <Input
              value={formData.companyName2}
              onChange={(e) => updateFormData('companyName2', e.target.value)}
              placeholder="Example Ventures"
              className="flex-grow"
            />
            <span className="flex items-center text-muted-foreground px-3 bg-muted rounded-md">LLC</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>{language === 'ar' ? 'الاسم البديل الثالث *' : 'Third Choice *'}</Label>
          <div className="flex gap-2">
            <Input
              value={formData.companyName3}
              onChange={(e) => updateFormData('companyName3', e.target.value)}
              placeholder="Example Group"
              className="flex-grow"
            />
            <span className="flex items-center text-muted-foreground px-3 bg-muted rounded-md">LLC</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{language === 'ar' ? 'نوع النشاط *' : 'Business Type *'}</Label>
        <Select value={formData.businessType} onValueChange={(v) => updateFormData('businessType', v)}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'ar' ? 'اختر نوع النشاط' : 'Select business type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulting">{language === 'ar' ? 'استشارات' : 'Consulting'}</SelectItem>
            <SelectItem value="technology">{language === 'ar' ? 'تقنية' : 'Technology'}</SelectItem>
            <SelectItem value="ecommerce">{language === 'ar' ? 'تجارة إلكترونية' : 'E-commerce'}</SelectItem>
            <SelectItem value="trading">{language === 'ar' ? 'تجارة' : 'Trading'}</SelectItem>
            <SelectItem value="marketing">{language === 'ar' ? 'تسويق' : 'Marketing'}</SelectItem>
            <SelectItem value="real_estate">{language === 'ar' ? 'عقارات' : 'Real Estate'}</SelectItem>
            <SelectItem value="investment">{language === 'ar' ? 'استثمار' : 'Investment/Holding'}</SelectItem>
            <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{language === 'ar' ? 'وصف نشاط الشركة *' : 'Business Purpose/Description *'}</Label>
        <Textarea
          value={formData.businessPurpose}
          onChange={(e) => updateFormData('businessPurpose', e.target.value)}
          placeholder={language === 'ar'
            ? 'صف النشاط الرئيسي للشركة بالتفصيل...'
            : 'Describe the main business activities in detail...'}
          rows={4}
        />
      </div>
    </div>
  );

  const renderMembersStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {language === 'ar' ? 'أعضاء/مالكي الشركة' : 'Company Members/Owners'}
        </h3>
        {formData.members.length < 4 && (
          <Button variant="outline" size="sm" onClick={addMember}>
            <Users className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
          </Button>
        )}
      </div>

      {formData.members.map((member, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {language === 'ar' ? `العضو ${index + 1}` : `Member ${index + 1}`}
                {index === 0 && <Badge className="ml-2">{language === 'ar' ? 'المدير المسجل' : 'Registered Agent Contact'}</Badge>}
              </CardTitle>
              {formData.members.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeMember(index)} className="text-red-500">
                  {language === 'ar' ? 'حذف' : 'Remove'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الاسم الكامل (كما في جواز السفر) *' : 'Full Legal Name *'}</Label>
                <Input
                  value={member.fullName}
                  onChange={(e) => updateMember(index, 'fullName', e.target.value)}
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full name as on passport'}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'تاريخ الميلاد *' : 'Date of Birth *'}</Label>
                <Input
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => updateMember(index, 'dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</Label>
                <Input
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(index, 'email', e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}</Label>
                <Input
                  type="tel"
                  value={member.phone}
                  onChange={(e) => updateMember(index, 'phone', e.target.value)}
                  placeholder="+966 5XX XXX XXXX"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الجنسية' : 'Nationality'}</Label>
                <Select value={member.nationality} onValueChange={(v) => updateMember(index, 'nationality', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {language === 'ar' ? c.name.ar : c.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'رقم جواز السفر' : 'Passport Number'}</Label>
                <Input
                  value={member.passportNumber}
                  onChange={(e) => updateMember(index, 'passportNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان *' : 'Address *'}</Label>
              <Input
                value={member.address}
                onChange={(e) => updateMember(index, 'address', e.target.value)}
                placeholder={language === 'ar' ? 'الشارع، رقم المبنى' : 'Street, Building Number'}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'المدينة *' : 'City *'}</Label>
                <Input
                  value={member.city}
                  onChange={(e) => updateMember(index, 'city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الدولة *' : 'Country *'}</Label>
                <Select value={member.country} onValueChange={(v) => updateMember(index, 'country', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {language === 'ar' ? c.name.ar : c.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الرمز البريدي' : 'Zip Code'}</Label>
                <Input
                  value={member.zipCode}
                  onChange={(e) => updateMember(index, 'zipCode', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'نسبة الملكية (%)' : 'Ownership Percentage (%)'}</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={member.ownershipPercent}
                onChange={(e) => updateMember(index, 'ownershipPercent', parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="space-y-2">
        <Label>{language === 'ar' ? 'نوع الإدارة' : 'Management Type'}</Label>
        <RadioGroup
          value={formData.managementType}
          onValueChange={(v) => updateFormData('managementType', v as 'member' | 'manager')}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="member" id="member" />
            <Label htmlFor="member" className="font-normal cursor-pointer">
              {language === 'ar' ? 'يديرها الأعضاء (Member-Managed)' : 'Member-Managed'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manager" id="manager" />
            <Label htmlFor="manager" className="font-normal cursor-pointer">
              {language === 'ar' ? 'يديرها مدير (Manager-Managed)' : 'Manager-Managed'}
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          {language === 'ar'
            ? 'معظم الشركات الصغيرة تختار "يديرها الأعضاء" - الأعضاء يديرون الشركة مباشرة.'
            : 'Most small businesses choose "Member-Managed" - members directly manage the company.'}
        </p>
      </div>
    </div>
  );

  const renderServicesStep = () => (
    <div className="space-y-6">
      <h3 className="font-semibold">
        {language === 'ar' ? 'الخدمات والتفضيلات الإضافية' : 'Additional Services & Preferences'}
      </h3>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${formData.needEIN ? 'border-primary bg-primary/5' : ''}`}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="needEIN"
              checked={formData.needEIN}
              onCheckedChange={(c) => updateFormData('needEIN', c as boolean)}
              disabled={formData.selectedPackage !== 'basic'} // Included in standard/premium
            />
            <div className="flex-grow">
              <Label htmlFor="needEIN" className="font-medium cursor-pointer">
                {language === 'ar' ? 'رقم تعريف ضريبي فيدرالي (EIN)' : 'Federal EIN (Tax ID)'}
                {formData.selectedPackage !== 'basic' && (
                  <Badge className="ml-2" variant="secondary">{language === 'ar' ? 'مشمول' : 'Included'}</Badge>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'مطلوب لفتح حساب بنكي أمريكي وتوظيف موظفين.'
                  : 'Required for opening US bank accounts and hiring employees.'}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${formData.needBankAccount ? 'border-primary bg-primary/5' : ''}`}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="needBankAccount"
              checked={formData.needBankAccount}
              onCheckedChange={(c) => updateFormData('needBankAccount', c as boolean)}
            />
            <div className="flex-grow">
              <Label htmlFor="needBankAccount" className="font-medium cursor-pointer">
                {language === 'ar' ? 'مساعدة في فتح حساب بنكي أمريكي' : 'US Bank Account Assistance'}
                {formData.selectedPackage === 'premium' && (
                  <Badge className="ml-2" variant="secondary">{language === 'ar' ? 'مشمول' : 'Included'}</Badge>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'سنساعدك في اختيار البنك المناسب وإعداد طلب الحساب.'
                  : 'We\'ll help you choose the right bank and prepare the account application.'}
              </p>
            </div>
          </div>
        </div>

        {formData.needBankAccount && (
          <div className="space-y-2 ml-8">
            <Label>{language === 'ar' ? 'البنك المفضل (اختياري)' : 'Preferred Bank (Optional)'}</Label>
            <Select value={formData.preferredBank} onValueChange={(v) => updateFormData('preferredBank', v)}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر أو اتركه لنا' : 'Select or let us recommend'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mercury">Mercury (Online, International-Friendly)</SelectItem>
                <SelectItem value="relay">Relay (Online, No Fees)</SelectItem>
                <SelectItem value="chase">Chase (Traditional)</SelectItem>
                <SelectItem value="bofa">Bank of America (Traditional)</SelectItem>
                <SelectItem value="recommend">{language === 'ar' ? 'اقترح لي الأنسب' : 'Recommend for me'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className={`p-4 rounded-lg border ${formData.needVirtualAddress ? 'border-primary bg-primary/5' : ''}`}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="needVirtualAddress"
              checked={formData.needVirtualAddress}
              onCheckedChange={(c) => updateFormData('needVirtualAddress', c as boolean)}
              disabled={formData.selectedPackage === 'premium'}
            />
            <div className="flex-grow">
              <Label htmlFor="needVirtualAddress" className="font-medium cursor-pointer">
                {language === 'ar' ? 'عنوان بريدي أمريكي افتراضي' : 'US Virtual Mailing Address'}
                {formData.selectedPackage === 'premium' && (
                  <Badge className="ml-2" variant="secondary">{language === 'ar' ? 'مشمول' : 'Included'}</Badge>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'عنوان فعلي في أمريكا لاستلام البريد ومسحه لك.'
                  : 'A real US address to receive and scan your mail.'}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${formData.needUSPhone ? 'border-primary bg-primary/5' : ''}`}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="needUSPhone"
              checked={formData.needUSPhone}
              onCheckedChange={(c) => updateFormData('needUSPhone', c as boolean)}
              disabled={formData.selectedPackage === 'premium'}
            />
            <div className="flex-grow">
              <Label htmlFor="needUSPhone" className="font-medium cursor-pointer">
                {language === 'ar' ? 'رقم هاتف أمريكي' : 'US Phone Number'}
                {formData.selectedPackage === 'premium' && (
                  <Badge className="ml-2" variant="secondary">{language === 'ar' ? 'مشمول' : 'Included'}</Badge>
                )}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? 'رقم هاتف أمريكي للتحقق من الحسابات والتواصل مع البنوك.'
                  : 'US phone number for account verification and bank communications.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{language === 'ar' ? 'ملاحظات أو طلبات إضافية' : 'Additional Notes or Requests'}</Label>
        <Textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData('additionalNotes', e.target.value)}
          placeholder={language === 'ar'
            ? 'أي معلومات إضافية تود مشاركتها معنا...'
            : 'Any additional information you\'d like to share with us...'}
          rows={4}
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{currentPackage.name} Package</span>
            <span>${currentPackage.price}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{language === 'ar' ? 'رسوم الولاية' : 'State Filing Fee'}</span>
            <span>${currentPackage.stateFee}</span>
          </div>
          {formData.selectedAddOns.map(addon => {
            const addOnItem = addOnOptions.find(a => a.id === addon);
            return addOnItem ? (
              <div key={addon} className="flex justify-between text-muted-foreground">
                <span>{t(`store.addon.${addon}`)}</span>
                <span>${addOnItem.price}</span>
              </div>
            ) : null;
          })}
          <div className="border-t pt-4 flex justify-between text-lg font-bold">
            <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
            <span className="text-primary">${calculateTotal()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Company Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{language === 'ar' ? 'بيانات الشركة' : 'Company Information'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {formData.companyName1} LLC</p>
          <p><strong>{language === 'ar' ? 'النشاط:' : 'Business:'}</strong> {formData.businessPurpose.substring(0, 100)}...</p>
          <p><strong>{language === 'ar' ? 'الأعضاء:' : 'Members:'}</strong> {formData.members.map(m => m.fullName).join(', ')}</p>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(c) => updateFormData('termsAccepted', c as boolean)}
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
            {language === 'ar' ? (
              <>
                أوافق على <a href="/terms" target="_blank" className="text-primary underline">الشروط والأحكام</a> وأفهم أن هذه خدمة تأسيس شركة وليست استشارة قانونية.
              </>
            ) : (
              <>
                I agree to the <a href="/terms" target="_blank" className="text-primary underline">Terms & Conditions</a> and understand this is a formation service, not legal advice.
              </>
            )}
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={formData.privacyAccepted}
            onCheckedChange={(c) => updateFormData('privacyAccepted', c as boolean)}
          />
          <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
            {language === 'ar' ? (
              <>
                أوافق على <a href="/privacy" target="_blank" className="text-primary underline">سياسة الخصوصية</a> ومعالجة بياناتي لغرض تأسيس الشركة.
              </>
            ) : (
              <>
                I agree to the <a href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</a> and consent to processing my data for LLC formation.
              </>
            )}
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="communication"
            checked={formData.communicationConsent}
            onCheckedChange={(c) => updateFormData('communicationConsent', c as boolean)}
          />
          <Label htmlFor="communication" className="text-sm font-normal cursor-pointer">
            {language === 'ar'
              ? 'أوافق على تلقي تحديثات حول طلبي عبر البريد الإلكتروني والواتساب.'
              : 'I consent to receive order updates via email and WhatsApp.'}
          </Label>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        <Lock className="w-4 h-4" />
        <span>
          {language === 'ar'
            ? 'الدفع آمن ومشفر عبر Stripe. لا نخزن بيانات بطاقتك.'
            : 'Payment is secure and encrypted via Stripe. We never store your card details.'}
        </span>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPackageStep();
      case 1: return renderCompanyStep();
      case 2: return renderMembersStep();
      case 3: return renderServicesStep();
      case 4: return renderPaymentStep();
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 border-emerald-500/50 text-emerald-500">
                <MapPin className="w-3 h-3 mr-1" />
                Wyoming LLC Formation
              </Badge>
              <h1 className="text-3xl font-bold mb-2">
                {language === 'ar' ? 'ابدأ تأسيس شركتك' : 'Start Your LLC Formation'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar'
                  ? 'أكمل النموذج التالي لبدء تأسيس شركتك في وايومنغ'
                  : 'Complete the following form to begin your Wyoming LLC formation'}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex flex-col items-center ${index < steps.length - 1 ? 'mr-2' : ''}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          index < currentStep
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index < currentStep ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs mt-2 whitespace-nowrap ${index === currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
                        {language === 'ar' ? step.title.ar : step.title.en}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 md:w-16 h-1 rounded mx-1 ${index < currentStep ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? steps[currentStep].title.ar : steps[currentStep].title.en}
                </CardTitle>
                <CardDescription>
                  {language === 'ar'
                    ? `الخطوة ${currentStep + 1} من ${totalSteps}`
                    : `Step ${currentStep + 1} of ${totalSteps}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'السابق' : 'Previous'}
                  </Button>

                  {currentStep < totalSteps - 1 ? (
                    <Button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={!canProceed()}
                    >
                      {language === 'ar' ? 'التالي' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !canProceed()}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {language === 'ar' ? `ادفع $${calculateTotal()}` : `Pay $${calculateTotal()}`}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{language === 'ar' ? 'معاملات آمنة' : 'Secure Transactions'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" />
                <span>{language === 'ar' ? 'مشفر SSL' : 'SSL Encrypted'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span>{language === 'ar' ? 'دعم ثنائي اللغة' : 'Bilingual Support'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderIntake;
