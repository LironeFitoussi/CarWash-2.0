import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n, t } = useTranslation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  
  return (
    <footer className="border-t bg-muted/30 mt-12" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                ET
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTracker
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprehensive online course management platform. Track your learning progress and achieve your educational goals.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Platform</h3>
            <div className="space-y-2">
              <Link to="/courses" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Browse Courses
              </Link>
              <Link to="/profile" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                My Profile
              </Link>
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          {/* Learning */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Learning</h3>
            <div className="space-y-2">
              <span className="block text-sm text-muted-foreground">Progress Tracking</span>
              <span className="block text-sm text-muted-foreground">Interactive Lessons</span>
              <span className="block text-sm text-muted-foreground">Course Management</span>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
            <div className="space-y-2">
              <a href="mailto:support@edutracker.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </a>
              <a href="mailto:contact@edutracker.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
              <span className="block text-sm text-muted-foreground">24/7 Support</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EduTracker. {t('footer.rights', 'All rights reserved.')}</p>
          <p className="mt-1">
            {t('footer.developed', 'Developed with')} ❤️ {t('footer.by', 'by')}{" "}
            <a
              href="https://github.com/lironefitoussi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lirone Fitoussi
            </a>
            , {t('footer.passion', 'empowering learners through technology.')} 
          </p>
        </div>
      </div>
    </footer>
  );
}
