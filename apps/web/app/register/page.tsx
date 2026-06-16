"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Create account</h2>
          <p className="text-sm text-zinc-500">Start your FinFlow journey.</p>
        </div>

        <AuthForm mode="register" onSubmit={(d) => console.log("register", d)} />

        <p className="mt-4 text-center text-sm text-zinc-600">
          Already have an account? <Link href="/login" className="text-black font-medium">Sign in</Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
