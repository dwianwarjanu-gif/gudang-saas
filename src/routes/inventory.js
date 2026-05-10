const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const tenantDBMiddleware = require("../middleware/tenantDBMiddleware");

router.use(verifyToken, tenantDBMiddleware);

// GET ALL INVENTORY
router.get("/", async (req, res) => {
  try {
    console.log("🔥 INVENTORY DB:", !!req.db);

    const [rows] = await req.db.query("SELECT * FROM inventory");

    res.json({
      data: rows,
      total: rows.length
    });

  } catch (err) {
    console.error("🔥 INVENTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;