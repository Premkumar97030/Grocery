const User = require('../models/User');
const Address = require('../models/Address');
const generateToken = require('../utils/generateToken');

class AuthService {
  async register({ name, email, password, phone, role }) {
    const cleanEmail = email ? String(email).toLowerCase().trim() : '';
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      throw new Error('User already exists with this email address');
    }

    const user = await User.create({
      name: name?.trim(),
      email: cleanEmail,
      password,
      phone: phone ? String(phone).trim() : '',
      role: role && role === 'admin' ? 'admin' : 'customer',
    });

    const token = generateToken(user._id, user.role);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async login({ email, password }) {
    const cleanEmail = email ? String(email).toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id, user.role);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).populate('addresses');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, { name, phone }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    return user;
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
    return true;
  }
}

module.exports = new AuthService();
