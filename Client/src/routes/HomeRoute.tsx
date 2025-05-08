import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Car, Shield, Sparkles, Star, Timer } from "lucide-react"
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    name: "John Smith",
    role: "Regular Customer",
    content: "The best car wash service I've ever experienced. My car always looks brand new!",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    content: "Professional service and attention to detail. Highly recommended!",
    rating: 5,
  },
  {
    name: "Mike Williams",
    role: "Car Enthusiast",
    content: "Their premium detailing service is outstanding. Worth every penny!",
    rating: 5,
  },
]

const services = [
  {
    title: "Express Wash",
    description: "Quick and efficient cleaning in 15 minutes",
    icon: Timer,
    price: "$15",
  },
  {
    title: "Premium Wash",
    description: "Comprehensive cleaning with wax protection",
    icon: Shield,
    price: "$25",
  },
  {
    title: "Deluxe Detail",
    description: "Complete interior and exterior detailing",
    icon: Sparkles,
    price: "$99",
  },
]

export default function HomeRoute() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            {t("home.heroTitle", "Professional Car Wash & Detailing")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("home.heroSubtitle", "Experience the finest car care services with our state-of-the-art facilities and expert detailing team.")}
          </p>
          <Button size="lg" className="gap-2">
            {t("home.bookNow", "Book Now")} <ArrowRight />
          </Button>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">{t("home.ourServices", "Our Services")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <service.icon className="size-6 text-primary" />
                  </div>
                  <CardTitle>{t(`home.services.${index}.title`, service.title)}</CardTitle>
                  <CardDescription>{t(`home.services.${index}.description`, service.description)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                  <Button variant="outline" className="mt-4">
                    {t("home.learnMore", "Learn More")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold">{t("home.whyChooseUs", "Why Choose Our Service?")}</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Car className="text-primary" />
                <span>{t("home.whyChooseUs1", "State-of-the-art washing equipment")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Shield className="text-primary" />
                <span>{t("home.whyChooseUs2", "Eco-friendly cleaning products")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Timer className="text-primary" />
                <span>{t("home.whyChooseUs3", "Quick service, amazing results")}</span>
              </li>
            </ul>
          </div>
          <div className="relative rounded-lg bg-muted/30 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg" />
            <div className="relative">
              <h3 className="mb-4 text-2xl font-bold">{t("home.premiumQualityTitle", "Premium Quality")}</h3>
              <p className="text-muted-foreground">
                {t("home.premiumQualityDesc", "We use only the highest quality products and equipment to ensure your vehicle receives the best possible care.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">{t("home.testimonialsTitle", "What Our Customers Say")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardTitle className="mt-4">{t(`home.testimonials.${index}.name`, testimonial.name)}</CardTitle>
                  <CardDescription>{t(`home.testimonials.${index}.role`, testimonial.role)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(`home.testimonials.${index}.content`, testimonial.content)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold">{t("home.ctaTitle", "Ready to Experience the Best Car Wash?")}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          {t("home.ctaSubtitle", "Book your appointment today and give your car the care it deserves.")}
        </p>
        <Button size="lg" className="gap-2">
          {t("home.scheduleNow", "Schedule Now")} <ArrowRight />
        </Button>
      </section>
    </div>
  )
}
