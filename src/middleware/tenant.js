const prisma = require('../utils/prisma')

module.exports = async (req, res, next) => {
  const host = req.headers.host
  const subdomain = host.split('.')[0]

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain }
  })

  if (!tenant) {
    return res.status(404).json({ error: "Tenant not found" })
  }

  req.tenant = tenant
  next()
};
