import { MapPin } from "lucide-react";

import { Phone } from "lucide-react";

// import { Mail } from "lucide-react";

export default function ContactUs() {
  return (
    <div>
      <h3 className="mb-4 font-bold">Contact Us</h3>
      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-primary" /> 18 Yehuda Hanasi St, Netanya, Israel
      </p>
      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
        <Phone className="w-4 h-4 text-primary" /> +972 58-505-9829
      </p>
      {/* <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" /> info@carwash.com
      </p> */}
    </div>
  );
}
