const getTenantConnection = require("../utils/tenantDB");

async function tenantDBMiddleware(req, res, next) {

 try {

  const dbName = req.tenant.db_name;

  const connection = await getTenantConnection(dbName);

  req.tenantDB = connection;

  next();

 } catch (error) {

  console.error(error);

  res.status(500).json({
   error: "Tenant DB connection failed"
  });

 }

}

module.exports = tenantDBMiddleware;
