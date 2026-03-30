import { batch1Schema, batch2Schema, batch3Schema } from "./schemas";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert travel planner. Always give specific real place names, real restaurant names, exact timings, entry fees, and distances. Never be vague. Always follow the JSON schema field names exactly as given.`;

const callGroqApi = (prompt: string, schema: any, description: string) => {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    tools: [{
      type: "function",
      function: { name: "set_travel_details", parameters: schema, description },
    }],
    tool_choice: { type: "function", function: { name: "set_travel_details" } },
    temperature: 0.7,
    max_tokens: 8000,
  });
};

type GroqInputType = {
  userPrompt: string;
  activityPreferences?: string[];
  customThemes?: string[];
  fromDate?: number;
  toDate?: number;
  companion?: string;
  startingLocation?: string;
  pace?: string;
  weather?: string;
  accommodation?: string;
  food?: string;
  departureTransport?: string;
  localTransport?: string;
  budget?: string;
  currency?: string;
  additionalPreferences?: string;
};

const buildContext = (params: GroqInputType): string => {
  const { userPrompt, startingLocation, companion, activityPreferences, customThemes,
    pace, weather, accommodation, food, departureTransport, localTransport,
    budget, currency, additionalPreferences, fromDate, toDate } = params;

  let ctx = userPrompt;
  if (fromDate && toDate) {
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
    ctx += `, ${days} days from ${new Date(fromDate).toDateString()} to ${new Date(toDate).toDateString()}`;
  }
  if (startingLocation) ctx += `, departing from ${startingLocation}`;
  if (companion) ctx += `, travelling with ${companion}`;
  if (activityPreferences?.length) ctx += `, interests: ${activityPreferences.join(", ")}`;
  if (customThemes?.length) ctx += `, themes: ${customThemes.join(", ")}`;
  if (pace) ctx += `, pace: ${pace}`;
  if (weather) ctx += `, weather preference: ${weather}`;
  if (accommodation) ctx += `, accommodation: ${accommodation}`;
  if (food) ctx += `, food: ${food}`;
  if (departureTransport) ctx += `, travel by: ${departureTransport}`;
  if (localTransport) ctx += `, local transport: ${localTransport}`;
  if (budget) ctx += `, budget: ${budget}`;
  if (currency) ctx += `, currency: ${currency}`;
  if (additionalPreferences) ctx += `, special requests: ${additionalPreferences}`;
  return ctx;
};

export const generatebatch1 = (promptText: string) => {
  const description = `Generate destination overview. abouttheplace: min 100 words, vivid, specific, covers culture/geography/history. besttimetovisit: specific months with reasons, months to avoid. triPhighlights: 3 paragraphs in second person about arrival, core experiences, farewell. weatheranalysis: temperature range, rainfall, what to wear, best time of day outdoors. Be specific, no generic phrases.`;
  return callGroqApi(promptText, batch1Schema, description);
};

export const generatebatch2 = (inputParams: GroqInputType) => {
  const context = buildContext(inputParams);
  const description = `For this trip: ${context}

Generate:
1. adventuresactivitiestodo: 8 activities. Format: "[Activity] at [Real Location] — [why unmissable] — Best time: [time] — Duration: [X hrs] — Cost: [amount]"
2. localcuisinerecommendations: 8 food items. Format: "[Dish] at [Real Restaurant Name], [Area] — [what makes it special] — Price: [range]". Match food preference. Include breakfast/lunch/dinner/street food.
3. packingchecklist: items tailored to destination, weather, activities. Include documents, clothing, health, tech, destination-specific.
4. budgetrange: realistic costs in ${inputParams.currency || "INR"}. totalmin, totalmax, and breakdown for accommodation/food/transport/activities/contingency with min/max/percentage.

Use REAL restaurant names and place names only.`;
  return callGroqApi(context, batch2Schema, description);
};

export const generatebatch3 = (inputParams: GroqInputType) => {
  const context = buildContext(inputParams);
  const days = inputParams.fromDate && inputParams.toDate
    ? Math.ceil((inputParams.toDate - inputParams.fromDate) / (1000 * 60 * 60 * 24)) + 1
    : 3;

  const description = `Create a ${days}-day itinerary for: ${context}

RULES:
${inputParams.startingLocation ? `- Day 1 = travel day FROM ${inputParams.startingLocation} TO destination. Show exact departure time, travel mode, arrival time, check-in.` : ""}
- Each day title: vivid and specific e.g. "Amber Fort, Jantar Mantar & Sunset at Nahargarh" NOT "Day 2 Sightseeing"
- daytheme: one line e.g. "History & Architecture"
- estimateddailycost: e.g. "2500-4000 INR per person"
- morning/afternoon/evening/night activities: format "[TIME] — [Real Place]: [what to do]. [why special]. Duration: [X hrs]. Entry: [cost]."
- Group activities geographically
- foodrecommendations: 3 per day. Format: "[Meal] at [Real Restaurant], [Area] — Must try: [dish] — Price: [range] — Tip: [specific tip]"
- stayoptions: 2 hotels per day. Format: "[Hotel Name], [Area] — [X star] — [price/night] — Best for: [who] — Highlight: [what is special]"
- optionalactivities: 3 hidden gems. Format: "[Activity] — [why special] — [duration] — [cost]"
- quickbookings: hotels use type=hotel url=/book-hotel ONLY. Attractions use type=attraction with Google Maps URL.
- tip: ONE specific insider tip with real names/prices/timings. NOT generic.
- topplacestovisit: 8 places with real GPS coordinates, description, category.`;

  return callGroqApi(context, batch3Schema, description);
};