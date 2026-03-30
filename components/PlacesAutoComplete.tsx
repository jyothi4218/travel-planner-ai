"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

const PlacesAutoComplete = ({ field, form, setSelectedFromList }: any) => {
  const [results, setResults] = useState<any[]>([]);

  let timeout: any;

const handleSearch = (value: string) => {
  field.onChange(value);

  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    if (!value) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/location?q=${value}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  }, 500); // VERY IMPORTANT
};

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search city..."
        value={field.value || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {results.length > 0 && (
        <div className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
          {results.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                field.onChange(item.display_name);
                setResults([]);
                setSelectedFromList(true);
                form.clearErrors(field.name);
              }}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacesAutoComplete;