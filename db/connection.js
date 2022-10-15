const mysql = require(`mysql2`);

const db = mysql.createConnection({
    host: `localhost`,
    // MySQL username
    user: `root`,
    // MySQL password
    password: `Falken274mysql`,
    database: `employeeRoster`
});

module.exports = db;