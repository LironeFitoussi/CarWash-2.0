import { MapPin } from "lucide-react";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

// import { Mail } from "lucide-react";

export default function ContactUs() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('footer.contactUs.title', 'Contact Us')}
      </h3>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <span>{t('footer.contactUs.phoneLabel', 'Phone:')}</span> {t('footer.contactUs.phone', '+972-50-123-4567')}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <span>{t('footer.contactUs.emailLabel', 'Email:')}</span> {t('footer.contactUs.email', 'support@financeflow.com')}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" /> support@financeflow.com
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{t('footer.contactUs.addressLabel', 'Address:')}</span> {t('footer.contactUs.address', 'Tel Aviv, Israel')}
        </div>
      </div>
    </div>
  );
}
