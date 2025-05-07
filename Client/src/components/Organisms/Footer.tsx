// Molecules
import ContactUs from "@/components/Molecules/ContactUs";
import FollowUs from "@/components/Molecules/FollowUs";
import Hours from "@/components/Molecules/Hours";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-12">
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <ContactUs />
          <Hours />
          <FollowUs />
        </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CarWash. All rights reserved.</p>
        <p className="mt-1">
          Developed with ❤️ by{" "}
          <a
            href="https://github.com/lironefitoussi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Lirone Fitoussi
          </a>
          , a passionate developer crafting digital experiences.
        </p>
      </div>
      </div>
    </footer>
  );
}
