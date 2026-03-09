const getTenantConnection = require("../utils/tenantDB");
const getTenantConnection = require("../config/tenantConnection");

module.exports = async function tenantDBMiddleware(req, res, next) {

 try {

  if (!req.tenant) {
   return res.status(400).json({ error: "Tenant not resolved" });
  }

  const db = await getTenantConnection(req.tenant.dbName);

  req.db = db;

  next();

 } catch (error) {

  console.error("Tenant DB connection error:", error);

  res.status(500).json({
   error: "Tenant database connection failed"
  });

 }

};

module.exports = tenantDBMiddleware;
