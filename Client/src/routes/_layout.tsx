import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, TrendingDown, Receipt, User, LogOut, Settings } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { i18n } = useTranslation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { role } = useSelector((state: RootState) => state.user);
  
  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/income', label: 'Income', icon: TrendingUp },
    { href: '/expenses', label: 'Expenses', icon: TrendingDown },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
  ];

  // Add admin navigation for admin users
  const adminNavItems = role === 'admin' ? [
    { href: '/admin', label: 'Admin Panel', icon: Settings },
  ] : [];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    // Clear auth storage
    localStorage.removeItem("auth0_token");
    localStorage.removeItem("auth0_id_token");
    localStorage.removeItem("auth0_user");
    localStorage.removeItem("auth0_expires_at");
  };

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  // Public routes that don't need sidebar
  const publicRoutes = ['/', '/auth'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Show full-width layout for public routes or when not authenticated
  if (isPublicRoute || (!isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    );
  }

  // Show sidebar layout for authenticated users
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FF</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">FinanceFlow</h1>
              <p className="text-xs text-slate-400">Personal Finance</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Admin Navigation Separator */}
            {adminNavItems.length > 0 && (
              <>
                <div className="my-4 border-t border-slate-600"></div>
                <div className="px-3 py-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Administration
                  </span>
                </div>
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith(item.href)
                          ? 'bg-orange-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* User Account & Logout Section */}
        <div className="mt-auto p-4 space-y-2">
          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/profile')
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">Your Account</div>
              <div className="text-xs text-slate-400">Manage profile</div>
            </div>
          </Link>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700 h-auto p-3"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <div className="text-left">
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-slate-400">Logout safely</div>
            </div>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
