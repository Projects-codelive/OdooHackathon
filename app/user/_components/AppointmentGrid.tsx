"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import AppointmentCard from "./AppointmentCard";

type FilterType = "all" | "free" | "paid";

interface AppointmentGridProps {
  appointments: any[];
  searchQuery?: string;
}

const FILTER_BUTTONS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

export default function AppointmentGrid({ appointments, searchQuery = "" }: AppointmentGridProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    let list = appointments;

    // Apply price filter
    if (filter === "free") list = list.filter((s) => !s.price || s.price === 0);
    if (filter === "paid") list = list.filter((s) => s.price && s.price > 0);

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [appointments, filter, searchQuery]);

  return (
    <main className="flex-1 rounded-2xl border border-[#E8E0D0] bg-[#FFFBE9]/50 p-5 sm:p-6">
      <h2 className="text-xl font-bold text-[#1A1A2E]">Available Appointments</h2>
      <p className="mt-1 text-sm text-[#8A8AAA]">Book a slot with our providers.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTER_BUTTONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              filter === value
                ? "bg-[#724A6A] text-white"
                : "border border-[#E8E0D0] bg-white text-[#4A4A6A] hover:border-[#724A6A]/30 hover:text-[#724A6A]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-[#E8E0D0] bg-white p-10 text-center">
          <Calendar size={42} className="mx-auto text-[#B8B8CC]" />
          <p className="mt-3 text-sm font-medium text-[#4A4A6A]">No appointments available yet.</p>
          <p className="text-xs text-[#8A8AAA]">Check back soon for new slots.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service, i) => (
            <AppointmentCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
