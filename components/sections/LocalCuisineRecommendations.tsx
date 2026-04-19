"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import EditList from "@/components/shared/EditList";
import HeaderWithEditIcon from "@/components/shared/HeaderWithEditIcon";
import {Skeleton} from "@/components/ui/skeleton";
import {api} from "@/convex/_generated/api";
import {Doc} from "@/convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {Utensils, ExternalLink} from "lucide-react";
import {useState} from "react";

type LocalCuisineRecommendationsProps = {
  recommendations: string[] | undefined;
  planId: string;
  isLoading: boolean;
  allowEdit: boolean;
};

// Extracts just the restaurant name from the full string
// e.g. "Idiyappam at Saravana Bhavan, Ernakulam — Delicious..." → "Saravana Bhavan"
const extractRestaurantName = (item: string): string => {
  // Format: "Dish at Restaurant, Area — description — Price: ..."
  const atMatch = item.match(/at\s+([^,—]+)/i);
  if (atMatch) return atMatch[1].trim();
  // Fallback: return first part before —
  return item.split("—")[0].trim();
};

export default function LocalCuisineRecommendations({
  recommendations,
  isLoading,
  planId,
  allowEdit,
}: LocalCuisineRecommendationsProps) {
  const [editMode, setEditMode] = useState(false);

  const updateLocalCuisineRecommendations = useMutation(api.plan.updatePartOfPlan);

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const updateLocalCuisines = (updatedArray: string[]) => {
    updateLocalCuisineRecommendations({
      planId: planId as Doc<"plan">["_id"],
      data: updatedArray,
      key: "localcuisinerecommendations",
    }).then(() => {
      handleToggleEditMode();
    });
  };

  return (
    <SectionWrapper id="localcuisinerecommendations">
      <HeaderWithEditIcon
        shouldShowEditIcon={!editMode && allowEdit}
        handleToggleEditMode={handleToggleEditMode}
        hasData={recommendations != null && recommendations.length != 0}
        icon={<Utensils className="mr-2" />}
        title="Local Cuisine Recommendations"
        isLoading={isLoading}
      />

      {!isLoading && recommendations ? (
        <div className="ml-8">
          {editMode ? (
            <EditList
              arrayData={recommendations}
              handleToggleEditMode={handleToggleEditMode}
              updateData={updateLocalCuisines}
            />
          ) : (
            <ol className="flex flex-col gap-2 mt-2">
              {recommendations.map((item, index) => {
                const restaurantName = extractRestaurantName(item);
                const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(restaurantName)}`;
                return (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    
                      <a href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                    >
                      {restaurantName}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
}