"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OAuthButtons from "./OAuthButtons";

interface LoginFormProps {
  roleDisplay?: string;
}

export default function LoginForm({ roleDisplay }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const routeUserBasedOnRole = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "ORGANIZER") {
        router.push("/organiser");
      } else {
        router.push("/user/home");
      }
      router.refresh();
    } catch (err) {
      router.push("/user/home");
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        expectedRole: roleDisplay?.toUpperCase(),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
      } else {
        await routeUserBasedOnRole();
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8E0D0]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="rounded-full border border-[#E8E0D0] bg-[#FFFBE9] px-4 py-1 text-xs uppercase tracking-wider text-[#8A8AAA]">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-[#C62828]/20 bg-[#FFEBEE] p-3 text-sm text-[#C62828]">
            <svg className="h-4 w-4 shrink-0 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#4A4A6A]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-base"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[#4A4A6A]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-base"
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end">
          <Link href="/reset-password" className="text-sm font-medium text-[#724A6A] transition-colors hover:text-[#5A3854] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A8AAA]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#724A6A] transition-colors hover:text-[#5A3854] hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
}
