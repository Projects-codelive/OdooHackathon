"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
        router.push("/admin/dashboard");
      } else if (role === "ORGANIZER") {
        router.push("/organizer/dashboard");
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
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-transparent px-4 text-gray-400 bg-slate-900/50 rounded-full py-1 text-xs tracking-wider uppercase backdrop-blur-sm border border-white/5">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="text-red-200 text-sm bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end">
          <a
            href="/reset-password"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors hover:underline decoration-purple-400/30 underline-offset-4"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline decoration-purple-400/30 underline-offset-4">
          Register now
        </a>
      </p>
    </div>
  );
}
