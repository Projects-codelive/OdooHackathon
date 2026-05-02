import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingWizard from "./BookingWizard";

export default async function BookAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const session = await auth();

  if (!session || session.user.role !== "USER") {
    redirect("/user/login");
  }

  const service = await prisma.service.findUnique({
    where: {
      id: appointmentId,
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

  if (!service || !service.isPublished) {
    notFound();
  }

  // Convert Decimal to number for safe serialization to Client Component
  const serializedService = {
    ...service,
    price: service.price ? service.price.toNumber() : null,
    paymentAmount: service.paymentAmount ? service.paymentAmount.toNumber() : null,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Complete the steps below to secure your booking.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <BookingWizard service={serializedService} user={session.user} />
      </div>
    </div>
  );
}
