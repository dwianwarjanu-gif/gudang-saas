module.exports = function (roles = []) {
  return (req, res, next) => {
    try {
      const userRole = req.user.role?.toUpperCase();

      if (!roles.map(r => r.toUpperCase()).includes(userRole)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "RBAC error" });
    }
  };
};
