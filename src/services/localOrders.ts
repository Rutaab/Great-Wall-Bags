import { getProductById } from './localProducts'

const ORDERS_KEY = 'hobags_local_orders'

export const ORDERS_CHANGED_EVENT = 'hobags_orders_changed'

export function notifyOrdersChanged(): void {
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT))
}

export interface OrderItem {
  product_id: string
  name: string
  image: string
  quantity: number
  price: number
  seller_id?: string
  seller_name?: string
}

export interface LocalOrder {
  id: string
  user_id: string
  buyer_name?: string
  buyer_email?: string
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shipping_address: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

function getAllOrders(): LocalOrder[] {
  try {
    const raw: any[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    return raw.map(o => ({
      ...o,
      status: (['pending', 'shipped', 'delivered', 'cancelled'].includes(o.status) ? o.status : 'pending') as LocalOrder['status'],
      total: typeof o.total === 'number' ? o.total : 0,
      created_at: o.created_at || new Date().toISOString(),
      updated_at: o.updated_at || o.created_at || new Date().toISOString(),
      items: Array.isArray(o.items) ? o.items.filter((i: any) => i && typeof i === 'object') : [],
    }))
  } catch {
    return []
  }
}

function saveOrders(orders: LocalOrder[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function enrichItemWithSeller(item: OrderItem): OrderItem {
  if (item.seller_id) return item
  const product = getProductById(item.product_id)
  if (product?.addedBy) {
    return { ...item, seller_id: product.addedBy.id, seller_name: product.addedBy.name }
  }
  return item
}

/**
 * Merge shared-store (backend) orders into the local store so that "Save"/"Delete"
 * always work — even for orders that were placed in ANOTHER browser and only
 * arrived here through the backend merge. Upserts by id, preserving local copies
 * when they already exist.
 */
export function importRemoteOrders(remote: LocalOrder[]): void {
  const all = getAllOrders()
  const byId = new Map(all.map(o => [o.id, o]))
  remote.forEach(r => {
    if (!r || !r.id) return
    if (!byId.has(r.id)) byId.set(r.id, r)
  })
  saveOrders([...byId.values()])
}

export function getSellerOrders(sellerId: string): LocalOrder[] {
  const all = getAllOrders()
  return all
    .map(order => ({
      ...order,
      items: order.items.map(enrichItemWithSeller),
    }))
    .filter(order => order.items.some(item => item.seller_id === sellerId))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getOrdersByBuyer(userId: string): LocalOrder[] {
  const all = getAllOrders()
  return all
    .filter(o => o.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getOrderById(orderId: string): LocalOrder | undefined {
  return getAllOrders().find(o => o.id === orderId)
}

export function updateOrderStatus(orderId: string, status: LocalOrder['status']): boolean {
  const all = getAllOrders()
  const idx = all.findIndex(o => o.id === orderId)
  if (idx === -1) return false
  all[idx].status = status
  all[idx].updated_at = new Date().toISOString()
  saveOrders(all)
  return true
}
