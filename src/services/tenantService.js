const mysql = require("mysql2/promise");
<<<<<<< HEAD
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
=======
const runTenantMigrations = require("../migrations/runTenantMigrations");

const createTenant = async ({ name, subdomain, email }) => {
  try {
    const dbName = `tenant_${subdomain}`;

    console.log("?? Creating DB:", dbName);

    // root connection
    const rootDB = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await rootDB.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await rootDB.end();

    // ? connect ke DB tenant
    const tenantDB = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });

    // ? RUN MIGRATION
    await runTenantMigrations(tenantDB);

    await tenantDB.end();

    console.log("? Tenant ready:", dbName);

    return { success: true };

  } catch (err) {
    console.error("? CREATE TENANT ERROR:", err);
    throw err;
  }
};

module.exports = { createTenant };
>>>>>>> 9d21037 (fix order detail + update status flow)
