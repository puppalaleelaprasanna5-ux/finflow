import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-zinc-500">
          Manage your income and expenses from a single dashboard.
        </p>
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
}
