"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import { DollarSign, Hotel, Utensils, Car, Zap, Shield, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BudgetRangeProps = {
  budgetrange: Doc<"plan">["budgetrange"] | undefined;
  isLoading: boolean;
};

const tabs = ["Essentials", "Activities", "Transport"];

const categoryConfig = {
  accommodation: {
    label: "Accommodation",
    icon: <Hotel className="w-4 h-4 text-white" />,
    bg: "bg-blue-500",
    bar: "bg-blue-500",
    tab: "Essentials",
  },
  food: {
    label: "Food",
    icon: <Utensils className="w-4 h-4 text-white" />,
    bg: "bg-green-500",
    bar: "bg-green-500",
    tab: "Essentials",
  },
  transport: {
    label: "Transport",
    icon: <Car className="w-4 h-4 text-white" />,
    bg: "bg-purple-500",
    bar: "bg-purple-500",
    tab: "Transport",
  },
  activities: {
    label: "Activities",
    icon: <Zap className="w-4 h-4 text-white" />,
    bg: "bg-yellow-500",
    bar: "bg-yellow-500",
    tab: "Activities",
  },
  contingency: {
    label: "Contingency",
    icon: <HelpCircle className="w-4 h-4 text-white" />,
    bg: "bg-pink-500",
    bar: "bg-pink-500",
    tab: "Essentials",
  },
};

const formatCurrency = (amount: number, currency: string) => {
  const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "₹";
  return `${symbol} ${amount.toLocaleString("en-IN")}`;
};

const BudgetRange = ({ budgetrange, isLoading }: BudgetRangeProps) => {
  const [activeTab, setActiveTab] = useState("Essentials");

  if (isLoading || !budgetrange) {
    return (
      <SectionWrapper id="budget">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Budget Range</h2>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </SectionWrapper>
    );
  }

  const currency = budgetrange.currency?.split(" - ")[0] || "INR";

  const categories = Object.entries(categoryConfig).filter(
    ([key]) => budgetrange[key as keyof typeof budgetrange]
  );

  const filteredCategories = categories.filter(
    ([, config]) => config.tab === activeTab
  );

  return (
    <SectionWrapper id="budget">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Budget Range</h2>
      </div>

      {/* Total Cost */}
      <div className="border border-border rounded-2xl p-5 mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total Estimated Cost
          </p>
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
            {currency}
          </span>
        </div>
        <p className="text-3xl font-bold mt-1">
          {formatCurrency(budgetrange.totalmin, currency)}{" "}
          <span className="text-muted-foreground text-2xl">—</span>{" "}
          {formatCurrency(budgetrange.totalmax, currency)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeTab === tab
                ? "bg-blue-500 text-white border-blue-500"
                : "border-border text-muted-foreground hover:border-blue-300"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Items */}
      <div className="flex flex-col gap-3">
        {filteredCategories.map(([key, config]) => {
          const data = budgetrange[key as keyof typeof budgetrange] as {
            min: number;
            max: number;
            percentage: number;
          };
          if (!data || typeof data !== "object") return null;

          return (
            <div key={key} className="border border-border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", config.bg)}>
                    {config.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{config.label}</p>
                    <p className="text-xs text-muted-foreground">~{data.percentage}% of total budget</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-right">
                  {formatCurrency(data.min, currency)}{" "}
                  <span className="text-muted-foreground">—</span>{" "}
                  {formatCurrency(data.max, currency)}
                </p>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                <div
                  className={cn("h-1.5 rounded-full", config.bar)}
                  style={{ width: `${Math.min(data.percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default BudgetRange;