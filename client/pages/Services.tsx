import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Workflow, Cloud, Megaphone, Bot, ArrowRight, Zap, Globe, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const iconMap = {
    automation: <Workflow className="w-8 h-8 text-primary" />,
    cloud: <Cloud className="w-8 h-8 text-primary" />,
    marketing: <Megaphone className="w-8 h-8 text-primary" />,
    ai_agents: <Bot className="w-8 h-8 text-primary" />,
    rapid_product_dev: <Zap className="w-8 h-8 text-primary" />,
    market_entry: <Globe className="w-8 h-8 text-primary" />,
    ecommerce: <ShoppingCart className="w-8 h-8 text-primary" />
  };

  const services: Array<{
    id: string;
    icon: keyof typeof iconMap;
    title: string;
    desc: string;
    features: string[];
  }> = [
    {
      id: 'automation',
      icon: 'automation',
      title: "services.automation",
      desc: "services.automation.desc",
      features: ["Workflow Automation", "Process Optimization", "Integration Services"]
    },
    {
      id: 'cloud',
      icon: 'cloud',
      title: "services.cloud",
      desc: "services.cloud.desc",
      features: ["Infrastructure as a Service", "Data Management", "Disaster Recovery"]
    },
    {
      id: 'marketing',
      icon: 'marketing',
      title: "services.marketing",
      desc: "services.marketing.desc",
      features: ["SEO & SEM", "Content Strategy", "Analytics & Reporting"]
    },
    {
      id: 'ai_agents',
      icon: 'ai_agents',
      title: "services.ai_agents",
      desc: "services.ai_agents.desc",
      features: ["Custom AI Training", "Multi-channel Integration", "24/7 Availability"]
    },
    {
      id: 'rapid_product_dev',
      icon: 'rapid_product_dev',
      title: "services.rapid_product_dev",
      desc: "services.rapid_product_dev.desc",
      features: ["MVP Development", "UI/UX Design", "Rapid Launch"]
    },
    {
      id: 'market_entry',
      icon: 'market_entry',
      title: "services.market_entry",
      desc: "services.market_entry.desc",
      features: ["MISA Licensing", "Legal Setup", "Government Approvals"]
    },
    {
      id: 'ecommerce',
      icon: 'ecommerce',
      title: "services.ecommerce",
      desc: "services.ecommerce.desc",
      features: ["Payment Integration", "Shipping Setup", "Full Automation"]
    }
  ];

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 flex items-center justify-center px-4">
        <div className="container mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              {t('services.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive solutions tailored to your business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={item}>
                <Card className="bg-background/40 backdrop-blur-md border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <CardHeader className="pb-4">
                    <div className="mb-4 p-3 bg-primary/20 w-fit rounded-lg group-hover:bg-primary/30 transition-colors">
                      {iconMap[service.icon]}
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{t(service.title)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {t(service.desc)}
                    </CardDescription>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('service.key_features')}</h4>
                      <ul className="space-y-1.5">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full mt-4 rounded-full group/btn bg-primary hover:bg-primary/90 h-9 text-sm">
                      {t('service.view_details')}
                      <ArrowRight className={`ml-2 w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-background/40 backdrop-blur-md p-8 rounded-2xl border border-white/10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('service.cta_title')}</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              {t('service.cta_desc')}
            </p>
            <Button className="px-8 h-10 rounded-full text-sm">
              {t('service.cta_button')}
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
