// Two-Factor Authentication (2FA) feature module
const crypto = require('crypto');
const { logEvent } = require('./auditLog');

// In-memory store for 2FA codes (for demo; use DB in production)
const twoFACodes = {};
const codeExpiryMs = 5 * 60 * 1000; // 5 minutes

/**
 * Generates a 2FA code for a user and stores it temporarily.
 * @param {string} username
 * @returns {string} code
 */
function generate2FACode(username) {
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    twoFACodes[username] = { code, expires: Date.now() + codeExpiryMs };
    logEvent('2FA_CODE_GENERATED', username, '2FA code generated');
    // In production, send code via email/SMS
    return code;
}

/**
 * Verifies a 2FA code for a user.
 * @param {string} username
 * @param {string} code
 * @returns {boolean}
 */
function verify2FACode(username, code) {
    const entry = twoFACodes[username];
    if (!entry || entry.code !== code || Date.now() > entry.expires) {
        logEvent('2FA_FAIL', username, 'Invalid or expired 2FA code');
        return false;
    }
    delete twoFACodes[username];
    logEvent('2FA_SUCCESS', username, '2FA code verified');
    return true;
}

module.exports = {
    generate2FACode,
    verify2FACode,
};
// Add two-factor authentication logic in twoFactorAuth.js
// Add two-factor authentication logic in twoFactorAuth.js
