const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { productValidation } = require('../utils/validators');

// Public catalog routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-protected management routes
router.post('/', protect, adminOnly, upload.single('image'), productValidation, createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
