import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, Shield, AlertTriangle, CreditCard, Globe, Mail } from 'lucide-react';

const Terms = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const lastUpdated = '2026-01-23';

  const sections = isArabic ? [
    {
      icon: Scale,
      title: 'القبول بالشروط',
      content: `باستخدامك لموقع فالكون كور (fc.sa / falconcore.us) وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.`
    },
    {
      icon: Globe,
      title: 'وصف الخدمات',
      content: `تقدم فالكون كور الخدمات التالية:
• جلسات استشارية للأعمال والتقنية
• تأسيس شركات ذات مسؤولية محدودة (LLC) في الولايات المتحدة
• تطوير المواقع الإلكترونية والتطبيقات
• خدمات الأتمتة والتحول الرقمي

جميع الخدمات تخضع للتوفر وقد تتغير الأسعار دون إشعار مسبق.`
    },
    {
      icon: CreditCard,
      title: 'الدفع والاسترداد',
      content: `• جميع المدفوعات تتم عبر Stripe بشكل آمن
• الأسعار معروضة بالدولار الأمريكي
• بمجرد بدء العمل على الطلب، لا يمكن استرداد المبلغ
• للجلسات الاستشارية: يمكن إعادة الجدولة قبل 24 ساعة
• لتأسيس الشركات: لا استرداد بعد تقديم الطلب للجهات الحكومية
• للمواقع: استرداد 50% إذا تم الإلغاء قبل بدء التصميم`
    },
    {
      icon: Shield,
      title: 'حقوق الملكية الفكرية',
      content: `• جميع المحتويات على الموقع مملوكة لفالكون كور
• يُمنع نسخ أو إعادة إنتاج أي محتوى دون إذن كتابي
• بالنسبة للمواقع المطورة: يحتفظ العميل بملكية المحتوى الذي يقدمه
• الكود والتصاميم المخصصة تصبح ملكاً للعميل بعد السداد الكامل`
    },
    {
      icon: AlertTriangle,
      title: 'إخلاء المسؤولية',
      content: `• نقدم خدماتنا "كما هي" دون أي ضمانات صريحة أو ضمنية
• لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام خدماتنا
• نحن لسنا مستشارين قانونيين أو ضريبيين - يرجى استشارة متخصصين
• لا نضمن نتائج محددة لأي خدمة`
    },
    {
      icon: FileText,
      title: 'القانون الحاكم',
      content: `تخضع هذه الشروط لقوانين المملكة العربية السعودية. أي نزاع ينشأ عن هذه الشروط يخضع للاختصاص الحصري للمحاكم السعودية.`
    }
  ] : [
    {
      icon: Scale,
      title: 'Acceptance of Terms',
      content: `By using Falcon Core website (fc.sa / falconcore.us) and our services, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use our services.`
    },
    {
      icon: Globe,
      title: 'Description of Services',
      content: `Falcon Core provides the following services:
• Business and technology advisory sessions
• US LLC formation services
• Website and application development
• Automation and digital transformation services

All services are subject to availability and prices may change without prior notice.`
    },
    {
      icon: CreditCard,
      title: 'Payment and Refunds',
      content: `• All payments are processed securely via Stripe
• Prices are displayed in US Dollars (USD)
• Once work begins on an order, refunds are not available
• Advisory sessions: Can be rescheduled 24 hours in advance
• LLC Formation: No refunds after filing with government agencies
• Websites: 50% refund if cancelled before design begins`
    },
    {
      icon: Shield,
      title: 'Intellectual Property Rights',
      content: `• All content on the website is owned by Falcon Core
• Copying or reproducing any content without written permission is prohibited
• For developed websites: Client retains ownership of content they provide
• Custom code and designs become client property after full payment`
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimer of Warranties',
      content: `• We provide our services "as is" without any express or implied warranties
• We are not liable for any direct or indirect damages resulting from use of our services
• We are not legal or tax advisors - please consult specialists
• We do not guarantee specific results for any service`
    },
    {
      icon: FileText,
      title: 'Governing Law',
      content: `These terms are governed by the laws of the Kingdom of Saudi Arabia. Any dispute arising from these terms is subject to the exclusive jurisdiction of Saudi courts.`
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
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-4 mb-4">
                <Scale className="w-full h-full text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
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
                    ? 'مرحباً بك في فالكون كور. يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا. هذه الشروط تحكم علاقتك معنا وتحدد حقوقك والتزاماتك.'
                    : 'Welcome to Falcon Core. Please read these Terms and Conditions carefully before using our services. These terms govern your relationship with us and define your rights and obligations.'}
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

            {/* Contact */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {isArabic ? 'للاستفسارات' : 'Questions?'}
                    </h3>
                    <p className="text-muted-foreground">
                      {isArabic
                        ? 'إذا كان لديك أي أسئلة حول هذه الشروط، تواصل معنا على:'
                        : 'If you have any questions about these terms, contact us at:'}{' '}
                      <a href="mailto:legal@fc.sa" className="text-primary hover:underline">
                        legal@fc.sa
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

export default Terms;
