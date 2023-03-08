const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "05251998",
    database: "company_db",
  },
  console.log("Connected to the employee_tracker database.")
);

module.exports = db;
