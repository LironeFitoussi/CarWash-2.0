import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Shield, Sparkles } from "lucide-react";

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
];

export default function ServicesRoute() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Car Wash Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose from our range of professional car wash and detailing services. We guarantee a sparkling clean car, every time!
        </p>
      </div>
      {/* Services Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                <service.icon className="size-6 text-primary" />
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{service.price}</p>
              <Button variant="outline" className="mt-4 w-full">
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
