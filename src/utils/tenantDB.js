const mysql = require("mysql2/promise");

async function getTenantConnection(dbName) {

 const connection = await mysql.createConnection({
  host: "localhost",
  user: "saas_user",
  password: "Trizlab@2026!",
  database: dbName
 });

 return connection;

}

module.exports = getTenantConnection;
