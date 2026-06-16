"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="max-w-md mx-auto w-full">
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
