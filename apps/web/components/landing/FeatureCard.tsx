"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  emoji,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
    >
      <div className="mb-6 flex items-center justify-between">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">
          {emoji}
        </div>

        <ArrowUpRight className="text-zinc-400 transition group-hover:translate-x-1 group-hover:-translate-y-1" />

      </div>

      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-zinc-600">
        {description}
      </p>
    </motion.div>
  );
}