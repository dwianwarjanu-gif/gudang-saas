const tenantMiddleware = (req, res, next) => {
  try {
    if (!req.user || !req.user.tenant_id) {
      return res.status(403).json({
        message: 'Tenant not found'
      });
    }

    req.tenant_id = req.user.tenant_id;
    next();
    
  } catch (err) {
    console.error('Tenant middleware error:', err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = tenantMiddleware;