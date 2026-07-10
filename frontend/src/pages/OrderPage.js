import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const OrderPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Why redirect: if not logged in, can't see orders
    if (!user) {
      navigate('/login')
      return
    }

    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          config
        )
        setOrder(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id, user, navigate])

  // Why color coding: makes order status visually clear
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

  if (!order) return (
    <div className='flex justify-center items-center h-screen'>
      <p className='text-xl text-red-500'>Order not found</p>
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-2'>Order Details</h1>
      <p className='text-gray-500 mb-6'>Order ID: {order._id}</p>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

        {/* Left side - order items and delivery */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Order status */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-bold mb-4'>Order Status</h2>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>

            {/* Why progress bar: visually shows where order is in delivery process */}
            <div className='mt-6'>
              <div className='flex justify-between text-sm text-gray-500 mb-2'>
                <span>Ordered</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-yellow-400 h-2 rounded-full transition-all'
                  style={{
                    width:
                      order.status === 'Pending' ? '10%' :
                      order.status === 'Processing' ? '35%' :
                      order.status === 'Shipped' ? '65%' :
                      order.status === 'Delivered' ? '100%' : '0%'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-bold mb-4'>Items Ordered</h2>
            {order.orderItems.map((item, index) => (
              <div key={index} className='flex items-center gap-4 py-3 border-b'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-16 h-16 object-cover rounded'
                />
                <div className='flex-1'>
                  <p className='font-semibold'>{item.name}</p>
                  <p className='text-gray-500 text-sm'>Quantity: {item.quantity}</p>
                </div>
                <p className='font-bold text-yellow-600'>
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h2 className='text-xl font-bold mb-4'>Delivery Address</h2>
            <p className='text-gray-700'>{order.shippingAddress.address}</p>
            <p className='text-gray-700'>{order.shippingAddress.city}</p>
            <p className='text-gray-700'>Pincode: {order.shippingAddress.pincode}</p>
            <p className='text-gray-700'>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Right side - price summary */}
        <div className='bg-white p-6 rounded-lg shadow h-fit'>
          <h2 className='text-xl font-bold mb-4'>Price Details</h2>

          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Items Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Payment Status</span>
              <span className={order.isPaid ? 'text-green-500' : 'text-red-500'}>
                {order.isPaid ? 'Paid ✅' : 'Pending ⏳'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Delivery Status</span>
              <span className={order.isDelivered ? 'text-green-500' : 'text-orange-500'}>
                {order.isDelivered ? 'Delivered ✅' : 'Pending ⏳'}
              </span>
            </div>
            <hr />
            <div className='flex justify-between font-bold text-lg'>
              <span>Total Paid</span>
              <span className='text-yellow-600'>₹{order.totalPrice}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className='w-full mt-6 bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors'
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate('/myorders')}
            className='w-full mt-3 border-2 border-yellow-400 text-yellow-600 py-3 rounded-lg font-bold hover:bg-yellow-50 transition-colors'
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderPage