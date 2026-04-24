import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 2500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const bg = type === 'error' ? 'var(--fk-red)' : type === 'warn' ? 'var(--fk-star)' : 'var(--fk-green)'
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '!'

  return (
    <div id="toast-notification" style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: bg, color: '#fff', padding: '12px 24px', borderRadius: '6px',
      fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'slideUp 0.25s ease', whiteSpace: 'nowrap',
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }`}</style>
      {icon} {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', marginLeft: '6px' }}>×</button>
    </div>
  )
}
