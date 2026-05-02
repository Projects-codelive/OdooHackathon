const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'user@test.com', name: 'Test User', role: 'USER' },
    { email: 'organizer@test.com', name: 'Test Organizer', role: 'ORGANIZER' },
    { email: 'admin@test.com', name: 'Test Admin', role: 'ADMIN' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: password,
        role: u.role,
      },
    });
    console.log(`Created ${u.role} user: ${u.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
