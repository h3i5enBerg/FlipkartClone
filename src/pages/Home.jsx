import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Filters from '../components/Filters'
import { fetchProducts, fetchCategories } from '../services/api'
import '../styles/home.css'

const DEFAULT_FILTERS = { priceMax: 100000, minRating: 0, inStockOnly: false }
const SORT_OPTIONS = [
  { value: 'default',    label: 'Relevance' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Rating: High to Low' },
]

export default function Home({ addToCart, addToWishlist, wishlist, showToast }) {
  const navigate = useNavigate()
  const [products, setProducts]             = useState([])
  const [categories, setCategories]         = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery]       = useState('')
  const [filters, setFilters]               = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy]                 = useState('default')
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => { fetchCategories().then(setCategories) }, [])

  useEffect(() => {
    setLoading(true); setError(null)
    fetchProducts(activeCategory)
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [activeCategory])

  useEffect(() => {
    try { const raw = localStorage.getItem('fk_recently_viewed'); if (raw) setRecentlyViewed(JSON.parse(raw)) } catch {}
  }, [])

  const wishlistIds = new Set(wishlist.map(w => w.id))

  const displayed = products
    .filter(p => {
      if (filters.inStockOnly && !p.inStock) return false
      if (p.price > filters.priceMax) return false
      if (p.rating < filters.minRating) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) =>
      sortBy === 'price_asc'  ? a.price - b.price :
      sortBy === 'price_desc' ? b.price - a.price :
      sortBy === 'rating'     ? b.rating - a.rating : 0
    )

  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setSearchQuery(''); setSortBy('default'); setActiveCategory(null) }

  return (
    <div className="home-page">
      <div className="category-strip">
        <div className="category-strip-inner">
          <button className={`cat-pill${activeCategory === null ? ' active' : ''}`} id="cat-all" onClick={() => setActiveCategory(null)}>All</button>
          {categories.map(cat => (
            <button key={cat} className={`cat-pill${activeCategory === cat ? ' active' : ''}`}
              id={`cat-${cat.replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="home-layout">
        <div className="filters-sidebar">
          <Filters filters={filters} onFilterChange={setFilters} onClear={clearFilters} />
        </div>

        <div className="products-main">
          <div className="products-toolbar">
            <span className="result-count">
              {loading ? 'Loading…' : `${displayed.length} result${displayed.length !== 1 ? 's' : ''}`}
            </span>
            <select className="sort-select" id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading && <div className="loading-wrap"><div className="spinner" /><span>Fetching products…</span></div>}
          {error && !loading && <div className="error-msg">⚠️ {error}</div>}

          {!loading && !error && displayed.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}

          {!loading && !error && displayed.length > 0 && (
            <div className="products-grid" id="products-grid">
              {displayed.map(product => (
                <ProductCard key={product.id} product={product}
                  isWished={wishlistIds.has(product.id)}
                  onAddToCart={() => { addToCart(product); showToast('Added to cart!') }}
                  onAddToWishlist={() => {
                    addToWishlist(product)
                    showToast(wishlistIds.has(product.id) ? 'Removed from wishlist' : 'Added to wishlist!')
                  }}
                />
              ))}
            </div>
          )}

          {recentlyViewed.length > 0 && (
            <div className="recently-viewed">
              <h3 className="section-title">🕐 Recently Viewed</h3>
              <div className="recently-scroll">
                {recentlyViewed.map(p => (
                  <div key={p.id} className="recently-item" onClick={() => navigate(`/product/${p.id}`)} id={`recent-${p.id}`}>
                    <img src={p.image} alt={p.title} />
                    <p>{p.title}</p>
                    <p className="r-price">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
