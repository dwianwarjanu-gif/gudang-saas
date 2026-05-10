const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requirePermission = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get(
 "/",
 authMiddleware,
 requirePermission("manage_users"),
 userController.listUsers
);

router.post(
 "/",
 authMiddleware,
 requirePermission("manage_users"),
 userController.createUser
);

router.put(
 "/:id/role",
 authMiddleware,
 requirePermission("manage_users"),
 userController.updateUserRole
);

router.put(
 "/:id/disable",
 authMiddleware,
 requirePermission("manage_users"),
 userController.disableUser
);

module.exports = router;
