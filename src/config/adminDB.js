const mysql = require("mysql2/promise");

const adminDB = mysql.createPool({

 host: "localhost",
 user: "root",
 password: "Trizlab@2026!",
 database: "saas_admin"
 waitForConnections: true,
 connectionLimit: 10

});

module.exports = adminDB;
