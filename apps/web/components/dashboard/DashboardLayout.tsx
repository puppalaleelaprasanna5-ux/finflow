"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const jwt = window.localStorage.getItem("jwt");
    if (!jwt) {
      router.replace("/login");
      return;
    }

    async function verifyToken() {
      try {
        const response = await fetch("https://finflow-production-55d0.up.railway.app/api/auth/me", {
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
          router.replace("/login");
          return;
        }

        setIsReady(true);
      } catch (error) {
        router.replace("/login");
      }
    }

    verifyToken();
  }, [router]);

  if (!isReady) {
    return null;
  }

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
