import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// Components
import Navbar from "@/components/Organisms/Navbar";
import Footer from "@/components/Organisms/Footer";
import { AuthSync } from "@/components/AuthSync";

export default function Layout() {
  const { i18n } = useTranslation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <AuthSync />
      <Navbar />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
