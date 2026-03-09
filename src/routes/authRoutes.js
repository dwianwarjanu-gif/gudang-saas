const express = require("express");
const router = express.Router();

const { createTenant } = require("../services/tenantService");
const { login } = require("../controllers/authController");

router.post("/login", login);

router.post("/register-tenant", async (req, res) => {

 try {

  const tenant = await createTenant(req.body);

  res.json({
   message: "Tenant created successfully",
   tenant
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   error: "Failed to create tenant"
  });

 }

});

router.get("/test", (req, res) => {
 res.json({ message: "Auth route working" });
});

module.exports = router;
