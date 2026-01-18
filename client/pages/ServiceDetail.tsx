import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import ServiceRequestForm from '@/components/ui/ServiceRequestForm';
import ServiceWorkflow from '@/components/ui/ServiceWorkflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle } from 'lucide-react';

interface WorkflowStep {
  title: string;
  description: string;
}

interface ServiceData {
  id: string;
  titleKey: string;
  descKey: string;
  longDescKey: string;
  icon: React.ReactNode;
  features: string[];
  benefits: string[];
  workflow?: WorkflowStep[];
  targetAudience?: string[];
}

const serviceMap: Record<string, ServiceData> = {
  automation: {
    id: 'automation',
    titleKey: 'services.automation',
    descKey: 'services.automation.desc',
    longDescKey: 'services.automation.long_desc',
    icon: '⚙️',
    features: ['services.automation.feature1', 'services.automation.feature2', 'services.automation.feature3', 'services.automation.feature4'],
    benefits: ['services.automation.benefit1', 'services.automation.benefit2', 'services.automation.benefit3'],
    workflow: [
      { title: 'Audit & Analysis', description: 'Identify processes suitable for automation and define requirements' },
      { title: 'Solution Design', description: 'Select tools and design workflow integration architecture' },
      { title: 'Implementation & Testing', description: 'Build automation and conduct user acceptance testing' },
      { title: 'Launch & Optimize', description: 'Deploy and continuously monitor and improve automation' }
    ],
    targetAudience: ['E-commerce stores', 'Marketing agencies', 'Service companies']
  },
  cloud: {
    id: 'cloud',
    titleKey: 'services.cloud',
    descKey: 'services.cloud.desc',
    longDescKey: 'services.cloud.long_desc',
    icon: '☁️',
    features: ['services.cloud.feature1', 'services.cloud.feature2', 'services.cloud.feature3', 'services.cloud.feature4'],
    benefits: ['services.cloud.benefit1', 'services.cloud.benefit2', 'services.cloud.benefit3'],
    workflow: [
      { title: 'Assessment', description: 'Evaluate current infrastructure and cloud needs' },
      { title: 'Architecture Design', description: 'Design scalable and secure cloud infrastructure' },
      { title: 'Migration', description: 'Migrate data and systems to cloud infrastructure' },
      { title: 'Management', description: 'Provide ongoing management, monitoring, and optimization' }
    ],
    targetAudience: ['Enterprise companies', 'Growing businesses', 'Digital-first organizations']
  },
  marketing: {
    id: 'marketing',
    titleKey: 'services.marketing',
    descKey: 'services.marketing.desc',
    longDescKey: 'services.marketing.long_desc',
    icon: '📢',
    features: ['services.marketing.feature1', 'services.marketing.feature2', 'services.marketing.feature3', 'services.marketing.feature4'],
    benefits: ['services.marketing.benefit1', 'services.marketing.benefit2', 'services.marketing.benefit3'],
    workflow: [
      { title: 'Strategy Audit', description: 'Analyze current marketing efforts and market positioning' },
      { title: 'Strategy Development', description: 'Create comprehensive multi-channel marketing strategy' },
      { title: 'Implementation', description: 'Execute campaigns across SEO, SEM, content, and social channels' },
      { title: 'Analytics & Reporting', description: 'Monitor performance and optimize campaigns continuously' }
    ],
    targetAudience: ['SaaS companies', 'B2B enterprises', 'E-commerce businesses']
  },
  ai_agents: {
    id: 'ai_agents',
    titleKey: 'services.ai_agents',
    descKey: 'services.ai_agents.desc',
    longDescKey: 'services.ai_agents.long_desc',
    icon: '🤖',
    features: ['services.ai_agents.feature1', 'services.ai_agents.feature2', 'services.ai_agents.feature3', 'services.ai_agents.feature4'],
    benefits: ['services.ai_agents.benefit1', 'services.ai_agents.benefit2', 'services.ai_agents.benefit3'],
    workflow: [
      { title: 'Use Case Definition', description: 'Identify customer support, sales, or analysis needs' },
      { title: 'Data Preparation', description: 'Prepare and train custom language models on your data' },
      { title: 'Agent Development', description: 'Develop and customize AI agent personality and capabilities' },
      { title: 'Integration & Deployment', description: 'Connect agents to systems, channels, and deploy live' }
    ],
    targetAudience: ['Customer service teams', 'Sales organizations', 'Data-driven businesses']
  },
  rapid_product_dev: {
    id: 'rapid_product_dev',
    titleKey: 'services.rapid_product_dev',
    descKey: 'services.rapid_product_dev.desc',
    longDescKey: 'services.rapid_product_dev.long_desc',
    icon: '⚡',
    features: ['services.rapid_product_dev.feature1', 'services.rapid_product_dev.feature2', 'services.rapid_product_dev.feature3', 'services.rapid_product_dev.feature4'],
    benefits: ['services.rapid_product_dev.benefit1', 'services.rapid_product_dev.benefit2', 'services.rapid_product_dev.benefit3'],
    workflow: [
      { title: 'Scope Workshop', description: 'Define MVP scope and validate core features' },
      { title: 'Design & Wireframing', description: 'Create wireframes and visual designs in Figma' },
      { title: 'Rapid Development', description: 'Build MVP using no-code and low-code platforms' },
      { title: 'Testing & Launch', description: 'User testing, feedback integration, and market launch' }
    ],
    targetAudience: ['Startups', 'Entrepreneurs', 'Companies launching new products']
  },
  market_entry: {
    id: 'market_entry',
    titleKey: 'services.market_entry',
    descKey: 'services.market_entry.desc',
    longDescKey: 'services.market_entry.long_desc',
    icon: '🌍',
    features: ['services.market_entry.feature1', 'services.market_entry.feature2', 'services.market_entry.feature3', 'services.market_entry.feature4'],
    benefits: ['services.market_entry.benefit1', 'services.market_entry.benefit2', 'services.market_entry.benefit3'],
    workflow: [
      { title: 'Feasibility Assessment', description: 'Evaluate business model fit for Saudi market' },
      { title: 'Market Entry Planning', description: 'Prepare documentation and market entry strategy' },
      { title: 'Licensing (MISA)', description: 'Apply and obtain investment license from MISA' },
      { title: 'Legal & Operational Setup', description: 'Complete registration, banking, and operational setup' }
    ],
    targetAudience: ['International tech companies', 'Foreign entrepreneurs', 'Venture investors']
  },
  ecommerce: {
    id: 'ecommerce',
    titleKey: 'services.ecommerce',
    descKey: 'services.ecommerce.desc',
    longDescKey: 'services.ecommerce.long_desc',
    icon: '🛒',
    features: ['services.ecommerce.feature1', 'services.ecommerce.feature2', 'services.ecommerce.feature3', 'services.ecommerce.feature4'],
    benefits: ['services.ecommerce.benefit1', 'services.ecommerce.benefit2', 'services.ecommerce.benefit3'],
    workflow: [
      { title: 'Discovery & Planning', description: 'Understand product range, target market, and requirements' },
      { title: 'Store Setup & Design', description: 'Create professional store design and product catalog' },
      { title: 'Integration & Automation', description: 'Connect payments, shipping, inventory, and order automation' },
      { title: 'Launch & Optimization', description: 'Go live, gather customer feedback, and optimize continuously' }
    ],
    targetAudience: ['Retailers', 'Brands', 'Small business owners']
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t, dir } = useLanguage();

  const service = serviceId && serviceMap[serviceId];

  if (!service) {
    return (
      <Layout>
        <section className="min-h-[50vh] flex items-center justify-center px-4 pt-20">
          <div className="text-center z-10">
            <h1 className="text-3xl font-bold mb-4">Service not found</h1>
            <Button asChild>
              <Link to="/services">Back to Services</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <section className="relative pt-20 pb-6 px-4">
        <div className="container mx-auto z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group">
            <ChevronLeft className={`w-5 h-5 group-hover:${dir === 'rtl' ? 'translate-x-1' : '-translate-x-1'} transition-transform`} />
            {t('service.back')}
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 pb-20">
        <div className="container mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="text-6xl">{service.icon}</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              {t(service.titleKey)}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t(service.descKey)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-12"
          >
            {/* Long Description */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('service.overview')}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t(service.longDescKey)}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t('service.features')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {service.features.map((featureKey, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-lg font-medium">{t(featureKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold mb-8">{t('service.benefits')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {service.benefits.map((benefitKey, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-background/40 backdrop-blur-sm border-white/10 h-full">
                      <CardContent className="pt-6">
                        <p className="text-center font-medium text-lg">{t(benefitKey)}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Workflow Section */}
            {service.workflow && service.workflow.length > 0 && (
              <div className="border-t border-black/10 pt-12">
                <ServiceWorkflow steps={service.workflow} title={t('service.workflow')} />
              </div>
            )}

            {/* Target Audience Section */}
            {service.targetAudience && service.targetAudience.length > 0 && (
              <div className="border-t border-black/10 pt-12">
                <h2 className="text-3xl font-bold mb-8">{t('service.target_audience')}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {service.targetAudience.map((audience, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-background/40 backdrop-blur-sm border-white/10 hover:border-primary/30 transition-all h-full">
                        <CardContent className="pt-6">
                          <p className="text-center font-medium text-lg">{audience}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Request Service Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <ServiceRequestForm serviceName={t(service.titleKey)} />
          </motion.div>
        </div>
      </section>

      {/* Related Services Section */}
      <section className="py-24 relative border-t border-black/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t('service.related')}</h2>
            <p className="text-muted-foreground">{t('service.related_desc')}</p>
          </motion.div>

          <div className="flex justify-center gap-4 flex-wrap">
            {Object.values(serviceMap)
              .filter((s) => s.id !== service.id)
              .map((relatedService) => (
                <Button
                  key={relatedService.id}
                  variant="outline"
                  asChild
                  className="rounded-full"
                >
                  <Link to={`/services/${relatedService.id}`}>
                    {t(relatedService.titleKey)}
                  </Link>
                </Button>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
