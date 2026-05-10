const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const email = "test@test.com"
  const password = "123456"

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      role: "ADMIN",
      tenant: {
        create: {
          name: "tokolaptop2",
          subdomain: "tokolaptop2"
        }
      }
    }
  })

  console.log("User created:", user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
