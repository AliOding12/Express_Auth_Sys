// Logout feature module
const { logEvent } = require('./auditLog');

/**
 * Logs out the user by destroying the session.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function logoutUser(req, res) {
    const username = req.session?.user?.username || 'Unknown';
    req.session.destroy((err) => {
        if (err) {
            logEvent('LOGOUT_FAIL', username, err.message);
            return res.status(500).json({ success: false, message: 'Logout failed.' });
        }
        logEvent('LOGOUT', username, 'User logged out');
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logout successful.' });
    });
}

module.exports = {
    logoutUser,
};
// Add logout functionality in logout.js
