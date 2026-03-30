"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";

type LocationAutoCompleteProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const LocationAutoComplete = ({ value, onChange, placeholder = "e.g. Hyderabad, Telangana, India" }: LocationAutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      fields: ["formatted_address", "name", "address_components"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place) return;

      const components = place.address_components || [];
      const city = components.find(c => c.types.includes("locality"))?.long_name
        || components.find(c => c.types.includes("administrative_area_level_2"))?.long_name
        || place.name || "";
      const state = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";
      const country = components.find(c => c.types.includes("country"))?.long_name || "";

      const fullLocation = [city, state, country].filter(Boolean).join(", ");
      setInputValue(fullLocation);
      onChange(fullLocation);
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (!e.target.value) onChange("");
        }}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 border border-border rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default LocationAutoComplete;