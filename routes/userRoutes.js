const express = require('express');

const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', authMiddleware(['admin']), async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(500).send("Bad Server");
    }
});

router.post('/', authMiddleware(['admin']), async (req, res) => {
    const { email, password, role } = req.body;

    if (!['admin', 'customer'].includes(role)) {
        return res.status(400).send("Invalid request");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).send("User Added Successfuly");
    } catch (err) {
        res.status(400).send(err.message);
    }
});
router.put('/:id',authMiddleware(['admin']),async (req, res) => {
        const { id } = req.params;
        const updates = req.body;
        try {
            const user = await User.findByIdAndUpdate(id, updates, { new: true });
            if (!user) {
                return res.status(404).send("Not Found");
            }
            res.send(user);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);

// حذف مستخدم
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).send("User Not Found");

        res.send("The User is added succesfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});


module.exports = router;
