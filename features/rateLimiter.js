// Rate Limiting feature module
// In-memory store for rate limiting (for demo; use Redis in production)
const rateLimits = {};
const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 100;

/**
 * Express middleware for rate limiting by IP.
 */
function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    if (!rateLimits[ip]) {
        rateLimits[ip] = { count: 1, start: now };
        return next();
    }
    const { count, start } = rateLimits[ip];
    if (now - start > windowMs) {
        rateLimits[ip] = { count: 1, start: now };
        return next();
    }
    if (count >= maxRequests) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }
    rateLimits[ip].count++;
    next();
}

module.exports = {
    rateLimiter,
};
