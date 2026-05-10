<<<<<<< HEAD
const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {

 const header = req.headers.authorization;

 if (!header) {
  return res.status(401).json({
   error: "No token"
  });
 }

 const token = header.split(" ")[1];

 try {

  const decoded = verifyToken(token);

  req.user = decoded;

  next();

 } catch (err) {

  return res.status(401).json({
   error: "Invalid token"
  });

 }

}

module.exports = authMiddleware;
=======
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔥 DECODED:", decoded);

    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      tenant: decoded.tenant
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
>>>>>>> 9d21037 (fix order detail + update status flow)
