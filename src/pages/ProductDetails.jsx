import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchProductById } from '../services/api'
import '../styles/productDetails.css'

export default function ProductDetails({ addToCart, addToWishlist, wishlist, showToast }) {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const isWished = wishlist.some(w => w.id === Number(id))

  useEffect(() => {
    setLoading(true); setError(null)
    fetchProductById(id)
      .then(data => {
        if (!data) throw new Error('Product not found')
        setProduct(data); setLoading(false)
        try {
          const prev = JSON.parse(localStorage.getItem('fk_recently_viewed') || '[]')
          localStorage.setItem('fk_recently_viewed', JSON.stringify([data, ...prev.filter(p => p.id !== data.id)].slice(0, 6)))
        } catch {}
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  const ratingColor = r => r >= 4 ? 'var(--fk-green)' : r >= 3 ? 'var(--fk-star)' : 'var(--fk-red)'

  if (loading) return <div className="page-content"><div className="loading-wrap"><div className="spinner" /><span>Loading product…</span></div></div>
  if (error || !product) return (
    <div className="page-content">
      <div className="error-msg">⚠️ {error || 'Product not found'}<br /><br />
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  )

  return (
    <div className="page-content"><div className="details-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link to="/">Home</Link> &rsaquo;
        <Link to="/" onClick={e => e.preventDefault()} style={{ textTransform: 'capitalize' }}>{product.category}</Link> &rsaquo;
        <span>{product.title.slice(0, 40)}…</span>
      </nav>

      <div className="details-grid">
        <div className="details-image-col">
          <div className="details-image-wrap"><img src={product.image} alt={product.title} /></div>
        </div>

        <div className="details-info">
          <span className="details-category">{product.category}</span>
          <h1 className="details-title">{product.title}</h1>

          <div className="details-rating-row">
            <span className="details-rating-pill" style={{ background: ratingColor(product.rating) }}>{product.rating} ★</span>
            <span className="details-rating-count">{product.ratingCount} ratings</span>
          </div>

          <div className="details-pricing">
            <div className="details-price">₹{product.price.toLocaleString('en-IN')}</div>
            <div className="details-mrp-row">
              <span className="details-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="details-off">{product.discount}% off</span>
            </div>
          </div>

          <div className="delivery-info">
            <span className="icon">🚚</span>
            <span>Free delivery on orders above ₹499. Estimated 2–5 days.</span>
          </div>

          <div className="details-actions">
            <button className="btn btn-primary" id="detail-add-cart-btn"
              onClick={() => { addToCart(product); showToast('Added to cart! 🛒') }}>
              🛒 Add to Cart
            </button>
            <button className={`btn ${isWished ? 'btn-outline' : 'btn-secondary'}`} id="detail-wishlist-btn"
              onClick={() => { addToWishlist(product); showToast(isWished ? 'Removed from wishlist' : 'Saved to wishlist! ❤️') }}>
              {isWished ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
          </div>

          <div className="details-description">
            <h4>About this item</h4>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div></div>
  )
}
