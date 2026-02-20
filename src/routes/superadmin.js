const express = require('express');
const { prisma } = require('../utils/database');
const { verifyToken } = require('../middleware/auth');
const { requireSuperAdmin } = require('../middleware/role');

const router = express.Router();

router.use(verifyToken, requireSuperAdmin);

// GET all tenants
router.get('/tenants', async (req, res) => {
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          products: true
        }
      }
    }
  });

  res.json(tenants);
});

// Create tenant
router.post('/tenants', async (req, res) => {
  const { name, plan } = req.body;

  const tenant = await prisma.tenant.create({
    data: {
      name,
      plan
    }
  });

  res.json(tenant);
});

// Suspend tenant
router.put('/tenants/:id/status', async (req, res) => {
  const { status } = req.body;

  const tenant = await prisma.tenant.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json(tenant);
});

router.get('/tenants', verifyToken, requireSuperAdmin, async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});


router.post('/tenants', verifyToken, requireSuperAdmin, async (req, res) => {
  const { name, plan } = req.body;

  const tenant = await prisma.tenant.create({
    data: {
      name,
      plan
    }
  });

  res.json(tenant);
});

module.exports = router;
