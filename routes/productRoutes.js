const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.send(products);
    } catch (err) {
        res.status(500).send("Bad Server");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).send({ error: 'Product not found' });
        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to fetch product' });
    }
});

router.post('/', authMiddleware(['admin']),upload.array('images', 4),async (req, res) => {
    
    const { name, description, price, category, stock } = req.body;
            const imagesUrl = req.files ? req.files.map(file => `/uploads/${file.filename}`) : null;
    
            const newProduct = new Product({
                name,
                description,
                price,
                category,
                stock,
                imagesUrl
            });

    try {
        await newProduct.save();
        res.status(201).send("Product Added Successfuly");
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/:id',authMiddleware(['admin']), upload.array('images', 4), async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
  
      let updateData = {
        name,
        description,
        price,
        category,
        stock
      };
  
      // إذا أرسل صور جديدة
      if (req.files && req.files.length > 0) {
        updateData.imagesUrl = req.files.map(file => `/uploads/${file.filename}`);
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updatedProduct) return res.status(404).send({ error: 'Product not found' });
  
      res.send(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Failed to update product' });
    }
  });

  // 🗑 حذف منتج
router.delete('/:id',authMiddleware(['admin']), async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  
      if (!deletedProduct) return res.status(404).send({ error: 'Product not found' });
  
      res.send({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Failed to delete product' });
    }
  });
  

module.exports = router;
