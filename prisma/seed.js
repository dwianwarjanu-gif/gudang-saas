const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@mail.com";
  const password = await bcrypt.hash("123456", 10);

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        password,
        fullName: "Super Admin",
        role: "ADMIN",
        isActive: true
      }
    });

    console.log("Admin created:");
    console.log("Email: admin@mail.com");
    console.log("Password: 123456");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
