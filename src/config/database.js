<<<<<<< HEAD
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



=======
const mysql = require("mysql2/promise");


const pool = mysql.createPool({
 host: "202.10.44.9",
 user: "saas_user",
 password: "SaasPassword123!",
 database: "saas_master",
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0
});


module.exports = pool;
>>>>>>> 9d21037 (fix order detail + update status flow)
