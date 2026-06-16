"use client";

import { motion } from "framer-motion";

export default function SpotlightCard() {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-zinc-200 bg-gradient-to-r from-white to-zinc-50 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">
          🌟 Today's Spotlight
        </span>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          On Track
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold">
        Save ₹450 today to stay on track.
      </h3>

      <div className="mt-6 h-2 rounded-full bg-zinc-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "82%" }}
          transition={{ duration: 2 }}
          className="h-2 rounded-full bg-black"
        />
      </div>

      <div className="mt-3 flex justify-between text-sm text-zinc-500">
        <span>Laptop Goal</span>
        <span>82%</span>
      </div>
    </motion.div>
  );
}