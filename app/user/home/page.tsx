import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function UserHomePage() {
  const session = await auth();

  if (!session) {
    redirect("/user/login");
  }

  const appointments = await prisma.service.findMany({
    where: { isPublished: true },
    include: {
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

  // Serialize Decimal → number for client
  const serialized = appointments.map((a) => ({
    ...a,
    price: a.price ? Number(a.price) : null,
  }));

  return (
    <HomeClient
      appointments={serialized}
      userName={session.user?.name}
      userImage={session.user?.image}
    />
  );
}
