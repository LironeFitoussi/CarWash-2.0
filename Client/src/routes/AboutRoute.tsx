import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Shield, Sparkles, Timer, Users } from "lucide-react";

export default function AboutRoute() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10 px-4">
      {/* Hero / Mission Section */}
      <Card className="text-center p-8">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <Car className="w-12 h-12 text-primary mb-2" />
            <CardTitle className="text-3xl font-bold">About CarWash 🚗</CardTitle>
          </div>
          <CardDescription className="mt-4 text-lg">
            Our mission is to provide the finest car care services with state-of-the-art facilities and a passion for excellence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-xl mx-auto">
            At CarWash, we believe your vehicle deserves the best. Our team is dedicated to delivering a sparkling clean car, every time, with eco-friendly products and a smile.
          </p>
        </CardContent>
      </Card>

      {/* Values Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-center p-6">
          <CardHeader>
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>Premium Quality</CardTitle>
            <CardDescription>We use only the highest quality products and equipment.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center p-6">
          <CardHeader>
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>Eco-Friendly</CardTitle>
            <CardDescription>Our cleaning products are safe for your car and the environment.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center p-6">
          <CardHeader>
            <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle>Quick Service</CardTitle>
            <CardDescription>Get your car washed and detailed in record time.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Team / Story Section */}
      <Card className="p-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <CardTitle>Our Story</CardTitle>
          </div>
          <CardDescription>
            Founded in 2023, CarWash started as a small family business with a big dream: to make car care easy, affordable, and enjoyable for everyone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Today, our passionate team serves hundreds of happy customers every month. We're proud to be a part of your community and look forward to keeping your car looking its best!
          </p>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>We'd love to hear from you!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-muted-foreground">
            <div>
              <span className="font-semibold">Address:</span> 123 Car Wash Street, City, State 12345
            </div>
            <div>
              <span className="font-semibold">Phone:</span> (555) 123-4567
            </div>
            <div>
              <span className="font-semibold">Email:</span> info@carwash.com
            </div>
          </div>
          <Button className="mt-6" variant="outline" asChild>
            <a href="mailto:info@carwash.com">Send us an Email</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
