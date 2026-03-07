const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../utils/database');
const { session } = require('../utils/redis'); // optional (redis)

const authController = require('../controllers/authController')

router.post('/register-tenant', authController.registerTenant)
router.post('/login', authController.login)


const router = express.Router();

// Dummy user (sementara untuk test SAAS)
const users = [
  {
    id: 1,
    email: 'admin@mail.com',
    password: bcrypt.hashSync('admin123', 10),
    fullName: 'Admin',
    tenant_id: 1,
    role: 'SUPER_ADMIN'
  }
];

// TEST
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN REQUEST:", email, password);
    

// 1. Cari user
  exports.login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(401).json({ error: "User not found" })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ error: "Invalid password" })
  }

  const token = jwt.sign(
    { userId: user.id, tenantId: user.tenantId },
    process.env.JWT_SECRET
  )

  res.json({ token })
}

    
// 2. Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password salah'
      });
    }

    // 3. Buat session (untuk Redis - optional tapi PRO)
    const sessionId = Date.now().toString();

    // 4. ===== JWT SAAS =====
    const token = jwt.sign(
      {
        userId: user.id,
        tenant_id: user.tenant_id,
        role: user.role,
        sessionId: sessionId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  
    // 5. Simpan session ke Redis (PRODUCTION)
      if (session) {
      await session.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user.id,
          tenant_id: user.tenant_id
        }),
        60 * 60 * 24 * 7
      );
    }

    // 6. Response ke frontend
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenant_id: user.tenant_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
  });
  }
});

module.exports = router;
