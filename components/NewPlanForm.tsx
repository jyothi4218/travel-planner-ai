"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Wand2, ChevronRight, ChevronLeft, Plus, X } from "lucide-react";
import { generatePlanAction } from "@/lib/actions/generateplanAction";
import PlacesAutoComplete from "@/components/PlacesAutoComplete";
import { useToast } from "@/components/ui/use-toast";
import CompanionControl from "@/components/plan/CompanionControl";
import ActivityPreferences from "@/components/plan/ActivityPreferences";
import DateRangeSelector from "@/components/common/DateRangeSelector";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  placeName: z.string({ required_error: "Please select a place" }).min(3, "Place name should be at least 3 characters long"),
  startingLocation: z.optional(z.string()),
  datesOfTravel: z.object({ from: z.date(), to: z.date() }).refine((data) => data.to >= data.from, {
    message: "End date cannot be before start date",
    path: ["to"],
  }),
  activityPreferences: z.array(z.string()),
  customThemes: z.optional(z.array(z.string())),
  companion: z.optional(z.string()),
  pace: z.optional(z.string()),
  weather: z.optional(z.string()),
  accommodation: z.optional(z.string()),
  food: z.optional(z.string()),
  departureTransport: z.optional(z.string()),
  localTransport: z.optional(z.string()),
  budget: z.optional(z.string()),
  currency: z.optional(z.string()),
  additionalPreferences: z.optional(z.string()),
});

export type formSchemaType = z.infer<typeof formSchema>;

const CURRENCIES = ["INR - Indian Rupee", "USD - US Dollar", "EUR - Euro", "GBP - British Pound", "AED - UAE Dirham", "SGD - Singapore Dollar"];

const stepConfig = [
  {
    emoji: "✈️",
    title: "Set the Course,\nOwn the Journey",
    desc: "Define your dream destination and chart the perfect path to make it a reality.",
  },
  {
    emoji: "🎯",
    title: "Craft Your\nPerfect Experience",
    desc: "Tell us your travel style so we can tailor every detail of your trip.",
  },
  {
    emoji: "💰",
    title: "Trip Budget &\nFinal Details",
    desc: "Add the final touches with budget and special preferences for an unforgettable experience.",
  },
];

const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-3 py-2 rounded-xl border text-sm transition-all",
      selected
        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 font-medium"
        : "border-border hover:border-blue-300"
    )}
  >
    {label}
  </button>
);

const NewPlanForm = ({ closeModal }: { closeModal: Dispatch<SetStateAction<boolean>> }) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;

  const [step, setStep] = useState(0);
  const [pendingAIPlan, startTransactionAiPlan] = useTransition();
  const [selectedFromList, setSelectedFromList] = useState(false);
  const [newTheme, setNewTheme] = useState("");
  const { toast } = useToast();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityPreferences: [],
      customThemes: [],
      companion: undefined,
      placeName: "",
      startingLocation: "",
      datesOfTravel: { from: undefined, to: undefined },
      pace: undefined,
      weather: undefined,
      accommodation: undefined,
      food: undefined,
      departureTransport: undefined,
      localTransport: undefined,
      budget: undefined,
      currency: "INR - Indian Rupee",
      additionalPreferences: "",
    },
  });

  const addCustomTheme = () => {
    if (!newTheme.trim()) return;
    const current = form.getValues("customThemes") || [];
    form.setValue("customThemes", [...current, newTheme.trim()]);
    setNewTheme("");
  };

  const removeCustomTheme = (index: number) => {
    const current = form.getValues("customThemes") || [];
    form.setValue("customThemes", current.filter((_, i) => i !== index));
  };

  async function onSubmitAIPlan(values: z.infer<typeof formSchema>) {
    startTransactionAiPlan(async () => {
      const planId = await generatePlanAction(values);
      closeModal(false);
      if (planId === null) toast({ title: "Error", description: "Error generating AI plan" });
    });
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const current = stepConfig[step];

  return (
    <div className="flex min-h-[580px]">

      {/* ── Left Blue Card ── */}
      <div className="hidden md:flex w-[260px] bg-blue-500 rounded-l-2xl flex-col p-7 gap-5 shrink-0">
        <h2 className="text-white font-bold text-2xl">Create a Plan</h2>

        {/* Step indicators */}
        <div className="flex items-center">
          {["Destination", "Preferences", "Details"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                  i < step ? "bg-green-400 border-green-300 text-white"
                    : i === step ? "bg-white text-blue-500 border-white"
                    : "bg-white/20 border-white/40 text-white"
                )}>
                  {i < step ? "✓" : i + 1}
                </div>
              </div>
              {i < 2 && (
                <div className={cn("w-5 h-0.5 mx-1", i < step ? "bg-green-400" : "bg-white/30")} />
              )}
            </div>
          ))}
        </div>

        {/* Dynamic illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="text-8xl">{current.emoji}</div>
          <div>
            <h3 className="text-white font-bold text-lg leading-snug whitespace-pre-line">
              {current.title}
            </h3>
            <p className="text-blue-100 text-sm mt-3 leading-relaxed">
              {current.desc}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="flex-1 flex flex-col p-7 overflow-y-auto max-h-[580px]">
        <h2 className="text-xl font-bold mb-5">Create Travel Plan</h2>

        <Form {...form}>
          <form className="flex flex-col gap-4 flex-1">

            {/* STEP 1 */}
            {step === 0 && (
              <div className="space-y-4">
                <FormField control={form.control} name="startingLocation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where are you starting your trip from? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <FormControl><Input placeholder="e.g. Hyderabad, India" {...field} /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="placeName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search for your destination city</FormLabel>
                    <FormControl>
                      <PlacesAutoComplete field={field} form={form} selectedFromList={selectedFromList} setSelectedFromList={setSelectedFromList} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="datesOfTravel" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Dates</FormLabel>
                    <DateRangeSelector value={field.value} onChange={field.onChange} forGeneratePlan={true} />
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="activityPreferences" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel themes <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <ActivityPreferences values={field.value} onChange={(e) => field.onChange(e)} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="customThemes" render={() => (
                  <FormItem>
                    <FormLabel>Add your own theme <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. Photography, Spiritual..."
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTheme())}
                      />
                      <Button type="button" variant="outline" onClick={addCustomTheme}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(form.watch("customThemes") || []).map((theme, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {theme}
                          <button type="button" onClick={() => removeCustomTheme(i)}><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="companion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who are you travelling with <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <CompanionControl value={field.value} onChange={(id: string) => field.onChange(id)} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            )}

            {/* STEP 2 */}
            {step === 1 && (
              <div className="space-y-4">
                <FormField control={form.control} name="pace" render={({ field }) => (
                  <FormItem>
                    <FormLabel>What pace of travel do you prefer? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "🐢 Slow and Easy", value: "Slow and Easy" }, { label: "⚖️ Balanced", value: "Balanced" }, { label: "🚀 Fast", value: "Fast" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="weather" render={({ field }) => (
                  <FormItem>
                    <FormLabel>What kind of weather do you prefer? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "☀️ Warm and Sunny", value: "Warm and Sunny" }, { label: "🌬️ Cool and Breezy", value: "Cool and Breezy" }, { label: "❄️ Cold and Snowy", value: "Cold and Snowy" }, { label: "🌤️ Mild and Pleasant", value: "Mild and Pleasant" }, { label: "🌧️ Rainy and Cozy", value: "Rainy and Cozy" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="accommodation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>What type of accommodation? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "3 Star", value: "3 Star" }, { label: "4 Star", value: "4 Star" }, { label: "5 Star", value: "5 Star" }, { label: "🏠 Airbnb", value: "Airbnb" }, { label: "🏡 Homestay", value: "Homestay" }, { label: "🛏️ Hostel", value: "Hostel" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="food" render={({ field }) => (
                  <FormItem>
                    <FormLabel>What type of food do you prefer? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "🥗 Vegetarian", value: "Vegetarian" }, { label: "🌱 Vegan", value: "Vegan" }, { label: "🌾 Gluten Free", value: "Gluten Free" }, { label: "☪️ Halal", value: "Halal" }, { label: "✡️ Kosher", value: "Kosher" }, { label: "🍜 Local Cuisine", value: "Local Cuisine" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="departureTransport" render={({ field }) => (
                  <FormItem>
                    <FormLabel>How will you travel to the destination? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "✈️ Flights", value: "Flights" }, { label: "🚂 Trains", value: "Trains" }, { label: "🚌 Buses", value: "Buses" }, { label: "🚗 Road", value: "Road" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="localTransport" render={({ field }) => (
                  <FormItem>
                    <FormLabel>How would you get around at the destination? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {[{ label: "🚕 Taxi/Cab", value: "Taxi" }, { label: "🚇 Metro/Public", value: "Metro" }, { label: "🛵 Scooter Rental", value: "Scooter" }, { label: "🚶 Walking", value: "Walking" }, { label: "🚲 Cycling", value: "Cycling" }].map((o) => (
                        <Chip key={o.value} label={o.label} selected={field.value === o.value} onClick={() => field.onChange(o.value)} />
                      ))}
                    </div>
                  </FormItem>
                )} />
              </div>
            )}

            {/* STEP 3 */}
            {step === 2 && (
              <div className="space-y-4">
                <FormField control={form.control} name="currency" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Which currency would you like to use? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full border border-border rounded-xl p-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="budget" render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your estimated travel budget? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex gap-2 flex-wrap">
                      {["Budget (< ₹10,000)", "Mid-range (₹10,000 - ₹50,000)", "Luxury (> ₹50,000)"].map((o) => (
                        <Chip key={o} label={o} selected={field.value === o} onClick={() => field.onChange(o)} />
                      ))}
                    </div>
                  </FormItem>
                )} />

                <FormField control={form.control} name="additionalPreferences" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any additional preferences? <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="e.g., I want to visit the Eiffel Tower, go parasailing, or try local cooking classes..."
                        className="w-full border border-border rounded-xl p-3 text-sm min-h-[100px] bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 mt-auto">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              ) : <div />}

              {step < 2 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 0 && !form.formState.isValid}
                  className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => form.handleSubmit(onSubmitAIPlan)()}
                  type="button"
                  disabled={pendingAIPlan || !form.formState.isValid}
                  className="bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2"
                >
                  {pendingAIPlan ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /><span>Generating...</span></>
                  ) : (
                    <><Wand2 className="h-4 w-4" /><span>Generate AI Plan</span></>
                  )}
                </Button>
              )}
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPlanForm;