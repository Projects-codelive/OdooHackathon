import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

// Simplified settings using a mock or a specific model if it exists
// Since there's no "PlatformSetting" model in schema, we can use a dedicated table or Json in a specific record
// For now, I'll use a mock response that could be backed by a "Settings" model later

export async function GET() {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  return NextResponse.json({
    platformName: "Odoo Appointments",
    defaultCurrency: "USD",
    timezone: "UTC",
    maxBookingAdvance: 90,
    maintenanceMode: false,
  });
}

export async function PATCH(req: Request) {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const body = await req.json();
    // Logic to save settings would go here
    return NextResponse.json({ success: true, ...body });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
