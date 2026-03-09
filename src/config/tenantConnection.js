const mysql = require("mysql2/promise");

const tenantPools = {};

async function getTenantConnection(dbName) {

 if (!tenantPools[dbName]) {

  tenantPools[dbName] = mysql.createPool({
   host: "localhost",
   user: "saas_user",
   password: "Trizlab@2026!",
   database: dbName,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0
  });

 }

 return tenantPools[dbName];
}

module.exports = getTenantConnection;
