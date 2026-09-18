const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  addAddress,
  deleteAddress,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All user routes are protected
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', updateUserPassword);

// Saved Addresses
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

// Admin route
router.get('/', adminOnly, getAllUsers);

module.exports = router;
