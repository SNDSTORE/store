const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, 'accessSecretKey');
};

const generateRefreshToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, 'refreshSecretKey');
};

module.exports = { generateAccessToken, generateRefreshToken };
