const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { categoryValidation } = require('../utils/validators');

// Public category routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-protected category routes
router.post('/', protect, adminOnly, categoryValidation, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
