<<<<<<< HEAD
const mysql = require("mysql2/promise");

async function runTenantMigrations(dbName) {

 const connection = await mysql.createConnection({
  host: "localhost",
  user: "saas_user",
  password: "Trizlab@2026!",
  database: dbName
 });

 console.log("Running tenant migrations for:", dbName);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price INT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(100),
  total INT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 await connection.query(`
 CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_name VARCHAR(255),
  currency VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 )
 `);

 await connection.end();

}


module.exports = runTenantMigrations;
=======
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

 console.log("RUNNING TENANT MIGRATIONS");
 
 const createUsersTable = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255),
      password VARCHAR(255),
      role VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createOrdersTable = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255),
      order_number VARCHAR(255),
      status VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const createInventoryTable = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id VARCHAR(255),
      variant_id VARCHAR(255),
      stock_quantity INT DEFAULT 0,
      min_stock_level INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const seedAdminUser = async (db) => {
  const [rows] = await db.query("SELECT * FROM users LIMIT 1");

  if (rows.length === 0) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await db.query(`
      INSERT INTO users (id, email, password, role)
      VALUES (UUID(), 'admin@demo.com', ?, 'ADMIN')
    `, [hashedPassword]);

    console.log("?? Admin user seeded (hashed)");
  }
};

const runTenantMigrations = async (db) => {
  console.log("?? Running tenant migrations...");

  await createUsersTable(db);
  await createOrdersTable(db);
  await createInventoryTable(db);
  await seedAdminUser(db);

  console.log("? All tenant tables ready");
};

module.exports = runTenantMigrations;
>>>>>>> 9d21037 (fix order detail + update status flow)
