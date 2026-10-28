export const CHECKOUT_STATE_KEY = 'hobags_checkout_state'
const LEGACY_SHIPPING_KEY = 'hobags_checkout_shipping'

export type DeliverySpeed = 'standard' | 'express' | 'priority'
export type PaymentMethod = 'card' | 'paypal' | 'bank'

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  zipCode: string
  country: string
}

export interface CardDetail {
  last4: string
  brand: string
  name: string
  expiry: string
}

export interface PaypalDetail {
  email: string
}

export interface BankDetail {
  holder: string
  bank: string
  accountMasked: string
  swift: string
}

export interface PromoTier {
  code: string
  label: string
  percent: number
}

export interface CheckoutState {
  shipping: ShippingAddress
  deliverySpeed: DeliverySpeed
  insurance: boolean
  promoCode: string
  promoTier: PromoTier | null
  paymentMethod: PaymentMethod
  card: CardDetail | null
  paypal: PaypalDetail | null
  bank: BankDetail | null
}

export const DELIVERY_COSTS: Record<DeliverySpeed, number> = {
  standard: 0,
  express: 14.99,
  priority: 29.99,
}

export const DELIVERY_DETAILS: Record<DeliverySpeed, { label: string; desc: string }> = {
  standard: { label: 'Standard', desc: '5-7 Business Days' },
  express: { label: 'Express', desc: '2-3 Business Days' },
  priority: { label: 'Priority', desc: 'Next Day Delivery' },
}

export const INSURANCE_COST = 4.5
export const TAX_RATE = 0.085

export const PROMO_TIERS: PromoTier[] = [
  { code: 'KINETIC20', label: '20% off subtotal', percent: 0.2 },
]

export function defaultCheckoutState(): CheckoutState {
  return {
    shipping: { fullName: '', address: '', city: '', zipCode: '', country: '' },
    deliverySpeed: 'standard',
    insurance: false,
    promoCode: '',
    promoTier: null,
    paymentMethod: 'card',
    card: null,
    paypal: null,
    bank: null,
  }
}

export function getCheckoutState(): CheckoutState {
  try {
    const raw = localStorage.getItem(CHECKOUT_STATE_KEY)
    if (!raw) return defaultCheckoutState()
    const parsed = JSON.parse(raw)
    return {
      ...defaultCheckoutState(),
      ...parsed,
      shipping: { ...defaultCheckoutState().shipping, ...(parsed.shipping || {}) },
    }
  } catch {
    return defaultCheckoutState()
  }
}

export function formatAddress(a: ShippingAddress): string {
  return [a.address, a.city, a.zipCode, a.country].map(s => s.trim()).filter(Boolean).join(', ')
}

/**
 * Forces the payment experience to run inside a secure context (HTTPS).
 * Returns true when the current page is already secure. If the page is
 * reachable over plain HTTP it immediately upgrades to the HTTPS URL and
 * returns false (mount should stop rendering payment forms in that case).
 */
export function ensureSecureContext(): boolean {
  if (typeof window === 'undefined') return true
  if (window.isSecureContext) return true

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '[::1]'
  if (isLocal && window.location.protocol === 'http:') {
    window.location.href = window.location.href.replace(/^http:/, 'https:')
    return false
  }
  if (window.location.protocol === 'http:') {
    window.location.href = window.location.href.replace(/^http:/, 'https:')
    return false
  }
  return false
}

export function saveCheckoutState(patch: Partial<CheckoutState>): CheckoutState {
  const next = { ...getCheckoutState(), ...patch }
  localStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(next))
  const addr = formatAddress(next.shipping)
  if (addr) {
    const full = next.shipping.fullName.trim() ? `${next.shipping.fullName.trim()}, ${addr}` : addr
    localStorage.setItem(LEGACY_SHIPPING_KEY, full)
  } else {
    localStorage.removeItem(LEGACY_SHIPPING_KEY)
  }
  return next
}

export interface Totals {
  subtotal: number
  shipping: number
  insurance: number
  tax: number
  discount: number
  total: number
}

export function computeTotals(items: Array<{ price: number; quantity: number }>): Totals {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const state = getCheckoutState()
  const shipping = DELIVERY_COSTS[state.deliverySpeed] || 0
  const insurance = state.insurance ? INSURANCE_COST : 0
  const tax = subtotal * TAX_RATE
  const discount = state.promoTier ? subtotal * state.promoTier.percent : 0
  const total = Math.max(0, subtotal + shipping + insurance + tax - discount)
  return { subtotal, shipping, insurance, tax, discount, total }
}

export function applyPromoCode(code: string): { ok: boolean; tier?: PromoTier; error?: string } {
  const tier = PROMO_TIERS.find(t => t.code === code.trim().toUpperCase())
  if (!tier) {
    saveCheckoutState({ promoCode: code, promoTier: null })
    return { ok: false, error: 'Invalid promo code. Please try again.' }
  }
  saveCheckoutState({ promoCode: code, promoTier: tier })
  return { ok: true, tier }
}

export function removePromoCode(): void {
  saveCheckoutState({ promoCode: '', promoTier: null })
}

export function detectCardBrand(number: string): string {
  const clean = number.replace(/\s+/g, '')
  if (/^4/.test(clean)) return 'Visa'
  if (/^5[1-5]/.test(clean)) return 'Mastercard'
  if (/^3[47]/.test(clean)) return 'Amex'
  if (/^6(?:011|5)/.test(clean)) return 'Discover'
  return 'Card'
}

export function isValidCardNumber(number: string): boolean {
  const clean = number.replace(/\s+/g, '')
  if (!/^\d{13,19}$/.test(clean)) return false
  let sum = 0
  let double = false
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i], 10)
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}