const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateToken } = require("../utils/jwt");

exports.registerTenant = async (req, res) => {
  const { email, password, tenantName, subdomain } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const tenant = await prisma.tenant.create({
    data: {
      name: tenantName,
      subdomain,
      users: {
        create: {
          email,
          password: hashedPassword,
          role: "owner"
        }
      }
    }
  })

  res.json({
    message: "Tenant created",
    tenant
  })

}
