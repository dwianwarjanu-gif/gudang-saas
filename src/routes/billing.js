const express = require('express');
const router = express.Router();

// Prisma (bukan db.query lagi)
const { prisma } = require('../utils/database');

// Middleware (AMBIL FUNCTION, BUKAN OBJECT)
const { verifyToken } = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenantMiddleware');

/**
 * Upgrade Plan
 * POST /api/billing/upgrade
 */
router.post('/upgrade', verifyToken, tenantMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Plan is required'
      });
    }

    const expired = new Date();
    expired.setMonth(expired.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        tenant_id: req.tenant_id,
        plan,
        expired_at: expired
      }
    });

    res.json({
      success: true,
      message: 'Plan upgraded'
    });

  } catch (err) {
    console.error('Billing upgrade error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;