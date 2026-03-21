"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Sun, Thermometer, Wind } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

type WeatherProps = {
  placeName: string | undefined;
  weatheranalysis?: Doc<"plan">["weatheranalysis"];
  besttimetovisit?: string;
  isLoading: boolean;
};

const Weather = ({ placeName, weatheranalysis, besttimetovisit, isLoading }: WeatherProps) => {
  return (
    <SectionWrapper id="weather">
      <h2 className="mb-4 text-lg font-semibold tracking-wide flex items-center">
        <Cloud className="mr-2" /> Weather Analysis
      </h2>

      {isLoading || !weatheranalysis ? (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl w-full p-5 shadow-md border border-border">
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {/* Expected Conditions */}
          <div className="rounded-xl border border-border p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Sun className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="font-semibold text-sm">Expected Conditions</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {weatheranalysis.expectedconditions}
            </p>
          </div>

          {/* Best Time to Visit */}
          <div className="rounded-xl border border-border p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="font-semibold text-sm">Best Time To Visit</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {weatheranalysis.besttimetovisit}
            </p>
          </div>

          {/* General Best Time */}
          {besttimetovisit && (
            <div className="rounded-xl border border-border p-5 shadow-sm flex flex-col gap-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-semibold text-sm">General Best Time for {placeName}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {besttimetovisit}
              </p>
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
};

export default Weather;