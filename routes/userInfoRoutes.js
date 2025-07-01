const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.get('/info', authMiddleware(['admin', 'customer']), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        res.status(500).send('Bad Server');
    }
});



module.exports = router;
