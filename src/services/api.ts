import type { UserRole } from '../contexts/AuthContext'

const API_BASE = import.meta.env.DEV
  ? (typeof window !== 'undefined' && window.location.protocol === 'https:' ? '/api' : 'http://localhost:3002/api')
  : '/api'

export { API_BASE }

export const TOKEN_KEY = 'hobags_token'

let _token: string | null = localStorage.getItem(TOKEN_KEY)

export function setToken(token: string | null) {
  _token = token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getToken(): string | null {
  return _token
}

// Generous enough that a slow first paint or a cold backend start is not mistaken
// for a failed request, but still bounded so nothing hangs forever.
const REQUEST_TIMEOUT_MS = 15000

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, signal: controller.signal })

    if (res.status === 401 && _token) {
      // The backend rejected the token we presented: it is expired, forged, or
      // belongs to an account that has since been deleted. Drop it immediately so
      // the auth layer forces a real login, instead of letting every subsequent
      // authenticated call fail silently and render empty pages.
      _token = null
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event('hobags_auth_401'))
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = body.error || `Request failed`
      // Keep the structured error fields (status, retryAfter, attemptsRemaining)
      // so callers can react to a lockout instead of re-parsing the message text.
      throw Object.assign(new Error(`${msg} (${res.status})`), {
        status: res.status,
        retryAfter: body.retryAfter,
        attemptsRemaining: body.attemptsRemaining,
      })
    }

    return res.json()
  } catch (err: any) {
    // An aborted request is a timeout, not an auth problem - say so plainly
    // rather than surfacing a bare "Failed to fetch".
    if (err?.name === 'AbortError') {
      throw Object.assign(new Error('The server took too long to respond. Please try again.'), { status: 0 })
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

const ORDERS_KEY = 'hobags_local_orders'
const CHECKOUT_SHIPPING_KEY = 'hobags_checkout_shipping'

/** Order line item as stored in the backend's orders.json. */
export interface AdminOrderItem {
  product_id?: string
  name?: string
  image?: string
  quantity?: number
  price?: number
  seller_id?: string
  seller_name?: string
}

/** Order shape returned by the developer/admin console endpoints. */
export interface AdminOrder {
  id: string
  user_id: string
  buyer_name?: string
  buyer_email?: string
  status: string
  total: number
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  shipping_address: string | null
  created_at: string
  updated_at: string
  items?: AdminOrderItem[]
}

import { notifyOrdersChanged } from './localOrders'
import { getCheckoutState, computeTotals, formatAddress } from './checkout'

function _getUserIdFromToken(): string {
  const payload = decodeJwtPayload(_token || '')
  return payload?.sub || ''
}

function _getUserFromToken(): { id: string; name: string; email: string; role: string } {
  const payload = decodeJwtPayload(_token || '')
  return {
    id: payload?.sub || '',
    name: payload?.name || '',
    email: payload?.email || '',
    role: payload?.role || '',
  }
}

/**
 * Safely decode a JWT payload. JWTs use base64url (can contain "-"/"_" and miss
 * padding) which the browser `atob()` rejects or mis-decodes — that made
 * `_getUserIdFromToken()` return the wrong/empty user id and order history
 * silently matched nobody. Normalizes to base64 + padding first.
 */
export function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const part = String(token || '').split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const rem = base64.length % 4
    const padded = rem === 2 ? base64 + '==' : rem === 3 ? base64 + '=' : base64
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}
function localCreateOrder(shipping_address?: string): { id: string; user_id: string; buyer_name?: string; buyer_email?: string; status: string; total: number; subtotal?: number; shipping?: number; tax?: number; discount?: number; insurance?: number; payment_method?: string; delivery_speed?: string; shipping_address: string | null; created_at: string; updated_at: string; items: Array<{ product_id: string; name: string; image: string; quantity: number; price: number; seller_id?: string; seller_name?: string }> } {
  const user = _getUserFromToken()
  const cartRaw = localStorage.getItem('hobags_local_cart')
  const cartItems: Array<{ id: string; name: string; price: number; image: string; quantity: number }> = cartRaw ? JSON.parse(cartRaw) : []

  const allProducts: Array<{ id: string; addedBy?: { id: string; name: string } | null }> = JSON.parse(localStorage.getItem('hobags_products') || '[]')

  let blockedBySelf = false
  const items = cartItems.map(ci => {
    const product = allProducts.find(p => p.id === ci.id)
    if (product?.addedBy?.id && product.addedBy.id === user.id) {
      blockedBySelf = true
    }
    return {
      product_id: ci.id,
      name: ci.name,
      image: ci.image,
      quantity: ci.quantity,
      price: ci.price,
      seller_id: product?.addedBy?.id || undefined,
      seller_name: product?.addedBy?.name || undefined,
    }
  })

  if (blockedBySelf) {
    throw new Error('You cannot order your own product.')
  }

  const totals = computeTotals(cartItems.map(ci => ({ price: ci.price, quantity: ci.quantity })))
  const total = totals.total
  const now = new Date().toISOString()
  const checkoutState = getCheckoutState()
  const address = shipping_address || formatAddress(checkoutState.shipping) || localStorage.getItem(CHECKOUT_SHIPPING_KEY) || null

  const order = {
    id: `KC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    user_id: user.id,
    buyer_name: user.name || undefined,
    buyer_email: user.email || undefined,
    status: 'pending',
    total,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    discount: totals.discount,
    insurance: totals.insurance,
    payment_method: checkoutState.paymentMethod,
    delivery_speed: checkoutState.deliverySpeed,
    shipping_address: address,
    created_at: now,
    updated_at: now,
    items,
  }

  const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
  all.push(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all))
  notifyOrdersChanged()

  // Best-effort backend sync so the server copy stays in sync where supported.
  // The full order is sent so items + totals persist to the shared orders.json
  // and appear consistently across browsers/devices.
  if (_token) {
    request<unknown>('/orders', { method: 'POST', body: JSON.stringify({ order }) }).catch(() => {})
  }

  return order
}

export interface AuthUser {
  id: string
  name: string
  email: string
  /** Server-authoritative. Never widen to `string` at a call site - the layouts and
   *  product forms compare it against known roles. */
  role: UserRole
  avatar: string | null
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

/**
 * Public seller profile for the storefront page. Deliberately excludes any auth
 * fields - this is the only shape served to anonymous visitors.
 */
export interface PublicSeller {
  id: string
  name: string
  role: string
  avatar: string | null
  memberSince: string | null
  productCount: number
  totalSold: number
  rating: number | null
  reviewCount: number
}

/** A partner-access request as stored in the backend's requests.json. */
export interface VerificationRequestRecord {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string | null
  notes?: string | null
  type?: 'onboarding' | 'role_change'
  requestedRole?: string
  applicationData?: Record<string, any>
  roleAssignmentRequired?: boolean
}

export const api = {
  // Auth. Every one of these is served by backend/server.js from data/users.json;
  // there is no client-side account store.
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  googleConfig: () =>
    request<{ clientId: string; allowedRedirectUris: string[] }>('/auth/google/config'),

  googleCallback: (data: { code: string; code_verifier: string; redirect_uri: string }) =>
    request<AuthResponse>('/auth/google/callback', { method: 'POST', body: JSON.stringify(data) }),

  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  me: () =>
    request<AuthUser>('/auth/me'),

  updateProfile: (name: string) =>
    request<AuthUser>('/auth/profile', { method: 'PUT', body: JSON.stringify({ name }) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string; reset_token?: string }>(
      '/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }
    ),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>(
      '/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }
    ),

  sendOtp: (phone: string) =>
    request<{ message: string; code?: string; expires_in: number }>(
      '/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }
    ),

  verifyOtp: (phone: string, code: string, name?: string) =>
    request<AuthResponse>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code, name }) }),

  emailRequestCode: (email: string) =>
    request<{ message: string; code?: string; expires_in: number }>(
      '/auth/email/request-code', { method: 'POST', body: JSON.stringify({ email }) }
    ),

  emailRegister: (data: { name: string; email: string; password: string; code: string }) =>
    request<AuthResponse & { verified: boolean }>(
      '/auth/email/register', { method: 'POST', body: JSON.stringify(data) }
    ),

  // Cart
  getCart: () =>
    request<Array<{ id: string; product_id: string; quantity: number; name: string; price: number; image: string; stock: number }>>('/cart'),

  addToCart: (product_id: string, quantity: number = 1, details?: { name?: string; price?: number; image?: string }) =>
    request<{ ok: boolean }>('/cart/add', { method: 'POST', body: JSON.stringify({ product_id, quantity, ...details }) }),

  removeFromCart: (id: string) =>
    request<{ ok: boolean }>(`/cart/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => {
    const userId = _getUserIdFromToken()
    if (!userId) return Promise.resolve([])
    let local: any[] = []
    try {
      const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
      // Only this profile's own orders from this browser — never anyone else's.
      local = all.filter((o: any) => o.user_id === userId).sort(
        (a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
    } catch {
      local = []
    }
    return request<Array<{ id: string; user_id: string; status: string; total: number; shipping_address: string | null; created_at: string; updated_at: string; items?: Array<{ product_id?: string; name?: string; image?: string; quantity?: number; price?: number }> }>>('/orders')
      .then(remote => {
        // Backend already returns ONLY the current user's orders (server-side
        // filter on req.user.sub). Re-filter defensively so a profile can never
        // see another user's order.
        const ownRemote = remote.filter(r => r.user_id === userId)
        const remoteIds = new Set(ownRemote.map(r => r.id))
        // Backfill this browser's own local-only orders (e.g. placed while
        // offline/guest) into the shared backend so they show up in every
        // browser/device, not just this one.
        local.forEach(o => {
          if (o.id && !remoteIds.has(o.id)) {
            request<any>('/orders', { method: 'POST', body: JSON.stringify({ order: o }) }).catch(() => {})
          }
        })
        const ids = new Set(local.map(o => o.id))
        const merged = [...local]
        ownRemote.forEach(r => {
          if (!ids.has(r.id)) merged.push(r)
        })
        // Remote copy wins for duplicates: replace any local-only record that
        // is also (now) on the backend with the authoritative backend version.
        const byId = new Map<string, any>()
        for (const o of merged) if (o.id && !byId.has(o.id)) byId.set(o.id, o)
        ownRemote.forEach(r => {
          if (r.id) byId.set(r.id, r)
        })
        return [...byId.values()].sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()) as any
      })
      .catch(() => local as any)
  },

  getOrder: (id: string) =>
    request<{ id: string; user_id: string; status: string; total: number; shipping_address: string | null; created_at: string; items: Array<{ product_id: string; name: string; image: string; quantity: number; price: number }> }>(`/orders/${id}`)
      .catch(() => {
        const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
        const order = all.find((o: any) => o.id === id)
        if (!order) throw new Error('Order not found')
        return order
      }),

  createOrder: (shipping_address?: string) =>
    Promise.resolve().then(() => localCreateOrder(shipping_address)),

  // Verification requests. These live in the backend's requests.json so the
  // status is the same in every browser and on the developer console.
  submitVerificationRequest: (payload: {
    id: string
    role: string
    type?: 'onboarding' | 'role_change'
    requestedRole?: string
    applicationData?: Record<string, any>
  }) =>
    request<VerificationRequestRecord>('/requests', {
      method: 'POST',
      body: JSON.stringify({ request: payload }),
    }),

  getMyVerificationRequests: () =>
    request<VerificationRequestRecord[]>('/requests/mine'),

  getDevRequests: () =>
    request<VerificationRequestRecord[]>('/requests/all'),

  patchDevRequest: (id: string, patch: { status?: string; notes?: string }) =>
    request<VerificationRequestRecord>(`/requests/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  deleteDevRequest: (id: string) =>
    request<{ ok: boolean }>(`/requests/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Wishlist
  getWishlist: () =>
    request<Array<{ id: string; user_id: string; product_id: string; created_at: string }>>('/wishlist'),

  addToWishlist: (product_id: string) =>
    request<{ ok: boolean }>('/wishlist/add', { method: 'POST', body: JSON.stringify({ product_id }) }),

  removeFromWishlist: (product_id: string) =>
    request<{ ok: boolean }>(`/wishlist/${product_id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params?: { category?: string; search?: string; featured?: boolean; page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.category) q.set('category', params.category)
    if (params?.search) q.set('search', params.search)
    if (params?.featured) q.set('featured', 'true')
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    return request<Array<{ id: string; name: string; description: string; price: number; original_price: number | null; image: string; category_id: string | null; badge: string | null; stock: number; seller_id: string | null; featured: number; created_at: string; updated_at: string }>>(`/products${qs ? '?' + qs : ''}`)
  },

  getProduct: (id: string) =>
    request<{ id: string; name: string; description: string; price: number; original_price: number | null; image: string; category_id: string | null; badge: string | null; stock: number; seller_id: string | null; featured: number; created_at: string; updated_at: string }>(`/products/${id}`),

  createProduct: (data: { name: string; description?: string; price: number; original_price?: number; image?: string; category_id?: string; badge?: string; stock?: number }) =>
    request<any>('/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id: string, data: { name?: string; description?: string; price?: number; original_price?: number; image?: string; category_id?: string; badge?: string; stock?: number }) =>
    request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id: string) =>
    request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () =>
    request<Array<{ id: string; name: string; slug: string; description: string; image: string }>>('/categories'),

  // Public storefront. Served without auth so a seller page works for visitors;
  // the backend decides which fields are public, so no passwordHash can leak here.
  getPublicSeller: (id: string) =>
    request<PublicSeller>('/public/sellers/' + encodeURIComponent(id)),

  // Admin
  getAdminUsers: () =>
    request<Array<{ id: string; name: string; email: string; role: string; avatar: string | null; createdAt: string }>>('/admin/users'),

  // The only call in the app that changes a user's role. Backs /developer/users.
  updateAdminUser: (id: string, data: { name?: string; email?: string; role?: string }) =>
    request<AuthUser>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteAdminUser: (id: string) =>
    request<{ ok: boolean }>(`/admin/users/${id}`, { method: 'DELETE' }),

  getAdminFeatures: () =>
    request<Array<{ id: string; name: string; description: string; enabled: number; category: string; created_at: string; updated_at: string }>>('/admin/features'),

  toggleAdminFeature: (id: string, enabled: boolean) =>
    request<any>(`/admin/features/${id}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),

  getAdminSettings: () =>
    request<Array<[string, string]>>('/admin/settings'),

  updateAdminSetting: (key: string, value: string) =>
    request<any>(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),

  getAdminStats: () =>
    request<{ total_users: number; total_products: number; total_orders: number; total_revenue: number }>('/admin/stats'),

  getAdminOrders: () => request<AdminOrder[]>('/admin/orders'),

  // Update an order from the developer console (currently the status).
  updateAdminOrder: (id: string, updates: { status?: string }) =>
    request<AdminOrder>(`/admin/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Delete an order from the developer console.
  deleteAdminOrder: (id: string) =>
    request<{ ok: boolean; id: string }>(`/admin/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Supplier
  getSupplierDashboard: () =>
    request<any>('/supplier/dashboard'),
  getSupplierWarehouses: () =>
    request<any>('/supplier/warehouses'),
  createSupplierWarehouse: (data: Record<string, any>) =>
    request<any>('/supplier/warehouses', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplierWarehouse: (id: string, patch: Record<string, any>) =>
    request<any>(`/supplier/warehouses/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteSupplierWarehouse: (id: string) =>
    request<any>(`/supplier/warehouses/${id}`, { method: 'DELETE' }),
  getSupplierWarehouseInventory: (warehouseId: string) =>
    request<any>(`/supplier/warehouses/${warehouseId}/inventory`),
  getSupplierTrends: () =>
    request<any>('/supplier/trends'),

  // Seller
  getSellerDashboard: () =>
    request<any>('/seller/dashboard'),
  getSellerPromotions: () =>
    request<any>('/seller/promotions'),
  createSellerPromotion: (data: any) =>
    request<any>('/seller/promotions', { method: 'POST', body: JSON.stringify(data) }),
  updateSellerPromotionStatus: (id: string, status: string) =>
    request<any>(`/seller/promotions/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
  getSellerAbandonedCarts: () =>
    request<any>('/seller/abandoned-carts'),
  getSellerCustomerInsights: () =>
    request<any>('/seller/customer-insights'),

  // Manufacturer
  getManufacturerHub: () =>
    request<any>('/manufacturer/hub'),
  getManufacturerProduction: () =>
    request<any>('/manufacturer/production'),
  getManufacturerWholesaleOrders: () =>
    request<any>('/manufacturer/wholesale-orders'),
  getManufacturerLogistics: () =>
    request<any>('/manufacturer/logistics'),
  getManufacturerQC: () =>
    request<any>('/manufacturer/qc'),
  getManufacturerContracts: () =>
    request<any>('/manufacturer/contracts'),
  getManufacturerAnalytics: () =>
    request<any>('/manufacturer/analytics'),
  getManufacturerEquipment: () =>
    request<any>('/manufacturer/equipment'),
  getManufacturerMaintenanceLogs: (equipmentId: string) =>
    request<any>(`/manufacturer/equipment/${equipmentId}/maintenance`),
  getManufacturerBoms: () =>
    request<any>('/manufacturer/boms'),
  getManufacturerBomCost: (productId: string) =>
    request<any>(`/manufacturer/boms/${productId}/cost`),
  getManufacturerScorecards: () =>
    request<any>('/manufacturer/scorecards'),
  createManufacturerShipment: (data: { origin: string; destination: string; status: string; eta: string }) =>
    request<any>('/manufacturer/logistics/shipments', { method: 'POST', body: JSON.stringify(data) }),
  createManufacturerInspection: (data: { batch: string; inspector: string; type: string }) =>
    request<any>('/manufacturer/qc/records', { method: 'POST', body: JSON.stringify(data) }),
  createManufacturerBom: (data: { product_id: string; material_name: string; material_sku?: string; quantity_per_unit: number; unit: string; unit_cost: number; supplier_name?: string; lead_time_days?: number }) =>
    request<any>('/manufacturer/boms', { method: 'POST', body: JSON.stringify(data) }),

  // Messages (Contact)
  sendMessage: (data: { sellerId: string; sellerName: string; product: string; productImage: string; message: string; buyerName?: string; buyerEmail?: string }) =>
    request<{ ok: boolean; id: string }>('/messages', { method: 'POST', body: JSON.stringify(data) }),

  getMessages: () =>
    request<Array<{ id: string; sellerId: string; sellerName: string; buyerId: string; buyerName: string; buyerEmail: string; product: string; productImage: string; message: string; createdAt: string }>>('/messages'),
}
