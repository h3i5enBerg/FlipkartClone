import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

export default function Login({ user, onLogin, onLogout, showToast }) {
  const navigate = useNavigate()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!name.trim() || !email.trim() || !password.trim()) return setError('All fields are required.')
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    onLogin({ name: name.trim(), email: email.trim() })
    showToast(`Welcome, ${name.trim()}! 👋`)
    navigate('/')
  }

  if (user) return (
    <div className="page-content login-page">
      <div className="logged-in-card">
        <div className="avatar">{user.name[0].toUpperCase()}</div>
        <h3>Hi, {user.name}!</h3>
        <p>{user.email}</p>
        <button className="btn btn-primary" id="logout-btn" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => { onLogout(); showToast('Logged out successfully'); navigate('/') }}>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="page-content login-page">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-hero-img">🛍️</div>
          <h2>Looks like you're new here!</h2>
          <p>Sign up to get access to exclusive deals, track your orders, and save your favourites.</p>
        </div>

        <form className="login-form-wrap" onSubmit={handleSubmit} id="login-form">
          <h3>Create Account</h3>
          <div className="form-group">
            <label htmlFor="login-name">Full Name</label>
            <input id="login-name" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          {error && <p style={{ color: 'var(--fk-red)', fontSize: '13px', marginTop: '-8px' }}>⚠️ {error}</p>}
          <button type="submit" className="login-submit" id="login-submit-btn">Continue</button>
          <p className="login-note">By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.</p>
        </form>
      </div>
    </div>
  )
}
