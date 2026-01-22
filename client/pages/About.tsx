import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Building2, Rocket, LineChart, Globe, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const { t, dir } = useLanguage();

  const stats = [
    { icon: Building2, label: "Subsidiaries", value: "10+" },
    { icon: Users, label: "Team Members", value: "50+" },
    { icon: Globe, label: "Global Presence", value: "5+ Countries" },
    { icon: Zap, label: "Active Projects", value: "20+" }
  ];

  const values = [
    {
      icon: Rocket,
      titleKey: "about.values_innovation",
      descKey: "about.values_innovation_desc"
    },
    {
      icon: LineChart,
      titleKey: "about.values_growth",
      descKey: "about.values_growth_desc"
    },
    {
      icon: Users,
      titleKey: "about.values_partnership",
      descKey: "about.values_partnership_desc"
    },
    {
      icon: Globe,
      titleKey: "about.values_global",
      descKey: "about.values_global_desc"
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
              {t('about.hero_title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              How challenges shaped our mission to empower entrepreneurs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Narrative Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                <Building2 className="w-4 h-4" />
                <span>{t('about.company_badge')}</span>
              </div>

              <div className="space-y-6">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {t('about.narrative_intro')}
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.narrative_main')}
                </p>

                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {t('about.narrative_falcon')}
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.narrative_mission')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy & Co-Venture Model */}
      <section className="py-24 relative bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">{t('about.philosophy')}</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('about.philosophy_desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-md">
                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-primary">Co-Venture Model Benefits</p>
                    <ul className="text-muted-foreground space-y-2">
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Advanced services at cost price</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Equity stake for promising companies</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>Aligned success incentives</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>We only succeed when you succeed</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('about.journey_title')}</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { company: t('about.phase1'), desc: t('about.phase1_desc'), icon: Building2 },
                { company: t('about.phase2'), desc: t('about.phase2_desc'), icon: LineChart },
                { company: t('about.falcon_core'), desc: t('about.falcon_core_desc'), icon: Rocket }
              ].map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      {index < 2 && <div className="w-1 h-12 bg-primary/30 mt-4" />}
                    </div>
                    <div className="pt-2 pb-8">
                      <h3 className="text-2xl font-bold mb-2">{milestone.company}</h3>
                      <p className="text-muted-foreground text-lg">{milestone.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 relative bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold">{t('about.title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.desc')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.investment')}
              </p>
              <Button size="lg" className="rounded-full">
                Explore Our Ecosystem
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl absolute inset-0 animate-pulse" />
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-md p-6 flex flex-col justify-end">
                    <span className="text-4xl font-bold text-primary">10+</span>
                    <span className="text-sm text-muted-foreground">Subsidiaries</span>
                  </div>
                  <div className="h-56 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20 backdrop-blur-md p-6 flex flex-col justify-end">
                    <span className="text-4xl font-bold text-secondary">Global</span>
                    <span className="text-sm text-secondary/70">Presence</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-56 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-md p-6 flex flex-col justify-end">
                    <span className="text-4xl font-bold text-primary">AI</span>
                    <span className="text-sm text-muted-foreground">Driven Solutions</span>
                  </div>
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur-md p-6 flex flex-col justify-end">
                    <span className="text-4xl font-bold text-secondary">24/7</span>
                    <span className="text-sm text-muted-foreground">Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-md hover:border-primary/50 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('about.values_title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape our culture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-all duration-300 group"
                >
                  <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-3">{t(value.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(value.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default About;
