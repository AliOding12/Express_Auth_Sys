const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'practice01',
    waitForConnections:true
});

module.exports = pool.promise();  // Use promises for cleaner async/await// Add database connection logic in database.js
// Add database connection logic in database.js
