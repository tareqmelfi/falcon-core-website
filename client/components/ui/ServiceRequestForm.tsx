import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRequestFormProps {
  serviceName: string;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ serviceName }) => {
  const { t, dir } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

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
        body: JSON.stringify({
          ...formData,
          service: serviceName
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        toast.success(t('service.request.success'));
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        toast.error(t('service.request.error'));
      }
    } catch (error) {
      toast.error(t('service.request.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-background/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold mb-2">{t('service.request.title')}</h2>
      <p className="text-muted-foreground mb-8">{t('service.request.subtitle')}</p>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">{t('service.request.submitted')}</h3>
          <p className="text-muted-foreground max-w-sm">
            {t('service.request.submitted_desc')}
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('service.request.name')}</label>
              <input
                type="text"
                name="name"
                placeholder={t('service.request.name_placeholder')}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('service.request.email')}</label>
              <input
                type="email"
                name="email"
                placeholder={t('service.request.email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('service.request.phone')}</label>
              <input
                type="tel"
                name="phone"
                placeholder={t('service.request.phone_placeholder')}
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('service.request.company')}</label>
              <input
                type="text"
                name="company"
                placeholder={t('service.request.company_placeholder')}
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('service.request.message')}</label>
            <textarea
              name="message"
              placeholder={t('service.request.message_placeholder')}
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-primary/50 focus:outline-none text-foreground placeholder-muted-foreground resize-none transition-colors"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full rounded-full group"
          >
            {isLoading ? t('service.request.sending') : t('service.request.submit')}
            <Send className={`ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Button>
        </form>
      )}
    </motion.div>
  );
};

export default ServiceRequestForm;
