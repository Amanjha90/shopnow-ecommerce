import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  // Why useCart: to access addToCart function when user clicks Add to Cart
  const { addToCart } = useCart()

  return (
    // Why shadow and hover: gives card a professional look with hover effect
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300'>

      {/* Why Link: clicking image takes user to product detail page */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          // Why w-full h-48 object-cover: makes all images same size regardless of original size
          className='w-full h-48 object-cover hover:opacity-90 transition-opacity'
        />
      </Link>

      <div className='p-4'>
        {/* Product name links to detail page */}
        <Link to={`/product/${product._id}`}>
          <h2 className='text-lg font-semibold text-gray-800 hover:text-blue-600 mb-1'>
            {product.name}
          </h2>
        </Link>

        {/* Category badge */}
        {/* Why: helps user quickly identify product category */}
        <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>
          {product.category}
        </span>

        <div className='flex justify-between items-center mt-3'>
          {/* Price */}
          <p className='text-xl font-bold text-blue-600'>
            ₹{product.price}
          </p>

          {/* Stock status */}
          {/* Why: user needs to know if product is available */}
          <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart button */}
        {/* Why disabled when out of stock: can't add unavailable products */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className='w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard