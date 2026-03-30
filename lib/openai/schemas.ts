export const batch1Schema = {
  type: "object",
  properties: {
    abouttheplace: { type: "string" },
    besttimetovisit: { type: "string" },
    triPhighlights: { type: "string" },
    weatheranalysis: {
      type: "object",
      properties: {
        expectedconditions: { type: "string" },
        besttimetovisit: { type: "string" },
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
      items: { type: "string" },
    },
    localcuisinerecommendations: {
      type: "array",
      items: { type: "string" },
    },
    packingchecklist: {
      type: "array",
      items: { type: "string" },
    },
    budgetrange: {
      type: "object",
      properties: {
        totalmin: { type: "number" },
        totalmax: { type: "number" },
        currency: { type: "string" },
        accommodation: {
          type: "object",
          properties: {
            min: { type: "number" },
            max: { type: "number" },
            percentage: { type: "number" },
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
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          daytheme: { type: "string" },
          estimateddailycost: { type: "string" },
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
            items: { type: "string" },
          },
          stayoptions: {
            type: "array",
            items: { type: "string" },
          },
          optionalactivities: {
            type: "array",
            items: { type: "string" },
          },
          quickbookings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                url: { type: "string" },
                type: { type: "string" },
              },
              required: ["name", "url", "type"],
            },
          },
          tip: { type: "string" },
        },
        required: ["title", "daytheme", "estimateddailycost", "activities", "foodrecommendations", "stayoptions", "optionalactivities", "quickbookings", "tip"],
      },
    },
    topplacestovisit: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" },
            },
            required: ["lat", "lng"],
          },
        },
        required: ["name", "description", "category", "coordinates"],
      },
    },
  },
  required: ["itinerary", "topplacestovisit"],
};