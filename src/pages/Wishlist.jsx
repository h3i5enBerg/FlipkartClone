import { Link } from 'react-router-dom'
import '../styles/wishlist.css'

export default function Wishlist({ wishlist, removeFromWishlist, moveToCart, showToast }) {
  if (wishlist.length === 0) return (
    <div className="page-content"><div className="wishlist-page">
      <div className="empty-state">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>❤️</div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love to your wishlist.</p>
        <Link to="/" className="btn btn-secondary" id="go-shopping-wishlist-btn">Explore Products</Link>
      </div>
    </div></div>
  )

  return (
    <div className="page-content"><div className="wishlist-page">
      <h1>My Wishlist ({wishlist.length})</h1>
      <div className="wishlist-grid" id="wishlist-grid">
        {wishlist.map(product => (
          <div className="wishlist-item" key={product.id} id={`wishlist-item-${product.id}`}>
            <button className="wishlist-remove-btn" id={`wishlist-remove-${product.id}`}
              onClick={() => { removeFromWishlist(product.id); showToast('Removed from wishlist', 'warn') }}
              aria-label="Remove from wishlist">✕</button>

            <div className="wishlist-img-wrap"><img src={product.image} alt={product.title} /></div>

            <div className="wishlist-info">
              <p className="wishlist-title">{product.title}</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span className="wishlist-price">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="wishlist-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              </div>
              <span className="wishlist-off">{product.discount}% off</span>
            </div>

            <div className="wishlist-actions">
              <button className="btn btn-primary" id={`wishlist-move-cart-${product.id}`}
                onClick={() => { moveToCart(product); showToast('Moved to cart! 🛒') }}>
                🛒 Add to Cart
              </button>
              <Link to={`/product/${product.id}`} className="btn btn-outline" id={`wishlist-view-${product.id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  )
}
