const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { protect, admin } = require('../middleware/authMiddleware')

// POST /api/orders
// Why protect: only logged in users can place orders
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body

    // Why check orderItems: can't place empty order
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' })
    }

    const order = new Order({
      user: req.user._id, // Why: links order to logged in user
      orderItems,
      shippingAddress,
      totalPrice
    })

    const savedOrder = await order.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/orders/myorders
// Why: logged in user can see their own orders
router.get('/myorders', protect, async (req, res) => {
  try {
    // Why find by user: only return orders belonging to logged in user
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // Why sort: show newest orders first
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/orders/:id
// Why: user can see details of a specific order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email') // Why populate: get user name and email
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT /api/orders/:id/status
// Why admin: only admin can update order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Why update status: admin needs to mark orders as shipped/delivered
    order.status = req.body.status
    if (req.body.status === 'Delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/orders (admin only)
// Why: admin needs to see all orders from all users
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router