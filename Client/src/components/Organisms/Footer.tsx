// Molecules
import ContactUs from "@/components/Molecules/ContactUs";
import FollowUs from "@/components/Molecules/FollowUs";
import Hours from "@/components/Molecules/Hours";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n, t } = useTranslation();
  const dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  return (
    <footer className="border-t bg-muted/30 mt-12" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <ContactUs />
          <Hours />
          <FollowUs />
        </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CarWash. {t('footer.rights', 'All rights reserved.')}</p>
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
          , {t('footer.passion', 'a passionate developer crafting digital experiences.')} 
        </p>
      </div>
      </div>
    </footer>
  );
}
