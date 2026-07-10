const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// GET all products
// Why: React homepage needs to fetch and display all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find() // find() gets all products from database
    res.json(products) // send products back as JSON to frontend
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET single product by id
// Why: When user clicks on a product, we need to show its full details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id) // find one product by its id
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create new product
// Why: Admin needs to add new products to the store
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body) // create new product from data sent by frontend
    const savedProduct = await product.save() // save it to database
    res.status(201).json(savedProduct) // send saved product back
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT update product
// Why: Admin needs to update price, stock, description of existing products
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated product, not old one
    )
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE product
// Why: Admin needs to remove products that are no longer available
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router