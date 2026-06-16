"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "../shared/Container";
import DashboardPreview from "@/components/dashboard/DashboardPreview";
export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28">

      {/* Background */}

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-zinc-50 to-white" />

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-zinc-200/30 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-zinc-300/20 blur-3xl" />

      <Container>

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <span className="rounded-full border bg-white px-5 py-2 text-sm shadow-sm">

              ✨ The Finance App That Celebrates Progress

            </span>

            <h1 className="mt-8 text-6xl font-bold leading-tight tracking-tight lg:text-7xl">

              Your Money.

              <br />

              Your Journey.

              <br />

              Your Story.

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600">

              More than an expense tracker.

              FinFlow helps you build healthier financial habits,
              celebrate milestones,
              and remember the moments your money made possible.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                size="lg"
                className="rounded-xl px-8"
              >
                Start Your Journey →
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8"
              >
                Watch Demo
              </Button>

            </div>

          </motion.div>

          {/* Right */}

          <DashboardPreview />

        </div>

      </Container>

    </section>
  );
}