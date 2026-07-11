const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { generateToken } = require('../utils/jwt');
const { sendWelcomeEmail } = require('../utils/email');
const ActivityLog = require('../models/ActivityLog');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'CUSTOMER' },
    });

    const token = generateToken({ id: user.id, role: user.role, email: user.email });

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.warn('Welcome email failed to send:', e.message);
    }

    try {
      await ActivityLog.create({ userId: user.id, action: 'REGISTER', meta: { email: user.email } });
    } catch (e) {
      console.warn('Activity log failed:', e.message);
    }

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });

    try {
      await ActivityLog.create({ userId: user.id, action: 'LOGIN' });
    } catch (e) {
      console.warn('Activity log failed:', e.message);
    }

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    if (req.user) {
      try {
        await ActivityLog.create({ userId: req.user.id, action: 'LOGOUT' });
      } catch (e) {
        console.warn('Activity log failed:', e.message);
      }
    }
    // JWTs are stateless: the client is responsible for discarding the token.
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, me };
