"use client";

import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import GoalCard from "./GoalCard";
import StatsCard from "./StatsCard";
import LifeVaultCard from "./LifeVaultCard";

export default function DashboardPreview() {
  return (
    <motion.div
      animate={{ y: [-8, 8, -8] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-pink-100/20 via-transparent to-purple-100/20 blur-3xl" />

      <div className="relative rounded-[32px] border border-zinc-200 bg-white/80 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Good Evening 👋
            </p>

            <h2 className="text-2xl font-bold">
              Leela
            </h2>
          </div>

          <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium">
            🌸 Blossom
          </span>
        </div>

        <SpotlightCard />

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <GoalCard />

          <StatsCard
            title="Saved"
            amount="₹6,200"
            subtitle="+12% this month"
            emoji="💰"
          />
        </div>

        <div className="mt-5">
          <LifeVaultCard />
        </div>
      </div>
    </motion.div>
  );
}