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

  const initials = (name: string) =>
    name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      onClick={() => router.push(`/user/book/${service.id}`)}
      style={{
        background: "white",
        border: "1px solid #DEE2E6",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "box-shadow 150ms ease, transform 150ms ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Header row: icon tile + badge */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon tile */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "8px",
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Price badge */}
        {isFree ? (
          <span
            style={{
              background: "#D4EDDA",
              color: "#155724",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "12px",
              padding: "2px 10px",
            }}
          >
            Free
          </span>
        ) : (
          <span
            style={{
              background: "#F3EEF2",
              color: "#714B67",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "12px",
              padding: "2px 10px",
            }}
          >
            ₹{Number(service.price).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#212529",
          marginBottom: "8px",
          lineHeight: 1.3,
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      {service.description && (
        <p
          style={{
            fontSize: "12px",
            color: "#6C757D",
            marginBottom: "10px",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as any}
        >
          {service.description}
        </p>
      )}

      {/* Meta: location + duration */}
      <div className="flex items-center gap-3 mb-3">
        {service.location && (
          <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6C757D" }}>
            <MapPin size={12} /> {service.location}
          </span>
        )}
        {service.durationMinutes && (
          <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6C757D" }}>
            <Clock size={12} /> {service.durationMinutes} min
          </span>
        )}
      </div>

      {/* Providers avatars */}
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

      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ borderTop: "1px solid #DEE2E6", margin: "12px 0" }} />

      {/* Book Now button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/user/book/${service.id}`);
        }}
        style={{
          background: "#714B67",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 500,
          width: "100%",
          cursor: "pointer",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#5C3D56")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#714B67")}
      >
        Book Now →
      </button>
    </div>
  );
}
