 const db = require('./database');
 const path = require('path');
 const crypto = require('crypto');
 const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by username
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password (replace with real hash verification)
        if (password !== user.password_hash) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a new session ID
        const sessionId = crypto.randomBytes(16).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        // Insert session into database
        await db.query('INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)', 
            [sessionId, user.user_id, expiresAt]);

        // Send session ID as a cookie
        res.cookie('session_id', sessionId, { httpOnly: true, expires: expiresAt });
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Logout Route
const logout =  async (req, res) => {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
        return res.status(400).json({ message: 'No session found' });
    }

    try {
        // Delete the session
        await db.query('DELETE FROM sessions WHERE session_id = ?', [sessionId]);

        // Clear the cookie
        res.clearCookie('session_id');
        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const dashboard = (req, res) => {
         //res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
         //res.sendFile(path.join(__dirname, '../views', 'dashboard.html')); // Adjust path based on the folder structure
         res.sendFile(path.resolve(__dirname, '../views/dashboard.html'));

        }; 


module.exports = {login,logout,dashboard};










