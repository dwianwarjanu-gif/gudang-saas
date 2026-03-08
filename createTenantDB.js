const mysql = require("mysql2/promise");

async function createTenantDB(dbName) {

 const connection = await mysql.createConnection({
   host: "localhost",
   user: "root",
   password: ""
 });

 await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

 console.log("Tenant DB created:", dbName);

 await connection.end();
}

module.exports = createTenantDB;
