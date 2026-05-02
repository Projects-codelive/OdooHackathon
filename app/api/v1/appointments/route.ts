import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      where: {
        isPublished: true,
      },
      include: {
        organiser: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
