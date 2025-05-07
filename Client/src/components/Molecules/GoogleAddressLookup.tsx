import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

interface GoogleAddressLookupProps {
  onAddressSelect?: (address: {
    formatted_address: string;
    place_id: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export default function GoogleAddressLookup({
  onAddressSelect,
  defaultValue = "",
  className = "",
  placeholder = "Search for an address..."
}: GoogleAddressLookupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add custom styles for Google Places Autocomplete dropdown
    const style = document.createElement('style');
    style.textContent = `
      .pac-container {
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        margin-top: 4px;
        background-color: white;
        font-family: inherit;
        z-index: 9999;
      }
      .pac-item {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .pac-item:hover {
        background-color: #f8fafc;
      }
      .pac-item-selected {
        background-color: #f1f5f9;
      }
      .pac-icon {
        display: none;
      }
      .pac-item-query {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #1e293b;
      }
      .pac-matched {
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);

    const loadGoogleMapsScript = () => {
      setIsLoading(true);
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }

    return () => {
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
      document.head.removeChild(style);
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "IL" },
      fields: ["address_components", "formatted_address", "geometry", "place_id"],
    });

    autoCompleteRef.current.addListener("place_changed", () => {
      const place = autoCompleteRef.current?.getPlace();
      
      if (place && place.formatted_address && place.geometry?.location && place.place_id) {
        setInputValue(place.formatted_address);
        onAddressSelect?.({
          formatted_address: place.formatted_address,
          place_id: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin 
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400
            ${isFocused ? 'text-primary' : ''}`}
        />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`pl-9 pr-10 transition-all duration-200 ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}

