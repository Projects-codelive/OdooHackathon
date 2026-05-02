import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, date, time, headcount, notes } = body;

    if (!serviceId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Combine date and time
    const startDateTime = new Date(`${date}T${time}:00`);
    
    // Validate service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(startDateTime.getMinutes() + service.durationMinutes);

    // Mock ProviderSlot creation since we don't have a real scheduling engine running
    // In a real application, we would link to an existing slot.
    const providerSlot = await prisma.providerSlot.create({
      data: {
        serviceId: service.id,
        startTime: startDateTime,
        endTime: endDateTime,
        capacity: service.maxPerSlot || 1,
        booked: headcount || 1,
      },
    });

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        serviceId: service.id,
        providerSlotId: providerSlot.id,
        status: "CONFIRMED",
        paymentStatus: service.price ? "PAID" : "UNPAID", // Mock payment success
        notes,
        headcount: headcount || 1,
      },
    });

    // Optionally create a payment record
    if (service.price) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: service.price,
          currency: service.currency || "USD",
          status: "PAID",
          idempotencyKey: `mock_${Date.now()}_${booking.id}`,
          paidAt: new Date(),
        },
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
