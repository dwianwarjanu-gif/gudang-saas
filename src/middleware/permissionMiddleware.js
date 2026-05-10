module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      const db = req.db; // dari tenantDBMiddleware
      const roleId = req.user.role_id;

      const [rows] = await db.query(`
        SELECT p.name
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ?
      `, [roleId]);

      const permissions = rows.map(p => p.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: "Forbidden (no permission)" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      const db = req.db; // dari tenantDBMiddleware
      const roleId = req.user.role_id;

      const [rows] = await db.query(`
        SELECT p.name
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ?
      `, [roleId]);

      const permissions = rows.map(p => p.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: "Forbidden (no permission)" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};module.exports = function (requiredPermission) {
  return async (req, res, next) => {
    try {
      const db = req.db; // dari tenantDBMiddleware
      const roleId = req.user.role_id;

      const [rows] = await db.query(`
        SELECT p.name
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = ?
      `, [roleId]);

      const permissions = rows.map(p => p.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: "Forbidden (no permission)" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};
