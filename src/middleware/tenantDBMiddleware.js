<<<<<<< HEAD
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

=======
const getTenantDB = require("../config/tenantDB");

const tenantDBMiddleware = async (req, res, next) => {
  try {
    const tenant = req.user?.tenant;

    if (!tenant) {
      return res.status(400).json({ error: "Tenant missing" });
    }

    req.tenant = tenant;
    
    console.log("?? USER:", req.user);
    console.log("?? TENANT FROM USER:", req.user?.tenant);

    const db = await getTenantDB(tenant);
    req.db = db;

    next();
  } catch (err) {
    console.error("TENANT ERROR:", err);
    res.status(500).json({ error: "Tenant middleware error" });
  }
>>>>>>> 9d21037 (fix order detail + update status flow)
};

module.exports = tenantDBMiddleware;
