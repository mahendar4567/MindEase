const User = require('../models/User');
const { generateTokenAndSetCookie, clearTokenCookie } = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { displayName, email, password, confirmPassword } = req.body;

    // Basic server-side validations
    if (!displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide display name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      displayName: displayName.trim(),
      email: normalizedEmail,
      password,
    });

    // Set JWT HTTP-only cookie
    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: user.toResponse(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get cookie
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user and explicitly include password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Set JWT HTTP-only cookie
    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: user.toResponse(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public / Private
const logoutUser = (req, res) => {
  clearTokenCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current authenticated user session
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toResponse(),
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
