// Email Verification feature module
const db = require('../pracauth01/database');
const crypto = require('crypto');
const { logEvent } = require('./auditLog');

// In-memory store for verification tokens (for demo; use DB in production)
const verificationTokens = {};

/**
 * Generates a verification token for a user's email.
 * @param {string} email
 * @returns {string} token
 */
function generateVerificationToken(email) {
    const token = crypto.randomBytes(32).toString('hex');
    verificationTokens[email] = token;
    return token;
}

/**
 * Verifies a user's email using the token.
 * @param {string} email
 * @param {string} token
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function verifyEmail(email, token) {
    if (verificationTokens[email] !== token) {
        return { success: false, message: 'Invalid or expired token.' };
    }
    await db.query('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);
    delete verificationTokens[email];
    logEvent('EMAIL_VERIFIED', email, 'Email verified successfully');
    return { success: true, message: 'Email verified.' };
}

module.exports = {
    generateVerificationToken,
    verifyEmail,
};
