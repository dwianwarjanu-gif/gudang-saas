const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('123456', 10)

  await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      password: hash,
      fullName: 'Admin',
      role: 'ADMIN',
      isActive: true
    }
  })

  console.log('Admin created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())