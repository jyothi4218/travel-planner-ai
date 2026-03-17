"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { formSchemaType } from "@/components/NewPlanForm";

type PlacesAutoCompleteProps = {
  selectedFromList: boolean;
  setSelectedFromList: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<formSchemaType, any, undefined>;
  field: ControllerRenderProps<formSchemaType, "placeName">;
};

const PlacesAutoComplete = ({
  form,
  field,
  selectedFromList,
  setSelectedFromList,
}: PlacesAutoCompleteProps) => {

  const isEnglish = (text: string) => /^[A-Za-z0-9\s,.-]+$/.test(text);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      field.onChange(value);
      form.clearErrors("placeName");
      return;
    }

    if (!isEnglish(value)) {
      form.setError("placeName", {
        message: "This tool supports only English as input.",
        type: "custom",
      });
      return;
    }

    form.clearErrors("placeName");
    setSelectedFromList(true);
    field.onChange(value);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for your destination city..."
        onChange={handleSearch}
        value={field.value}
      />
    </div>
  );
};

export default PlacesAutoComplete;