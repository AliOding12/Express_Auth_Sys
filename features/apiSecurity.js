// API Security (middleware) feature module
const { logEvent } = require('./auditLog');

/**
 * Middleware to require authentication for API routes.
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    logEvent('API_UNAUTHORIZED', 'Unknown', `Unauthorized API access to ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
}

module.exports = {
    requireAuth,
};
// Add API security measures in apiSecurity.js
