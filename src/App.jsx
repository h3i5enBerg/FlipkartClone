import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'

const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export default function App() {
  const [cart, setCart]         = useState(() => load('fk_cart', []))
  const [wishlist, setWishlist] = useState(() => load('fk_wishlist', []))
  const [user, setUser]         = useState(() => load('fk_user', null))
  const [darkMode, setDarkMode] = useState(() => load('fk_dark', false))
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast]       = useState({ message: '', type: 'success' })

  useEffect(() => { save('fk_cart', cart) }, [cart])
  useEffect(() => { save('fk_wishlist', wishlist) }, [wishlist])
  useEffect(() => { save('fk_user', user) }, [user])
  useEffect(() => { save('fk_dark', darkMode) }, [darkMode])
  useEffect(() => { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light') }, [darkMode])

  const showToast = (message, type = 'success') => setToast({ message, type })

  const addToCart = (product) => setCart(prev => {
    const exists = prev.find(i => i.product.id === product.id)
    if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, 10) } : i)
    return [...prev, { product, quantity: 1 }]
  })

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.product.id !== id))

  const addToWishlist = (product) => setWishlist(prev => {
    const exists = prev.find(p => p.id === product.id)
    return exists ? prev.filter(p => p.id !== product.id) : [...prev, product]
  })

  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(p => p.id !== id))

  const moveToCart = (product) => { addToCart(product); removeFromWishlist(product.id) }

  return (
    <BrowserRouter>
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        onLogout={() => setUser(null)}
        darkMode={darkMode}
        toggleDark={() => setDarkMode(d => !d)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} showToast={showToast} searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} showToast={showToast} />} />
        <Route path="/cart" element={<Cart cart={cart} updateCart={setCart} removeFromCart={removeFromCart} showToast={showToast} />} />
        <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} moveToCart={moveToCart} showToast={showToast} />} />
        <Route path="/login" element={<Login user={user} onLogin={u => setUser(u)} onLogout={() => setUser(null)} showToast={showToast} />} />
      </Routes>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </BrowserRouter>
  )
}
