import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (login(password)) {
      toast.success('Welcome to Admin Dashboard!');
      navigate('/admin');
    } else {
      setError('Invalid password. Please try again.');
      toast.error('Invalid password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fb1912ff7781d47a78305e30d6b25186d?format=webp&width=800"
                alt="Falcon Core Logo"
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Enter your access code to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter access code"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="pl-10 bg-primary/5 border-primary/20 focus:border-primary/50"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            🔒 Secure Admin Area | Access restricted to authorized personnel only
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Need help? Contact{' '}
            <a href="mailto:admin@fc.sa" className="text-primary hover:underline">
              admin@fc.sa
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
