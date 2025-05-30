import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useState } from "react";
import LanguageSwitcher from "@/components/Molecules/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth(); // `login` and `logout` must be exposed
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const routes = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.courses"), path: "/courses" },
    { name: t("navbar.profile"), path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    // clear cookies
    localStorage.removeItem("auth0_token");
    localStorage.removeItem("auth0_id_token");
    localStorage.removeItem("auth0_user");
    localStorage.removeItem("auth0_expires_at");
    setMobileOpen(false);
  };

  // console.log(role);
  return (
    <header className="w-full border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Flex row for logo and hamburger (mobile) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ET
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduTracker
            </span>
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary ml-auto"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Desktop nav */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex gap-4">
            {routes.map((route) => (
              <NavigationMenuItem key={route.path}>
                <Link
                  to={route.path}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                    location.pathname === route.path
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  {route.name}
                </Link>
              </NavigationMenuItem>
            ))}
            <LanguageSwitcher />
            {/* Admin Dashboard */}
            {isAuthenticated && role === "admin" && (
              <NavigationMenuItem
                className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                  location.pathname.includes("/admin")
                    ? "bg-primary text-white"
                    : "hover:bg-muted hover:text-black"
                }`}
              >
                <Link to="/admin">{t("navbar.adminDashboard", "Admin Dashboard")}</Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          {!isAuthenticated ? (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              {t("navbar.login")}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogout}>
              {t("navbar.logout", "Log Out")}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto bg-black/40"
            : "opacity-0 pointer-events-none bg-black/40"
        }`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />
      {/* Mobile Drawer */}
      <nav
        className={`fixed top-0 right-0 h-full w-64 z-50 bg-white shadow-lg p-6 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="mb-6 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <ul className="flex flex-col gap-4">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`block text-base font-medium px-3 py-2 rounded-md transition ${
                  location.pathname === route.path
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {route.name}
              </Link>
            </li>
          ))}
          {isAuthenticated && role === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`block text-base font-medium px-3 py-2 rounded-md transition ${
                  location.pathname.includes("/admin")
                    ? "bg-primary text-white"
                    : "hover:bg-muted hover:text-black"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {t("navbar.adminDashboard", "Admin Dashboard")}
              </Link>
            </li>
          )}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
        <div className="mt-8">
          {!isAuthenticated ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
            >
              {t("navbar.login")}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              {t("navbar.logout", "Log Out")}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
