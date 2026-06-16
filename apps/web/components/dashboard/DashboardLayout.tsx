"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="flex w-full gap-6 px-6 py-6">
        <Sidebar />

        <main className="flex min-h-[80vh] flex-1 flex-col gap-6">
          <Header />

          <div className="rounded-2xl bg-white p-6 shadow-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
