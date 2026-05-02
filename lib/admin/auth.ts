import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function authorizeAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return false;
  }
  return true;
}

export const unauthorizedResponse = NextResponse.json(
  { error: "Unauthorized" },
  { status: 401 }
);
