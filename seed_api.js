const users = [
  { email: 'user@test.com', name: 'Test User', role: 'USER', password: 'password123' },
  { email: 'organizer@test.com', name: 'Test Organizer', role: 'ORGANIZER', password: 'password123' },
  { email: 'admin@test.com', name: 'Test Admin', role: 'ADMIN', password: 'password123' },
];

async function seed() {
  for (const user of users) {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    console.log(`Response for ${user.email}:`, data);
  }
}

seed();
