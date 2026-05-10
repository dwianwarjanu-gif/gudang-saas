const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("🔥 AUTH MIDDLEWARE MASUK");

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔥 DECODED:", decoded);

    req.user = decoded; // 🔥 WAJIB

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
