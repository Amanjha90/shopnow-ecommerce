const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Why this middleware: protects routes that require login
// It checks if user has a valid JWT token before allowing access
const protect = async (req, res, next) => {
  let token

  // Why we check Authorization header: this is where frontend sends the JWT token
  // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1]

      // verify token using our secret key
      // Why: this checks if token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // find user from token's id and attach to request
      // Why: this makes user data available in all protected routes
      req.user = await User.findById(decoded.id).select('-password')

      next() // move to next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}

// Why this middleware: some routes are only for admin users
// e.g. adding products, viewing all orders, deleting users
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next() // user is admin, allow access
  } else {
    res.status(401).json({ message: 'Not authorized as admin' })
  }
}

module.exports = { protect, admin }