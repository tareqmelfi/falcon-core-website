import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import PartnersCarousel from '@/components/ui/PartnersCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Bot,
  Cloud,
  Cpu,
  LineChart,
  Megaphone,
  Workflow,
  ArrowRight,
  Building2,
  Rocket
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Index = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const services = [
    {
      id: 'automation',
      icon: <Workflow className="w-10 h-10 text-primary" />,
      title: "services.automation",
      desc: "services.automation.desc"
    },
    {
      id: 'cloud',
      icon: <Cloud className="w-10 h-10 text-primary" />,
      title: "services.cloud",
      desc: "services.cloud.desc"
    },
    {
      id: 'marketing',
      icon: <Megaphone className="w-10 h-10 text-primary" />,
      title: "services.marketing",
      desc: "services.marketing.desc"
    },
    {
      id: 'ai_agents',
      icon: <Bot className="w-10 h-10 text-primary" />,
      title: "services.ai_agents",
      desc: "services.ai_agents.desc"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex justify-end pt-8">
              <Button size="lg" onClick={() => navigate('/services')} className="text-lg px-8 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-105">
                {t('hero.cta_secondary')} <ArrowRight className={`ml-2 w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('value_proposition.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('value_proposition.subtitle')}</p>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-8" />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">
                    <Cpu className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('value_proposition.ai_first')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('value_proposition.ai_first_desc')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">
                    <Rocket className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('value_proposition.rapid_execution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('value_proposition.rapid_execution_desc')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t('value_proposition.local_global')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t('value_proposition.local_global_desc')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('services.title')}</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={item}>
                <Card
                  className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <CardHeader>
                    <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl group-hover:bg-primary/20 transition-colors">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{t(service.title)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {t(service.desc)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                <Building2 className="w-4 h-4" />
                <span>Falcon Core Holdings</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">{t('about.title')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.desc')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.investment')}
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <Rocket className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-bold mb-1">Incubation</h3>
                  <p className="text-sm text-muted-foreground">Accelerating growth for startups</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <LineChart className="w-8 h-8 text-secondary mb-2" />
                  <h3 className="font-bold mb-1">Investment</h3>
                  <p className="text-sm text-muted-foreground">Strategic capital allocation</p>
                </div>
              </div>
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
        </div>
      </section>

      {/* AI Trading Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">{t('trading.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('trading.desc')}
            </p>
            <div className="h-64 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Live Market Analysis</p>
                <div className="flex items-end gap-1 h-20 justify-center">
                  {[40, 60, 45, 70, 50, 80, 65, 90, 75, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-2 bg-primary rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gradient-to-b from-white/10 to-transparent p-8 rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-muted-foreground mb-8">
              {t('contact.desc')}
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto text-lg px-8 rounded-full">
              <a href="mailto:info@fc.sa">
                Get Started
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
