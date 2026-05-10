const mysql = require("mysql2/promise");
const createTenantTables = require("../migrations/createTenantTables");

module.exports = async function (tenant) {
  try {
    const dbName = `tenant_${tenant}`;

    console.log("🔥 Creating DB:", dbName);

    // koneksi root (buat create database)
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // create database kalau belum ada
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

    console.log("🔥 DB ready:", dbName);

    // koneksi ke DB tenant
    const tenantConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });

    // jalankan migration
    await createTenantTables(tenantConn);

    console.log("🔥 Tenant tables created:", dbName);

  } catch (err) {
    console.error("❌ TENANT PROVISION ERROR:", err);
    throw err;
  }
};
