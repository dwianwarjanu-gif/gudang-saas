const mysql = require("mysql2/promise");

const adminDB = mysql.createPool({

 host: "localhost",
 user: "saas_user",
 password: "SaasPassword123!",
 database: "saas_master"
 waitForConnections: true,
 connectionLimit: 10
});

module.exports = adminDB;

