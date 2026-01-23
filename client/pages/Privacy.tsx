import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Database, Share2, Lock, Clock, UserCheck, Mail } from 'lucide-react';

const Privacy = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const lastUpdated = '2026-01-23';

  const sections = isArabic ? [
    {
      icon: Eye,
      title: 'المعلومات التي نجمعها',
      content: `نجمع المعلومات التالية:
• معلومات شخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان
• معلومات الدفع: يتم معالجتها بشكل آمن عبر Stripe ولا نخزنها
• معلومات الاستخدام: كيفية تصفحك للموقع، الصفحات التي تزورها
• معلومات الجهاز: نوع المتصفح، نظام التشغيل، عنوان IP
• معلومات الأعمال: للخدمات مثل تأسيس الشركات`
    },
    {
      icon: Database,
      title: 'كيف نستخدم معلوماتك',
      content: `نستخدم معلوماتك للأغراض التالية:
• تقديم الخدمات التي طلبتها
• التواصل معك بشأن طلباتك
• تحسين خدماتنا وموقعنا
• إرسال تحديثات مهمة عن خدماتك
• الامتثال للمتطلبات القانونية
• منع الاحتيال وحماية أمن الموقع`
    },
    {
      icon: Share2,
      title: 'مشاركة المعلومات',
      content: `قد نشارك معلوماتك مع:
• مزودي الخدمات (Stripe للدفع، Netlify للاستضافة)
• الجهات الحكومية (لتأسيس الشركات حسب الطلب)
• المستشارين المحترفين (المحامين، المحاسبين) عند الحاجة

لا نبيع معلوماتك الشخصية لأي طرف ثالث.`
    },
    {
      icon: Lock,
      title: 'أمن البيانات',
      content: `نحمي بياناتك من خلال:
• تشفير SSL/TLS لجميع الاتصالات
• تخزين آمن مع Cloudflare
• عدم تخزين بيانات الدفع على خوادمنا
• مراجعات أمنية دورية
• وصول محدود للموظفين المخولين فقط`
    },
    {
      icon: Clock,
      title: 'الاحتفاظ بالبيانات',
      content: `نحتفظ ببياناتك:
• طالما كان حسابك نشطاً
• للفترة اللازمة لتقديم الخدمات
• حسب المتطلبات القانونية (عادة 5-7 سنوات للسجلات المالية)
• يمكنك طلب حذف بياناتك في أي وقت (مع مراعاة الالتزامات القانونية)`
    },
    {
      icon: UserCheck,
      title: 'حقوقك',
      content: `لديك الحق في:
• الوصول إلى بياناتك الشخصية
• تصحيح البيانات غير الدقيقة
• طلب حذف بياناتك
• الاعتراض على معالجة بياناتك
• سحب موافقتك في أي وقت
• تقديم شكوى للجهات المختصة`
    },
    {
      icon: Shield,
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: `نستخدم ملفات تعريف الارتباط لـ:
• تذكر تفضيلاتك (اللغة، المظهر)
• تحليل استخدام الموقع
• تحسين تجربة المستخدم

يمكنك التحكم في ملفات تعريف الارتباط من إعدادات المتصفح.`
    }
  ] : [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: `We collect the following information:
• Personal Information: Name, email, phone number, address
• Payment Information: Processed securely via Stripe - we don't store it
• Usage Information: How you browse our site, pages you visit
• Device Information: Browser type, operating system, IP address
• Business Information: For services like LLC formation`
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: `We use your information for:
• Providing the services you requested
• Communicating with you about your orders
• Improving our services and website
• Sending important updates about your services
• Complying with legal requirements
• Preventing fraud and protecting site security`
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      content: `We may share your information with:
• Service providers (Stripe for payments, Netlify for hosting)
• Government agencies (for LLC formation as requested)
• Professional advisors (lawyers, accountants) when necessary

We do not sell your personal information to any third party.`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We protect your data through:
• SSL/TLS encryption for all communications
• Secure storage with Cloudflare
• No storage of payment data on our servers
• Regular security reviews
• Limited access to authorized personnel only`
    },
    {
      icon: Clock,
      title: 'Data Retention',
      content: `We retain your data:
• As long as your account is active
• For the period necessary to provide services
• As required by law (typically 5-7 years for financial records)
• You can request deletion at any time (subject to legal obligations)`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the right to:
• Access your personal data
• Correct inaccurate data
• Request deletion of your data
• Object to processing of your data
• Withdraw your consent at any time
• File a complaint with relevant authorities`
    },
    {
      icon: Shield,
      title: 'Cookies',
      content: `We use cookies to:
• Remember your preferences (language, theme)
• Analyze site usage
• Improve user experience

You can control cookies through your browser settings.`
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 mb-4">
                <Shield className="w-full h-full text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </h1>
              <p className="text-muted-foreground">
                {isArabic ? `آخر تحديث: ${lastUpdated}` : `Last Updated: ${lastUpdated}`}
              </p>
            </div>

            {/* Introduction */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {isArabic
                    ? 'في فالكون كور، نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك عند استخدام موقعنا وخدماتنا.'
                    : 'At Falcon Core, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information when using our website and services.'}
                </p>
              </CardContent>
            </Card>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* GDPR Compliance Note */}
            <Card className="mt-8 border-blue-500/20 bg-blue-500/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  {isArabic ? 'الامتثال للأنظمة الدولية' : 'International Compliance'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isArabic
                    ? 'نلتزم بالمعايير الدولية لحماية البيانات بما في ذلك اللائحة العامة لحماية البيانات (GDPR) للمستخدمين في الاتحاد الأوروبي، ونظام حماية البيانات الشخصية في المملكة العربية السعودية.'
                    : 'We comply with international data protection standards including GDPR for EU users and the Personal Data Protection Law in the Kingdom of Saudi Arabia.'}
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isArabic ? 'مسؤول حماية البيانات' : 'Data Protection Officer'}
                    </h3>
                    <p className="text-muted-foreground">
                      {isArabic
                        ? 'للاستفسارات المتعلقة بالخصوصية، تواصل معنا على:'
                        : 'For privacy-related inquiries, contact us at:'}{' '}
                      <a href="mailto:privacy@fc.sa" className="text-primary hover:underline">
                        privacy@fc.sa
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
