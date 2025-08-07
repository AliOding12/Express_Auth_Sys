// CSRF/XSS Protection feature module
const crypto = require('crypto');

// In-memory store for CSRF tokens (for demo; use session in production)
const csrfTokens = {};

/**
 * Middleware to generate and validate CSRF tokens.
 */
function csrfProtection(req, res, next) {
    if (req.method === 'GET') {
        const token = crypto.randomBytes(24).toString('hex');
        csrfTokens[req.sessionID] = token;
        res.locals.csrfToken = token;
        return next();
    }
    const token = req.body._csrf;
    if (csrfTokens[req.sessionID] && csrfTokens[req.sessionID] === token) {
        delete csrfTokens[req.sessionID];
        return next();
    }
    return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
}

/**
 * Sanitizes input to prevent XSS attacks.
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

module.exports = {
    csrfProtection,
    sanitizeInput,
};
