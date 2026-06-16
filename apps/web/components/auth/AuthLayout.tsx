"use client";

import Container from "@/components/shared/Container";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center bg-white">
      <Container>
        <div className="flex min-h-[70vh] items-center justify-center py-12">
          {children}
        </div>
      </Container>
    </div>
  );
}
