"use server";
import { formSchemaType } from "@/components/NewPlanForm";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";
import { redirect } from "next/navigation";
import { differenceInDays } from "date-fns";

export async function generatePlanAction(formData: formSchemaType) {
  const token = await getAuthToken();
  const {
    placeName,
    activityPreferences,
    customThemes,
    datesOfTravel,
    companion,
    startingLocation,
    pace,
    weather,
    accommodation,
    food,
    departureTransport,
    localTransport,
    budget,
    currency,
    additionalPreferences,
  } = formData;

  const userData = await fetchQuery(api.users.currentUser, {}, { token });
  const totalCredits = (userData?.credits ?? 0) + (userData?.freeCredits ?? 0);
  if (totalCredits <= 0) {
    console.log(`unable to create ai travel plan due to low credits user:${userData?.userId}`);
    return null;
  }

  // Build enriched prompt with all user preferences
  const noOfDays = (differenceInDays(datesOfTravel.to, datesOfTravel.from) + 1).toString();
  
  let enrichedPrompt = `${noOfDays} days trip to ${placeName}`;
  if (startingLocation) enrichedPrompt += `, starting from ${startingLocation}`;
  if (companion) enrichedPrompt += `, travelling with ${companion}`;
  if (activityPreferences && activityPreferences.length > 0) enrichedPrompt += `, activity preferences: ${activityPreferences.join(", ")}`;
  if (customThemes && customThemes.length > 0) enrichedPrompt += `, custom themes: ${customThemes.join(", ")}`;
  if (pace) enrichedPrompt += `, travel pace: ${pace}`;
  if (weather) enrichedPrompt += `, preferred weather: ${weather}`;
  if (accommodation) enrichedPrompt += `, preferred accommodation: ${accommodation}`;
  if (food) enrichedPrompt += `, food preference: ${food}`;
  if (departureTransport) enrichedPrompt += `, travel from home city to destination by: ${departureTransport}`;
  if (localTransport) enrichedPrompt += `, local transport at destination: ${localTransport}`;
  if (budget) enrichedPrompt += `, budget: ${budget}`;
  if (currency) enrichedPrompt += `, preferred currency: ${currency}`;
  if (additionalPreferences) enrichedPrompt += `, additional preferences: ${additionalPreferences}`;

  const planId = await fetchMutation(
    api.plan.createEmptyPlan,
    {
      placeName,
      noOfDays,
      activityPreferences,
      fromDate: datesOfTravel.from.getTime(),
      toDate: datesOfTravel.to.getTime(),
      companion,
      isGeneratedUsingAI: true,
      userPrompt: enrichedPrompt,
      startingLocation: startingLocation ?? undefined,
      departureTransport: departureTransport ?? undefined,
      localTransport: localTransport ?? undefined,
    },
    { token }
  );

  if (planId === null) return null;

  fetchMutation(
    api.retrier.runAction,
    { action: "images:generateAndStore", actionArgs: { prompt: placeName, planId } },
    { token }
  );

  fetchMutation(
    api.retrier.runAction,
    { action: "plan:prepareBatch1", actionArgs: { planId } },
    { token }
  );

  fetchMutation(
    api.retrier.runAction,
    { action: "plan:prepareBatch2", actionArgs: { planId } },
    { token }
  );

  fetchMutation(
    api.retrier.runAction,
    { action: "plan:prepareBatch3", actionArgs: { planId } },
    { token }
  );

  fetchMutation(api.users.reduceUserCreditsByOne, {}, { token });
  redirect(`/plans/${planId}/plan?isNewPlan=true`);
}