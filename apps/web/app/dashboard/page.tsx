import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardSummary from "../../components/dashboard/DashboardSummary";
import SpotlightCard from "../../components/dashboard/SpotlightCard";
import GoalCard from "../../components/dashboard/GoalCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import LifeVaultCard from "../../components/dashboard/LifeVaultCard";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardSummary />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <SpotlightCard />
            <div className="mt-6">
              <RecentTransactions />
            </div>
          </div>

          <div className="space-y-6">
            <GoalCard />
            <LifeVaultCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
