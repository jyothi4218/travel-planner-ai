import ItineraryDayHeader from "@/components/ItineraryDayHeader";
import { Doc } from "@/convex/_generated/dataModel";
import { Sun, Sunrise, Sunset, Moon, Utensils, Hotel, Clock, Lightbulb, BookOpen, ExternalLink } from "lucide-react";
import { ReactNode } from "react";
import { format } from "date-fns";

type TimelineProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
  planId: string;
  allowEdit: boolean;
  fromDate?: number;
};

const Timeline = ({ itinerary, planId, allowEdit, fromDate }: TimelineProps) => {
  if (itinerary && itinerary.length === 0)
    return (
      <div className="flex justify-center items-center p-4 text-muted-foreground">
        Click + Add a Day to plan an itinerary
      </div>
    );

  const filteredItinerary = itinerary?.filter((day) => {
    const isMorningEmpty = day.activities.morning.length === 0;
    const isAfternoonEmpty = day.activities.afternoon.length === 0;
    const isEveningEmpty = day.activities.evening.length === 0;
    const isNightEmpty = !day.activities.night || day.activities.night.length === 0;
    return !(isMorningEmpty && isAfternoonEmpty && isEveningEmpty && isNightEmpty);
  });

  return (
    <div className="flex flex-col gap-4 mt-4">
      {filteredItinerary?.map((day, index) => {
        const dayDate = fromDate
          ? format(new Date(fromDate + index * 24 * 60 * 60 * 1000), "MMM d, yyyy")
          : null;

        return (
          <div key={day.title} className="border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Day Header */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <ItineraryDayHeader planId={planId} title={day.title} allowEdit={allowEdit} />
                {dayDate && <p className="text-sm text-muted-foreground">{dayDate}</p>}
              </div>
            </div>

            {/* Day Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left — Daily Schedule */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Daily Schedule</h3>
                  <Activity activity={day.activities.morning} heading="Morning" icon={<Sunrise className="w-4 h-4 text-orange-400" />} bgColor="bg-orange-50 dark:bg-orange-950/30" />
                  <Activity activity={day.activities.afternoon} heading="Afternoon" icon={<Sun className="w-4 h-4 text-yellow-500" />} bgColor="bg-yellow-50 dark:bg-yellow-950/30" />
                  <Activity activity={day.activities.evening} heading="Evening" icon={<Sunset className="w-4 h-4 text-purple-500" />} bgColor="bg-purple-50 dark:bg-purple-950/30" />
                  {day.activities.night && day.activities.night.length > 0 && (
                    <Activity activity={day.activities.night} heading="Night" icon={<Moon className="w-4 h-4 text-indigo-400" />} bgColor="bg-indigo-50 dark:bg-indigo-950/30" />
                  )}
                </div>

                {/* Right — Food, Stay, Optional */}
                <div className="flex flex-col gap-4">
                  {/* Food Recommendations */}
                  {day.foodrecommendations && day.foodrecommendations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-green-500" /> Food Recommendations
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {day.foodrecommendations.map((food, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Utensils className="w-3 h-3 mt-1 shrink-0 text-green-400" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stay Options */}
                  {day.stayoptions && day.stayoptions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-blue-500" /> Stay Options
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {day.stayoptions.map((stay, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Hotel className="w-3 h-3 mt-1 shrink-0 text-blue-400" />
                            {stay}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Activities */}
                  {day.optionalactivities && day.optionalactivities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" /> Optional Activities
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {day.optionalactivities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 mt-1 shrink-0 text-orange-400" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Bookings */}
              {day.quickbookings && day.quickbookings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border bg-muted/40 rounded-xl p-3">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" /> Quick Bookings
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {day.quickbookings.map((booking, i) => (
                      
                      <a  key={i}
                        href={booking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 ${
                          booking.type === "hotel"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300"
                            : "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300"
                        }`}
                      >
                        {booking.type === "hotel" ? <Hotel className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        {booking.name}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip */}
              {day.tip && (
                <div className="mt-3 flex items-start gap-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <span className="font-semibold">Tip: </span>{day.tip}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Activity = ({
  activity,
  heading,
  icon,
  bgColor,
}: {
  activity: { itineraryItem: string; briefDescription: string }[];
  heading: string;
  icon: ReactNode;
  bgColor: string;
}) => {
  if (!activity || activity.length === 0) return null;
  return (
    <div className={`flex flex-col gap-2 rounded-xl p-3 ${bgColor}`}>
      <h3 className="text-sm font-semibold flex items-center gap-2">
        {icon}
        <span>{heading}</span>
      </h3>
      <ul className="flex flex-col gap-2">
        {activity.map((act, index) => (
          <li key={index} className="pl-2">
            <span className="text-sm font-semibold text-foreground">{act.itineraryItem}</span>
            <p className="text-sm text-muted-foreground mt-0.5">{act.briefDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;