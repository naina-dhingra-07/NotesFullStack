const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const sendToken = (res, user, status = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(status).json({ id: user._id, name: user.name, email: user.email });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    sendToken(res, user, 201);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
    // Same message for both failure cases so we don't reveal which emails exist
    if (!user || !(await user.matchPassword(String(password)))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendToken(res, user);
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: undefined });
  res.json({ message: 'Logged out' });
};

// Lets the client restore the session on page load
exports.me = (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ id: _id, name, email });
};
