import {
  batch1Schema,
  batch2Schema,
  batch3Schema
} from "./schemas";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const promptSuffix = `generate travel data according to the schema and in json format,
                     do not return anything in your response outside of curly braces, 
                     generate response as per the functin schema provided. Dates given,
                     activity preference and travelling with may influence likw 50% while generating plan.`;

const callGroqApi = (prompt: string, schema: any, description: string) => {
  console.log({ prompt, schema });
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a helpful travel assistant." },
      { role: "user", content: prompt },
    ],
    tools: [{ 
      type: "function",
      function: { name: "set_travel_details", parameters: schema, description } 
    }],
    tool_choice: { type: "function", function: { name: "set_travel_details" } },
  });
}

export const generatebatch1 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  const description = `Generate rich travel information including:
  - About the Place: detailed description in at least 80 words
  - Best Time to Visit: specific months and reasons
  - Trip Highlights: a compelling 3-paragraph narrative story of the trip written in second person, mentioning specific places, food, accommodation, and experiences based on all user preferences
  - Weather Analysis: expected weather conditions during travel dates and best time to visit
  Ensure response is in JSON format matching the schema exactly.`;
  return callGroqApi(prompt, batch1Schema, description);
}

type GroqInputType = {
  userPrompt: string;
  activityPreferences?: string[] | undefined;
  customThemes?: string[] | undefined;
  fromDate?: number | undefined;
  toDate?: number | undefined;
  companion?: string | undefined;
  startingLocation?: string | undefined;
  pace?: string | undefined;
  weather?: string | undefined;
  accommodation?: string | undefined;
  food?: string | undefined;
  departureTransport?: string | undefined;
  localTransport?: string | undefined;
  budget?: string | undefined;
  currency?: string | undefined;
  additionalPreferences?: string | undefined;
};

export const generatebatch2 = (inputParams: GroqInputType) => {
  const description = `Generate detailed trip recommendations including:
  - Top Adventure Activities: at least 5 with specific location names
  - Local Cuisine Recommendations: specific dishes and where to find them
  - Packing Checklist: tailored to destination, weather, and activities
  - Budget Range: detailed cost breakdown in user's preferred currency with min/max for accommodation, food, transport, activities, and contingency
  Ensure response is in JSON format matching the schema exactly.`;
  return callGroqApi(getPrompt(inputParams), batch2Schema, description);
}

export const generatebatch3 = (inputParams: GroqInputType) => {
  const description = `Generate a rich day-by-day travel itinerary starting from the DEPARTURE day from the starting location. Each day must include:
  - Title: catchy day title
  - Activities: morning, afternoon, evening, night schedules with descriptions
  - Food Recommendations: 2-3 specific restaurants/areas with cuisine type
  - Stay Options: 1-2 hotel recommendations with type and area
  - Optional Activities: 2-3 optional things to do
  - Quick Bookings: hotel booking link on MakeMyTrip (https://www.makemytrip.com/hotels/) and attraction links, each with name, url, and type
  - Tip: one practical travel tip
  Also include top 5+ places to visit with coordinates.
  Ensure response is in JSON format matching the schema exactly.`;
  return callGroqApi(getPrompt(inputParams), batch3Schema, description);
}

const getPrompt = ({ 
  userPrompt, activityPreferences, customThemes, companion, fromDate, toDate,
  startingLocation, pace, weather, accommodation, food,
  departureTransport, localTransport, budget, currency, additionalPreferences
}: GroqInputType) => {
  let prompt = `${userPrompt}, from date-${fromDate} to date-${toDate}`;

  if (startingLocation) prompt += `, starting from ${startingLocation}`;
  if (companion) prompt += `, travelling with ${companion}`;
  if (activityPreferences && activityPreferences.length > 0) prompt += `, activity preferences: ${activityPreferences.join(", ")}`;
  if (customThemes && customThemes.length > 0) prompt += `, custom themes: ${customThemes.join(", ")}`;
  if (pace) prompt += `, travel pace: ${pace}`;
  if (weather) prompt += `, preferred weather: ${weather}`;
  if (accommodation) prompt += `, accommodation type: ${accommodation}`;
  if (food) prompt += `, food preference: ${food}`;
  if (departureTransport) prompt += `, travel from home city to destination by: ${departureTransport}`;
  if (localTransport) prompt += `, local transport at destination: ${localTransport}`;
  if (budget) prompt += `, budget: ${budget}`;
  if (currency) prompt += `, currency: ${currency}`;
  if (additionalPreferences) prompt += `, additional preferences: ${additionalPreferences}`;

  prompt = `${prompt}, ${promptSuffix}`;
  return prompt;
}