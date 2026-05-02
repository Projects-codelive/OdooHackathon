"use client";

import { useState } from "react";
import UserNavbar from "@/components/user/UserNavbar";
import AppointmentGrid from "@/components/user/AppointmentGrid";

interface HomeClientProps {
  appointments: any[];
  userName?: string | null;
  userImage?: string | null;
}

export default function HomeClient({ appointments, userName, userImage }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <UserNavbar userName={userName} userImage={userImage} onSearch={setSearchQuery} />
      <AppointmentGrid appointments={appointments} searchQuery={searchQuery} />
    </div>
  );
}
