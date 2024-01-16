// Account Lockout feature module
const { logEvent } = require('./auditLog');

// In-memory store for failed attempts (for demo; use DB in production)
const failedAttempts = {};
const lockoutThreshold = 5;
const lockoutTimeMs = 15 * 60 * 1000; // 15 minutes

/**
 * Records a failed login attempt for a username.
 * @param {string} username
 */
function recordFailedAttempt(username) {
    if (!failedAttempts[username]) {
        failedAttempts[username] = { count: 0, lockoutUntil: null };
    }
    failedAttempts[username].count++;
    if (failedAttempts[username].count >= lockoutThreshold) {
        failedAttempts[username].lockoutUntil = Date.now() + lockoutTimeMs;
        logEvent('ACCOUNT_LOCKED', username, 'Account locked due to too many failed attempts');
    }
}

/**
 * Middleware to check if account is locked.
 */
function checkLockout(req, res, next) {
    const username = req.body.username;
    const user = failedAttempts[username];
    if (user && user.lockoutUntil && Date.now() < user.lockoutUntil) {
        return res.status(423).json({ success: false, message: 'Account is locked. Try again later.' });
    }
    next();
}

/**
 * Resets failed attempts after successful login.
 * @param {string} username
 */
function resetFailedAttempts(username) {
    if (failedAttempts[username]) {
        failedAttempts[username] = { count: 0, lockoutUntil: null };
    }
}

module.exports = {
    recordFailedAttempt,
    checkLockout,
    resetFailedAttempts,
};
// Add account lockout logic in accountLockout.js
