"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AuthForm({
  mode = "login",
  onSubmit,
  isSubmitting,
  serverError,
}: {
  mode?: "login" | "register" | "forgot";
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => Promise<void> | void;
  isSubmitting?: boolean;
  serverError?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (mode !== "forgot" && password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  }

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setError("");
    setLoading(true);
    try {
      await onSubmit?.({ email, password, remember });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>

      {mode !== "forgot" && (
        <div>
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <button type="button" className="text-sm text-zinc-500" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <Input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>

        {mode === "login" && <a href="/forgot-password" className="text-sm text-zinc-600">Forgot Password?</a>}
      </div>

      {(error || serverError) && <p className="text-sm text-red-600">{error || serverError}</p>}

      <div>
        <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
          {loading || isSubmitting ? "Loading..." : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
        </Button>
      </div>
    </form>
  );
}
