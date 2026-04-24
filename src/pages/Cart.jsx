import { Link } from 'react-router-dom'
import '../styles/cart.css'

function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  const { product, quantity } = item
  return (
    <div className="cart-item" id={`cart-item-${product.id}`}>
      <img src={product.image} alt={product.title} className="cart-item-img" />

      <div className="cart-item-info">
        <p className="cart-item-title">{product.title}</p>
        <p className="cart-item-category">{product.category}</p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="cart-item-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="cart-item-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
          <span className="cart-item-discount">{product.discount}% off</span>
        </div>
        <div className="qty-control">
          <button className="qty-btn" id={`qty-dec-${product.id}`} onClick={() => onDecrement(product.id)} disabled={quantity <= 1}>−</button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" id={`qty-inc-${product.id}`} onClick={() => onIncrement(product.id)} disabled={quantity >= 10}>+</button>
        </div>
        <button className="remove-btn" id={`remove-cart-${product.id}`} onClick={() => onRemove(product.id)}>✕ Remove</button>
      </div>

      <div style={{ textAlign: 'right', minWidth: '80px' }}>
        <div style={{ fontSize: '13px', color: 'var(--fk-muted)', marginBottom: '4px' }}>Subtotal</div>
        <div style={{ fontSize: '16px', fontWeight: '700' }}>₹{(product.price * quantity).toLocaleString('en-IN')}</div>
      </div>
    </div>
  )
}

export default function Cart({ cart, updateCart, removeFromCart, showToast }) {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const savings    = cart.reduce((s, i) => s + (i.product.mrp - i.product.price) * i.quantity, 0)
  const delivery   = subtotal > 499 ? 0 : 40
  const total      = subtotal + delivery

  const increment = id => updateCart(cart.map(i => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  const decrement = id => updateCart(cart.map(i => i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
  const remove    = id => { removeFromCart(id); showToast('Item removed from cart', 'warn') }

  if (cart.length === 0) return (
    <div className="page-content"><div className="cart-page">
      <div className="empty-state">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h3>Your cart is empty!</h3>
        <p>Add some products to get started.</p>
        <Link to="/" className="btn btn-secondary" id="go-shopping-btn">Start Shopping</Link>
      </div>
    </div></div>
  )

  return (
    <div className="page-content"><div className="cart-page">
      <h1>My Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})</h1>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map(item => <CartItem key={item.product.id} item={item} onIncrement={increment} onDecrement={decrement} onRemove={remove} />)}
        </div>

        <div className="cart-actions-col">
          <div className="price-summary">
            <div className="price-summary-header">Price Details</div>
            <div className="price-summary-body">
              <div className="price-row"><span>Price ({totalItems} items)</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
              <div className="price-row"><span>Discount</span><span className="green">− ₹{savings.toLocaleString('en-IN')}</span></div>
              <div className="price-row">
                <span>Delivery Charges</span>
                {delivery === 0 ? <span className="green">FREE</span> : <span>₹{delivery}</span>}
              </div>
              <div className="price-row total"><span>Total Amount</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              {savings > 0 && <p style={{ fontSize: '13px', color: 'var(--fk-green)', fontWeight: '600' }}>🎉 You save ₹{savings.toLocaleString('en-IN')} on this order!</p>}
            </div>
          </div>
          <button className="checkout-btn" id="checkout-btn" onClick={() => showToast('Order placed successfully! 🎉')}>Place Order</button>
        </div>
      </div>
    </div></div>
  )
}
