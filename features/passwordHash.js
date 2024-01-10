// Password Hashing feature module
const bcrypt = require('bcrypt');

/**
 * Hashes a plain text password.
 * @param {string} password
 * @returns {Promise<string>} hashed password
 */
function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>} result
 */
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword,
};
// Add password hashing in passwordHash.js
// Add password hashing in passwordHash.js
