<<<<<<< HEAD
const pool = require("../config/database");

async function tenantResolver(req, res, next) {

 try {

  const host = req.hostname;
  
//Resolver Middleware
module.exports = function tenantResolver(req, res, next) {

 const host = req.headers.host;

 if (!host) {
  return res.status(400).json({ error: "Host header missing" });
 }

 const subdomain = host.split(".")[0];

 if (!subdomain) {
  return res.status(400).json({ error: "Invalid subdomain" });
 }

 req.tenant = {
  subdomain,
  dbName: `tenant_${subdomain}`
 };

 next();
};

  // contoh: tokobaju.trizlabhw.com
  const subdomain = host.split(".")[0];

  if (!subdomain) {
   return res.status(400).json({ error: "Tenant not found" });
  }

  const [rows] = await pool.query(
   "SELECT * FROM tenants WHERE subdomain = ?",
   [subdomain]
  );

  if (rows.length === 0) {
   return res.status(404).json({ error: "Tenant not registered" });
  }

  req.tenant = rows[0];

  next();

 } catch (error) {

  console.error(error);

  res.status(500).json({
   error: "Tenant resolver failed"
  });

 }

}

module.exports = tenantResolver;
=======
const adminDB = require("../config/database");
const getTenantDB = require("../config/tenantDB");
const { connectRedis } = require("../config/redis");


module.exports = async (req, res, next) => {
  try {
    let tenant =
      req.body?.tenant ||
      req.headers["x-tenant-id"] ||
      req.headers["x-tenant"] ||
      req.headers["tenant"];

    console.log("TENANT BEFORE AUTH:", tenant);

    // kalau belum ada → skip dulu (biar authMiddleware isi dulu)
    if (!tenant) {
      return next();
    }

    tenant = tenant.trim();
    req.tenant = tenant;

    next();
  } catch (err) {
    console.error("TENANT ERROR:", err);
    res.status(500).json({ error: "Tenant resolver error" });
  }
};
>>>>>>> 9d21037 (fix order detail + update status flow)
