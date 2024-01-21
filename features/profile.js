// User Profile Management feature module
const db = require('../pracauth01/database');
const { logEvent } = require('./auditLog');

/**
 * Gets user profile by username.
 * @param {string} username
 * @returns {Promise<object|null>}
 */
async function getProfile(username) {
    const [users] = await db.query('SELECT username, email, role, is_verified FROM users WHERE username = ?', [username]);
    return users[0] || null;
}

/**
 * Updates user profile (email only for demo).
 * @param {string} username
 * @param {object} updates
 * @returns {Promise<{ success: boolean, message: string }>}
 */
async function updateProfile(username, updates) {
    if (!updates.email) return { success: false, message: 'No updates provided.' };
    await db.query('UPDATE users SET email = ? WHERE username = ?', [updates.email, username]);
    logEvent('PROFILE_UPDATE', username, 'Email updated');
    return { success: true, message: 'Profile updated.' };
}

module.exports = {
    getProfile,
    updateProfile,
};
// Add user profile management in profile.js
// Add profile update functionality in profile.js
