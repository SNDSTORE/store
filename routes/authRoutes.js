const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');
const User = require('../models/User');

const router = express.Router();

router.post('/register',
async (req, res) => {
    const { name, email, password, location , phone } = req.body;

    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({name, email, password: hashedPassword, role:"customer", location ,phone });
        await user.save();

        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Registration failed', details: err.message });
    }
})

// مسار تسجيل الدخول
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }

        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }

        // توليد الرموز
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const role = user.role
        const id = user.id
        res.status(200).send({
            message: 'Login successful',
            accessToken,
            refreshToken,
            role,
            id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Login failed', details: err.message });
    }
});

// مسار تجديد الرمز (Refresh Token)
router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).send({ error: 'Refresh token is required' });
    }

    try {
        const verified = jwt.verify(token, 'refreshSecretKey');
        const accessToken = generateAccessToken(verified);

        res.status(200).send({
            message: 'Token refreshed successfully',
            accessToken,
        });
    } catch (err) {
        console.error(err);
        res.status(403).send({ error: 'Invalid refresh token', details: err.message });
    }
});

module.exports = router;
