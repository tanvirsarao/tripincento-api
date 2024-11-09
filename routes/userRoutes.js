// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (connection) => {
    // Login endpoint with POST JSON
    router.post('/login', async (req, res) => {
        try {
            if (!req.is('application/json')) {
                return res.status(400).json({
                    success: false,
                    message: "Content-Type must be application/json"
                });
            }

            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username and password are required"
                });
            }

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

                    if (results.length === 0) {
                        return res.status(401).json({
                            success: false,
                            message: "Invalid username or password"
                        });
                    }

                    const user = results[0];
                    const isValidPassword = await bcrypt.compare(password, user.password_hash);
                    
                    if (!isValidPassword) {
                        return res.status(401).json({
                            success: false,
                            message: "Invalid username or password"
                        });
                    }

                    const token = jwt.sign(
                        { user_id: user.id, username: user.username },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.json({
                        success: true,
                        message: "Login successful",
                        token
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

    return router;
};