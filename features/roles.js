// Role-Based Access Control feature module

/**
 * Middleware to check if user has required role(s).
 * @param {...string} allowedRoles
 */
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        const user = req.session?.user;
        if (user && allowedRoles.includes(user.role)) {
            return next();
        }
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    };
}

/**
 * Utility to get user role from session.
 */
function getUserRole(req) {
    return req.session?.user?.role || null;
}

module.exports = {
    requireRole,
    getUserRole,
};
// Add role-based access control in roles.js
