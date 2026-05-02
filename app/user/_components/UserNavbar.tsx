"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Search, CalendarDays, LogOut, User } from "lucide-react";

interface UserNavbarProps {
  userName?: string | null;
  userImage?: string | null;
  onSearch?: (query: string) => void;
}

export default function UserNavbar({ userName, userImage, onSearch }: UserNavbarProps) {
  const [searchValue, setSearchValue] = useState("");

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <nav
      style={{ backgroundColor: "#714B67" }}
      className="w-full h-12 flex items-center px-6 gap-4 shrink-0 z-10"
    >
      {/* Left: Brand */}
      <div className="flex items-center gap-2 mr-4">
        <CalendarDays size={16} color="white" />
        <span className="text-white font-semibold text-sm whitespace-nowrap">
          Appointments
        </span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xs relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.6)" }}
        />
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchValue}
          onChange={handleSearch}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "4px",
            color: "white",
            width: "100%",
          }}
          className="pl-8 pr-3 py-1.5 text-sm outline-none placeholder:text-white/60 focus:ring-1 focus:ring-white/30"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Avatar + name + logout */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        {userImage ? (
          <img
            src={userImage}
            alt={userName ?? "User"}
            className="w-8 h-8 rounded-full object-cover"
            style={{ border: "2px solid rgba(255,255,255,0.3)" }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {initials}
          </div>
        )}

        {/* Name */}
        <span className="text-white text-xs font-medium hidden sm:block">
          {userName ?? "User"}
        </span>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/user/login" })}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.7)" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "white")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
        >
          <LogOut size={13} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
}
