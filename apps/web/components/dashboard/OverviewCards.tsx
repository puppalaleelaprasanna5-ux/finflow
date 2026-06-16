"use client";

import StatsCard from "./StatsCard";

export default function OverviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard className="h-full" title="Saved" amount="₹6,200" subtitle="+12% this month" emoji="💰" />
      <StatsCard className="h-full" title="Income" amount="₹24,000" subtitle="Monthly" emoji="📈" />
      <StatsCard className="h-full" title="Expenses" amount="₹8,400" subtitle="This month" emoji="💸" />
      <StatsCard className="h-full" title="Goals" amount="3" subtitle="Active goals" emoji="🎯" />
    </div>
  );
}
