const mysql = require("mysql2/promise");

const pool = mysql.createPool({
 host: "localhost",
 user: "root",
 password: "Trizlab@2026!",
 database: "saas_master",
 waitForConnections: true,
 connectionLimit: 10
});


module.exports = pool;
