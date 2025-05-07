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
  value?: string;
  className?: string;
  placeholder?: string;
}

export default function GoogleAddressLookup({
  onAddressSelect,
  value = "",
  className = "",
  placeholder = "Search for an address...",
}: GoogleAddressLookupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .pac-container {
        z-index: 2147483647 !important;
        margin-top: 4px !important;
        border-radius: 0.5rem !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        background-color: white !important;
        font-family: inherit !important;
        pointer-events: auto !important;
      }
      .pac-container::after {
        display: none !important;
      }
      .pac-item {
        padding: 0.75rem 1rem !important;
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        border-top: 1px solid #e2e8f0 !important;
        pointer-events: auto !important;
      }
      .pac-item:first-child {
        border-top: none !important;
      }
      .pac-item:hover {
        background-color: #f8fafc !important;
      }
      .pac-item-selected {
        background-color: #f1f5f9 !important;
      }
      .pac-icon {
        display: none !important;
      }
      .pac-item-query {
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        color: #1e293b !important;
        cursor: pointer !important;
        pointer-events: auto !important;
      }
      .pac-matched {
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);

    // Add click handler to prevent clicks from bubbling up to the modal
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.pac-container') || target.closest('.google-address-lookup')) {
        e.stopPropagation();
      }
    };

    document.addEventListener('click', handleDocumentClick, true);

    const loadGoogleMapsScript = () => {
      setIsLoading(true);
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeAutocomplete();
        setIsLoading(false);
      };
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
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "IL" },
      fields: ["address_components", "formatted_address", "geometry", "place_id"],
    });

    // Prevent form submission on enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    inputRef.current.addEventListener('keydown', handleKeyDown);

    // Handle place selection
    autoCompleteRef.current.addListener("place_changed", () => {
      isSelectingRef.current = true;
      const place = autoCompleteRef.current?.getPlace();

      if (place && place.formatted_address && place.geometry?.location && place.place_id) {
        const formatted = place.formatted_address;
        setInputValue(formatted);
        
        if (inputRef.current) {
          inputRef.current.value = formatted;
          // Keep focus in the input
          inputRef.current.focus();
        }

        onAddressSelect?.({
          formatted_address: formatted,
          place_id: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });

        // Reset the selecting state after a short delay
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 100);
      }
    });

    // Cleanup function
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  };

  const handleBlur = () => {
    // Only blur if we're not in the middle of selecting an address
    if (!isSelectingRef.current) {
      setTimeout(() => setIsFocused(false), 300);
    }
  };

  return (
    <div className={`relative google-address-lookup ${className}`}>
      <div className="relative">
        <MapPin
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400
            ${isFocused ? "text-primary" : ""}`}
        />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          className={`pl-9 pr-10 transition-all duration-200 ${
            isFocused ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          autoComplete="off"
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
