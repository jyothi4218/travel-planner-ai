"use client";

import { useState, useTransition } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ActivityPreferences from "@/components/plan/ActivityPreferences";
import CompanionControl from "@/components/plan/CompanionControl";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import { cn } from "@/lib/utils";
import { CreditCard, RefreshCw, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { generatePlanAction } from "@/lib/actions/generateplanAction";

type RefinePlanProps = {
  planId: string;
  fromDate?: number;
  toDate?: number;
  companion?: string;
  activityPreferences?: string[];
  placeName?: string;
  userPrompt?: string;
};

const Chip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-xl border text-sm transition-all",
      selected
        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 font-medium"
        : "border-border hover:border-blue-300"
    )}
  >
    {label}
  </button>
);

const RefinePlan = ({
  planId,
  fromDate,
  toDate,
  companion,
  activityPreferences = [],
  placeName,
  userPrompt,
}: RefinePlanProps) => {
  const [show, setShow] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  });
  const [selectedCompanion, setSelectedCompanion] = useState(companion);
  const [selectedActivities, setSelectedActivities] =
    useState(activityPreferences);
  const [pace, setPace] = useState<string | undefined>();
  const [accommodation, setAccommodation] = useState<string | undefined>();
  const [food, setFood] = useState<string | undefined>();

  const updateTravelDates = useMutation(api.planSettings.updateTravelDates);
  const updateCompanionId = useMutation(api.planSettings.updateCompanionId);
  const updateActivityPreferences = useMutation(
    api.planSettings.updateActivityPreferences
  );

  if (!show) return null;

  const handleRefine = () => {
    startTransition(async () => {
      try {
        // Save updated settings
        if (selectedDates?.from && selectedDates?.to) {
          await updateTravelDates({
            planId: planId as Id<"plan">,
            fromDate: selectedDates.from.getTime(),
            toDate: selectedDates.to.getTime(),
          });
        }
        if (selectedCompanion) {
          await updateCompanionId({
            planId: planId as Id<"plan">,
            companionId: selectedCompanion,
          });
        }
        if (selectedActivities.length > 0) {
          await updateActivityPreferences({
            planId: planId as Id<"plan">,
            activityPreferencesIds: selectedActivities,
          });
        }

        // Regenerate plan
        await generatePlanAction({
          placeName: placeName ?? "",
          datesOfTravel: {
            from: selectedDates?.from ?? new Date(fromDate ?? Date.now()),
            to: selectedDates?.to ?? new Date(toDate ?? Date.now()),
          },
          activityPreferences: selectedActivities,
          companion: selectedCompanion,
          pace,
          accommodation,
          food,
        });

        toast({ title: "Plan refined successfully!" });
        setShow(false);
      } catch (error) {
        toast({
          title: "Error refining plan",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="border border-blue-200 dark:border-blue-800 rounded-2xl overflow-hidden mb-2">
      {/* Header */}
      <div className="flex justify-between items-start p-4 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Need to Make Changes?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your trip, your way! Adjustments are easy, but will include a fee{" "}
              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                <CreditCard className="w-3 h-3" /> 0.25 Credit
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 flex flex-col gap-4">
        {/* Dates */}
        <div>
          <label className="text-sm font-medium mb-2 block">Select Dates</label>
          <DateRangeSelector
            value={selectedDates}
            onChange={setSelectedDates}
            forGeneratePlan={true}
          />
        </div>

        {/* Activities */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Travel themes{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <ActivityPreferences
            values={selectedActivities}
            onChange={setSelectedActivities}
          />
        </div>

        {/* Pace */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Travel pace{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {["🐢 Slow and Easy", "⚖️ Balanced", "🚀 Fast"].map((o) => (
              <Chip
                key={o}
                label={o}
                selected={pace === o}
                onClick={() => setPace(pace === o ? undefined : o)}
              />
            ))}
          </div>
        </div>

        {/* Companion */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Travelling with{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <CompanionControl
            value={selectedCompanion}
            onChange={setSelectedCompanion}
          />
        </div>

        {/* Accommodation */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Accommodation{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {["3 Star", "4 Star", "5 Star", "🏠 Airbnb", "🏡 Homestay", "🛏️ Hostel"].map((o) => (
              <Chip
                key={o}
                label={o}
                selected={accommodation === o}
                onClick={() => setAccommodation(accommodation === o ? undefined : o)}
              />
            ))}
          </div>
        </div>

        {/* Food */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Food preference{" "}
            <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {["🥗 Vegetarian", "🌱 Vegan", "🌾 Gluten Free", "☪️ Halal", "🍜 Local Cuisine"].map((o) => (
              <Chip
                key={o}
                label={o}
                selected={food === o}
                onClick={() => setFood(food === o ? undefined : o)}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          onClick={handleRefine}
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Refining Plan...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refine Plan
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RefinePlan;