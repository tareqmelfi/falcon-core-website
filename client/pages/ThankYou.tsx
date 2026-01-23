import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle, Calendar, FileText, Mail, Phone, ArrowRight,
  Clock, Download, ExternalLink, MessageSquare, Building2, Code, Sparkles
} from 'lucide-react';

const productInfo = {
  advisory: {
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    nextSteps: [
      { icon: Calendar, key: 'thankyou.advisory.step1' },
      { icon: FileText, key: 'thankyou.advisory.step2' },
      { icon: Clock, key: 'thankyou.advisory.step3' },
    ],
  },
  formation: {
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
    nextSteps: [
      { icon: FileText, key: 'thankyou.formation.step1' },
      { icon: Clock, key: 'thankyou.formation.step2' },
      { icon: Mail, key: 'thankyou.formation.step3' },
    ],
  },
  website: {
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    nextSteps: [
      { icon: FileText, key: 'thankyou.website.step1' },
      { icon: Calendar, key: 'thankyou.website.step2' },
      { icon: Clock, key: 'thankyou.website.step3' },
    ],
  },
};

const ThankYou = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product') || 'advisory';
  const orderId = searchParams.get('order_id') || 'ORD-2026-XXX';

  const info = productInfo[product as keyof typeof productInfo] || productInfo.advisory;
  const IconComponent = info.icon;

  const [showSparkles, setShowSparkles] = useState(true);

  useEffect(() => {
    // Hide sparkles after animation
    const timer = setTimeout(() => setShowSparkles(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      {/* Celebration Sparkles */}
      <AnimatePresence>
        {showSparkles && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                  y: -50
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0],
                  y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
                  rotate: 360
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className="absolute pointer-events-none"
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${info.color} p-1 relative`}>
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              {/* Pulse ring */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${info.color} opacity-30`}
                animate={{ scale: [1, 1.4, 1.4], opacity: [0.3, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('thankyou.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              {t(`thankyou.${product}.message`)}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {t('thankyou.order_id')}: <span className="font-mono font-medium text-foreground">{orderId}</span>
            </p>
          </motion.div>

          {/* Next Steps Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="text-left mb-8">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  {t('thankyou.next_steps')}
                </h2>
                <div className="space-y-4">
                  {info.nextSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <StepIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{t(`${step.key}_title`)}</p>
                          <p className="text-sm text-muted-foreground">{t(`${step.key}_desc`)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-primary/5 rounded-xl p-6 mb-8"
          >
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{t('thankyou.email_sent')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('thankyou.email_desc')}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg">
              <Link to="/portal">
                {t('thankyou.go_to_portal')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                {t('thankyou.back_home')}
              </Link>
            </Button>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">{t('thankyou.need_help')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:info@fc.sa" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                info@fc.sa
              </a>
              <a href="tel:8001110110" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                8001110110
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
