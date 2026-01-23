import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  User, Mail, Phone, Package, Clock, CheckCircle, AlertCircle,
  MessageSquare, FileText, Download, ExternalLink, Lock,
  ArrowRight, Loader2, Building2, Globe, MailCheck, ShoppingBag
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

// Types
interface OrderStep {
  name: string;
  nameAr?: string;
  status: 'pending' | 'in_progress' | 'completed';
  date: string | null;
}

interface Document {
  name: string;
  size: string;
  date: string;
  url?: string;
}

interface Message {
  from: string;
  message: string;
  date: string;
  isTeam: boolean;
}

interface Order {
  id: string;
  email: string;
  product: string;
  productCode: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  date: string;
  amount: number;
  customerName?: string;
  steps: OrderStep[];
  documents?: Document[];
  messages?: Message[];
}

interface PortalStats {
  activeOrders: number;
  completedOrders: number;
  totalDocuments: number;
}

const Portal = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('');
  const [orderLookup, setOrderLookup] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');

  // UI states
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyingToken, setVerifyingToken] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<PortalStats>({ activeOrders: 0, completedOrders: 0, totalDocuments: 0 });
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('portal_session_token');
    const storedEmail = localStorage.getItem('portal_email');

    if (storedToken && storedEmail) {
      validateSession(storedToken, storedEmail);
    }
  }, []);

  // Check for magic link token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !isLoggedIn && !verifyingToken) {
      verifyMagicLink(token);
    }
  }, [searchParams]);

  // Validate existing session
  const validateSession = async (token: string, email: string) => {
    try {
      const response = await fetch('/.netlify/functions/portal-auth/validate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token })
      });

      const data = await response.json();

      if (data.success && data.valid) {
        setSessionToken(token);
        setUserEmail(email);
        setIsLoggedIn(true);
        fetchOrders(email, token);
      } else {
        // Session expired, clear storage
        localStorage.removeItem('portal_session_token');
        localStorage.removeItem('portal_email');
      }
    } catch (err) {
      console.error('Session validation error:', err);
      localStorage.removeItem('portal_session_token');
      localStorage.removeItem('portal_email');
    }
  };

  // Verify magic link token
  const verifyMagicLink = async (token: string) => {
    setVerifyingToken(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/portal-auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.success) {
        // Store session
        localStorage.setItem('portal_session_token', data.sessionToken);
        localStorage.setItem('portal_email', data.email);

        setSessionToken(data.sessionToken);
        setUserEmail(data.email);
        setIsLoggedIn(true);

        // Clear token from URL
        window.history.replaceState({}, document.title, '/portal');

        // Fetch orders
        fetchOrders(data.email, data.sessionToken);
      } else {
        setError(data.error || (language === 'ar' ? 'رابط غير صالح أو منتهي الصلاحية' : 'Invalid or expired link'));
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setVerifyingToken(false);
    }
  };

  // Fetch customer orders
  const fetchOrders = async (email: string, token: string) => {
    try {
      const response = await fetch(`/.netlify/functions/portal-data/orders?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
        setStats(data.stats || { activeOrders: 0, completedOrders: 0, totalDocuments: 0 });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Request magic link
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/portal-auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language })
      });

      const data = await response.json();

      if (data.success) {
        setLinkSent(true);
      } else {
        setError(data.error || (language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.'));
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Order lookup also requests magic link
  const handleOrderLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/portal-auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: lookupEmail, orderId: orderLookup, language })
      });

      const data = await response.json();

      if (data.success) {
        setLinkSent(true);
      } else {
        setError(data.error || (language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.'));
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await fetch('/.netlify/functions/portal-auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    localStorage.removeItem('portal_session_token');
    localStorage.removeItem('portal_email');
    setSessionToken(null);
    setUserEmail('');
    setIsLoggedIn(false);
    setOrders([]);
    setStats({ activeOrders: 0, completedOrders: 0, totalDocuments: 0 });
    setLinkSent(false);
  };

  // Send message
  const handleSendMessage = async (orderId?: string) => {
    if (!messageText.trim() || !sessionToken) return;

    setSendingMessage(true);

    try {
      const response = await fetch('/.netlify/functions/portal-data/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          email: userEmail,
          orderId,
          message: messageText
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessageText('');
        // Show success feedback
        alert(language === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message sent successfully');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Verifying token screen
  if (verifyingToken) {
    return (
      <Layout>
        <div className="min-h-screen py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg">{language === 'ar' ? 'جاري التحقق من الرابط...' : 'Verifying your link...'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Link sent confirmation screen
  if (linkSent && !isLoggedIn) {
    return (
      <Layout>
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <MailCheck className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">
                {language === 'ar' ? 'تم إرسال رابط الدخول!' : 'Access Link Sent!'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {language === 'ar'
                  ? `تم إرسال رابط الدخول إلى ${email || lookupEmail}. يرجى التحقق من بريدك الإلكتروني والنقر على الرابط للدخول.`
                  : `We've sent an access link to ${email || lookupEmail}. Please check your email and click the link to access your portal.`
                }
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                {language === 'ar'
                  ? 'الرابط صالح لمدة 15 دقيقة فقط.'
                  : 'The link is valid for 15 minutes only.'
                }
              </p>
              <div className="space-y-4">
                <Button variant="outline" onClick={() => setLinkSent(false)} className="w-full">
                  {language === 'ar' ? 'حاول بريد إلكتروني آخر' : 'Try a different email'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar'
                    ? 'لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها.'
                    : "Didn't receive the email? Check your spam folder."
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Login/Lookup Screen
  if (!isLoggedIn) {
    return (
      <Layout>
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

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

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
                          value={lookupEmail}
                          onChange={(e) => setLookupEmail(e.target.value)}
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
      </Layout>
    );
  }

  // Dashboard Screen
  return (
    <Layout>
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
              <p className="text-muted-foreground">
                {t('portal.welcome_back')} • {userEmail}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
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
                    <p className="text-2xl font-bold">{stats.activeOrders}</p>
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
                    <p className="text-2xl font-bold">{stats.completedOrders}</p>
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
                    <p className="text-2xl font-bold">{stats.totalDocuments}</p>
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
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'ar'
                        ? 'لم نجد أي طلبات مرتبطة بهذا البريد الإلكتروني.'
                        : 'We couldn\'t find any orders associated with this email.'
                      }
                    </p>
                    <Button asChild>
                      <Link to="/store">
                        {language === 'ar' ? 'تصفح خدماتنا' : 'Browse Our Services'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
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
                              {language === 'ar' && step.nameAr ? step.nameAr : step.name}
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
                ))
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>{t('portal.your_documents')}</CardTitle>
                  <CardDescription>{t('portal.documents_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.flatMap(o => o.documents || []).length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'ar' ? 'لا توجد مستندات متاحة بعد' : 'No documents available yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.flatMap(o => o.documents || []).map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-card/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-red-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size} • {doc.date}</p>
                            </div>
                          </div>
                          {doc.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
                    {orders.flatMap(o => o.messages || []).length === 0 ? (
                      <div className="py-4 text-center text-muted-foreground">
                        {language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}
                      </div>
                    ) : (
                      orders.flatMap(o => o.messages || []).map((msg, index) => (
                        <div key={index} className={`p-4 rounded-lg ${msg.isTeam ? 'bg-primary/5 border border-primary/20' : 'bg-card border'}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isTeam ? 'bg-primary/20' : 'bg-muted'}`}>
                              <User className={`w-5 h-5 ${msg.isTeam ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{msg.from}</span>
                                <span className="text-xs text-muted-foreground">{msg.date}</span>
                              </div>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {/* Reply Form */}
                    <div className="pt-4 border-t border-border/50">
                      <Label htmlFor="reply" className="mb-2 block">{t('portal.send_message')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="reply"
                          placeholder={t('portal.message_placeholder')}
                          className="flex-grow"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                        />
                        <Button onClick={() => handleSendMessage(orders[0]?.id)} disabled={sendingMessage || !messageText.trim()}>
                          {sendingMessage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {t('portal.send')}
                            </>
                          )}
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
    </Layout>
  );
};

export default Portal;
