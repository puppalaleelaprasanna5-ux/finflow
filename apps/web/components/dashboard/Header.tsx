"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleLogout() {
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("user");
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between gap-6 p-6">
      <div className="flex flex-1 items-center gap-6">
        <div className="hidden md:block">
          <p className="text-sm text-zinc-500">Good Evening 👋</p>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <div className="relative w-full max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search transactions, goals..."
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-md px-3 py-2 text-sm hover:bg-zinc-100">🔔</button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-200"
        >
          Logout
        </button>

        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="Leela" />
          <AvatarFallback>LL</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
