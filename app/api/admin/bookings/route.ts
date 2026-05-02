import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { service: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          service: { select: { id: true, title: true, organiser: { select: { name: true } } } },
          provider: { select: { id: true, name: true } },
          providerSlot: { select: { startTime: true, endTime: true } },
          answers: { include: { question: { select: { text: true } } } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const formattedBookings = bookings.map(b => ({
      id: b.id,
      customerId: b.customer.id,
      customerName: b.customer.name || "N/A",
      serviceId: b.service.id,
      serviceName: b.service.title,
      providerId: b.provider?.id,
      providerName: b.provider?.name || b.service.organiser.name || "N/A",
      status: b.status,
      paymentStatus: b.paymentStatus,
      amount: 0, // In real app, calculate from service price or payment records
      currency: "USD",
      dateTime: b.providerSlot.startTime,
      duration: 0, // Calculate from start/end time
      answers: b.answers.map(a => ({
        id: a.id,
        questionText: a.question.text,
        answer: a.answerText || "",
      })),
      createdAt: b.createdAt,
    }));

    return NextResponse.json({
      data: formattedBookings,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("ADMIN_BOOKINGS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
