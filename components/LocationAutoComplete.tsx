"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type LocationAutoCompletePropType = {
  planId: string;
  addNewPlaceToTopPlaces: (lat: number, lng: number, placeName: string) => void;
};

const LocationAutoComplete = ({ planId, addNewPlaceToTopPlaces }: LocationAutoCompletePropType) => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const updatePlaceToVisit = useMutation(api.plan.updatePlaceToVisit);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddPlace = async () => {
    if (!searchQuery.trim()) return;

    setIsSaving(true);
    const { dismiss } = toast({ description: `Adding ${searchQuery}...` });

    try {
      // Use a free geocoding API to get coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const name = data[0].display_name.split(",")[0];

        await updatePlaceToVisit({
          placeName: name,
          lat,
          lng,
          planId: planId as Id<"plan">,
        });

        addNewPlaceToTopPlaces(lat, lng, name);
        setSearchQuery("");
        dismiss();
        toast({ description: `✅ ${name} added successfully!` });
      } else {
        toast({ description: "Place not found. Try a different name.", variant: "destructive" });
      }
    } catch (error) {
      toast({ description: "Error finding place. Try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Input
          disabled={isSaving}
          type="text"
          className="font-light h-12"
          placeholder="Search new location"
          onChange={handleSearch}
          value={searchQuery}
          onKeyDown={(e) => e.key === "Enter" && handleAddPlace()}
        />
        <div className="absolute right-3 top-0 h-full flex items-center">
          <Search className="w-4 h-4" />
        </div>
      </div>
      <button
        onClick={handleAddPlace}
        disabled={isSaving || !searchQuery.trim()}
        className="px-4 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {isSaving ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default LocationAutoComplete;