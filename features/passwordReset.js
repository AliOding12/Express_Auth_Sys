// Password Reset feature module
const db = require('../pracauth01/database');
const crypto = require('crypto');
const { hashPassword } = require('./passwordHash');
const { logEvent } = require('./auditLog');

// In-memory store for reset tokens (for demo; use DB in production)
const resetTokens = {};

/**
 * Request a password reset (generates a token and logs the event).
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string, token?: string }>}
 */
async function requestPasswordReset(email) {
    if (!email) return { success: false, message: 'Email required.' };
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return { success: false, message: 'User not found.' };
    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[email] = token;
    logEvent('PASSWORD_RESET_REQUEST', users[0].username, 'Requested password reset');
    // In production, send token via email
    return { success: true, message: 'Password reset token generated.', token };
}

/**
 * Reset the user's password using a valid token.
 * @param {string} email
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function resetPassword(email, token, newPassword) {
    if (resetTokens[email] !== token) {
        return { success: false, message: 'Invalid or expired token.' };
    }
    const hashed = await hashPassword(newPassword);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
    delete resetTokens[email];
    logEvent('PASSWORD_RESET', email, 'Password reset successful');
    return { success: true, message: 'Password has been reset.' };
}

module.exports = {
    requestPasswordReset,
    resetPassword,
};
// Add password reset functionality in passwordReset.js
// Add password reset functionality in passwordReset.js
// Add secure token generation in passwordReset.js
