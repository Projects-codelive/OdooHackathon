import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const body = await req.json();
    const { status, paymentStatus, notes } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(notes !== undefined && { notes }),
        ...(status === "CONFIRMED" && { confirmedAt: new Date() }),
        ...(status === "CANCELLED" && { cancelledAt: new Date() }),
        ...(status === "COMPLETED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("ADMIN_BOOKING_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Refund endpoint
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payments: { where: { status: "PAID" } } },
    });

    if (!booking || booking.payments.length === 0) {
      return NextResponse.json({ error: "No paid transaction found" }, { status: 404 });
    }

    // Logic for refunding via gateway would go here
    // For now, we just update the database status
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { bookingId: id, status: "PAID" },
        data: { status: "REFUNDED", refundedAt: new Date() },
      }),
      prisma.booking.update({
        where: { id },
        data: { paymentStatus: "REFUNDED", status: "CANCELLED" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_BOOKING_REFUND_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
