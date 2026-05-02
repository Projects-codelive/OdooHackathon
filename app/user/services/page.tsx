import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserServicesPage() {
  const session = await auth();

  if (!session) {
    redirect("/user/login");
  }

  let appointments: any[] = [];
  try {
    const [serviceTable] = await prisma.$queryRaw<Array<{ table_name: string | null }>>`
      SELECT to_regclass('public."Service"') as table_name
    `;

    if (serviceTable?.table_name) {
      appointments = await prisma.service.findMany({
        where: { isPublished: true },
        include: {
          organiser: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          providers: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
          serviceResources: {
            include: {
              resource: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.warn("Services unavailable until database migrations are applied.", error);
  }

  const serialized = appointments.map((a) => ({
    ...a,
    price: a.price ? Number(a.price) : null,
    paymentAmount: a.paymentAmount ? Number(a.paymentAmount) : null,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E8E0D0] bg-white p-5 shadow-[0_2px_10px_rgba(114,74,106,0.06)]">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Browse Services</h1>
        <p className="mt-1 text-sm text-[#8A8AAA]">
          Services created by admins and organizers appear here with full details.
        </p>
      </div>

      {serialized.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E8E0D0] bg-white p-10 text-center">
          <p className="text-base font-medium text-[#4A4A6A]">No published services yet.</p>
          <p className="mt-1 text-sm text-[#8A8AAA]">Check back after organizers publish services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {serialized.map((service) => {
            const currency = service.currency || "INR";
            const price = service.price ?? service.paymentAmount ?? 0;
            const isFree = !price || price <= 0;
            const priceLabel = isFree
              ? "Free"
              : new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 2,
                }).format(price);

            return (
              <div
                key={service.id}
                className="rounded-2xl border border-[#E8E0D0] bg-white p-6 shadow-[0_2px_10px_rgba(114,74,106,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A2E]">{service.title}</h2>
                    <p className="mt-1 text-sm text-[#8A8AAA]">
                      By {service.organiser?.name || "Organizer"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isFree ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#F5EDF4] text-[#724A6A]"
                    }`}
                  >
                    {priceLabel}
                  </span>
                </div>

                {service.description && (
                  <p className="mt-4 text-sm leading-relaxed text-[#4A4A6A]">{service.description}</p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-[#E8E0D0] bg-[#FFFBE9] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#8A8AAA]">Duration</p>
                    <p className="mt-1 font-semibold text-[#1A1A2E]">{service.durationMinutes} min</p>
                  </div>
                  <div className="rounded-xl border border-[#E8E0D0] bg-[#FFFBE9] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#8A8AAA]">Capacity</p>
                    <p className="mt-1 font-semibold text-[#1A1A2E]">{service.maxPerSlot} / slot</p>
                  </div>
                  <div className="rounded-xl border border-[#E8E0D0] bg-[#FFFBE9] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#8A8AAA]">Location</p>
                    <p className="mt-1 font-semibold text-[#1A1A2E]">{service.location || service.venue || "Online / TBA"}</p>
                  </div>
                  <div className="rounded-xl border border-[#E8E0D0] bg-[#FFFBE9] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#8A8AAA]">Providers</p>
                    <p className="mt-1 font-semibold text-[#1A1A2E]">{service.providers?.length || 0}</p>
                  </div>
                </div>

                {service.introMessage && (
                  <div className="mt-4 rounded-xl border border-[#E8E0D0] bg-[#FFFBE9] p-3">
                    <p className="text-xs uppercase tracking-wider text-[#8A8AAA]">Organizer Note</p>
                    <p className="mt-1 text-sm text-[#4A4A6A]">{service.introMessage}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.type && <span className="badge border border-[#D4B8CF] bg-[#F5EDF4] text-[#724A6A]">{service.type}</span>}
                  {service.manualConfirm && (
                    <span className="badge border border-[#FFE88A] bg-[#FFF3C4] text-[#D4A017]">Manual confirmation</span>
                  )}
                  {service.advancePayment && (
                    <span className="badge border border-[#CFE8FF] bg-[#EAF5FF] text-[#0277BD]">Advance payment</span>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Link href={`/user/book/${service.id}`} className="btn-primary">
                    Book This Service
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
