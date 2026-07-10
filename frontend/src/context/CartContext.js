import { createContext, useState, useContext } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  )

  const addToCart = (product) => {
    const existItem = cartItems.find(item => item._id === product._id)

    let newCartItems
    if (existItem) {
      newCartItems = cartItems.map(item =>
        item._id === existItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      // Why toast: shows beautiful notification instead of alert
      toast.success(`${product.name} quantity updated! 🛒`)
    } else {
      newCartItems = [...cartItems, { ...product, quantity: 1 }]
      toast.success(`${product.name} added to cart! 🛒`)
    }

    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }

  const removeFromCart = (id) => {
    const newCartItems = cartItems.filter(item => item._id !== id)
    setCartItems(newCartItems)
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
    toast.error('Item removed from cart')
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)