"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-sm text-zinc-500">Welcome back — please enter your details.</p>
        </div>

        <AuthForm mode="login" onSubmit={(d) => console.log("login", d)} />

        <p className="mt-4 text-center text-sm text-zinc-600">
          Don't have an account? <Link href="/register" className="text-black font-medium">Create one</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
