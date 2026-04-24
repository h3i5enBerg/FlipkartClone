import '../styles/filters.css'

const MAX_PRICE = 100000

export default function Filters({ filters, onFilterChange, onClear }) {
  const update = (key, value) => onFilterChange({ ...filters, [key]: value })

  return (
    <aside className="filters-panel" id="filters-panel">
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="clear-btn" onClick={onClear} id="clear-filters-btn">Clear All</button>
      </div>

      <div className="filter-section">
        <p className="filter-label">Price Range</p>
        <div className="price-range-wrap">
          <input type="range" id="price-range-slider" min={0} max={MAX_PRICE} step={500}
            value={filters.priceMax} onChange={e => update('priceMax', Number(e.target.value))} />
          <div className="price-range-labels">
            <span>₹0</span>
            <span className="price-current">Up to ₹{filters.priceMax.toLocaleString('en-IN')}</span>
            <span>₹1,00,000</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <p className="filter-label">Customer Rating</p>
        {[4, 3, 2, 1].map(r => (
          <label key={r} className="rating-filter-option">
            <input type="radio" name="rating-filter" id={`rating-filter-${r}`}
              checked={filters.minRating === r}
              onChange={() => update('minRating', r === filters.minRating ? 0 : r)} />
            <span className="rating-stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
            <span style={{ fontSize: '12px', color: 'var(--fk-muted)' }}>{r}★ &amp; above</span>
          </label>
        ))}
        {filters.minRating > 0 && (
          <button className="clear-btn" style={{ marginTop: '4px' }} onClick={() => update('minRating', 0)}>
            Clear rating
          </button>
        )}
      </div>

      <div className="filter-section">
        <p className="filter-label">Availability</p>
        <label className="filter-option">
          <input type="checkbox" id="in-stock-filter" checked={filters.inStockOnly}
            onChange={e => update('inStockOnly', e.target.checked)} />
          In Stock Only
        </label>
      </div>
    </aside>
  )
}
