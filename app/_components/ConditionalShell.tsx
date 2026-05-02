"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";

// Routes that have their own full-page layout (sidebar dashboards)
// — Navbar and Footer should NOT be rendered on these.
const EXCLUDED_PREFIXES = [
  "/dashboard",
  "/organiser",
  "/admin",
  "/profile",
  "/user",
];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering conditional content until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  const isExcluded = EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBE9]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
