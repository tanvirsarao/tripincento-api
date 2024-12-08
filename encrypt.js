const bcrypt = require('bcrypt');

// Using async/await
async function encryptPassword(plainPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return {
            success: true,
            hashedPassword
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Using Promise
function hashPassword(plainPassword) {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, saltRounds)
            .then(hash => {
                resolve({
                    success: true,
                    hashedPassword: hash
                });
            })
            .catch(err => {
                resolve({
                    success: false,
                    error: err.message
                });
            });
    });
}
