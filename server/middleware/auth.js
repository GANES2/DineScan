// Middleware dummy untuk bypass auth selama development
const authenticate = (req, res, next) => {
  req.user = { id: 'dev-user', role: 'ADMIN' }; // Berikan akses admin default
  next();
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    next();
  };
};

module.exports = { authenticate, authorize };
