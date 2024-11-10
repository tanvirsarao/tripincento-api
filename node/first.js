const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const { createToken, validateToken, verifyToken } = require('../jwt');


//Create database connection
require('dotenv').config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

console.log(createToken(10))
console.log(validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiaWF0IjoxNzMxMTM0MjU2LCJleHAiOjE3MzEyMjA2NTZ9.eL4HxmsIV3a-WTLBET6pQELY4pCEJon7HNAHq0acyP0'))

// // Function to verify user
// function verifyUser(firstName, lastName, password, callback) {
//     // SQL query to find user
//     const query = 'SELECT * FROM users WHERE first_name = ? AND last_name = ?';
    
//     // Execute query
//     connection.query(query, [firstName, lastName], (err, results) => {
//         if (err) {
//             console.error('Error querying database:', err);
//             callback(false);
//             return;
//         }

//         // If no user found
//         if (results.length === 0) {
//             console.log('User not found');
//             callback(false);
//             return;
//         }

//         // Get the stored password hash
//         const user = results[0];
//         const storedHash = user.password_hash;

//         // Compare password with stored hash
//         bcrypt.compare(password, storedHash, (err, isMatch) => {
//             if (err) {
//                 console.error('Error comparing passwords:', err);
//                 callback(false);
//                 return;
//             }

//             if (isMatch) {
//                 console.log('Password is correct!');
//                 callback(true);
//             } else {
//                 console.log('Password is incorrect!');
//                 callback(false);
//             }
//         });
//     });
// }

// // Example usage
// function testVerifyUser() {
//     // Test case 1: Correct credentials
//     verifyUser('John', 'Doe', 'password123', (result) => {
//         console.log('Verification result:', result);
//     });
// }

// // Run the test
// testVerifyUser();

// // Remember to close the connection when done
// // connection.end();
