module.exports = function (req, res, next) {
    if (req.user.role !== 'MANAGER') {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
  