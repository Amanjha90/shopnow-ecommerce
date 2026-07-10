const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Why this function: we need to generate JWT token in both register and login
// so we create it once and reuse it
const generateToken = (id) => {
  return jwt.sign(
    { id }, // payload — what we store inside token (user's id)
    process.env.JWT_SECRET, // secret key from .env to sign the token
    { expiresIn: '30d' } // token expires after 30 days
  )
}

// POST /api/users/register
// Why: allows new users to create an account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body // get data sent from frontend

    // Why we check existing user: we don't want two accounts with same email
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // create new user — password gets encrypted automatically by our model
    const user = await User.create({ name, email, password })

    // send back user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id) // generate and send JWT token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/users/login
// Why: allows existing users to login to their account
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body // get email and password from frontend

    // find user by email in database
    const user = await User.findOne({ email })

    // Why we check password: matchPassword compares entered password with encrypted one
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id) // generate and send JWT token
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router