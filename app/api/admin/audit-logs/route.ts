import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { name: true, email: true } },
      },
    });

    const formattedLogs = logs.map(l => ({
      id: l.id,
      actorName: l.actor.name || "System",
      action: l.action,
      targetId: l.bookingId || "N/A",
      createdAt: l.createdAt,
    }));

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error("ADMIN_AUDIT_LOGS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
