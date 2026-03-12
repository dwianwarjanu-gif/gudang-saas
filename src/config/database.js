const mysql = require("mysql2/promise");

// Role Admin
const pool = mysql.createPool({
 host: "localhost",
 user: "root",
 password: "Trizlab@2026!",
 database: "saas_master",
 waitForConnections: true,
 connectionLimit: 10
});


// Role User
const pool = mysql.createPool({
 host: "localhost",
 user: "saas_user",
 password: "Trizlab@2026!",
 database: "saas_db",
 waitForConnections: true,
 connectionLimit: 10
});

module.exports = pool;

