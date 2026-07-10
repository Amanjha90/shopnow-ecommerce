const express = require('express')
const router = express.Router()
const Razorpay = require('razorpay')
const crypto = require('crypto')
const Order = require('../models/Order')
const { protect } = require('../middleware/authMiddleware')

// Why initialize Razorpay: connects our backend to Razorpay using our API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Add this line to debug
console.log('Razorpay initialized with key:', process.env.RAZORPAY_KEY_ID)

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body
    console.log('Creating order for amount:', amount)

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    console.log('Order created successfully:', order.id)
    res.json(order)
  } catch (error) {
    // Why detailed logging: shows exact error from Razorpay
    console.log('Razorpay error details:')
    console.log('Message:', error.message)
    console.log('Status code:', error.statusCode)
    console.log('Full error:', JSON.stringify(error))
    res.status(500).json({ message: error.message })
  }
})

// POST /api/payment/verify
// Why: verifies payment signature to confirm payment is genuine
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    // Why crypto: creates signature to verify payment is genuine
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      // Payment is genuine — update order as paid
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: Date.now(),
        status: 'Processing'
      })
      res.json({ success: true, message: 'Payment verified successfully' })
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' })
    }
  } catch (error) {
    console.log('Verify error:', error.message)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router