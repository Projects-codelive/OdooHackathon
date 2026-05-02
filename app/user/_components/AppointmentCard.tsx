import { useRouter } from "next/navigation";
import { Clock, MapPin, Users } from "lucide-react";

const ACCENT_COLORS = ["#714B67", "#00A09D", "#E06C00", "#2196F3", "#28A745", "#5B6E8C"];

interface AppointmentCardProps {
  service: any;
  index: number;
}

export default function AppointmentCard({ service, index }: AppointmentCardProps) {
  const router = useRouter();
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const isFree = !service.price || service.price === 0;
  const priceLabel = isFree
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: service.currency || "INR",
        maximumFractionDigits: 0,
      }).format(Number(service.price));

  const initials = (name: string) =>
    name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      onClick={() => router.push(`/user/book/${service.id}`)}
      className="card-hover flex h-full cursor-pointer flex-col rounded-2xl border border-[#E8E0D0] bg-white p-5 shadow-[0_2px_10px_rgba(114,74,106,0.08)]"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-white"
          style={{
            background: color,
          }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isFree ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#F5EDF4] text-[#724A6A]"
          }`}
        >
          {priceLabel}
        </span>
      </div>

      <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#1A1A2E]">{service.title}</h3>

      {service.description && (
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[#8A8AAA]">
          {service.description}
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        {service.location && (
          <span className="flex items-center gap-1 text-xs text-[#6C757D]">
            <MapPin size={12} /> {service.location}
          </span>
        )}
        {service.durationMinutes && (
          <span className="flex items-center gap-1 text-xs text-[#6C757D]">
            <Clock size={12} /> {service.durationMinutes} min
          </span>
        )}
      </div>

      {service.providers?.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <Users size={12} style={{ color: "#6C757D" }} />
          <div className="flex -space-x-1">
            {service.providers.slice(0, 3).map((p: any) => (
              <div
                key={p.id}
                title={p.user?.name ?? "Provider"}
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#714B67",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {initials(p.user?.name ?? "P")}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1" />
      <div className="my-3 border-t border-[#E8E0D0]" />

      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/user/book/${service.id}`);
        }}
        className="btn-primary w-full rounded-xl py-2.5"
      >
        Book Now →
      </button>
    </div>
  );
}
