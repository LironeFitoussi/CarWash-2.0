import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "+972585059829";

export default function ContactRoute() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Build WhatsApp message URL
    const text = encodeURIComponent(t('contact.whatsappMessage', 'Hi, my name is {{name}}. {{message}}', { name: form.name, message: form.message }));
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${text}`;
    window.open(url, '_blank');
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10 px-4">
      {/* Hero Section */}
      <Card className="text-center p-8">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <MessageCircle className="w-12 h-12 text-green-600 mb-2" />
            <CardTitle className="text-3xl font-bold">{t('contact.title', 'Contact Us on WhatsApp')}</CardTitle>
          </div>
          <CardDescription className="mt-4 text-lg">
            {t('contact.subtitle', "We'd love to hear from you! Send us a direct WhatsApp message below.")}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* WhatsApp Contact Form */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>{t('contact.form.title', 'Send a WhatsApp Message')}</CardTitle>
          <CardDescription>{t('contact.form.subtitle', "We'll reply as soon as possible.")}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-green-600 font-semibold text-center py-8">
              {t('contact.form.thankYou', "Thank you for your message! We'll be in touch soon via WhatsApp.")}
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">{t('contact.form.nameLabel', 'Name')}</label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder={t('contact.form.namePlaceholder', 'Your Name')} />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">{t('contact.form.messageLabel', 'Message')}</label>
                <Textarea id="message" name="message" value={form.message} onChange={handleChange} required placeholder={t('contact.form.messagePlaceholder', 'How can we help you?')} rows={5} />
              </div>
              <Button type="submit" className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="w-4 h-4" /> {t('contact.form.button', 'Send WhatsApp Message')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Contact Info Section */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>{t('contact.info.title', 'Contact Information')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {t('contact.info.address', '123 Car Wash Street, City, State 12345')}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <a href="https://wa.me/972585059829" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {t('contact.info.phone', '+972 58-505-9829 (WhatsApp)')}
              </a>
            </div>
          </div>
          <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white" asChild>
            <a href="https://wa.me/972585059829" target="_blank" rel="noopener noreferrer">
              {t('contact.info.button', 'Message us on WhatsApp')}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
