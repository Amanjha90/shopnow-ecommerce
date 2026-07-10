import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const CartPage = () => {
  // Why useCart: to get cart items, remove function and total price
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart()
  // Why useAuth: to check if user is logged in before checkout
  const { user } = useAuth()
  const navigate = useNavigate()

  const checkoutHandler = () => {
    // Why check login: user must be logged in to place an order
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
    } else {
      // Why navigate to checkout: goes to proper checkout page
      navigate('/checkout')
    }
  }

  // Why show empty message: if cart is empty, no point showing empty table
  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <p className='text-2xl text-gray-500 mb-4'>Your cart is empty</p>
        <button
          onClick={() => navigate('/')}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart items list */}
        <div className='lg:col-span-2'>
          {cartItems.map(item => (
            <div
              key={item._id}
              className='flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-4'
            >
              {/* Product image */}
              <img
                src={item.image}
                alt={item.name}
                className='w-20 h-20 object-cover rounded'
              />

              {/* Product details */}
              <div className='flex-1'>
                <h3 className='font-semibold text-lg'>{item.name}</h3>
                <p className='text-gray-500'>{item.category}</p>
                {/* Why show quantity: user needs to know how many they added */}
                <p className='text-blue-600 font-bold'>
                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
              </div>

              {/* Remove button */}
              {/* Why: user should be able to remove items they don't want */}
              <button
                onClick={() => removeFromCart(item._id)}
                className='text-red-500 hover:text-red-700 font-semibold'
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        {/* Why separate section: clearly shows total and checkout button */}
        <div className='bg-white p-6 rounded-lg shadow h-fit'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>

          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>Items</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>

          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className='flex justify-between mb-2'>
            <span className='text-gray-600'>Shipping</span>
            {/* Why free shipping above 500: common e-commerce practice */}
            <span className='text-green-500'>
              {cartTotal > 500 ? 'Free' : '₹50'}
            </span>
          </div>

          <hr className='my-4' />

          <div className='flex justify-between mb-6'>
            <span className='font-bold text-lg'>Total</span>
            <span className='font-bold text-lg text-blue-600'>
              ₹{cartTotal > 500 ? cartTotal : cartTotal + 50}
            </span>
          </div>

          <button
            onClick={checkoutHandler}
            className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg'
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate('/')}
            className='w-full mt-3 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage