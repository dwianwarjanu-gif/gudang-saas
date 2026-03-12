const mysql = require("mysql2/promise");

// Role Admin
const pool = mysql.createPool({
 host: "localhost",
 user: "saas_user",
 password: "SaasPassword123!",
 database: "saas_master",
 waitForConnections: true,
 connectionLimit: 10
 queueLimit: 0

});

module.exports = pool;



