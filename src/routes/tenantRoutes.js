const express = require("express");
const router = express.Router();

const tenantController = require("../controllers/tenantController");

router.post("/register-tenant", tenantController.registerTenant);

module.exports = router;
