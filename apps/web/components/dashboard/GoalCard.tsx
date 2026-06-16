"use client";

import { motion } from "framer-motion";

export default function GoalCard() {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-zinc-200 p-5"
    >
      <p className="text-sm text-zinc-500">
        🎯 Dream Goal
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        MacBook Pro
      </h2>

      <p className="mt-2 text-zinc-500">
        ₹1,23,000 Target
      </p>

      <div className="mt-5 h-2 rounded-full bg-zinc-200">
        <div className="h-2 w-[82%] rounded-full bg-black" />
      </div>

      <p className="mt-3 text-green-600 text-sm">
        ₹22,000 left
      </p>
    </motion.div>
  );
}