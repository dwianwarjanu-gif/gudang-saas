const jwt = require('jsonwebtoken');

/*
========================
VERIFY TOKEN
========================
*/
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      tenant_id: decoded.tenant_id
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/*
========================
TENANT ISOLATION
========================
*/
const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({ message: 'Tenant not found' });
  }

  req.tenant_id = req.user.tenant_id;
  next();
};

/*
========================
ADMIN GUARD
========================
*/
const requireAdmin = (req, res, next) => {
  if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

/*
========================
OWNERSHIP OR ADMIN
========================
*/
const requireOwnershipOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);

      if (
        req.user.role === 'SUPER_ADMIN' ||
        req.user.role === 'ADMIN' ||
        req.user.userId == ownerId
      ) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied' });
    } catch (err) {
      return res.status(500).json({ message: 'Authorization error' });
    }
  };
};

/*
========================
EXPORT (INI YANG TADI HILANG!)
========================
*/
module.exports = {
  verifyToken,
  tenantMiddleware,
  requireAdmin,
  requireOwnershipOrAdmin
};
