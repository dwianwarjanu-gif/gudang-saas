const mysql = require("mysql2/promise");
const adminDB = require("../config/adminDB");
const runTenantMigrations = require("../migrations/runTenantMigrations");

async function createTenant({ tenantName, subdomain, email }) {

 console.log("START TENANT CREATION");

 const dbName = `tenant_${subdomain}`;

 const rootDB = await mysql.createConnection({
  host: "localhost",
  user: "saas_user",
  password: "SaasPassword123!"
 });

 await rootDB.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

 console.log("DATABASE CREATED:", dbName);

 await adminDB.query(
  `INSERT INTO tenants (name, subdomain, db_name)
   VALUES (?, ?, ?)`,
  [tenantName, subdomain, dbName]
 );

 console.log("TENANT REGISTERED");

 await runTenantMigrations(dbName);

 console.log("TENANT MIGRATED");

 return {
  tenantName,
  subdomain,
  dbName
 };

}

module.exports = { createTenant };
