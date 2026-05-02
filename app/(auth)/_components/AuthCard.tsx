"use client";

import { ReactNode } from "react";
import BookoraLogo from "@/app/_components/BookoraLogo";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFFBE9] px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -right-28 h-[460px] w-[460px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #FFF3C4 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-20 h-[380px] w-[380px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #F5EDF4 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <BookoraLogo height={90} linked />
        </div>

        <div className="rounded-3xl border border-[#E8E0D0] bg-white/90 p-7 shadow-[0_12px_40px_rgba(114,74,106,0.14)] backdrop-blur-sm sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EDF4] text-[#724A6A] shadow-[0_4px_16px_rgba(114,74,106,0.2)]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A1A2E]">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[#8A8AAA]">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
