const db = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM subscriptions WHERE tenant_id = ? AND status = "active" AND expired_at >= CURDATE()',
      [req.tenant_id]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        message: 'Subscription expired'
      });
    }

    req.plan = rows[0].plan;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
