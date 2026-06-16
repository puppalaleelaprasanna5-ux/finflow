"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  amount: string;
  subtitle: string;
  emoji: string;
  className?: string;
}

export default function StatsCard({
  title,
  amount,
  subtitle,
  emoji,
  className,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${className ?? ""} rounded-3xl border border-zinc-200 p-5`}
    >
      <p className="text-sm text-zinc-500">
        {emoji} {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        {amount}
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        {subtitle}
      </p>
    </motion.div>
  );
}