const pool = require("../config/database");

async function tenantResolver(req, res, next) {

 try {

  const host = req.hostname;

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
