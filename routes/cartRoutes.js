const express = require('express');
const Cart = require('../models/Cart');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
router.post(
    '/',
     authMiddleware(['customer']),
    upload.array('images', 4),
    async (req, res) => {
        const { name, price, stock,imageUrl } = req.body;
        const cart = new Cart({
            name,
            price,
            stock,
            addedBy: req.user._id,
            imageUrl,
        });

        try {
            await cart.save();
            res.status(201).send("Cart is added");
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);

router.get('/',authMiddleware(['customer']), async (req, res) => {
    try {
        const carts = await Cart.find({ addedBy: req.user._id });
        res.send(carts);
    } catch (err) {
        res.status(500).send("Bad Server");
    }
});



router.put(
    '/:id',
    async (req, res) => {
        const { id } = req.params;
        const updates = req.body;

        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: id, addedBy: req.user._id }, // Ensure only the user's cart item is updated
                updates,
                { new: true }
            );

            if (!cart) {
                return res.status(404).send("Not Found or Unauthorized");
            }

            res.send(cart);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
);


router.delete('/:id',authMiddleware(['customer']), async (req, res) => {
    const { id } = req.params;

    try {
        const cart = await Cart.findOneAndDelete({ _id: id, addedBy: req.user._id });

        if (!cart) {
            return res.status(404).send("Not Found or Unauthorized");
        }

        res.send("The cart item is deleted successfully");
    } catch (err) {
        res.status(400).send(err.message);
    }
});
// In your cart routes file
router.delete('/delete/clear', authMiddleware(['customer']), async (req, res) => {
  try {
    await Cart.deleteMany({ addedBy: req.user._id });
    res.status(200).send("Cart cleared successfully");
  } catch (err) {
    res.status(500).send("Error clearing cart");
  }
});
module.exports = router;
