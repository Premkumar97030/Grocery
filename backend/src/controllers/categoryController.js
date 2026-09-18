const Category = require('../models/Category');
const { successResponse } = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return successResponse(res, 'Categories fetched successfully', { categories });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new Error('Category not found');
    }
    return successResponse(res, 'Category fetched successfully', { category });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      throw new Error('Category already exists with this name');
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      image: image || '',
      isActive: true,
    });

    return successResponse(res, 'Category created successfully', { category }, 201);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return successResponse(res, 'Category updated successfully', { category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new Error('Category not found');
    }
    return successResponse(res, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
