import fetch from 'node-fetch';
import https from 'https';

/**
 * Monitoring Metrics Interface
 */
export interface MonitoringMetrics {
  timestamp: Date;
  uptime: boolean;
  responseTime: number;
  performanceScore: number; // 0-100
  securityScore: number; // 0-100
  sslValid: boolean;
  lastChecked: string;
}

/**
 * Monitoring Service for Falcon Core
 * Checks uptime, performance, and security metrics
 */
export class MonitoringService {
  private readonly SITE_URL = 'https://falconcore.us';
  private readonly MONITORING_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private metricsHistory: MonitoringMetrics[] = [];
  private isMonitoring = false;

  /**
   * Start monitoring the website
   */
  async startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🟢 Monitoring service started for Falcon Core');

    // Run first check immediately
    await this.checkMetrics();

    // Then run checks every 5 minutes
    setInterval(async () => {
      await this.checkMetrics();
    }, this.MONITORING_INTERVAL);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
    console.log('🔴 Monitoring service stopped');
  }

  /**
   * Check all metrics
   */
  async checkMetrics(): Promise<MonitoringMetrics> {
    try {
      const [uptime, responseTime, sslValid, performanceScore] = await Promise.all([
        this.checkUptime(),
        this.checkResponseTime(),
        this.checkSSL(),
        this.checkPerformance()
      ]);

      const securityScore = await this.checkSecurity();

      const metrics: MonitoringMetrics = {
        timestamp: new Date(),
        uptime,
        responseTime,
        performanceScore,
        securityScore,
        sslValid,
        lastChecked: new Date().toISOString()
      };

      // Keep only last 1000 records
      this.metricsHistory.push(metrics);
      if (this.metricsHistory.length > 1000) {
        this.metricsHistory.shift();
      }

      // Log alerts if needed
      if (!uptime) {
        console.error('🚨 ALERT: Website is DOWN!');
      }

      if (performanceScore < 60) {
        console.warn('⚠️  WARNING: Performance score is low:', performanceScore);
      }

      return metrics;
    } catch (error) {
      console.error('❌ Error checking metrics:', error);
      return {
        timestamp: new Date(),
        uptime: false,
        responseTime: 0,
        performanceScore: 0,
        securityScore: 0,
        sslValid: false,
        lastChecked: new Date().toISOString()
      };
    }
  }

  /**
   * Check if site is up
   */
  private async checkUptime(): Promise<boolean> {
    try {
      const response = await fetch(this.SITE_URL, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check response time
   */
  private async checkResponseTime(): Promise<number> {
    try {
      const start = Date.now();
      await fetch(this.SITE_URL, {
        method: 'GET',
        timeout: 5000
      });
      const end = Date.now();
      return end - start;
    } catch {
      return 0;
    }
  }

  /**
   * Check SSL certificate validity
   */
  private async checkSSL(): Promise<boolean> {
    try {
      return await new Promise((resolve) => {
        const options = {
          hostname: 'falconcore.us',
          port: 443,
          method: 'HEAD',
          timeout: 5000
        };

        const req = https.request(options, (res) => {
          if (res.socket && res.socket.getPeerCertificate) {
            const cert = res.socket.getPeerCertificate();
            resolve(cert && cert.valid_to && new Date(cert.valid_to) > new Date());
          } else {
            resolve(res.statusCode === 200);
          }
          req.destroy();
        });

        req.on('error', () => {
          resolve(false);
        });

        req.end();
      });
    } catch {
      return false;
    }
  }

  /**
   * Check performance metrics
   * Based on response time
   */
  private async checkPerformance(): Promise<number> {
    try {
      const responseTime = await this.checkResponseTime();

      // Scoring: <500ms = 100, <1000ms = 80, <2000ms = 60, <3000ms = 40, else = 20
      if (responseTime < 500) return 100;
      if (responseTime < 1000) return 80;
      if (responseTime < 2000) return 60;
      if (responseTime < 3000) return 40;
      return 20;
    } catch {
      return 0;
    }
  }

  /**
   * Check security headers
   */
  private async checkSecurity(): Promise<number> {
    try {
      const response = await fetch(this.SITE_URL, {
        method: 'GET',
        timeout: 5000
      });

      let securityScore = 50; // Base score

      // Check for security headers
      const requiredHeaders = [
        'strict-transport-security',
        'x-content-type-options',
        'x-frame-options',
        'content-security-policy',
        'x-xss-protection'
      ];

      let headersFound = 0;
      requiredHeaders.forEach(header => {
        if (response.headers.get(header)) {
          headersFound++;
        }
      });

      // Calculate score based on headers found
      securityScore += (headersFound / requiredHeaders.length) * 50;

      // Check HTTPS
      if (response.url.startsWith('https://')) {
        securityScore += 10;
      }

      return Math.min(100, securityScore);
    } catch {
      return 0;
    }
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): MonitoringMetrics | null {
    return this.metricsHistory.length > 0
      ? this.metricsHistory[this.metricsHistory.length - 1]
      : null;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 100): MonitoringMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get uptime percentage for last 24 hours
   */
  getUptimePercentage24h(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24h = this.metricsHistory.filter(m => new Date(m.timestamp) > oneDayAgo);

    if (last24h.length === 0) return 100;

    const uptimeCount = last24h.filter(m => m.uptime).length;
    return (uptimeCount / last24h.length) * 100;
  }

  /**
   * Get average performance score for last 24 hours
   */
  getAveragePerformance24h(): number {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last24h = this.metricsHistory.filter(m => new Date(m.timestamp) > oneDayAgo);

    if (last24h.length === 0) return 0;

    const sum = last24h.reduce((acc, m) => acc + m.performanceScore, 0);
    return sum / last24h.length;
  }

  /**
   * Get alert summary
   */
  getAlerts(): Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }> {
    const alerts = [];
    const current = this.getCurrentMetrics();

    if (!current) return alerts;

    if (!current.uptime) {
      alerts.push({
        type: 'error',
        message: '🚨 Website is currently down',
        timestamp: current.timestamp
      });
    }

    if (current.performanceScore < 60) {
      alerts.push({
        type: 'warning',
        message: `⚠️  Performance score is low: ${Math.round(current.performanceScore)}%`,
        timestamp: current.timestamp
      });
    }

    if (!current.sslValid) {
      alerts.push({
        type: 'error',
        message: '🔒 SSL certificate issue detected',
        timestamp: current.timestamp
      });
    }

    if (current.securityScore < 50) {
      alerts.push({
        type: 'warning',
        message: `⚠️  Security score needs improvement: ${Math.round(current.securityScore)}%`,
        timestamp: current.timestamp
      });
    }

    return alerts;
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();
