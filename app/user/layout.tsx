import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/user/login");
  }

  // Each page under /user handles its own layout (navbar, content)
  return <>{children}</>;
}
