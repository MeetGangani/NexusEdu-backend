import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Middleware to protect routes (require authentication)
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// Higher-order function for role-based access control
const roleAuthorization = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.userType)) {
      res.status(403);
      throw new Error(`Access denied. Only ${allowedRoles.join(', ')} allowed.`);
    }
    next();
  });
};

// Role-based access middleware
const adminOnly = roleAuthorization(['admin']);
const instituteOnly = roleAuthorization(['institute']);
const studentOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.userType === 'student') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized, student only');
  }
});

export { protect, adminOnly, instituteOnly, studentOnly };
