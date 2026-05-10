<<<<<<< HEAD
const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateToken } = require("../utils/jwt");


async function login(req, res) {

 try {

  const { email, password } = req.body;

  const db = req.db;

  const [users] = await db.query(
   "SELECT * FROM users WHERE email = ?",
   [email]
  );

  if (users.length === 0) {
   return res.status(401).json({
    error: "User not found"
   });
  }

  const user = users[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
   return res.status(401).json({
    error: "Invalid password"
   });
  }

  const token = generateToken(user, req.tenant.subdomain);

  res.json({
   message: "Login success",
   token: token
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   error: "Login failed"
  });

 }

}

module.exports = {
 login
};
=======
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getTenantDB = require("../config/tenantDB");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = req.headers["x-tenant"];

    const db = await getTenantDB(tenant);

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("RAW INPUT:", password);
    console.log("LENGTH:", password.length);
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("DB HASH:", user.password);
    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    delete user.password;

    const token = jwt.sign(
      {
       user_id: user.id,
       email: user.email,
       role: user.role,
       tenant,
      },
      process.env.JWT_SECRET, // ? FIX
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login }; // ? WAJIB OBJECT
>>>>>>> 9d21037 (fix order detail + update status flow)
