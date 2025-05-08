import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Shield, Sparkles, Timer, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutRoute() {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10 px-4">
      {/* Hero / Mission Section */}
      <Card className="text-center p-8">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <Car className="w-12 h-12 text-primary mb-2" />
            <CardTitle className="text-3xl font-bold">{t('about.title', 'About CarWash 🚗')}</CardTitle>
          </div>
          <CardDescription className="mt-4 text-lg">
            {t('about.mission', 'Our mission is to provide the finest car care services with state-of-the-art facilities and a passion for excellence.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('about.intro', 'At CarWash, we believe your vehicle deserves the best. Our team is dedicated to delivering a sparkling clean car, every time, with eco-friendly products and a smile.')}
          </p>
        </CardContent>
      </Card>

      {/* Values Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-center p-6">
          <CardHeader>
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>{t('about.values.quality.title', 'Premium Quality')}</CardTitle>
            <CardDescription>{t('about.values.quality.desc', 'We use only the highest quality products and equipment.')}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center p-6">
          <CardHeader>
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>{t('about.values.eco.title', 'Eco-Friendly')}</CardTitle>
            <CardDescription>{t('about.values.eco.desc', 'Our cleaning products are safe for your car and the environment.')}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center p-6">
          <CardHeader>
            <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>{t('about.values.quick.title', 'Quick Service')}</CardTitle>
            <CardDescription>{t('about.values.quick.desc', 'Get your car washed and detailed in record time.')}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Team / Story Section */}
      <Card className="p-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle>{t('about.story.title', 'Our Story')}</CardTitle>
          </div>
          <CardDescription>
            {t('about.story.desc', 'Founded in 2023, CarWash started as a small family business with a big dream: to make car care easy, affordable, and enjoyable for everyone.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('about.story.content', "Today, our passionate team serves hundreds of happy customers every month. We're proud to be a part of your community and look forward to keeping your car looking its best!")}
          </p>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>{t('about.contact.title', 'Contact Us')}</CardTitle>
          <CardDescription>{t('about.contact.desc', "We'd love to hear from you!")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-muted-foreground">
            <div>
              <span className="font-semibold">{t('about.contact.addressLabel', 'Address:')}</span> {t('about.contact.address', '123 Car Wash Street, City, State 12345')}
            </div>
            <div>
              <span className="font-semibold">{t('about.contact.phoneLabel', 'Phone:')}</span> {t('about.contact.phone', '(555) 123-4567')}
            </div>
            <div>
              <span className="font-semibold">{t('about.contact.emailLabel', 'Email:')}</span> {t('about.contact.email', 'info@carwash.com')}
            </div>
          </div>
          <Button className="mt-6" variant="outline" asChild>
            <a href="mailto:info@carwash.com">{t('about.contact.button', 'Send us an Email')}</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
