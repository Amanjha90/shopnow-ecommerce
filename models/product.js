const mongoose = require('mongoose')

// Schema = structure/shape of our product data in database
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true    // every product MUST have a name
  },
  price: {
    type: Number,
    required: true    // every product MUST have a price
  },
  description: {
    type: String,
    required: true    // every product MUST have a description
  },
  image: {
    type: String,
    required: true    // stores the URL of product image
  },
  category: {
    type: String,
    required: true    // e.g. "Shoes", "Clothes", "Electronics"
  },
  stock: {
    type: Number,
    default: 0        // if not provided, stock starts at 0
  }
}, { timestamps: true })  
// timestamps automatically adds createdAt and updatedAt fields

// module.exports makes this model available to other files
module.exports = mongoose.model('Product', productSchema)