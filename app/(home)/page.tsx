"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import TravelHero from "@/components/home/TravelHero";
import { cn } from "@/lib/utils";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { Loading } from "@/components/shared/Loading";

export default function Home() {
  return (
    <motion.section
      className="flex flex-col md:flex-row w-full min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left - Hero Illustration */}
      <motion.article
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden",
          "md:w-[60vw] w-full min-h-[50vh] md:min-h-screen",
          "bg-gradient-to-br dark:from-[#181A20] dark:via-[#101114] dark:to-[#181A20]"
        )}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-h-[70vh] max-w-[70vw] w-full h-full flex items-center justify-center mx-auto">
          <TravelHero />
        </div>
      </motion.article>

      {/* Right - CTA */}
      <motion.article
        className="flex flex-col items-center justify-center md:w-[40vw] w-full min-h-[50vh] md:min-h-screen px-10 gap-8"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Travel Planner <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm">
            Plan your perfect trip in seconds. AI-powered itineraries, packing lists, local cuisine tips and more.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <AuthLoading>
            <Loading />
          </AuthLoading>

          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                Get Started — It's Free
              </button>
            </SignInButton>
          </Unauthenticated>

          <Authenticated>
            <Link href="/dashboard">

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                Go to Dashboard
              </button>
            </Link>
          </Authenticated>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>✈️ AI-generated itineraries</p>
          <p>🗺️ Interactive maps</p>
          <p>👥 Collaborate with friends</p>
          <p>💰 Expense tracking</p>
        </div>
      </motion.article>
    </motion.section>
  );
}