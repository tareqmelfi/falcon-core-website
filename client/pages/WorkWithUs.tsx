import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const WorkWithUs = () => {
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'freelancer' | 'referral'>('freelancer');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const freelancerSteps = [
    {
      step: 1,
      titleKey: 'work_with_us.freelancer_step1',
      descKey: 'work_with_us.freelancer_step1_desc'
    },
    {
      step: 2,
      titleKey: 'work_with_us.freelancer_step2',
      descKey: 'work_with_us.freelancer_step2_desc'
    },
    {
      step: 3,
      titleKey: 'work_with_us.freelancer_step3',
      descKey: 'work_with_us.freelancer_step3_desc'
    },
    {
      step: 4,
      titleKey: 'work_with_us.freelancer_step4',
      descKey: 'work_with_us.freelancer_step4_desc'
    },
    {
      step: 5,
      titleKey: 'work_with_us.freelancer_step5',
      descKey: 'work_with_us.freelancer_step5_desc'
    }
  ];

  const referralSteps = [
    {
      step: 1,
      titleKey: 'work_with_us.referral_step1',
      descKey: 'work_with_us.referral_step1_desc'
    },
    {
      step: 2,
      titleKey: 'work_with_us.referral_step2',
      descKey: 'work_with_us.referral_step2_desc'
    },
    {
      step: 3,
      titleKey: 'work_with_us.referral_step3',
      descKey: 'work_with_us.referral_step3_desc'
    },
    {
      step: 4,
      titleKey: 'work_with_us.referral_step4',
      descKey: 'work_with_us.referral_step4_desc'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-4 pt-20 pb-10">
        <div className="container mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              {t('work_with_us.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('work_with_us.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Selection */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setActiveTab('freelancer')}
              variant={activeTab === 'freelancer' ? 'default' : 'outline'}
              className="rounded-full px-8 h-12"
              size="lg"
            >
              <Users className="w-5 h-5 mr-2" />
              {t('work_with_us.freelancer_title')}
            </Button>
            <Button
              onClick={() => setActiveTab('referral')}
              variant={activeTab === 'referral' ? 'default' : 'outline'}
              className="rounded-full px-8 h-12"
              size="lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('work_with_us.referral_title')}
            </Button>
          </div>
        </div>
      </section>

      {/* Freelancer Section */}
      {activeTab === 'freelancer' && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('work_with_us.freelancer_title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('work_with_us.freelancer_subtitle')}
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto space-y-8"
            >
              {freelancerSteps.map((stepData, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all">
                    <CardContent className="p-8">
                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border-2 border-primary">
                            <span className="text-lg font-bold text-primary">{stepData.step}</span>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{t(stepData.titleKey)}</h3>
                          <p className="text-muted-foreground">{t(stepData.descKey)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: freelancerSteps.length * 0.2 + 0.3 }}
              className="mt-12 text-center"
            >
              <Button size="lg" className="rounded-full px-8 h-14 text-lg">
                {t('work_with_us.apply_freelancer')}
                <ArrowRight className={`ml-2 w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Referral Section */}
      {activeTab === 'referral' && (
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('work_with_us.referral_title')}</h2>
              <p className="text-lg text-muted-foreground mb-4">
                {t('work_with_us.referral_subtitle')}
              </p>
              <p className="text-lg text-muted-foreground">
                {t('work_with_us.referral_desc')}
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto space-y-8"
            >
              {referralSteps.map((stepData, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all">
                    <CardContent className="p-8">
                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border-2 border-primary">
                            <span className="text-lg font-bold text-primary">{stepData.step}</span>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{t(stepData.titleKey)}</h3>
                          <p className="text-muted-foreground">{t(stepData.descKey)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: referralSteps.length * 0.2 + 0.3 }}
              className="mt-12 text-center"
            >
              <Button size="lg" className="rounded-full px-8 h-14 text-lg">
                {t('work_with_us.apply_referral')}
                <ArrowRight className={`ml-2 w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-24 relative bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Join Falcon Core?</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { title: 'Competitive Rates', desc: 'Best-in-class rates and flexible terms' },
              { title: 'Exciting Projects', desc: 'Work on innovative AI and tech projects' },
              { title: 'Growth Opportunities', desc: 'Grow your network and expertise with us' }
            ].map((benefit, index) => (
              <motion.div key={index} variants={item}>
                <Card className="bg-background/40 backdrop-blur-sm border-black/10 h-full">
                  <CardContent className="pt-8">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-gradient-to-b from-white/10 to-transparent p-8 rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Collaborate?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join our growing network of experts and partners building the future with Falcon Core.
            </p>
            <Button size="lg" className="rounded-full px-8 h-14 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkWithUs;
