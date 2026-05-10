const bcrypt = require("bcrypt");
const db = require("../config/database");
const provisionTenant = require("../services/tenantProvisioning");

exports.registerTenant = async (req, res) => {

  const { tenant_name, admin_name, email, password } = req.body;

  try {

    const subdomain = tenant_name.toLowerCase();
    const dbName = "tenant_" + subdomain;

    const [result] = await db.query(
      "INSERT INTO tenants (name,subdomain,db_name,email) VALUES (?,?,?,?)",
      [tenant_name, subdomain, dbName, email]
    );

    const tenantId = result.insertId;

    // create tenant database + tables
    await provisionTenant(dbName);

    const hashed = await bcrypt.hash(password, 10);

    const mysql = require("mysql2/promise");

    const conn = await mysql.createConnection({
      host: "localhost",
      user: "saas_user",
      password: "SaasPassword123!",
      database: dbName
    });

    // create admin user in tenant DB
    await conn.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [admin_name, email, hashed, "admin"]
    );

    res.json({
      status: "success",
      tenant_id: tenantId,
      tenant: subdomain
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

};
