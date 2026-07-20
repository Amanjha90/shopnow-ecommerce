import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = process.env.REACT_APP_API_URL

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      const { data } = await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password
      })
      login(data)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Register</h1>
        {error && (
          <div className='bg-red-100 text-red-600 p-3 rounded mb-4'>{error}</div>
        )}
        <form onSubmit={submitHandler}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your name'
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500'
              required
            />
          </div>
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
          <div className='mb-4'>
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
          <div className='mb-6'>
            <label className='block text-gray-700 mb-2'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm your password'
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className='text-center mt-4 text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline'>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage