const { PrismaClient } = require('./lib/generated/prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding services...");

  // Get or create an organizer
  let organizer = await prisma.user.findFirst({
    where: { role: 'ORGANIZER' }
  });

  if (!organizer) {
    console.log("No organizer found. Creating one...");
    organizer = await prisma.user.create({
      data: {
        email: 'organizer_services@test.com',
        name: 'Jane Organizer',
        role: 'ORGANIZER',
        hashedPassword: 'placeholder_hashed_password', // Mock
        avatarUrl: 'https://i.pravatar.cc/150?u=jane'
      }
    });
  }

  const services = [
    {
      title: "Premium Haircut & Styling",
      description: "A complete makeover with our senior stylist. Includes wash, cut, and blowdry.",
      durationMinutes: 60,
      price: 85.00,
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
      location: "Downtown Salon, 123 Main St",
      type: "USER_BASED",
      isPublished: true,
      organiserId: organizer.id,
    },
    {
      title: "Full Body Massage",
      description: "Relaxing 90-minute swedish massage to relieve tension and stress.",
      durationMinutes: 90,
      price: 120.00,
      imageUrl: "https://images.unsplash.com/photo-1600334129128-685054366116?auto=format&fit=crop&q=80&w=1000",
      location: "Zen Spa Center",
      type: "RESOURCE_BASED",
      isPublished: true,
      organiserId: organizer.id,
    },
    {
      title: "Online Coding Consultation",
      description: "1-on-1 session to debug your React or Node.js application.",
      durationMinutes: 45,
      price: 50.00,
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000",
      location: "Google Meet",
      type: "USER_BASED",
      isPublished: true,
      organiserId: organizer.id,
    }
  ];

  for (const s of services) {
    const created = await prisma.service.create({
      data: s
    });
    console.log(`Created service: ${created.title}`);
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
