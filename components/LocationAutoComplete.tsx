"use client";
import { useRef, useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type LocationAutoCompleteProps = {
  // Used in TopPlacesToVisit
  planId?: string;
  addNewPlaceToTopPlaces?: (lat: number, lng: number, placeName: string) => void;
  // Used in NewPlanForm
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

const LocationAutoComplete = ({
  addNewPlaceToTopPlaces,
  value,
  onChange,
  placeholder = "Search a place...",
}: LocationAutoCompleteProps) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<any>(null);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (onChange) onChange(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!val || val.length < 3) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/location?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch { setResults([]); }
      setLoading(false);
    }, 800);
  };

  const handleSelect = (item: any) => {
    const city = item.address?.city || item.address?.town || item.address?.village || "";
    const state = item.address?.state || "";
    const country = item.address?.country || "";
    const display = [city, state, country].filter(Boolean).join(", ") || item.display_name?.split(",")[0] || "";
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    if (addNewPlaceToTopPlaces && lat && lng) {
      addNewPlaceToTopPlaces(lat, lng, display);
      setQuery("");
    } else {
      setQuery(display);
      if (onChange) onChange(display);
    }
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    if (onChange) onChange("");
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-8 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute z-50 bg-background border border-border w-full mt-1 rounded-xl shadow p-3 text-sm text-muted-foreground">
          Searching...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="absolute z-50 bg-background border border-border w-full mt-1 rounded-xl shadow max-h-60 overflow-y-auto">
          {results.slice(0, 5).map((item, index) => {
            const city = item.address?.city || item.address?.town || item.address?.village || "";
            const state = item.address?.state || "";
            const country = item.address?.country || "";
            const display = [city, state, country].filter(Boolean).join(", ");
            if (!display) return null;
            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                className="p-3 hover:bg-muted cursor-pointer text-sm flex items-center gap-2 border-b border-border last:border-0"
              >
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="flex-1">{display}</span>
                {addNewPlaceToTopPlaces && <Plus className="w-3 h-3 text-blue-500 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationAutoComplete;