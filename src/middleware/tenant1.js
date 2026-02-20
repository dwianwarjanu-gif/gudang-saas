const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({
      success: false,
      message: 'Tenant tidak ditemukan'
    });
  }

  // Inject tenant ke request
  req.tenant_id = req.user.tenant_id;

  next();
};

module.exports = tenantMiddleware;