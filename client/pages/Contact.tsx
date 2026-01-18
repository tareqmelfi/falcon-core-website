import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const { t, dir } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: t('contact.headquarters_value')
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: "info@falconcore.us"
    },
    {
      icon: Phone,
      label: t('contact.phone_label'),
      value: t('contact.phone_number'),
      isPhone: true
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        toast.success('Message sent successfully!');
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('contact.desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">{t('contact.info')}</h2>
                <p className="text-muted-foreground">
                  {t('contact.info_desc')}
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info: any, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md hover:border-primary/50 transition-all duration-300"
                    >
                      <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">{info.label}</h3>
                        {info.isPhone ? (
                          <a href={`tel:${info.value}`} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-black/10">
                <h3 className="font-bold mb-4">{t('contact.company')}</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong>{t('contact.company_name')}:</strong> {t('contact.company_name_value')}</p>
                  <p><strong>{t('contact.headquarters')}:</strong> {t('contact.headquarters_value')}</p>
                  <p><strong>{t('contact.business_type')}:</strong> {t('contact.business_type_value')}</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md"
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <CheckCircle className="w-16 h-16 text-primary mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{t('contact.thank_you')}</h3>
                  <p className="text-muted-foreground text-center">
                    {t('contact.success')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.name_placeholder')}
                      required
                      className="bg-primary/5 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.email_placeholder')}
                      required
                      className="bg-primary/5 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.phone')}</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contact.phone_placeholder')}
                      className="bg-primary/5 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('contact.subject_placeholder')}
                      required
                      className="bg-primary/5 border-primary/20 focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.message_placeholder')}
                      rows={5}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full group"
                    size="lg"
                  >
                    {isLoading ? t('contact.sending') : t('contact.send')}
                    <Send className={`ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
