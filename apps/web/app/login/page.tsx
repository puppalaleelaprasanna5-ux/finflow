"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleLogin({ email, password }: { email: string; password: string; remember: boolean }) {
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setApiError(body?.message || body?.error || "Unable to sign in. Please check your credentials.");
        return;
      }

      if (!body?.data?.token || !body?.data?.user) {
        setApiError("Unexpected response from the server.");
        return;
      }

      localStorage.setItem("jwt", body.data.token);
      localStorage.setItem("user", JSON.stringify(body.data.user));
      router.push("/dashboard");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unable to connect to the login service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-sm text-zinc-500">Welcome back — please enter your details.</p>
        </div>

        <AuthForm mode="login" onSubmit={handleLogin} isSubmitting={loading} serverError={apiError} />

        <p className="mt-4 text-center text-sm text-zinc-600">
          Don't have an account? <Link href="/register" className="text-black font-medium">Create one</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
