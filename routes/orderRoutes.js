const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new order
router.post(
    '/',
    authMiddleware(['customer']),
    async (req, res) => {
        const { products, totalAmount, location, orderDate } = req.body;
        
        const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
            location,
            orderDate,
            status: 'pending'
        });

        try {
            await order.save();
            res.status(201).send("Order created successfully");
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);

// Get all orders for the current user
router.get('/', authMiddleware(['customer', 'admin']), async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find()
                .populate('user', 'name email phone')
        } else {
            orders = await Order.find({ user: req.user._id })
        }
        res.send(orders);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Get a specific order
router.get('/:id', authMiddleware(['customer', 'admin']), async (req, res) => {
    try {
        let order;
        if (req.user.role === 'admin') {
            order = await Order.findById(req.params.id)
                .populate('user', 'name email')
        } else {
            order = await Order.findOne({
                _id: req.params.id,
                user: req.user._id
            })
        }

        if (!order) {
            return res.status(404).send("Order not found or unauthorized");
        }

        res.send(order);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Update order status (admin only)
router.put(
    '/:id',
    authMiddleware(['admin']),
    async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const order = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!order) {
                return res.status(404).send("Order not found");
            }

            res.send(order);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);

// Delete an order (admin only)
router.delete('/:id', authMiddleware(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        res.send("Order deleted successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;