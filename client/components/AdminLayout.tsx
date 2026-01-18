import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Home, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  email: string;
}

export function AdminLayout({ children, onLogout, email }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Top Bar */}
      <header className="border-b border-black/10 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2Fb1912ff7781d47a78305e30d6b25186d?format=webp&width=800"
                alt="Falcon Core Logo"
                className="h-6 w-auto"
              />
              <span className="text-sm font-semibold hidden sm:inline">Admin Dashboard</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-black/10 bg-background/30 hidden md:block">
          <nav className="p-6 space-y-2">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
            >
              <BarChart3 className="w-5 h-5 text-primary" />
              Dashboard
            </Link>
            <Link
              to="/admin/monitoring"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Monitoring
            </Link>
            <a
              href="https://builder.io/content"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium text-primary"
            >
              <RefreshCw className="w-5 h-5" />
              Edit Articles (Builder.io)
            </a>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium text-muted-foreground"
            >
              <Home className="w-5 h-5" />
              Back to Site
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
