import { Link, useNavigate } from 'react-router-dom'
import '../styles/navbar.css'

export default function Navbar({ cartCount, wishlistCount, user, onLogout, darkMode, toggleDark, onSearch, searchQuery }) {
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-main">Flipkart</span>
          <span className="logo-tagline">Explore Plus ✦</span>
        </Link>

        <form className="navbar-search" onSubmit={e => { e.preventDefault(); navigate('/') }}>
          <input
            type="text"
            id="navbar-search-input"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            aria-label="Search products"
          />
          <span className="search-icon">🔍</span>
        </form>

        <div className="navbar-actions">
          <button className="dark-toggle" onClick={toggleDark} id="dark-mode-toggle" aria-label="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'} <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          {user ? (
            <button className="nav-btn" id="user-menu-btn" onClick={onLogout} title={`Logout ${user.name}`}>
              <span className="nav-icon">👤</span><span>{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <Link to="/login" className="nav-btn" id="login-link">
              <span className="nav-icon">👤</span><span>Login</span>
            </Link>
          )}

          <Link to="/wishlist" className="nav-btn" id="wishlist-nav-link">
            <span className="nav-icon">❤️</span><span>Wishlist</span>
            {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="nav-btn" id="cart-nav-link">
            <span className="nav-icon">🛒</span><span>Cart</span>
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}
