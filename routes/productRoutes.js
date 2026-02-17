const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

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
          const imagesUrl = req.files ? req.files.map(file => file.path) : null;
    
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
        console.error('product save error:', err);
        res.status(400).send({ error: err.message });
    }
});

// wrap multer upload so that file errors are handled explicitly
router.put('/:id', authMiddleware(['admin']), (req, res, next) => {
  // log body and files for debugging
  console.log('PUT /products/' + req.params.id + ' body:', req.body);
  upload.array('images', 4)(req, res, (err) => {
    if (err) {
      console.error('multer upload error:', err);
      // always send the message so client sees what happened
      const msg = err && err.message ? err.message : 'Image upload failed';
      if (err instanceof multer.MulterError) {
        // multer-specific error (file size, count, etc.)
        return res.status(400).send({ error: msg });
      }
      return res.status(500).send({ error: msg });
    }
    // after multer success, log the files
    console.log('files uploaded:', req.files && req.files.length);
    next();
  });
}, async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
  
      let updateData = {
        name,
        description,
        price,
        category,
        stock
      };
  
      // إذا أرسل صور جديدة، ندمجها مع الصور الحالية بدلاً من استبدالها
      if (req.files && req.files.length > 0) {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send({ error: 'Product not found' });
        const newUrls = req.files.map(file => file.path);
        updateData.imagesUrl = [ ...(product.imagesUrl || []), ...newUrls ];
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) return res.status(404).send({ error: 'Product not found' });
  
      res.send(updatedProduct);
    } catch (err) {
      console.error('update error:', err);
      // include stack trace in response for debugging (remove in prod)
      return res.status(500).send({
        error: err.message || 'Failed to update product',
        stack: err.stack,
      });
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
