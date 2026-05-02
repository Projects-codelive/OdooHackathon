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
    <main style={{ background: "#F9F9F9", flex: 1, padding: "24px 32px", overflowY: "auto" }}>
      {/* Heading */}
      <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#212529", marginBottom: "4px" }}>
        Available Appointments
      </h1>
      <p style={{ fontSize: "13px", color: "#6C757D", marginBottom: "20px" }}>
        Book a slot with our providers
      </p>

      {/* Filter row */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {FILTER_BUTTONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{
              background: filter === value ? "#714B67" : "white",
              color: filter === value ? "white" : "#6C757D",
              border: filter === value ? "none" : "1px solid #DEE2E6",
              borderRadius: "4px",
              padding: "6px 16px",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 150ms ease",
              fontWeight: filter === value ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Calendar size={48} style={{ color: "#ADB5BD", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px", color: "#6C757D" }}>No appointments available yet.</p>
          <p style={{ fontSize: "13px", color: "#ADB5BD" }}>Check back soon!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
          className="appointment-grid"
        >
          {filtered.map((service, i) => (
            <AppointmentCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .appointment-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .appointment-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
