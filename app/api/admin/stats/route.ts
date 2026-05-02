import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdmin, unauthorizedResponse } from "@/lib/admin/auth";

export async function GET() {
  if (!(await authorizeAdmin())) return unauthorizedResponse;

  try {
    const [
      totalUsers,
      totalOrganisers,
      totalCustomers,
      totalAdmins,
      totalBookings,
      bookingsThisMonth,
      revenueThisMonth,
      revenueYearToDate,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ORGANIZER" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "PAID",
          paidAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: "PAID",
          paidAt: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
        _sum: { amount: true },
      }),
    ]);

    const bookingsCompleted = await prisma.booking.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const bookingsCancelled = await prisma.booking.count({
      where: {
        status: "CANCELLED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      totalOrganisers,
      totalCustomers,
      totalAdmins,
      activeProviders: totalOrganisers + totalAdmins, // Simplified logic
      bookingsThisMonth,
      bookingsCompleted,
      bookingsCancelled,
      revenueThisMonth: Number(revenueThisMonth._sum.amount || 0),
      revenueYearToDate: Number(revenueYearToDate._sum.amount || 0),
      averageOrderValue: totalBookings > 0 ? Number(revenueYearToDate._sum.amount || 0) / totalBookings : 0,
      userGrowthPercent: 12.5, // Mocked for now
      bookingGrowthPercent: 8.3, // Mocked for now
      revenueGrowthPercent: 15.7, // Mocked for now
    });
  } catch (error) {
    console.error("ADMIN_STATS_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
