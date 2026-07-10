import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const AdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [message, setMessage] = useState(null)

  // Why check isAdmin: redirect non-admin users away from this page
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/')
    }
  }, [user, navigate])

  // Why fetchProducts: admin needs to see all products to manage them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products')
        setProducts(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Why this function: admin needs to add new products to the store
  const addProductHandler = async (e) => {
    e.preventDefault()
    try {
      // Why send token: backend checks if user is admin before allowing product creation
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post(
        'http://localhost:5000/api/products',
        { name, price, description, image, category, stock },
        config
      )
      // Why add to products state: shows new product immediately without page refresh
      setProducts([...products, data])
      setMessage('Product added successfully! ✅')
      // Why clear form: ready for admin to add another product
      setName(''); setPrice(''); setDescription('')
      setImage(''); setCategory(''); setStock('')
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage('Failed to add product ❌')
    }
  }

  // Why this function: admin needs to remove outdated or unavailable products
  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        await axios.delete(`http://localhost:5000/api/products/${id}`, config)
        // Why filter: removes deleted product from UI immediately
        setProducts(products.filter(p => p._id !== id))
      } catch (error) {
        setMessage('Failed to delete product ❌')
      }
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      {message && (
        <div className='bg-green-100 text-green-700 p-3 rounded mb-4'>
          {message}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Add product form */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-bold mb-4'>Add New Product</h2>
          <form onSubmit={addProductHandler}>
            <div className='mb-3'>
              <label className='block text-gray-700 mb-1'>Product Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-gray-700 mb-1'>Price (₹)</label>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-gray-700 mb-1'>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                rows='3'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-gray-700 mb-1'>Image URL</label>
              <input
                type='text'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder='https://example.com/image.jpg'
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-3'>
              <label className='block text-gray-700 mb-1'>Category</label>
              <input
                type='text'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder='e.g. Footwear, Electronics'
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 mb-1'>Stock</label>
              <input
                type='number'
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className='w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors'
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Products list */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-bold mb-4'>
            All Products ({products.length})
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className='overflow-y-auto max-h-96'>
              {products.map(product => (
                <div
                  key={product._id}
                  className='flex items-center justify-between p-3 border-b hover:bg-gray-50'
                >
                  <div className='flex items-center gap-3'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                    <div>
                      <p className='font-semibold'>{product.name}</p>
                      <p className='text-blue-600 text-sm'>₹{product.price}</p>
                      <p className='text-gray-500 text-xs'>{product.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProductHandler(product._id)}
                    className='text-red-500 hover:text-red-700 font-semibold text-sm'
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage