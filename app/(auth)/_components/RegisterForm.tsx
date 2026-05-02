"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import OAuthButtons from "./OAuthButtons";

interface RegisterFormProps {
  fixedRole?: "USER" | "ORGANIZER";
}

export default function RegisterForm({ fixedRole }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(fixedRole || "USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please try logging in.");
      } else {
        const redirectPath = role === "ORGANIZER" ? "/organiser" : "/user/home";
        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
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
            or register with email
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

        {!fixedRole && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[#4A4A6A]">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`py-2 px-1 text-sm font-medium rounded-xl border transition-all ${
                  role === "USER"
                    ? "border-[#724A6A] bg-[#F5EDF4] text-[#724A6A]"
                    : "border-[#E8E0D0] bg-white text-[#8A8AAA] hover:border-[#724A6A]/30"
                }`}
              >
                👤 User
              </button>
              <button
                type="button"
                onClick={() => setRole("ORGANIZER")}
                className={`py-2 px-1 text-sm font-medium rounded-xl border transition-all ${
                  role === "ORGANIZER"
                    ? "border-[#724A6A] bg-[#F5EDF4] text-[#724A6A]"
                    : "border-[#E8E0D0] bg-white text-[#8A8AAA] hover:border-[#724A6A]/30"
                }`}
              >
                🏢 Organizer
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#4A4A6A]">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-base"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#4A4A6A]">
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#4A4A6A]">
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

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#4A4A6A]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-base"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-4 w-full py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A8AAA]">
        Already have an account?{" "}
        <Link href={fixedRole === "ORGANIZER" ? "/organizer/login" : "/user/login"} className="font-semibold text-[#724A6A] transition-colors hover:text-[#5A3854] hover:underline">
          Login instead
        </Link>
      </p>
    </div>
  );
}
