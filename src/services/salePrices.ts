import { useEffect, useState } from 'react'

export type SaleType = 'flash' | 'campaign'

export interface ActiveSale {
  product_id: string
  sale_price: number
  original_price: number
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  starts_at: string
  ends_at: string
  name: string
  sale_type: SaleType
}

const FLASH_PREFIX = 'hobags_seller_flashdeals_'
const CAMPAIGN_PREFIX = 'hobags_seller_campaigns_'
export const DEALS_CHANGED_EVENT = 'hobags_deals_changed'

interface RawDeal {
  status?: string
  product_id?: string
  sale_price?: number | string
  original_price?: number | string
  discount_type?: string
  discount_value?: number | string
  starts_at?: string
  ends_at?: string
  name?: string
}

export function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function num(v: number | string | undefined): number {
  const n = Number(v)
  return isFinite(n) ? n : 0
}

function parseDeal(raw: RawDeal, sale_type: SaleType): ActiveSale | null {
  if (!raw || typeof raw !== 'object') return null
  if (raw.status !== 'active') return null
  if (!raw.product_id) return null
  const sale_price = num(raw.sale_price)
  const original_price = num(raw.original_price)
  if (sale_price <= 0 || original_price <= 0 || sale_price >= original_price) return null
  const now = Date.now()
  const start = new Date(raw.starts_at || '').getTime()
  const end = new Date(raw.ends_at || '').getTime()
  if (!isNaN(start) && start > now) return null
  if (!isNaN(end) && end < now) return null
  return {
    product_id: raw.product_id,
    sale_price,
    original_price,
    discount_type: raw.discount_type === 'fixed' ? 'fixed' : 'percentage',
    discount_value: num(raw.discount_value),
    starts_at: raw.starts_at || '',
    ends_at: raw.ends_at || '',
    name: raw.name || '',
    sale_type,
  }
}

export function getActiveSales(): Record<string, ActiveSale> {
  const map: Record<string, ActiveSale> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      let sale_type: SaleType | null = null
      if (key.startsWith(FLASH_PREFIX)) sale_type = 'flash'
      else if (key.startsWith(CAMPAIGN_PREFIX)) sale_type = 'campaign'
      if (!sale_type) continue
      const raw = JSON.parse(localStorage.getItem(key) || '[]')
      if (!Array.isArray(raw)) continue
      for (const item of raw) {
        const sale = parseDeal(item, sale_type)
        if (!sale) continue
        const cur = map[sale.product_id]
        if (!cur || sale.sale_price < cur.sale_price) map[sale.product_id] = sale
      }
    }
  } catch { /* ignore */ }
  return map
}

export function getActiveSale(productId: string): ActiveSale | null {
  return getActiveSales()[productId] || null
}

export function useActiveSalesMap(): Record<string, ActiveSale> {
  const [sales, setSales] = useState<Record<string, ActiveSale>>(() => getActiveSales())
  useEffect(() => {
    const refresh = () => setSales(getActiveSales())
    if (typeof window !== 'undefined') {
      window.addEventListener(DEALS_CHANGED_EVENT, refresh)
      window.addEventListener('storage', refresh)
    }
    return () => {
      window.removeEventListener(DEALS_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])
  return sales
}

export function useActiveSale(productId: string): ActiveSale | null {
  const sales = useActiveSalesMap()
  return sales[productId] || null
}

export function notifyDealsChanged(): void {
  try {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DEALS_CHANGED_EVENT))
  } catch { /* ignore */ }
}

export function saleDiscountPct(sale: ActiveSale): number {
  if (sale.discount_type === 'percentage') {
    return Math.min(100, Math.max(0, Math.round(sale.discount_value)))
  }
  if (sale.original_price > 0) {
    return Math.max(0, Math.min(99, Math.round((1 - sale.sale_price / sale.original_price) * 100)))
  }
  return 0
}

export function saleLabel(sale: ActiveSale): string {
  return sale.sale_type === 'flash' ? 'Flash Deal' : 'Campaign'
}