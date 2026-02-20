const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const {
  verifyToken,
  tenantMiddleware,
  requireAdmin,
  requireOwnershipOrAdmin
} = require('../middleware/auth');

const { prisma } = require('../utils/database');
const logger = require('../utils/logger');


// ===============================
// GLOBAL SECURITY (APPLY TO ALL)
// ===============================
router.use(verifyToken);
router.use(tenantMiddleware);


// ===============================
// HELPERS
// ===============================
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
    });
    return false;
  }
  return true;
};

const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};


// =====================================================
// GET ALL USERS (ADMIN ONLY + TENANT ISOLATION)
// =====================================================
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const pagination = paginate(Number(page), Number(limit));

    const where = {
      tenant_id: req.tenant_id, // 🔒 tenant isolation
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(role && { role })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        ...pagination,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// =====================================================
// GET USER BY ID (OWNER OR ADMIN)
// =====================================================
router.get(
  '/:id',
  requireOwnershipOrAdmin(async (req) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        tenant_id: req.tenant_id
      },
      select: { id: true }
    });
    return user?.id;
  }),
  async (req, res) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: req.params.id,
          tenant_id: req.tenant_id
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, data: user });

    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// =====================================================
// UPDATE USER
// =====================================================
router.put(
  '/:id',
  [
    body('fullName').optional().isLength({ min: 2 }),
    body('phone').optional().isMobilePhone('any'),
    body('role').optional().isIn(['USER', 'ADMIN', 'SUPER_ADMIN']),
    body('isActive').optional().isBoolean()
  ],
  requireOwnershipOrAdmin(async (req) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        tenant_id: req.tenant_id
      },
      select: { id: true }
    });
    return user?.id;
  }),
  async (req, res) => {
    try {
      if (!handleValidation(req, res)) return;

      const { fullName, phone, role, isActive } = req.body;

      const existing = await prisma.user.findFirst({
        where: {
          id: req.params.id,
          tenant_id: req.tenant_id
        }
      });

      if (!existing) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const data = { fullName, phone };

      // Only admin can change role & status
      if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
        if (role !== undefined) data.role = role;
        if (isActive !== undefined) data.isActive = isActive;
      }

      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true
        }
      });

      res.json({ success: true, data: updated });

    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// =====================================================
// CHANGE PASSWORD
// =====================================================
router.patch(
  '/:id/change-password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  requireOwnershipOrAdmin(async (req) => {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        tenant_id: req.tenant_id
      },
      select: { id: true }
    });
    return user?.id;
  }),
  async (req, res) => {
    try {
      if (!handleValidation(req, res)) return;

      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          id: req.params.id,
          tenant_id: req.tenant_id
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (req.user.userId === user.id) {
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
          return res.status(400).json({
            success: false,
            message: 'Current password incorrect'
          });
        }
      }

      const hashed = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed }
      });

      res.json({ success: true, message: 'Password updated' });

    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);


// =====================================================
// DELETE USER (SOFT DELETE)
// =====================================================
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        tenant_id: req.tenant_id
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin'
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false }
    });

    res.json({ success: true, message: 'User deactivated' });

  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// =====================================================
// CURRENT USER
// =====================================================
router.get('/me/profile', async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});


module.exports = router;
