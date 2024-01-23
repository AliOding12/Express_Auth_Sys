// Audit Logging feature module
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../auth_audit.log');

/**
 * Logs an authentication event to the audit log file.
 * @param {string} eventType - The type of event (e.g., 'LOGIN', 'LOGOUT', 'REGISTER', 'PASSWORD_RESET').
 * @param {string} username - The username or user identifier.
 * @param {string} [details] - Optional details about the event.
 */
function logEvent(eventType, username, details = '') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${eventType}] User: ${username} ${details}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to audit log:', err);
        }
    });
}

module.exports = {
    logEvent,
};
// Add audit logging in auditLog.js
// Optimize audit logging performance
