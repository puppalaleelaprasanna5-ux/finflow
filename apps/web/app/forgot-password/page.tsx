"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export default function ForgotPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Reset password</h2>
          <p className="text-sm text-zinc-500">Enter your email to receive reset instructions.</p>
        </div>

        <AuthForm mode="forgot" onSubmit={(d) => console.log("forgot", d)} />
      </AuthCard>
    </AuthLayout>
  );
}
