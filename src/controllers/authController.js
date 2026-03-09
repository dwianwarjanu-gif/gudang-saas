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
