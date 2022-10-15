// Declration of needed libraries and routes and variables
const db = require(`./db/connection.js`);
const employeePrompt = require(`./util/employeeDatabase.js`)

// Start application after connection to database
db.connect(err => {
    if (err) throw err;
    
    console.log(`Employee database connected.`);
    // // Function call to prompt user to interact with database
    employeePrompt();
});