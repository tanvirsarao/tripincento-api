// routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

module.exports = (connection) => {
    router.get('/', verifyToken, (req, res) => {
        try {
            const userId = req.user.user_id;

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

    return router;
}; ///github