"use client";
import Timeline from "@/components/Timeline";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {AddIternaryDay} from "@/components/addNewItineraryDay/AddIternaryDay";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc} from "@/convex/_generated/dataModel";
import {Navigation, RefreshCw} from "lucide-react";
import {useAction} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useState} from "react";
import {toast} from "@/components/ui/use-toast";

type ItineraryProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
  fromDate?: number;
};

const Itinerary = ({itinerary, planId, isLoading, allowEdit, fromDate}: ItineraryProps) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const regenerateItinerary = useAction(api.plan.regenerateItinerary);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await regenerateItinerary({planId});
      toast({description: "Itinerary regenerated successfully!"});
    } catch (e) {
      toast({description: "Failed to regenerate. Please try again.", variant: "destructive"});
    } finally {
      setIsRegenerating(false);
    }
  };

  const isEmpty = !isLoading && (!itinerary || itinerary.length === 0);

  return (
    <SectionWrapper id="itinerary">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold tracking-wide flex items-center">
          <Navigation className="mr-2" /> Itinerary
        </h2>
        <div className="flex items-center gap-2">
          {allowEdit && !isLoading && isEmpty && (
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          )}
          {allowEdit && !isLoading && <AddIternaryDay planId={planId} />}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden p-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
          <Navigation className="w-8 h-8 opacity-30" />
          <p className="text-sm">No itinerary generated yet.</p>
          <p className="text-xs">Click <strong>Regenerate</strong> to generate it, or <strong>Add a day</strong> to build manually.</p>
        </div>
      ) : (
        <Timeline itinerary={itinerary} planId={planId} allowEdit={allowEdit} fromDate={fromDate}/>
      )}
    </SectionWrapper>
  );
};

export default Itinerary;
