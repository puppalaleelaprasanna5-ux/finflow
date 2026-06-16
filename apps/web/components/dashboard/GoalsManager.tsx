"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Goal = {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string | null;
};

type GoalFormState = {
  title: string;
  target: string;
  current: string;
  deadline: string;
};

const emptyFormState: GoalFormState = {
  title: "",
  target: "",
  current: "",
  deadline: new Date().toISOString().slice(0, 10),
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [formState, setFormState] = useState<GoalFormState>(emptyFormState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const jwt = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem("jwt");
  }, []);

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  const authHeaders = useMemo<Record<string, string> | undefined>(() => {
    return jwt ? { Authorization: `Bearer ${jwt}` } : undefined;
  }, [jwt]);

  const goalCards = goals.map((goal) => {
    const progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
    const remaining = Math.max(0, goal.target - goal.current);

    return (
      <div key={goal.id} className="rounded-3xl border border-zinc-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">🎯 {goal.title}</p>
            <h2 className="mt-3 text-2xl font-bold">{formatCurrency(goal.target)}</h2>
            <p className="mt-2 text-zinc-500">Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}</p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <p className="text-sm text-zinc-500">Progress</p>
            <p className="text-lg font-semibold">{progress}%</p>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-zinc-200">
          <div className="h-2 rounded-full bg-black" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
          <span>Saved: {formatCurrency(goal.current)}</span>
          <span>{remaining <= 0 ? "Goal reached" : `Left ${formatCurrency(remaining)}`}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => startEdit(goal)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(goal.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  });

  async function loadGoals() {
    if (!jwt) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/goals", {
        headers: {
          ...authHeaders,
        },
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to load goals.");
        return;
      }

      const result = await response.json();
      setGoals(result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(goal: Goal) {
    setEditingGoalId(goal.id);
    setFormState({
      title: goal.title,
      target: String(goal.target),
      current: String(goal.current),
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
    setFormVisible(true);
    setError(null);
  }

  function resetForm() {
    setFormState(emptyFormState);
    setEditingGoalId(null);
    setError(null);
  }

  function handleFieldChange(field: keyof GoalFormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const target = Number(formState.target);
    const current = Number(formState.current || 0);

    if (!formState.title.trim() || Number.isNaN(target) || target <= 0 || Number.isNaN(current) || current < 0) {
      setError("Please enter a valid title, target, and current amount.");
      return;
    }

    if (!jwt) {
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);

    const payload = {
      title: formState.title.trim(),
      target,
      current,
      deadline: formState.deadline || null,
    };

    const url = editingGoalId
      ? `http://localhost:4000/api/goals/${editingGoalId}`
      : "http://localhost:4000/api/goals";
    const method = editingGoalId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to save goal.");
        return;
      }

      resetForm();
      setFormVisible(false);
      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(goalId: string) {
    if (!confirm("Delete this goal?")) {
      return;
    }

    if (!jwt) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/goals/${goalId}`, {
        method: "DELETE",
        headers: {
          ...authHeaders,
        },
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Failed to delete goal.");
        return;
      }

      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Savings Goals</h3>
          <p className="text-sm text-zinc-500">Track your goals, progress, and deadlines.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => { setFormVisible((value) => !value); resetForm(); }}>
            {formVisible ? "Hide form" : "Add goal"}
          </Button>
          <Button type="button" variant="outline" onClick={loadGoals}>
            Refresh
          </Button>
        </div>
      </div>

      {formVisible && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  value={formState.title}
                  onChange={(event) => handleFieldChange("title", event.target.value)}
                />
              </div>
              <div>
                <Label>Target</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.target}
                  onChange={(event) => handleFieldChange("target", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Current Saved</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.current}
                  onChange={(event) => handleFieldChange("current", event.target.value)}
                />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={formState.deadline}
                  onChange={(event) => handleFieldChange("deadline", event.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingGoalId ? "Update goal" : "Create goal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setFormVisible(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-zinc-200 bg-white p-6 text-center text-zinc-500">
            No goals yet. Add one to get started.
          </div>
        ) : (
          goalCards
        )}
      </div>

      {error && !formVisible && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
