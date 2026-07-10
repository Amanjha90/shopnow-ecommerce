import { createContext, useState, useContext } from 'react'

// Why createContext: creates a central store for auth data
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Why localStorage: keeps user logged in even after page refresh
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )

  // Why this function: when user logs in, save their data
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Why this function: when user logs out, remove their data
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    // Why value: makes user, login, logout available to all pages
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Why this hook: makes it easy to use auth data in any component
// Instead of writing useContext(AuthContext) every time, we just write useAuth()
export const useAuth = () => useContext(AuthContext)