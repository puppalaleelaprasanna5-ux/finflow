"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-zinc-200/40 via-transparent to-zinc-300/30 blur-3xl" />

      <div className="relative rounded-[32px] border border-zinc-200 bg-white/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <div>

            <p className="text-sm text-zinc-500">
              Good Evening 👋
            </p>

            <h3 className="text-xl font-semibold">
              Leela
            </h3>

          </div>

          <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium">
            🌸 Blossom
          </div>

        </div>

        {/* Spotlight */}

        <motion.div
          whileHover={{ y: -4 }}
          className="mb-5 rounded-3xl border border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-5"
        >

          <p className="text-sm text-zinc-500">

            🌟 Today's Spotlight

          </p>

          <h3 className="mt-2 text-lg font-semibold">

            Save ₹450 today to stay on track.

          </h3>

          <div className="mt-5 h-2 rounded-full bg-zinc-200">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "82%" }}
              transition={{
                duration: 2,
              }}
              className="h-2 rounded-full bg-black"
            />

          </div>

          <p className="mt-2 text-sm text-zinc-500">

            Laptop Goal • 82%

          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid gap-4 md:grid-cols-2">

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-4"
          >

            <p className="text-sm text-zinc-500">

              💰 Saved

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              ₹6,200

            </h2>

            <p className="mt-1 text-sm text-green-600">

              +12% this month

            </p>

          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-4"
          >

            <p className="text-sm text-zinc-500">

              💸 Spent

            </p>

            <h2 className="mt-2 text-3xl font-bold">

              ₹14,850

            </h2>

            <p className="mt-1 text-sm text-zinc-500">

              Mostly Food & Travel

            </p>

          </motion.div>

        </div>

        {/* Life Vault */}

        <motion.div
          whileHover={{ y: -4 }}
          className="mt-5 rounded-3xl border border-zinc-200 p-5"
        >

          <p className="text-sm text-zinc-500">

            ❤️ Life Vault

          </p>

          <h3 className="mt-2 text-lg font-semibold">

            Bought my first Laptop

          </h3>

          <p className="mt-2 text-sm text-zinc-500">

            "A dream completed after eight months of disciplined saving."

          </p>

        </motion.div>

      </div>

    </motion.div>
  );
}