"use client";

import { useEffect, useMemo, useState } from "react";
import StatsCard from "./StatsCard";
import { useRouter } from "next/navigation";

export type DashboardSummaryData = {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  goalProgress: number;
  recentTransactions: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    type: string;
    notes: string | null;
    date: string;
  }>;
  recentGoals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string | null;
    progress: number;
  }>;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

export default function DashboardSummary() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jwt = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("jwt");
  }, []);

  useEffect(() => {
    if (!jwt) {
      router.replace("/login");
      return;
    }

    loadSummary();
    const handleRefresh = () => {
      loadSummary();
    };

    window.addEventListener("dashboard-refresh", handleRefresh);
    return () => {
      window.removeEventListener("dashboard-refresh", handleRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  async function loadSummary() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Unable to load dashboard summary.");
        return;
      }

      const result = await response.json();
      setSummary(result?.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard summary.");
    } finally {
      setLoading(false);
    }
  }

  const recentTransactions = summary?.recentTransactions ?? [];
  const recentGoals = summary?.recentGoals ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          className="h-full"
          title="Balance"
          amount={loading ? "Loading..." : formatCurrency(summary?.balance ?? 0)}
          subtitle="Net total"
          emoji="💰"
        />
        <StatsCard
          className="h-full"
          title="Income"
          amount={loading ? "Loading..." : formatCurrency(summary?.income ?? 0)}
          subtitle="Total income"
          emoji="📈"
        />
        <StatsCard
          className="h-full"
          title="Expenses"
          amount={loading ? "Loading..." : formatCurrency(summary?.expenses ?? 0)}
          subtitle="Total expenses"
          emoji="💸"
        />
        <StatsCard
          className="h-full"
          title="Goal Progress"
          amount={loading ? "Loading..." : `${summary?.goalProgress ?? 0}%`}
          subtitle="Savings progress"
          emoji="🎯"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <p className="text-sm text-zinc-500">Latest income and expenses.</p>
            </div>
            <button
              type="button"
              onClick={loadSummary}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-12 rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <p className="mt-5 text-sm text-zinc-500">No recent transactions yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="rounded-3xl border border-zinc-100 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{transaction.title}</p>
                      <p className="text-sm text-zinc-500">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {transaction.type === "EXPENSE" ? "-" : "+"}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-zinc-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Goals</h3>
              <p className="text-sm text-zinc-500">Track your latest savings goals.</p>
            </div>
            <button
              type="button"
              onClick={loadSummary}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-14 rounded-2xl bg-zinc-100" />
              ))}
            </div>
          ) : recentGoals.length === 0 ? (
            <p className="mt-5 text-sm text-zinc-500">No recent goals yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {recentGoals.map((goal) => (
                <div key={goal.id} className="rounded-3xl border border-zinc-100 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-sm text-zinc-500">{goal.progress}% complete</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(goal.current)}</p>
                      <p className="text-xs text-zinc-500">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
