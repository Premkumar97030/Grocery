const productService = require('../services/productService');
const { successResponse } = require('../utils/apiResponse');

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    return successResponse(res, 'Products fetched successfully', result);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 'Product fetched successfully', { product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // If an image was uploaded via Multer
    if (req.file) {
      productData.image = `/uploads/products/${req.file.filename}`;
    }

    // Parse numerical fields if submitted as FormData strings
    if (productData.price) productData.price = Number(productData.price);
    if (productData.discountPrice) productData.discountPrice = Number(productData.discountPrice);
    if (productData.stock) productData.stock = Number(productData.stock);

    const product = await productService.createProduct(productData);
    return successResponse(res, 'Product created successfully', { product }, 201);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.discountPrice) updateData.discountPrice = Number(updateData.discountPrice);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    const product = await productService.updateProduct(req.params.id, updateData);
    return successResponse(res, 'Product updated successfully', { product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return successResponse(res, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
