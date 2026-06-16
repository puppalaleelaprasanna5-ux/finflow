"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TransactionType = "INCOME" | "EXPENSE";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  notes?: string | null;
  date: string;
};

type TransactionFormState = {
  title: string;
  category: string;
  amount: string;
  type: TransactionType;
  date: string;
  notes: string;
};

const initialFormState: TransactionFormState = {
  title: "",
  category: "",
  amount: "",
  type: "EXPENSE",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function RecentTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formState, setFormState] = useState<TransactionFormState>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const jwt = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("jwt");
  }, []);

  const formattedTransactions = transactions.map((transaction) => {
    const amountString = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(transaction.amount);

    return {
      ...transaction,
      displayAmount: `${transaction.type === "EXPENSE" ? "-" : "+"}${amountString}`,
    };
  });

  useEffect(() => {
    if (!jwt) {
      router.replace("/login");
      return;
    }

    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  async function loadTransactions() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/transactions", {
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
        setError(result?.message || result?.error || "Unable to load transactions.");
        return;
      }

      const result = await response.json();
      setTransactions(result?.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(field: keyof TransactionFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(transaction: Transaction) {
    setFormState({
      title: transaction.title,
      category: transaction.category,
      amount: String(transaction.amount),
      type: transaction.type,
      date: transaction.date.slice(0, 10),
      notes: transaction.notes || "",
    });
    setEditingId(transaction.id);
    setFormVisible(true);
    setError(null);
  }

  function resetForm() {
    setFormState(initialFormState);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const amount = Number(formState.amount);
    if (!formState.title.trim() || !formState.category.trim() || Number.isNaN(amount) || amount <= 0) {
      setError("Please enter a valid title, category, and positive amount.");
      return;
    }

    if (!jwt) {
      router.replace("/login");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formState.title.trim(),
        category: formState.category.trim(),
        amount,
        type: formState.type,
        date: formState.date,
        notes: formState.notes.trim() || undefined,
      };

      const url = editingId
        ? `http://localhost:4000/api/transactions/${editingId}`
        : "http://localhost:4000/api/transactions";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.message || result?.error || "Unable to save transaction.");
        return;
      }

      resetForm();
      setFormVisible(false);
      await loadTransactions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save transaction.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(transactionId: string) {
    if (!confirm("Delete this transaction?")) {
      return;
    }

    if (!jwt) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/transactions/${transactionId}`, {
        method: "DELETE",
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
        setError(result?.message || result?.error || "Unable to delete transaction.");
        return;
      }

      await loadTransactions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete transaction.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-zinc-500">Your latest expense and income entries.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setFormVisible((visible) => !visible)}>
            {formVisible ? "Hide form" : editingId ? "Edit transaction" : "Add transaction"}
          </Button>
          <Button type="button" variant="outline" onClick={loadTransactions}>
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
                <Label>Category</Label>
                <Input
                  value={formState.category}
                  onChange={(event) => handleFieldChange("category", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Amount</Label>
                <Input
                  value={formState.amount}
                  onChange={(event) => handleFieldChange("amount", event.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={formState.type}
                  onChange={(event) => handleFieldChange("type", event.target.value)}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  value={formState.date}
                  onChange={(event) => handleFieldChange("date", event.target.value)}
                  type="date"
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <textarea
                value={formState.notes}
                onChange={(event) => handleFieldChange("notes", event.target.value)}
                className="flex min-h-[72px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update transaction" : "Add transaction"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { resetForm(); setFormVisible(false); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full table-auto">
          <thead className="bg-zinc-100 text-left text-sm text-zinc-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                  Loading transactions...
                </td>
              </tr>
            ) : formattedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                  No transactions yet. Add one above.
                </td>
              </tr>
            ) : (
              formattedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t last:border-b">
                  <td className="px-4 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{transaction.title}</td>
                  <td className="px-4 py-3">{transaction.category}</td>
                  <td className="px-4 py-3">{transaction.type}</td>
                  <td className={`px-4 py-3 ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.displayAmount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => startEdit(transaction)}>
                        Edit
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(transaction.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && !formVisible && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
