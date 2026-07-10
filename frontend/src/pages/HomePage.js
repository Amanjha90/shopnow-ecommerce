import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { FaSearch } from 'react-icons/fa'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products')
        setProducts(data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch products')
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || product.category === category
    return matchSearch && matchCategory
  })

  const categories = ['All', ...new Set(products.map(p => p.category))]

  if (loading) return (
    <div className='flex justify-center items-center h-screen'>
      {/* Why animate-spin: shows spinning loader while products are fetching */}
      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400'></div>
    </div>
  )

  if (error) return (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-xl text-red-500'>{error}</p>
    </div>
  )

  return (
    <div>
      {/* Hero Banner */}
      {/* Why hero banner: first thing user sees, makes site look professional */}
      <div className='bg-gray-900 text-white py-16 px-4'>
        <div className='container mx-auto text-center'>
          <h1 className='text-5xl font-bold mb-4'>
            Welcome to <span className='text-yellow-400'>ShopNow</span>
          </h1>
          <p className='text-xl text-gray-300 mb-8'>
            Discover amazing products at unbeatable prices
          </p>

          {/* Hero search bar */}
          <div className='flex max-w-2xl mx-auto'>
            <input
              type='text'
              placeholder='Search for products...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='flex-1 px-6 py-3 text-gray-800 rounded-l-lg text-lg focus:outline-none'
            />
            <button className='bg-yellow-400 text-gray-900 px-6 py-3 rounded-r-lg hover:bg-yellow-500 transition-colors'>
              <FaSearch className='text-xl' />
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {/* Why stats: builds trust with users like real e-commerce sites */}
      <div className='bg-yellow-400 py-4'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-3 gap-4 text-center text-gray-900 font-semibold'>
            <div>🚚 Free Delivery above ₹500</div>
            <div>🔒 Secure Payments</div>
            <div>↩️ Easy Returns</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='container mx-auto px-4 py-8'>

        {/* Category filters */}
        <div className='flex gap-2 mb-6 flex-wrap'>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                category === cat
                  ? 'bg-gray-900 text-yellow-400'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className='text-gray-500 mb-4'>
          Showing {filteredProducts.length} products
          {category !== 'All' && ` in ${category}`}
          {search && ` for "${search}"`}
        </p>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-2xl text-gray-400'>No products found</p>
            <button
              onClick={() => { setSearch(''); setCategory('All') }}
              className='mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500'
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {/* Why footer: every professional website has a footer */}
      <footer className='bg-gray-900 text-white py-8 mt-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-yellow-400 font-bold text-lg mb-3'>ShopNow</h3>
              <p className='text-gray-400'>Your one stop shop for everything you need.</p>
            </div>
            <div>
              <h3 className='text-yellow-400 font-bold text-lg mb-3'>Quick Links</h3>
              <ul className='text-gray-400 space-y-2'>
                <li>Home</li>
                <li>Products</li>
                <li>Cart</li>
                <li>My Orders</li>
              </ul>
            </div>
            <div>
              <h3 className='text-yellow-400 font-bold text-lg mb-3'>Contact</h3>
              <ul className='text-gray-400 space-y-2'>
                <li>📧 support@shopnow.com</li>
                <li>📞 1800-123-4567</li>
                <li>📍 Bhubaneswar, India</li>
              </ul>
            </div>
          </div>
          <div className='text-center text-gray-500 mt-8 border-t border-gray-700 pt-4'>
            © 2024 ShopNow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage