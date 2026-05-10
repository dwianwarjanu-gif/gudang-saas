const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.tenant.create({
    data: {
      name: "tokolaptop2",
      subdomain: "tokolaptop2" // 🔥 WAJIB ADA
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
