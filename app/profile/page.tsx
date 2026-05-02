import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfileEntryPage() {
  const session = await auth();

  if (!session) {
    redirect("/user/login");
  }

  const role = (session.user as { role?: string } | undefined)?.role ?? "USER";
  if (role === "ADMIN") redirect("/admin");
  if (role === "ORGANIZER") redirect("/organiser");
  redirect("/user/profile");
}
