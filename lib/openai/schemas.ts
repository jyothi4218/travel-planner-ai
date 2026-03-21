export const batch1Schema = {
  type: "object",
  properties: {
    abouttheplace: {
      type: "string",
      description: "A rich narrative about the place in at least 80 words covering culture, geography, and vibe",
    },
    besttimetovisit: {
      type: "string",
      description: "Best time to visit with specific months and reasons",
    },
    triPhighlights: {
      type: "string",
      description: "A compelling 3-paragraph narrative story of the trip experience, written in second person (you/your), mentioning specific places, food, and experiences based on the user preferences",
    },
    weatheranalysis: {
      type: "object",
      properties: {
        expectedconditions: {
          type: "string",
          description: "Detailed weather expected during the travel dates including temperature, humidity, and what to expect",
        },
        besttimetovisit: {
          type: "string",
          description: "Best time to visit considering the travel dates and user preferences",
        },
      },
      required: ["expectedconditions", "besttimetovisit"],
    },
  },
  required: ["abouttheplace", "besttimetovisit", "triPhighlights", "weatheranalysis"],
};

export const batch2Schema = {
  type: "object",
  properties: {
    adventuresactivitiestodo: {
      type: "array",
      description: "Top adventure activities, at least 5, with specific location names",
      items: { type: "string" },
    },
    localcuisinerecommendations: {
      type: "array",
      description: "Local cuisine recommendations specific to the destination",
      items: { type: "string" },
    },
    packingchecklist: {
      type: "array",
      description: "Detailed packing checklist tailored to the destination, weather, and activities",
      items: { type: "string" },
    },
    budgetrange: {
      type: "object",
      description: "Estimated budget breakdown for the trip",
      properties: {
        totalmin: { type: "number", description: "Minimum total estimated cost in the user's currency" },
        totalmax: { type: "number", description: "Maximum total estimated cost in the user's currency" },
        currency: { type: "string", description: "Currency code like INR, USD etc" },
        accommodation: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number", description: "Percentage of total budget" },
          },
          required: ["min", "max", "percentage"],
        },
        food: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number" },
          },
          required: ["min", "max", "percentage"],
        },
        transport: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number" },
          },
          required: ["min", "max", "percentage"],
        },
        activities: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number" },
          },
          required: ["min", "max", "percentage"],
        },
        contingency: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number" },
          },
          required: ["min", "max", "percentage"],
        },
      },
      required: ["totalmin", "totalmax", "currency", "accommodation", "food", "transport", "activities", "contingency"],
    },
  },
  required: ["adventuresactivitiestodo", "localcuisinerecommendations", "packingchecklist", "budgetrange"],
};

export const batch3Schema = {
  type: "object",
  properties: {
    itinerary: {
      type: "array",
      description: "Day by day itinerary starting from departure day. First day should be travel/departure day from starting location if provided.",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Catchy day title like 'Departure from Hyderabad to Goa'" },
          activities: {
            type: "object",
            properties: {
              morning: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem", "briefDescription"],
                },
              },
              afternoon: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem", "briefDescription"],
                },
              },
              evening: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem", "briefDescription"],
                },
              },
              night: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    itineraryItem: { type: "string" },
                    briefDescription: { type: "string" },
                  },
                  required: ["itineraryItem", "briefDescription"],
                },
              },
            },
            required: ["morning", "afternoon", "evening", "night"],
          },
          foodrecommendations: {
            type: "array",
            description: "2-3 specific food recommendations for the day with area/restaurant names",
            items: { type: "string" },
          },
          stayoptions: {
            type: "array",
            description: "1-2 hotel/stay recommendations for the day with type and area",
            items: { type: "string" },
          },
          optionalactivities: {
            type: "array",
            description: "2-3 optional activities for the day",
            items: { type: "string" },
          },
          quickbookings: {
            type: "array",
            description: "Booking suggestions for the day - hotels and attractions. Each item should have a name and a search URL for MakeMyTrip or Booking.com",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name like 'Hotel in Goa' or 'Calangute Beach Tour'" },
                url: { type: "string", description: "Search URL on MakeMyTrip or Booking.com for this item" },
                type: { type: "string", description: "hotel or attraction" },
              },
              required: ["name", "url", "type"],
            },
          },
          tip: {
            type: "string",
            description: "One practical travel tip for the day",
          },
        },
        required: ["title", "activities", "foodrecommendations", "stayoptions", "optionalactivities", "quickbookings", "tip"],
      },
    },
    topplacestovisit: {
      type: "array",
      description: "Top places to visit with coordinates, at least 5",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" },
            },
            required: ["lat", "lng"],
          },
        },
        required: ["name", "coordinates"],
      },
    },
  },
  required: ["itinerary", "topplacestovisit"],
};