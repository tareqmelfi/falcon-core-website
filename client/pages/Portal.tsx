import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Phone, Package, Clock, CheckCircle, AlertCircle,
  MessageSquare, FileText, Download, ExternalLink, Lock,
  ArrowRight, Loader2, Building2, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock order data (would come from database/API in production)
const mockOrders = [
  {
    id: 'ORD-2026-001',
    product: 'US LLC Formation Package',
    productCode: 'FC-FORM-001',
    status: 'in_progress',
    progress: 60,
    date: '2026-01-20',
    amount: 1200,
    steps: [
      { name: 'Order Received', status: 'completed', date: '2026-01-20' },
      { name: 'Intake Form Completed', status: 'completed', date: '2026-01-21' },
      { name: 'Articles Filed with Wyoming', status: 'completed', date: '2026-01-22' },
      { name: 'EIN Application', status: 'in_progress', date: null },
      { name: 'Documents Delivered', status: 'pending', date: null },
    ],
  },
];

const Portal = () => {
  const { t, language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [orderLookup, setOrderLookup] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsLoggedIn(true);
  };

  const handleOrderLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsLoggedIn(true);
  };

  // Login/Lookup Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-4 mb-4">
                <Lock className="w-full h-full text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{t('portal.title')}</h1>
              <p className="text-muted-foreground">{t('portal.subtitle')}</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="email">{t('portal.login_email')}</TabsTrigger>
                    <TabsTrigger value="order">{t('portal.login_order')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('portal.email_label')}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('portal.email_placeholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('portal.email_note')}
                      </p>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('portal.sending')}
                          </>
                        ) : (
                          <>
                            {t('portal.send_link')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="order">
                    <form onSubmit={handleOrderLookup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="order">{t('portal.order_label')}</Label>
                        <Input
                          id="order"
                          type="text"
                          placeholder="ORD-2026-001"
                          value={orderLookup}
                          onChange={(e) => setOrderLookup(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lookup-email">{t('portal.email_label')}</Label>
                        <Input
                          id="lookup-email"
                          type="email"
                          placeholder={t('portal.email_placeholder')}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('portal.looking_up')}
                          </>
                        ) : (
                          <>
                            {t('portal.lookup_order')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t('portal.no_order')}
              </p>
              <Button asChild variant="outline">
                <Link to="/store">
                  {t('portal.browse_store')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('portal.dashboard')}</h1>
              <p className="text-muted-foreground">{t('portal.welcome_back')}</p>
            </div>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              {t('portal.logout')}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">{t('portal.active_orders')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">{t('portal.completed')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">{t('portal.documents')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('portal.tab_orders')}
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {t('portal.tab_documents')}
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t('portal.tab_messages')}
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          {order.product}
                        </CardTitle>
                        <CardDescription>
                          {t('portal.order_id')}: {order.id} • {t('portal.ordered')}: {order.date}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={order.status === 'completed' ? 'default' : 'secondary'}
                        className={order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : ''}
                      >
                        {order.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {t(`portal.status_${order.status}`)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{t('portal.progress')}</span>
                        <span className="font-medium">{order.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      {order.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                          ) : step.status === 'in_progress' ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />
                          )}
                          <span className={step.status === 'pending' ? 'text-muted-foreground' : ''}>
                            {step.name}
                          </span>
                          {step.date && (
                            <span className="text-xs text-muted-foreground ml-auto">
                              {step.date}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>{t('portal.your_documents')}</CardTitle>
                  <CardDescription>{t('portal.documents_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Articles of Organization.pdf', size: '245 KB', date: '2026-01-22' },
                      { name: 'Operating Agreement.pdf', size: '512 KB', date: '2026-01-22' },
                      { name: 'Banking Roadmap Guide.pdf', size: '1.2 MB', date: '2026-01-20' },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-card/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-red-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size} • {doc.date}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>{t('portal.messages_title')}</CardTitle>
                  <CardDescription>{t('portal.messages_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Falcon Core Team</span>
                            <span className="text-xs text-muted-foreground">2026-01-22</span>
                          </div>
                          <p className="text-sm">{t('portal.sample_message')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reply Form */}
                    <div className="pt-4 border-t border-border/50">
                      <Label htmlFor="reply" className="mb-2 block">{t('portal.send_message')}</Label>
                      <div className="flex gap-2">
                        <Input id="reply" placeholder={t('portal.message_placeholder')} className="flex-grow" />
                        <Button>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t('portal.send')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Need Help */}
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t('portal.need_help')}</h3>
                    <p className="text-sm text-muted-foreground">{t('portal.help_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href="mailto:info@fc.sa">
                      <Mail className="w-4 h-4 mr-2" />
                      info@fc.sa
                    </a>
                  </Button>
                  <Button asChild>
                    <a href="tel:8001110110">
                      <Phone className="w-4 h-4 mr-2" />
                      8001110110
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Portal;
