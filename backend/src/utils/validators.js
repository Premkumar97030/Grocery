const { validationResult, check } = require('express-validator');
const { errorResponse } = require('./apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 422, errors.array());
  }
  next();
};

const registerValidation = [
  check('name', 'Name is required').trim().notEmpty(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  validate,
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists(),
  validate,
];

const productValidation = [
  check('name', 'Product name is required').trim().notEmpty(),
  check('description', 'Description is required').trim().notEmpty(),
  check('price', 'Valid price is required').isFloat({ min: 0 }),
  check('category', 'Category is required').trim().notEmpty(),
  check('stock', 'Stock must be a non-negative number').isInt({ min: 0 }),
  check('unit', 'Unit is required (e.g. 1 kg, 500g, 1 piece)').trim().notEmpty(),
  validate,
];

const categoryValidation = [
  check('name', 'Category name is required').trim().notEmpty(),
  check('description', 'Description is required').trim().notEmpty(),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  categoryValidation,
};
