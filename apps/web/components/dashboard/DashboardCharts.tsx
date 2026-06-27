"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useRouter } from "next/navigation";

const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#F97316"];

type CategoryTotal = { category: string; amount: number };

export default function DashboardCharts() {
  const router = useRouter();
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[] | null>(null);
  const [trend, setTrend] = useState<Array<{ month: string; income: number; expenses: number }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const jwt = useMemo(() => (typeof window === "undefined" ? null : window.localStorage.getItem("jwt")), []);

  useEffect(() => {
    if (!jwt) {
      router.replace("/login");
      return;
    }

    loadChartsData();

    const onRefresh = () => loadChartsData();
    window.addEventListener("dashboard-refresh", onRefresh);
    return () => window.removeEventListener("dashboard-refresh", onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  async function loadChartsData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://finflow-production-55d0.up.railway.app/api/dashboard/summary", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (res.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        const r = await res.json().catch(() => null);
        setError(r?.message || r?.error || "Failed to load analytics");
        return;
      }

      const body = await res.json();
      const data = body?.data ?? {};
      setCategoryTotals(data.categoryTotals ?? []);
      setTrend(data.monthlyTrend ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  const pieData = categoryTotals ? categoryTotals.map((c) => ({ name: c.category, value: c.amount })) : [];

  const barData = trend
    ? trend.map((m) => ({ month: m.month, Income: m.income, Expenses: m.expenses }))
    : [];

  const lineData = trend ? trend.map((m) => ({ month: m.month, expenses: m.expenses })) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Expense by Category</h3>
            <p className="text-sm text-zinc-500">Distribution of expenses by category (last 12 months)</p>
          </div>
          <button
            type="button"
            onClick={loadChartsData}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 h-64">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-lg bg-zinc-100" />
          ) : !pieData.length ? (
            <p className="text-sm text-zinc-500">No expense category data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Income vs Expense</h3>
            <p className="text-sm text-zinc-500">Income and expenses by month</p>
          </div>
          <button
            type="button"
            onClick={loadChartsData}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 h-64">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-lg bg-zinc-100" />
          ) : !barData.length ? (
            <p className="text-sm text-zinc-500">No monthly income/expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="Income" fill="#06B6D4" />
                <Bar dataKey="Expenses" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Monthly Spending Trend</h3>
            <p className="text-sm text-zinc-500">Expenses over time</p>
          </div>
          <button
            type="button"
            onClick={loadChartsData}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 h-64">
          {loading ? (
            <div className="h-full w-full animate-pulse rounded-lg bg-zinc-100" />
          ) : !lineData.length ? (
            <p className="text-sm text-zinc-500">No spending trend data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ReTooltip />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
