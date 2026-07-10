const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  // Why ref User: links order to the user who placed it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Why array: one order can have multiple products
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      }
    }
  ],
  // Why shippingAddress: we need to know where to deliver
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  // Why totalPrice: store final amount charged to user
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  // Why isPaid: track if payment is completed
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  // Why isDelivered: track if order has been delivered
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  // Why status: shows current state of order to user
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)