// User Registration feature module
const db = require('../pracauth01/database');
const bcrypt = require('bcrypt');
const { logEvent } = require('./auditLog');

/**
 * Registers a new user in the database.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string }>} result
 */
async function registerUser(username, password, email) {
    if (!username || !password || !email) {
        return { success: false, message: 'All fields are required.' };
    }
    try {
        // Check if user already exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return { success: false, message: 'Username or email already exists.' };
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user
        await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
        logEvent('REGISTER', username, 'User registered successfully');
        return { success: true, message: 'Registration successful.' };
    } catch (err) {
        logEvent('REGISTER_FAIL', username, err.message);
        return { success: false, message: 'Registration failed.' };
    }
}

module.exports = {
    registerUser,
};
// Add user registration logic in registration.js
// Add user registration logic in registration.js
