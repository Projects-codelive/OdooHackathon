import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrganiserLayout from "./_components/OrganiserLayout";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== "ORGANIZER") {
    redirect("/organiser/login");
  }

  return <OrganiserLayout>{children}</OrganiserLayout>;
}
