import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import { FaShoppingCart, FaUser, FaStore } from 'react-icons/fa'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const logoutHandler = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  return (
    <nav className='bg-gray-900 text-white sticky top-0 z-50 shadow-lg'>
      {/* Why sticky top-0: navbar stays at top when user scrolls down */}
      {/* Why z-50: navbar stays above all other content */}

      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>

          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <FaStore className='text-yellow-400 text-2xl' />
            <span className='text-2xl font-bold text-yellow-400'>
              ShopNow
            </span>
          </Link>

          {/* Search bar in navbar */}
          {/* Why: Amazon style search bar makes it look professional */}
          <div className='hidden md:flex flex-1 mx-8'>
            <input
              type='text'
              placeholder='Search products...'
              className='w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none'
            />
            <button className='bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-lg hover:bg-yellow-500 font-semibold'>
              Search
            </button>
          </div>

          {/* Right side links */}
          <div className='flex items-center gap-6'>

            {/* Cart icon with count */}
            <Link to='/cart' className='relative flex items-center gap-1 hover:text-yellow-400 transition-colors'>
              <FaShoppingCart className='text-xl' />
              <span className='hidden md:block'>Cart</span>
              {cartCount > 0 && (
                <span className='absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User section */}
            {user ? (
              <div className='flex items-center gap-4'>
                {user.isAdmin && (
                  <Link
                    to='/admin'
                    className='bg-yellow-400 text-gray-900 px-3 py-1 rounded font-semibold hover:bg-yellow-500 transition-colors text-sm'
                  >
                    Admin
                  </Link>
                )}
                <div className='flex items-center gap-2'>
  <FaUser className='text-yellow-400' />
  <Link to='/myorders' className='hidden md:block text-sm hover:text-yellow-400'>
    Hello, {user.name.split(' ')[0]}
  </Link>
</div>
                <button
                  onClick={logoutHandler}
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm'
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  to='/login'
                  className='hover:text-yellow-400 transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='bg-yellow-400 text-gray-900 px-3 py-1 rounded font-semibold hover:bg-yellow-500 transition-colors'
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar