import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  // Why these states: track what user types in each input field
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Why useAuth: to save user data after successful login
  const { login } = useAuth()
  // Why useNavigate: to redirect user to homepage after login
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault() // Why: prevents page from reloading when form is submitted

    try {
      setLoading(true)
      // Why this request: sends email and password to backend login route
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      })

      // Why login(data): saves user data and token to context and localStorage
      login(data)
      // Why navigate: redirect to homepage after successful login
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    // Why min-h-screen: makes page take full height of screen
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

        {/* Why show error: user needs to know if login failed and why */}
        {error && (
          <div className='bg-red-100 text-red-600 p-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          {/* Email field */}
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500'
              required
            />
          </div>

          {/* Password field */}
          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500'
              required
            />
          </div>

          {/* Submit button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Why show register link: user might not have account yet */}
        <p className='text-center mt-4 text-gray-600'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline'>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage