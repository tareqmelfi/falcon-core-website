import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Zap } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface MetricCard {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  status?: 'success' | 'warning' | 'neutral';
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, email } = useAdminAuth();
  const [metrics, setMetrics] = useState<MetricCard[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Initialize metrics
    setMetrics([
      {
        icon: <Eye className="w-8 h-8" />,
        title: 'Total Visitors',
        value: '2,847',
        change: '+12% this week',
        status: 'success'
      },
      {
        icon: <FileText className="w-8 h-8" />,
        title: 'Published Articles',
        value: '5',
        change: 'From Builder.io',
        status: 'success'
      },
      {
        icon: <TrendingUp className="w-8 h-8" />,
        title: 'Page Views',
        value: '8,392',
        change: '+8% from last week',
        status: 'success'
      },
      {
        icon: <Users className="w-8 h-8" />,
        title: 'Active Users',
        value: '142',
        change: 'Currently online',
        status: 'neutral'
      }
    ]);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout onLogout={logout} email={email}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-primary/5 p-6 md:p-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your website today.
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground hidden md:block">
              <p>Last login: Today</p>
              <p>Location: Admin Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  metric.status === 'success' ? 'bg-green-500/10 text-green-400' :
                  metric.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {metric.icon}
                </div>
                {metric.change && (
                  <span className={`text-xs font-semibold ${
                    metric.status === 'success' ? 'text-green-400' :
                    metric.status === 'warning' ? 'text-yellow-400' :
                    'text-muted-foreground'
                  }`}>
                    {metric.change}
                  </span>
                )}
              </div>
              <h3 className="text-muted-foreground text-sm mb-1">{metric.title}</h3>
              <p className="text-3xl font-bold">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-black/10 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm overflow-hidden"
        >
          <div className="border-b border-black/10 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Important Updates
            </h2>
          </div>

          <div className="divide-y divide-black/10">
            {[
              {
                icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                title: 'Articles Published Successfully',
                desc: '5 articles are now live on Builder.io CMS',
                time: '2 hours ago'
              },
              {
                icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                title: 'Free Phone Number Added',
                desc: 'Contact number 800111011 is now active on all pages',
                time: '1 hour ago'
              },
              {
                icon: <Zap className="w-5 h-5 text-blue-400" />,
                title: 'Admin Dashboard Live',
                desc: 'New admin control panel is now accessible',
                time: 'Just now'
              },
              {
                icon: <Clock className="w-5 h-5 text-orange-400" />,
                title: 'Monitoring System Pending',
                desc: 'Performance monitoring will be available soon',
                time: 'Coming next'
              }
            ].map((update, index) => (
              <div key={index} className="p-6 flex gap-4 hover:bg-white/5 transition-colors">
                <div className="flex-shrink-0 mt-1">{update.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{update.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{update.desc}</p>
                  <p className="text-xs text-muted-foreground">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <a
            href="https://builder.io/content"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
          >
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Manage Articles</h3>
            <p className="text-sm text-muted-foreground">Edit articles in Builder.io</p>
          </a>

          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-semibold mb-1">View Analytics</h3>
            <p className="text-sm text-muted-foreground">Google Analytics dashboard</p>
          </a>

          <a
            href="https://builder.io"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
          >
            <AlertCircle className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold mb-1">Builder.io CMS</h3>
            <p className="text-sm text-muted-foreground">Access full CMS panel</p>
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground pt-8 border-t border-white/10"
        >
          <p>
            Welcome to Falcon Core Admin Dashboard. For support, contact{' '}
            <a href="mailto:admin@fc.sa" className="text-primary hover:underline">
              admin@fc.sa
            </a>
          </p>
          <p className="mt-2">© 2024 Falcon Core Holdings. All rights reserved.</p>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
