const { prisma } = require('../utils/database');

const checkSubscription = async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        tenant_id: req.tenant_id,
        expired_at: {
          gt: new Date()
        }
      },
      orderBy: {
        expired_at: 'desc'
      }
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Subscription expired. Please upgrade your plan.'
      });
    }

    req.plan = subscription.plan;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Subscription check failed'
    });
  }
};

module.exports = checkSubscription;