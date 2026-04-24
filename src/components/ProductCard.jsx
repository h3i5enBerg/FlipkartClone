import { useNavigate } from 'react-router-dom'
import '../styles/productCard.css'

function StarRating({ rate }) {
  const cls = rate >= 4 ? 'high' : rate >= 3 ? 'mid' : 'low'
  return <span className={`rating-pill ${cls}`}>{rate?.toFixed(1)} ★</span>
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist, isWished }) {
  const navigate = useNavigate()
  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)} id={`product-card-${product.id}`}>
      {product.discount > 0 && <span className="card-discount-badge">{product.discount}% OFF</span>}

      <button className={`card-wishlist-btn ${isWished ? 'wished' : ''}`}
        onClick={e => { e.stopPropagation(); onAddToWishlist(product) }}
        id={`wishlist-btn-${product.id}`}
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}>
        {isWished ? '❤️' : '🤍'}
      </button>

      <div className="card-image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>

      <div className="card-info">
        <p className="card-category">{product.category}</p>
        <p className="card-title">{product.title}</p>
        <div className="card-rating">
          <StarRating rate={product.rating} />
          <span className="rating-count">({product.ratingCount})</span>
        </div>
        <div className="card-pricing">
          <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="card-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
          <span className="card-off">{product.discount}% off</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn btn-primary" onClick={e => { e.stopPropagation(); onAddToCart(product) }} id={`add-cart-${product.id}`}>
          🛒 Add
        </button>
        <button className={`btn ${isWished ? 'btn-outline' : 'btn-secondary'}`}
          onClick={e => { e.stopPropagation(); onAddToWishlist(product) }}
          id={`card-wish-${product.id}`}>
          {isWished ? '✓ Saved' : '♡ Save'}
        </button>
      </div>
    </div>
  )
}
