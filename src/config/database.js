const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "saas_user",
  password: process.env.DB_PASSWORD || "SaaSPassword123!",
  database: process.env.DB_NAME || "saas_master",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
