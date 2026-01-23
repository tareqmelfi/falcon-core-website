import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { resetMetaTags } from '@/lib/meta-manager';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t, language, setLanguage, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset meta tags to defaults when route changes (will be overridden by page-specific hooks)
  useEffect(() => {
    resetMetaTags();
  }, [location.pathname]);

  const NavItems = () => (
    <>
      <Link to="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
        {t('nav.home')}
      </Link>
      <Link to="/store" className="text-foreground/80 hover:text-primary transition-colors font-medium">
        {t('nav.store')}
      </Link>
      <Link to="/articles" className="text-foreground/80 hover:text-primary transition-colors font-medium">
        {t('nav.articles')}
      </Link>
      <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
        {t('nav.about')}
      </Link>
      <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
        {t('nav.contact')}
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" dir={dir}>
      <AnimatedBackground />
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-lg border-b border-black/10 shadow-lg'
            : location.pathname === '/'
            ? 'bg-transparent border-b border-black/5'
            : 'bg-background/80 backdrop-blur-md border-b border-black/10'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F2e1b9087ef4e46cdb32b82db285f3f9e?format=webp&width=800"
              alt="Falcon Core Logo"
              className="h-10 w-auto"
              style={{ transform: 'scaleX(-1)' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItems />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full hover:bg-primary/20"
            >
              <Globe className="w-5 h-5" />
              <span className="sr-only">Switch Language</span>
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full hover:bg-primary/20"
            >
              <Globe className="w-5 h-5" />
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl border-r border-black/10">
                <nav className="flex flex-col gap-6 mt-10">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <footer className="border-t border-black/10 bg-background/50 backdrop-blur-sm py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fcaddb27a75ac426ab2cf2b1bb67636ef%2F2e1b9087ef4e46cdb32b82db285f3f9e?format=webp&width=800"
                alt="Falcon Core Logo"
                className="h-8 w-auto mb-4"
                style={{ transform: 'scaleX(-1)' }}
              />
              <p className="text-muted-foreground text-sm">{t('footer.rights')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.quick_links')}</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('nav.home')}
                </Link>
                <Link to="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('nav.services')}
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('nav.about')}
                </Link>
                <Link to="/work-with-us" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('nav.work_with_us')}
                </Link>
                <Link to="/brand-identity" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('nav.brand_identity')}
                </Link>
                <Link to="/portal" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {language === 'ar' ? 'بوابة العملاء' : 'Customer Portal'}
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-4">{language === 'ar' ? 'قانوني' : 'Legal'}</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact_info')}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: info@fc.sa | info@falconcore.us</p>
                <p>
                  <a href="tel:8001110110" className="hover:text-primary transition-colors font-semibold text-primary">
                    📞 Saudi: 8001110110 (Toll-Free)
                  </a>
                </p>
                <p>
                  <a href="tel:+14424444410" className="hover:text-primary transition-colors">
                    📞 US: +1 (442) 444-4410
                  </a>
                </p>
                <p className="pt-2">🇸🇦 Riyadh, Saudi Arabia</p>
                <p>🇺🇸 30 N Gould St, Ste R, Sheridan, WY 82801</p>
              </div>
            </div>
          </div>
          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">&copy; 2026 Falcon Core LLC. {t('footer.rights')}</p>
            <div className="flex gap-4 text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'ar' ? 'الشروط' : 'Terms'}
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                {language === 'ar' ? 'الخصوصية' : 'Privacy'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
