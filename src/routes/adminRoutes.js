const express = require("express");
const router = express.Router();

const { createTenant } = require("../services/tenantService");

router.post("/tenants", async (req, res) => {

 console.log("REQUEST BODY:", req.body);

 try {

  const { name, subdomain, email } = req.body;

  if (!name || !subdomain) {
   return res.status(400).json({
    error: "Tenant not registered"
   });
  }

  const tenant = await createTenant({
   tenantName: name,
   subdomain,
   email
  });

  return res.json({
   message: "Tenant created successfully",
   tenant
  });

 } catch (err) {

  console.error("TENANT ERROR:", err);

  return res.status(500).json({
   error: err.message
  });

 }

});

module.exports = router;
