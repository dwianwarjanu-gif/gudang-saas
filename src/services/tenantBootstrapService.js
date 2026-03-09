const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function bootstrapTenant(dbName, tenantData) {

 const connection = await mysql.createConnection({
  host: "localhost",
  user: "saas_user",
  password: "Trizlab@2026!",
  database: dbName
 });

 const passwordHash = await bcrypt.hash("admin123", 10);

 await connection.query(
  "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
  [
   tenantData.tenantName + " Admin",
   tenantData.email,
   passwordHash,
   "admin"
  ]
 );

 await connection.query(
  "INSERT INTO settings (store_name,currency) VALUES (?,?)",
  [
   tenantData.tenantName,
   "IDR"
  ]
 );

 await connection.end();

 console.log("Tenant bootstrap completed");

}

module.exports = bootstrapTenant;
