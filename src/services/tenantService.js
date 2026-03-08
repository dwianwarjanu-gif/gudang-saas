const pool = require("../config/database");
const createTenantDB = require("../utils/createTenantDB");

async function createTenant(data) {

 const { tenantName, subdomain, email } = data;

 const dbName = `tenant_${subdomain}`;

 // create database tenant
 await createTenantDB(dbName);

 // save tenant record
 await pool.query(
   "INSERT INTO tenants (tenant_name, subdomain, db_name, email) VALUES (?, ?, ?, ?)",
   [tenantName, subdomain, dbName, email]
 );

 return {
   tenantName,
   subdomain,
   dbName
 };
}

module.exports = { createTenant };
