import type { UserRole } from '../contexts/AuthContext'
import { TOKEN_KEY } from './api'

export type FeaturedStatus = 'none' | 'pending' | 'approved' | 'rejected'

export interface ReviewItem {
  id: string
  author: string
  rating: number
  date: string
  text: string
}

export interface LocalProduct {
  id: string
  name: string
  spec: string
  material: string
  closure: string
  price: number
  stock: number
  bulk: string
  bulkQty: string
  rating: number
  reviews: number
  image: string
  badge: string
  route: string
  category: string
  categories: string[]
  tags: string[]
  status: 'draft' | 'published'
  featured: FeaturedStatus
  addedBy: { id: string; name: string; role: UserRole } | null
  createdAt: string
  variants?: { name: string; options: string }[]
  reviewsList?: ReviewItem[]
}

const PRODUCTS_KEY = 'hobags_products'
const REVIEWS_KEY = 'hobags_product_reviews'
const STORAGE_VERSION_KEY = 'hobags_storage_version'
const CURRENT_STORAGE_VERSION = 3
const API_BASE = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '/api' : 'http://localhost:3002/api'

function getApiToken(): string | null {
  // Single source: the backend-issued JWT kept by api.ts. There is no local
  // session store to fall back to - a token minted in the browser would not be
  // accepted by the backend and could only ever be a forgery attempt.
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch { return null }
}

function apiHeaders(): Record<string, string> {
  const token = getApiToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export function migrateStorageIfNeeded() {
  const version = parseInt(localStorage.getItem(STORAGE_VERSION_KEY) || '1')
  if (version < CURRENT_STORAGE_VERSION) {
    localStorage.removeItem(PRODUCTS_KEY)
    localStorage.removeItem(REVIEWS_KEY)
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_STORAGE_VERSION))
  }
}

export async function syncFromApi(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/products`, { headers: apiHeaders(), signal: AbortSignal.timeout(3000) })
    if (res.ok) {
      const products = await res.json()
      // Never overwrite local products with an empty payload. An uninitialised or
      // reset server store would otherwise wipe the whole catalog in every browser.
      // Deletions made in-app already update localStorage directly, so an empty
      // response here carries no information we do not already have.
      if (Array.isArray(products) && products.length > 0) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
      }
    }
  } catch { /* API offline, keep localStorage */ }
  try {
    const res2 = await fetch(`${API_BASE}/products/reviews`, { headers: apiHeaders(), signal: AbortSignal.timeout(3000) })
    if (res2.ok) {
      const reviews = await res2.json()
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
    }
  } catch { /* ignore */ }
}

function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function getStoredReviews(): Record<string, ReviewItem[]> {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}')
  } catch { return {} }
}

function saveStoredReviews(map: Record<string, ReviewItem[]>) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(map))
  fetch(`${API_BASE}/products/reviews`, {
    method: 'PUT', headers: apiHeaders(),
    body: JSON.stringify(map),
  }).catch(() => {})
}

export function getStoredProducts(): LocalProduct[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
    return raw.map((p: any) => ({
      ...p,
      categories: p.categories || [],
      tags: p.tags || [],
      status: p.status || 'published',
      featured: p.featured || 'none',
      stock: typeof p.stock === 'number' ? p.stock : 50,
    }))
  }
  catch { return [] }
}

export function saveProducts(products: LocalProduct[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  fetch(`${API_BASE}/products/bulk`, {
    method: 'POST', headers: apiHeaders(),
    body: JSON.stringify(products),
  }).catch(() => {})
}

export function getProductsByRoute(route: string): LocalProduct[] {
  return getStoredProducts().filter(p => p.route === route)
}

export function getProductsByCategory(category: string): LocalProduct[] {
  return getStoredProducts().filter(p => p.category === category)
}

export function getTopProductsByRoutes(routes: string[], perRoute: number = 1): LocalProduct[] {
  return routes.flatMap(route => {
    return getProductsByRoute(route)
      .filter(p => p.featured === 'approved' && p.status === 'published')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, perRoute)
  })
}

const FEATURED_RATING_WEIGHT = 0.4
const FEATURED_REVIEWS_WEIGHT = 0.3
const FEATURED_RECENCY_WEIGHT = 0.3
const MAX_REVIEWS_FOR_SCORE = 500

function recencyBoost(createdAt: string): number {
  const days = (Date.now() - new Date(createdAt).getTime()) / 86400000
  if (days < 7) return 1.0
  if (days < 14) return 0.8
  if (days < 30) return 0.5
  if (days < 90) return 0.2
  return 0
}

function computeFeaturedScore(p: LocalProduct): number {
  return (
    p.rating * FEATURED_RATING_WEIGHT +
    Math.min(p.reviews / MAX_REVIEWS_FOR_SCORE, 1) * FEATURED_REVIEWS_WEIGHT +
    recencyBoost(p.createdAt) * FEATURED_RECENCY_WEIGHT
  )
}

export function getSuggestedFeaturedProducts(): (LocalProduct & { score: number })[] {
  const products = getStoredProducts()
    .filter(p => p.featured !== 'approved' && p.featured !== 'rejected' && p.rating > 0 && p.status === 'published')

  const byRoute = new Map<string, LocalProduct[]>()
  for (const p of products) {
    const arr = byRoute.get(p.route) || []
    arr.push(p)
    byRoute.set(p.route, arr)
  }

  const result: (LocalProduct & { score: number })[] = []
  for (const [, routeProducts] of byRoute) {
    const scored = routeProducts
      .map(p => ({ ...p, score: Math.round(computeFeaturedScore(p) * 100) / 100 }))
      .sort((a, b) => b.score - a.score)
    result.push(scored[0])
  }

  return result.sort((a, b) => b.score - a.score)
}

export function approveFeaturedProduct(id: string): LocalProduct | null {
  return updateLocalProduct(id, { featured: 'approved' })
}

export function rejectFeaturedProduct(id: string): LocalProduct | null {
  return updateLocalProduct(id, { featured: 'rejected' })
}

const materialKeywords: Record<string, string> = {
  'Leather': 'Leather',
  'Canvas': 'Canvas',
  'Nylon': 'Nylon',
  'Cotton': 'Cotton',
  'Polyester': 'Polyester',
  'Denim': 'Denim',
  'Wool': 'Wool',
  'Silk': 'Silk',
  'Vegan': 'Vegan Leather',
  'Raffia': 'Raffia',
  'Straw': 'Straw',
  'Jute': 'Jute',
  'Bamboo': 'Bamboo',
  'Cork': 'Cork',
}

const closureKeywords: Record<string, string> = {
  'Zip': 'Zip',
  'Zipper': 'Zip',
  'Magnetic': 'Magnetic',
  'Flap': 'Flap',
  'Drawstring': 'Drawstring',
  'Buckle': 'Buckle',
  'Knot': 'Knot',
  'Snap': 'Magnetic',
}

function inferMaterial(tags: string[]): string {
  for (const tag of tags) {
    for (const [key, val] of Object.entries(materialKeywords)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) return val
    }
  }
  return 'Mixed Materials'
}

function inferClosure(tags: string[]): string {
  for (const tag of tags) {
    for (const [key, val] of Object.entries(closureKeywords)) {
      if (tag.toLowerCase().includes(key.toLowerCase())) return val
    }
  }
  return 'Zip'
}

function inferBadge(tags: string[]): string {
  const lower = tags.map(t => t.toLowerCase())
  if (lower.some(t => t.includes('premium') || t.includes('luxury'))) return 'Premium'
  if (lower.some(t => t.includes('eco') || t.includes('organic') || t.includes('sustainable'))) return 'Eco'
  if (lower.some(t => t.includes('mini'))) return 'Mini'
  if (lower.some(t => t.includes('travel'))) return 'Travel'
  return 'New'
}

export function getProductById(id: string): LocalProduct | undefined {
  return getStoredProducts().find(p => p.id === id)
}

export function getProductReviews(id: string): ReviewItem[] {
  const allReviews = getStoredReviews()
  return allReviews[id] || []
}

export function addReviewToProduct(id: string, review: { author: string; rating: number; text: string }): LocalProduct | null {
  const allReviews = getStoredReviews()
  const existing = allReviews[id] || []
  const newReview: ReviewItem = {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    author: review.author,
    rating: review.rating,
    date: 'Just now',
    text: review.text,
  }
  existing.unshift(newReview)
  allReviews[id] = existing
  saveStoredReviews(allReviews)

  const totalRating = existing.reduce((sum, r) => sum + r.rating, 0)
  const avgRating = Math.round((totalRating / existing.length) * 10) / 10

  const products = getStoredProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx !== -1) {
    products[idx] = {
      ...products[idx],
      rating: avgRating,
      reviews: existing.length,
    }
    saveProducts(products)
    return products[idx]
  }

  return {
    id,
    name: '',
    spec: '',
    material: '',
    closure: '',
    price: 0,
    stock: 0,
    bulk: '',
    bulkQty: '',
    rating: avgRating,
    reviews: existing.length,
    image: '',
    badge: '',
    route: '',
    category: '',
    categories: [],
    tags: [],
    status: 'published',
    featured: 'none',
    addedBy: null,
    createdAt: '',
  }
}

export function getProductsByUser(userId: string): LocalProduct[] {
  return getStoredProducts().filter(p => p.addedBy?.id === userId)
}

export function deleteLocalProduct(id: string): boolean {
  const products = getStoredProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return false
  products.splice(idx, 1)
  saveProducts(products)

  // Permanently delete from the backend so it does NOT come back on reload.
  // The backend DELETE /api/products/:id (authMiddleware) removes it from
  // the JSON store on the server, so syncFromApi() won't re-add it.
  try {
    fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    }).catch(() => {})
  } catch { /* ignore */ }

  return true
}

export function updateLocalProduct(id: string, updates: Partial<LocalProduct>): LocalProduct | null {
  const products = getStoredProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...updates }
  saveProducts(products)
  return products[idx]
}

export function addLocalProduct(data: {
  name: string
  spec: string
  price: number
  stock: number
  route: string
  category: string
  tags: string[]
  image?: string
  bulk?: string
  bulkQty?: string
  material?: string
  status?: 'draft' | 'published'
  categories?: string[]
  addedBy?: { id: string; name: string; role: UserRole } | null
  variants?: { name: string; options: string }[]
}): LocalProduct {
  const product: LocalProduct = {
    id: generateId(),
    name: data.name,
    spec: data.spec,
    material: data.material || inferMaterial(data.tags),
    closure: inferClosure(data.tags),
    price: data.price,
    stock: data.stock || 0,
    bulk: data.bulk || `$${(data.price * 0.7).toFixed(2)} / unit`,
    bulkQty: data.bulkQty || '10+',
    rating: 0,
    reviews: 0,
    image: data.image || 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop',
    badge: inferBadge(data.tags),
    route: data.route,
    category: data.category,
    categories: data.categories || [],
    tags: data.tags,
    status: data.status || 'published',
    featured: 'none',
    addedBy: data.addedBy || null,
    createdAt: new Date().toISOString(),
    variants: data.variants?.filter(v => v.name && v.options) || undefined,
  }
  const products = getStoredProducts()
  products.push(product)
  saveProducts(products)
  return product
}
