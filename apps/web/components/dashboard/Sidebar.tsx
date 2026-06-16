"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, List, Target, Archive, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/transactions", label: "Transactions", icon: List },
    { href: "/dashboard/goals", label: "Goals", icon: Target },
    { href: "/dashboard/life-vault", label: "Life Vault", icon: Archive },
  ];

  const widthClass = collapsed ? "w-20" : "w-[280px]";

  return (
    <aside className={`${widthClass} shrink-0 p-6 hidden md:block`}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold">{!collapsed && "FinFlow"}</h3>
            {!collapsed && <p className="text-sm text-zinc-500">Personal finance</p>}
          </div>

          <nav className="space-y-3">
            {links.map((l) => {
              const Icon = l.icon as any;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-zinc-700 hover:bg-zinc-100"
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{l.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
