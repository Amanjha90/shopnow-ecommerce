import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const MyOrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Why redirect: only logged in users can see their orders
    if (!user) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        const { data } = await axios.get(
          'http://localhost:5000/api/orders/myorders',
          config
        )
        setOrders(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user, navigate])

  // Why color coding: makes status easy to identify at a glance
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Shipped': return 'bg-purple-100 text-purple-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return (
    <div className='flex justify-center items-center h-screen'>
      <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400'></div>
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>My Orders</h1>

      {orders.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-2xl text-gray-400 mb-4'>No orders yet</p>
          <button
            onClick={() => navigate('/')}
            className='bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-500'
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map(order => (
            <div
              key={order._id}
              className='bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex justify-between items-start mb-4'>
                <div>
                  {/* Why show order id: user needs reference number for support */}
                  <p className='text-sm text-gray-500'>Order ID</p>
                  <p className='font-semibold text-sm'>{order._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order items preview */}
              <div className='flex gap-3 mb-4 overflow-x-auto'>
                {order.orderItems.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 bg-gray-50 rounded p-2 min-w-fit'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-10 h-10 object-cover rounded'
                    />
                    <div>
                      <p className='text-sm font-semibold'>{item.name}</p>
                      <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex justify-between items-center'>
                <div>
                  <p className='text-gray-500 text-sm'>
                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className='font-bold text-lg text-yellow-600'>
                    ₹{order.totalPrice}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className='bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors'
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage