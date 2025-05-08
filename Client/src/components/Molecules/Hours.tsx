import { useTranslation } from "react-i18next";

export default function Hours() {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="mb-4 font-bold">{t('footer.hours.title', 'Hours')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('footer.hours.weekdays', 'Sunday - Tuesday: 8am - 8pm')}<br />
        {t('footer.hours.friday', 'Friday: 8am - 6pm')}<br />
        {t('footer.hours.saturday', 'Saturday: Closed')}
      </p>
      <p className="text-sm text-muted-foreground mt-2 italic font-bold">
        * {t('footer.hours.note', 'Hours are subject to change. Please call ahead to confirm availability.')}
      </p>
    </div>
  );
}
