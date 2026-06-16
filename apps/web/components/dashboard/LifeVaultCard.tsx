"use client";

import { motion } from "framer-motion";

export default function LifeVaultCard() {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-zinc-200 p-5"
    >
      <p className="text-sm text-zinc-500">
        ❤️ Life Vault
      </p>

      <h3 className="mt-3 text-xl font-semibold">
        Bought my first Laptop
      </h3>

      <p className="mt-2 text-sm text-zinc-500 italic">
        "Dream achieved after eight months of disciplined saving."
      </p>
    </motion.div>
  );
}