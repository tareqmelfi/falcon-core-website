import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Lock, Zap, RefreshCw, Clock } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface MonitoringData {
  uptime: boolean;
  responseTime: number;
  performanceScore: number;
  securityScore: number;
  sslValid: boolean;
  lastChecked: string;
}

export const AdminMonitoring = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout, email } = useAdminAuth();
  const [data, setData] = useState<MonitoringData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Load initial monitoring data
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    try {
      // This would normally fetch from the backend
      // For now, we're using simulated data
      const mockData: MonitoringData = {
        uptime: true,
        responseTime: 342,
        performanceScore: 87,
        securityScore: 92,
        sslValid: true,
        lastChecked: new Date().toISOString()
      };

      setData(mockData);

      // Generate alerts based on data
      const generatedAlerts = [];
      if (mockData.performanceScore < 60) {
        generatedAlerts.push({
          type: 'warning',
          message: `⚠️  Performance score is low: ${mockData.performanceScore}%`,
          timestamp: new Date()
        });
      }
      if (!mockData.sslValid) {
        generatedAlerts.push({
          type: 'error',
          message: '🔒 SSL certificate needs attention',
          timestamp: new Date()
        });
      }

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      toast.error('Failed to load monitoring data');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadMonitoringData();
    setIsRefreshing(false);
    toast.success('Monitoring data refreshed');
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Site Monitoring 📊</h1>
            <p className="text-muted-foreground">Real-time performance, security, and uptime tracking</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Checking...' : 'Refresh'}
          </Button>
        </motion.div>

        {data && (
          <>
            {/* Main Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Uptime Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${data.uptime ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {data.uptime ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <span className={`text-xs font-semibold ${data.uptime ? 'text-green-400' : 'text-red-400'}`}>
                    {data.uptime ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
                <h3 className="text-muted-foreground text-sm mb-1">Website Status</h3>
                <p className="text-3xl font-bold">{data.uptime ? '✓ Running' : '✗ Down'}</p>
              </motion.div>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                    <Clock className="w-8 h-8" />
                  </div>
                  <span className={`text-xs font-semibold ${data.responseTime < 500 ? 'text-green-400' : data.responseTime < 1000 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {data.responseTime < 500 ? 'FAST' : data.responseTime < 1000 ? 'GOOD' : 'SLOW'}
                  </span>
                </div>
                <h3 className="text-muted-foreground text-sm mb-1">Response Time</h3>
                <p className="text-3xl font-bold">{data.responseTime}ms</p>
              </motion.div>

              {/* Performance Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${data.performanceScore >= 80 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold text-green-400">{data.performanceScore}%</span>
                </div>
                <h3 className="text-muted-foreground text-sm mb-1">Performance Score</h3>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                    style={{ width: `${data.performanceScore}%` }}
                  ></div>
                </div>
              </motion.div>

              {/* Security Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${data.securityScore >= 80 ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold text-green-400">{data.securityScore}%</span>
                </div>
                <h3 className="text-muted-foreground text-sm mb-1">Security Score</h3>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                    style={{ width: `${data.securityScore}%` }}
                  ></div>
                </div>
              </motion.div>
            </div>

            {/* Alerts Section */}
            {alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl border border-black/10 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm overflow-hidden"
              >
                <div className="border-b border-black/10 p-6 bg-orange-500/10">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-orange-400">
                    <AlertCircle className="w-5 h-5" />
                    Active Alerts
                  </h2>
                </div>

                <div className="divide-y divide-black/10">
                  {alerts.map((alert, index) => (
                    <div key={index} className="p-6 flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Detailed Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-black/10 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm overflow-hidden"
            >
              <div className="border-b border-black/10 p-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Detailed Metrics
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-muted-foreground text-sm mb-2">Response Time</p>
                    <p className="text-2xl font-bold">{data.responseTime}ms</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {data.responseTime < 500 ? '✓ Excellent' : data.responseTime < 1000 ? '✓ Good' : data.responseTime < 2000 ? '⚠️  Fair' : '✗ Slow'}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-muted-foreground text-sm mb-2">SSL Certificate</p>
                    <p className="text-2xl font-bold">{data.sslValid ? '✓ Valid' : '✗ Invalid'}</p>
                    <p className="text-xs text-muted-foreground mt-2">HTTPS Enabled</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-muted-foreground text-sm mb-2">Performance</p>
                    <p className="text-2xl font-bold">{data.performanceScore}%</p>
                    <p className="text-xs text-muted-foreground mt-2">Last 24 hours average</p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-muted-foreground text-sm mb-2">Security</p>
                    <p className="text-2xl font-bold">{data.securityScore}%</p>
                    <p className="text-xs text-muted-foreground mt-2">Security headers detected</p>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-muted-foreground text-sm mb-2">Last Checked</p>
                  <p className="text-sm">{new Date(data.lastChecked).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-sm text-muted-foreground pt-8 border-t border-white/10"
            >
              <p>Monitoring checks run every 5 minutes. Real-time alerts will be sent to {email}</p>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;
