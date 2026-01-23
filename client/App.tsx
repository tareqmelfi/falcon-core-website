import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import BrandIdentity from "./pages/BrandIdentity";
import WorkWithUs from "./pages/WorkWithUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMonitoring from "./pages/AdminMonitoring";
import AdminOrders from "./pages/AdminOrders";
import Store from "./pages/Store";
import Portal from "./pages/Portal";
import ThankYou from "./pages/ThankYou";
import OrderIntake from "./pages/OrderIntake";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import QuoteCalculator from "./pages/QuoteCalculator";
import BuilderPage from "./components/BuilderPage";
import NotFound from "./pages/NotFound";
import WyomingLLC from "./pages/WyomingLLC";
import WyomingBusinessGuide from "./pages/WyomingBusinessGuide";
import AdvisorySession from "./pages/AdvisorySession";
import WebsitePackage from "./pages/WebsitePackage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/brand-identity" element={<BrandIdentity />} />

            {/* Store & Portal Routes */}
            <Route path="/store" element={<Store />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/thank-you-advisory" element={<ThankYou />} />
            <Route path="/thank-you-formation" element={<ThankYou />} />
            <Route path="/thank-you-website" element={<ThankYou />} />
            <Route path="/order-intake" element={<OrderIntake />} />
            <Route path="/store/wyoming-llc" element={<WyomingLLC />} />
            <Route path="/store/advisory" element={<AdvisorySession />} />
            <Route path="/store/website-package" element={<WebsitePackage />} />
            <Route path="/articles/wyoming-business-guide-2025" element={<WyomingBusinessGuide />} />

            {/* Quote Calculator */}
            <Route path="/quote" element={<QuoteCalculator />} />
            <Route path="/calculator" element={<QuoteCalculator />} />

            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/orders" element={<AdminOrders />} />

            {/*
              Builder.io Visual CMS Routes
              Any page created in Builder.io will be accessible here.
              Example: Create a page with URL "/landing" in Builder.io,
              and it will be available at yoursite.com/landing
            */}
            <Route path="/builder/*" element={<BuilderPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
