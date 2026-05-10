const mysql = require("mysql2/promise");

const pools = {};

const getTenantDB = async (tenant) => {
  try {
    if (!tenant) {
      throw new Error("Tenant missing");
    }

    if (!pools[tenant]) {
      console.log("🔥 CREATE POOL:", tenant);

      pools[tenant] = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: `tenant_${tenant}`,
        waitForConnections: true,
        connectionLimit: 10,
      });
    }

    return pools[tenant];

  } catch (err) {
    console.error("❌ DB ERROR:", err);
    throw err;
  }
};

module.exports = getTenantDB;
