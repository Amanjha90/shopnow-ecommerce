import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import MyOrdersPage from './pages/MyOrdersPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/admin' element={<AdminPage />} />
            {/* Why these new routes: checkout, order detail and my orders pages */}
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/order/:id' element={<OrderPage />} />
            <Route path='/myorders' element={<MyOrdersPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App