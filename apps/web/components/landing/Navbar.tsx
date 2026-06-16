"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "../shared/Container";
import Logo from "../shared/Logo";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#",
  },
  {
    title: "About",
    href: "#",
  },
  {
    title: "GitHub",
    href: "#",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/70 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">

        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition hover:text-black"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Get Started →
          </Button>
        </div>
      </Container>
    </header>
  );
}