import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";
import { startOfDay, subDays, format } from "date-fns";

export async function GET() {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
        payments: {
          where: { status: "PAID" },
          select: { amount: true },
        },
      },
    });

    const chartDataMap: Record<string, any> = {};

    // Initialize 30 days
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      chartDataMap[date] = {
        date,
        bookings: 0,
        revenue: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    bookings.forEach((booking) => {
      const date = format(booking.createdAt, "yyyy-MM-dd");
      if (chartDataMap[date]) {
        chartDataMap[date].bookings++;
        if (booking.status === "COMPLETED") chartDataMap[date].completed++;
        if (booking.status === "CANCELLED") chartDataMap[date].cancelled++;
        
        const revenue = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        chartDataMap[date].revenue += revenue;
      }
    });

    const result = Object.values(chartDataMap).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("ADMIN_CHARTS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
