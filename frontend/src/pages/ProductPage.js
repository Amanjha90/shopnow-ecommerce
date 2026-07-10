import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const ProductPage = () => {
  // Why useParams: extracts product id from URL like /product/6a2f7981...
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)

  // Why useEffect with id: fetch product when page loads or id changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Why this URL: fetches single product by its id from backend
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(data)
        setLoading(false)
      } catch (error) {
        setError('Product not found')
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const addToCartHandler = () => {
    addToCart(product)
    setAdded(true)
    // Why setTimeout: show "Added!" message for 2 seconds then reset
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-xl'>Loading product...</p>
    </div>
  )

  if (error) return (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-xl text-red-500'>{error}</p>
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Why back button: user should be able to go back to product list easily */}
      <button
        onClick={() => navigate('/')}
        className='mb-6 text-blue-600 hover:underline flex items-center gap-1'
      >
        ← Back to Products
      </button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className='w-full rounded-lg shadow-md object-cover'
        />

        {/* Product details */}
        <div>
          <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>

          {/* Category badge */}
          <span className='text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full'>
            {product.category}
          </span>

          {/* Price */}
          <p className='text-3xl font-bold text-blue-600 mt-4'>
            ₹{product.price}
          </p>

          {/* Description */}
          {/* Why: user needs full details before deciding to buy */}
          <p className='text-gray-600 mt-4 leading-relaxed'>
            {product.description}
          </p>

          {/* Stock status */}
          <p className={`mt-4 font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {/* Add to Cart button */}
          <button
            onClick={addToCartHandler}
            disabled={product.stock === 0}
            className='mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold'
          >
            {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Go to cart button */}
          {/* Why: after adding to cart user might want to go directly to cart */}
          {added && (
            <button
              onClick={() => navigate('/cart')}
              className='mt-3 w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold'
            >
              Go to Cart →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductPage