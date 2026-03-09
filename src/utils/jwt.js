const jwt = require("jsonwebtoken");

const SECRET = "TRIZLAB_SAAS_SECRET";

function generateToken(user, tenant) {

 return jwt.sign(
  {
   userId: user.id,
   email: user.email,
   role: user.role,
   tenant: tenant
  },
  SECRET,
  { expiresIn: "24h" }
 );

}

function verifyToken(token) {

 return jwt.verify(token, SECRET);

}

module.exports = {
 generateToken,
 verifyToken
};
