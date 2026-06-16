"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleRegister({ email, password }: { email: string; password: string; remember: boolean }) {
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setApiError(body?.message || body?.error || "Unable to register. Please check your details.");
        return;
      }

      router.push("/login");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to connect to the registration service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-sm text-zinc-500">Start your FinFlow journey.</p>
        </div>

        <AuthForm mode="register" onSubmit={handleRegister} isSubmitting={loading} serverError={apiError} />

        <p className="mt-4 text-center text-sm text-zinc-600">
          Already have an account? <Link href="/login" className="text-black font-medium">Sign in</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
