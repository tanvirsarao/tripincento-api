// index.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Add middleware to parse JSON body
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Login endpoint with POST JSON
app.post('/user/login', async (req, res) => {
    try {
        // Check if the request has a JSON content-type
        if (!req.is('application/json')) {
            return res.status(400).json({
                success: false,
                message: "Content-Type must be application/json"
            });
        }

        const { username, password } = req.body;

        // Validate request body
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Query to find user
        connection.query(
            'SELECT id, username, password_hash FROM users WHERE username = ?',
            [username],
            async (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                }

                // Check if user exists
                if (results.length === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid username or password"
                    });
                }

                const user = results[0];

                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password_hash);
                
                if (!isValidPassword) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid username or password"
                    });
                }

                // Create JWT token
                const token = jwt.sign(
                    { user_id: user.id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // Send successful response
                res.json({
                    success: true,
                    message: "Login successful",
                    token
                    // user: {
                    //     id: user.id,
                    //     username: user.username
                    //}
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});







// Add this middleware to verify Bearer token
const verifyToken = (req, res, next) => {
    // Get auth header
    const authHeader = req.headers['authorization'];
    
    // Check if auth header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Bearer token is required"
        });
    }

    // Get token from header (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// Trips endpoint using Bearer token
app.get('/user/trips', verifyToken, (req, res) => {
    try {
        const userId = req.user.user_id;

        // Query to get trips for the user
        connection.query(
            'SELECT * FROM trips WHERE user_id = ?',
            [userId],
            (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error"
                    });
                }

                // Return trips
                res.json({
                    success: true,
                    message: "Trips retrieved successfully",
                    trips: results
                });
            }
        );

    } catch (error) {
        console.error('Trips fetch error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});













const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});