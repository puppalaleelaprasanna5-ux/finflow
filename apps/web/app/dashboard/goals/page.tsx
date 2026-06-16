import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GoalsManager from "@/components/dashboard/GoalsManager";

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="text-sm text-zinc-500">
            Create, update, and track your savings goals from one place.
          </p>
        </div>
        <GoalsManager />
      </div>
    </DashboardLayout>
  );
}
