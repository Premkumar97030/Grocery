const authService = require('../services/authService');
const User = require('../models/User');
const Address = require('../models/Address');
const { successResponse } = require('../utils/apiResponse');

const getUserProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return successResponse(res, 'User profile fetched successfully', { user });
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await authService.updateProfile(req.user._id, { name, phone });
    return successResponse(res, 'Profile updated successfully', { user });
  } catch (err) {
    next(err);
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(req.user._id, { currentPassword, newPassword });
    return successResponse(res, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: !!isDefault,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { addresses: address._id },
    });

    const user = await authService.getProfile(req.user._id);
    return successResponse(res, 'Address added successfully', { address, user }, 201);
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    await Address.findOneAndDelete({ _id: addressId, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { addresses: addressId },
    });

    const user = await authService.getProfile(req.user._id);
    return successResponse(res, 'Address deleted successfully', { user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, 'All users fetched successfully', { users, total: users.length });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  addAddress,
  deleteAddress,
  getAllUsers,
};
