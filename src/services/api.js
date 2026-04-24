const API_BASE = 'https://fakestoreapi.com'
const INR_RATE = 83

export function normalizeProduct(raw) {
  const price = Math.round(raw.price * INR_RATE)
  const mrp   = Math.round(price * 1.25)
  return {
    id: raw.id, title: raw.title, image: raw.image, price, mrp,
    discount:    Math.round(((mrp - price) / mrp) * 100),
    rating:      raw.rating?.rate ?? 0,
    ratingCount: raw.rating?.count ?? 0,
    category:    raw.category,
    description: raw.description,
    inStock:     true,
  }
}

export async function fetchProducts(category = null) {
  try {
    const url = category ? `${API_BASE}/products/category/${encodeURIComponent(category)}` : `${API_BASE}/products`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return (await res.json()).map(normalizeProduct)
  } catch (err) {
    console.warn('API failed, using mock data:', err.message)
    const { default: mock } = await import('../data/products.json')
    return (category ? mock.filter(p => p.category === category) : mock).map(normalizeProduct)
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`)
    if (!res.ok) throw new Error(`Product not found: ${id}`)
    return normalizeProduct(await res.json())
  } catch (err) {
    console.warn('Product fetch failed, using mock:', err.message)
    const { default: mock } = await import('../data/products.json')
    const found = mock.find(p => p.id === Number(id))
    return found ? normalizeProduct(found) : null
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/products/categories`)
    if (!res.ok) throw new Error('Categories fetch failed')
    return res.json()
  } catch {
    return ["electronics", "jewelery", "men's clothing", "women's clothing"]
  }
}
