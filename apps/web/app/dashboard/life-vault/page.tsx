import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LifeVaultManager from "@/components/dashboard/LifeVaultManager";

export default function LifeVaultPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Life Vault</h1>
          <p className="text-sm text-zinc-500">
            Upload and organize the documents and memories that matter most.
          </p>
        </div>
        <LifeVaultManager />
      </div>
    </DashboardLayout>
  );
}
