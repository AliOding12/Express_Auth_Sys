// Login feature module
const db = require('../pracauth01/database');
const { comparePassword } = require('./passwordHash');
const { logEvent } = require('./auditLog');

/**
 * Authenticates a user and sets up session.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
async function loginUser(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required.' });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            logEvent('LOGIN_FAIL', username, 'User not found');
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const user = users[0];
        const match = await comparePassword(password, user.password);
        if (!match) {
            logEvent('LOGIN_FAIL', username, 'Incorrect password');
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        req.session.user = { id: user.id, username: user.username, role: user.role };
        logEvent('LOGIN', username, 'User logged in');
        res.json({ success: true, message: 'Login successful.' });
    } catch (err) {
        logEvent('LOGIN_ERROR', username, err.message);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
}

module.exports = {
    loginUser,
};
// Add login functionality in login.js
