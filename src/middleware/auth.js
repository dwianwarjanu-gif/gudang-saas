const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("JWT SECRET:", process.env.JWT_SECRET);
    console.log("🔥 DECODED:", decoded);

    req.user = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      tenant: decoded.tenant
    };

    next();
  } catch (err) {
    console.log("❌ VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🔥 TAMBAH INI
const requireOwnershipOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);

      if (
        req.user.role === "ADMIN" ||
        req.user.role === "SUPER_ADMIN" ||
        req.user.user_id == ownerId
      ) {
        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (err) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};

// 🔥 EXPORT SEMUA
module.exports = {
  verifyToken,
  requireOwnershipOrAdmin
};
