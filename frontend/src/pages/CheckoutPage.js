import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const shippingPrice = cartTotal > 500 ? 0 : 50
  const finalPrice = cartTotal + shippingPrice

  const placeOrderHandler = async () => {
    if (!address || !city || !pincode || !phone) {
      toast.error('Please fill all delivery details')
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      // Step 1 — Create order in our database first
      // Why: we need order ID before starting payment
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id
      }))

      const { data: order } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems,
          shippingAddress: { address, city, pincode, phone },
          totalPrice: finalPrice
        },
        config
      )

      // Step 2 — Create Razorpay payment order
      // Why: Razorpay needs to know the amount before showing payment popup
      const { data: razorpayOrder } = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { amount: finalPrice },
        config
      )

      // Step 3 — Open Razorpay payment popup
      // Why options: these configure how the payment popup looks and behaves
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'ShopNow',
        description: 'Purchase from ShopNow',
        order_id: razorpayOrder.id,

        // Why handler: this runs after payment is successful
        handler: async (response) => {
          try {
            // Step 4 — Verify payment on backend
            // Why verify: confirms payment is genuine and not fake
            const { data } = await axios.post(
              'http://localhost:5000/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              },
              config
            )

            if (data.success) {
              clearCart()
              toast.success('Payment successful! Order confirmed 🎉')
              navigate(`/order/${order._id}`)
            }
          } catch (error) {
            toast.error('Payment verification failed')
          }
        },

        // Why prefill: fills user details automatically in payment popup
        prefill: {
          name: user.name,
          email: user.email,
          contact: phone
        },

        theme: {
          color: '#F59E0B' // Why yellow: matches our ShopNow theme
        },

        // Why modal: handles when user closes payment popup without paying
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled')
            setLoading(false)
          }
        }
      }

      // Why new window.Razorpay: opens the payment popup
      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()
      setLoading(false)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Delivery details form */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-bold mb-4'>Delivery Details</h2>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Full Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='House no, Street, Area'
              className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400'
              rows='3'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>City</label>
            <input
              type='text'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Your city'
              className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Pincode</label>
            <input
              type='text'
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder='6 digit pincode'
              className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Phone Number</label>
            <input
              type='text'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='10 digit phone number'
              className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400'
            />
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className='bg-white p-6 rounded-lg shadow mb-4'>
            <h2 className='text-xl font-bold mb-4'>Order Summary</h2>

            {cartItems.map(item => (
              <div key={item._id} className='flex justify-between items-center py-2 border-b'>
                <div className='flex items-center gap-3'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-12 h-12 object-cover rounded'
                  />
                  <div>
                    <p className='font-semibold text-sm'>{item.name}</p>
                    <p className='text-gray-500 text-xs'>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className='font-semibold'>₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div className='mt-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-500' : ''}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <hr />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span className='text-yellow-600'>₹{finalPrice}</span>
              </div>
            </div>
          </div>

          <button
            onClick={placeOrderHandler}
            disabled={loading}
            className='w-full bg-yellow-400 text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-400'
          >
            {loading ? 'Processing...' : `Pay ₹${finalPrice} with Razorpay`}
          </button>

          {/* Why test mode notice: reminds user this is test payment */}
          <p className='text-center text-gray-500 text-sm mt-2'>
            🔒 Secured by Razorpay | Test Mode
          </p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage