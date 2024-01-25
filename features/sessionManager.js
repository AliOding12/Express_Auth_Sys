// Session Management feature module

/**
 * Middleware to check if user is authenticated.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Unauthorized' });
}

/**
 * Utility to get current user from session.
 */
function getCurrentUser(req) {
    return req.session?.user || null;
}

/**
 * Utility to destroy session.
 */
function destroySession(req) {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = {
    isAuthenticated,
    getCurrentUser,
    destroySession,
};
// Add session management in sessionManager.js
// Add session management in sessionManager.js
// Add session expiration logic
