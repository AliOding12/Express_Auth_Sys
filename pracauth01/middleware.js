const db = require("./database");

const validateSession = async (req, res, next) => {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Validate the session
    const [sessions] = await db.query(
      "SELECT * FROM sessions WHERE session_id = ? AND expires_at > NOW()",
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    req.user = sessions[0]; // Attach session info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = validateSession;
// Add authentication middleware in middleware.js
// Enhance middleware with rate limiting
