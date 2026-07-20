import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FaCreditCard, FaLock } from 'react-icons/fa'

const API_URL = process.env.REACT_APP_API_URL

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [phone, setPhone] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const shippingPrice = cartTotal > 500 ? 0 : 50
  const finalPrice = cartTotal + shippingPrice

  const proceedToPayment = () => {
    if (!address || !city || !pincode || !phone) {
      toast.error('Please fill all delivery details')
      return
    }
    setStep(2)
  }

  const placeOrderHandler = async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error('Please fill all payment details')
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      }
      const orderItems = cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id
      }))
      const { data: order } = await axios.post(
        `${API_URL}/api/orders`,
        { orderItems, shippingAddress: { address, city, pincode, phone }, totalPrice: finalPrice },
        config
      )
      await axios.put(`${API_URL}/api/orders/${order._id}/pay`, {}, config)
      clearCart()
      toast.success('Payment successful! Order confirmed 🎉')
      navigate(`/order/${order._id}`)
    } catch (error) {
      toast.error('Something went wrong')
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

      <div className='flex items-center mb-8'>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200'}`}>1</div>
        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200'}`}>2</div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          {step === 1 && (
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold mb-4'>Delivery Details</h2>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Full Address</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder='House no, Street, Area' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' rows='3' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>City</label>
                <input type='text' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Your city' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Pincode</label>
                <input type='text' value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder='6 digit pincode' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Phone Number</label>
                <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='10 digit phone number' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
              </div>
              <button onClick={proceedToPayment} className='w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors'>
                Proceed to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className='bg-white p-6 rounded-lg shadow'>
              <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
                <FaCreditCard className='text-yellow-400' />
                Payment Details
              </h2>
              <div className='bg-yellow-50 border border-yellow-200 rounded p-3 mb-4'>
                <p className='text-sm font-semibold text-yellow-800'>Test Card Details:</p>
                <p className='text-sm text-yellow-700'>Card: 4111 1111 1111 1111</p>
                <p className='text-sm text-yellow-700'>Expiry: 12/26 | CVV: 123</p>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Card Number</label>
                <input type='text' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder='1234 5678 9012 3456' maxLength='19' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2'>Name on Card</label>
                <input type='text' value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder='Your full name' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
              </div>
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-gray-700 mb-2'>Expiry Date</label>
                  <input type='text' value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder='MM/YY' maxLength='5' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
                </div>
                <div>
                  <label className='block text-gray-700 mb-2'>CVV</label>
                  <input type='password' value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder='123' maxLength='3' className='w-full border rounded px-3 py-2 focus:outline-none focus:border-yellow-400' />
                </div>
              </div>
              <button onClick={placeOrderHandler} disabled={loading} className='w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2'>
                <FaLock />
                {loading ? 'Processing Payment...' : `Pay ₹${finalPrice} Securely`}
              </button>
              <button onClick={() => setStep(1)} className='w-full mt-3 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50'>
                ← Back to Delivery
              </button>
              <p className='text-center text-gray-400 text-xs mt-3'>
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          )}
        </div>

        <div className='bg-white p-6 rounded-lg shadow h-fit'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item._id} className='flex justify-between items-center py-2 border-b'>
              <div className='flex items-center gap-3'>
                <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded' />
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
              <span className={shippingPrice === 0 ? 'text-green-500' : ''}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
            </div>
            <hr />
            <div className='flex justify-between font-bold text-lg'>
              <span>Total</span>
              <span className='text-yellow-600'>₹{finalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage