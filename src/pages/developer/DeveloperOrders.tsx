import React, { useState, useEffect } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { api } from '../../services/api'
import { formatPrice } from '../../utils/currency'

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered', 'cancelled'] as const

interface OrderItem {
  product_id?: string
  name?: string
  image?: string
  quantity?: number
  price?: number
  seller_id?: string
  seller_name?: string
}

interface Order {
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
  items?: OrderItem[]
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const money = (n: number | undefined) => formatPrice(Number(n) || 0)

const DeveloperOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getAdminOrders()
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        setOrders([])
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadOrders()
  }, [])

  // Clear the transient success banner a few seconds after it appears.
  useEffect(() => {
    if (!actionMsg) return
    const t = setTimeout(() => setActionMsg(null), 3500)
    return () => clearTimeout(t)
  }, [actionMsg])

  const handleStatusChange = async (order: Order, status: string) => {
    if (status === order.status) return
    const previous = order.status
    setError(null)
    setBusyId(order.id)
    // Optimistic: reflect the new status immediately, roll back on failure.
    setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status } : o)))
    try {
      const updated = await api.updateAdminOrder(order.id, { status })
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, ...updated } : o)))
      setActionMsg(`Order ${order.id} set to ${statusLabel(status)}`)
    } catch (err: any) {
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status: previous } : o)))
      setError(err?.message || 'Failed to update order status')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    const target = confirmDelete
    if (!target) return
    setError(null)
    setBusyId(target.id)
    try {
      await api.deleteAdminOrder(target.id)
      setOrders(prev => prev.filter(o => o.id !== target.id))
      if (expandedId === target.id) setExpandedId(null)
      setConfirmDelete(null)
      setActionMsg(`Order ${target.id} deleted`)
    } catch (err: any) {
      setError(err?.message || 'Failed to delete order')
    } finally {
      setBusyId(null)
    }
  }


  const filtered = orders.filter((o: Order) => {
    if (statusFilter && o.status !== statusFilter) return false
    const search = searchQuery.toLowerCase().trim()
    if (!search) return true
    return (
      o.id.toLowerCase().includes(search) ||
      (o.buyer_name || '').toLowerCase().includes(search) ||
      (o.buyer_email || '').toLowerCase().includes(search) ||
      (o.user_id || '').toLowerCase().includes(search) ||
      ((o.items || []).some((i: OrderItem) => (i.name || '').toLowerCase().includes(search)))
    )
  })

  const sorted = [...filtered].sort((a: Order, b: Order) => {
    const da = new Date(a.created_at).getTime()
    const db = new Date(b.created_at).getTime()
    return db - da
  })

  const totalOrders = orders.length
  const pendingCount = orders.filter((o: Order) => o.status === 'pending').length
  const deliveredCount = orders.filter((o: Order) => o.status === 'delivered').length
  const totalRevenue = orders.reduce((sum: number, o: Order) => sum + (Number(o.total) || 0), 0)

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Orders</h1>
            <p className="text-[#805030] text-sm mt-1">All orders from backend (orders.json)</p>
          </div>
          <button onClick={loadOrders} className="px-4 py-2 bg-[#ffede4] text-[#805030] rounded-full text-xs font-bold hover:bg-[#ffd4bb] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

{error && (
          <div className="mb-6 px-4 py-3 bg-red-100 text-red-800 rounded-xl text-sm font-bold">{error}</div>
        )}

        {actionMsg && (
          <div className="mb-6 px-4 py-3 bg-green-100 text-green-800 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            {actionMsg}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#dca079]/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#9e3c00]">shopping_bag</span>
              <div>
                <p className="text-[10px] font-bold text-[#805030] uppercase">Total Orders</p>
                <p className="text-xl font-black text-[#4a2507]">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#dca079]/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#9e3c00]">hourglass_empty</span>
              <div>
                <p className="text-[10px] font-bold text-[#805030] uppercase">Pending</p>
                <p className="text-xl font-black text-[#4a2507]">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#dca079]/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#9e3c00]">check_circle</span>
              <div>
                <p className="text-[10px] font-bold text-[#805030] uppercase">Delivered</p>
                <p className="text-xl font-black text-[#4a2507]">{deliveredCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#dca079]/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#9e3c00]">attach_money</span>
              <div>
                <p className="text-[10px] font-bold text-[#805030] uppercase">Total Revenue</p>
                <p className="text-xl font-black text-[#4a2507]">{money(totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2 border border-[#dca079]/10 max-w-sm flex-1">
            <span className="material-symbols-outlined text-[#805030] text-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm placeholder-[#805030] w-full outline-none"
              placeholder="Search by order ID, buyer, user ID, items..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-[#dca079]/10 rounded-full text-sm text-[#4a2507] font-medium outline-none focus:ring-2 focus:ring-[#ff7936]/20"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white border border-[#dca079]/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#805030]">Loading orders...</div>
          ) : sorted.length === 0 ? (
            <div className="p-8 text-center text-[#805030]">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ffede4] bg-[#fff4f0]">
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Order ID</th>
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Buyer</th>
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Items</th>
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Total</th>
<th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Date</th>
                    <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Actions</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffede4]">
                  {sorted.map((order: Order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-[#fff4f0] transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-[#4a2507] truncate max-w-32 md:max-w-none">{order.id}</p>
                          <p className="text-[10px] text-[#805030] truncate max-w-32 md:max-w-none">User: {order.user_id}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-[#4a2507]">{order.buyer_name || 'N/A'}</p>
                          <p className="text-[10px] text-[#805030]">{order.buyer_email || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${statusStyles[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#805030]">{(order.items || []).length}</td>
                        <td className="py-3 px-4 text-sm font-bold text-[#4a2507]">{money(order.total)}</td>
                        <td className="py-3 px-4 text-sm text-[#805030]">
                          {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={STATUS_OPTIONS.includes(order.status as typeof STATUS_OPTIONS[number]) ? order.status : 'pending'}
                              disabled={busyId === order.id}
                              onChange={(e) => handleStatusChange(order, e.target.value)}
                              aria-label={`Status for order ${order.id}`}
                              className="px-2 py-1.5 bg-white border border-[#dca079]/30 rounded-full text-[10px] font-bold text-[#4a2507] outline-none focus:ring-2 focus:ring-[#ff7936]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{statusLabel(s)}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setConfirmDelete(order)}
                              disabled={busyId === order.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#b9002c]/30 text-[#b9002c] rounded-full text-[10px] font-bold hover:bg-[#ffede4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                            className="text-xs font-bold text-[#004be3] hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">{expandedId === order.id ? 'expand_less' : 'expand_more'}</span>
                            {expandedId === order.id ? 'Hide' : 'Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedId === order.id && (
                        <tr className="bg-[#fff4f0]">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#805030] mb-2">Items</p>
                                {(order.items || []).length === 0 ? (
                                  <p className="text-sm text-[#805030]">No items on this order.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {(order.items || []).map((item: OrderItem, i: number) => (
                                      <li key={`${order.id}-item-${i}`} className="flex items-center gap-3">
                                        {item.image ? (
                                          <img src={item.image} alt={item.name || 'Product'} className="w-10 h-10 rounded-lg object-cover bg-white" />
                                        ) : (
                                          <span className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm text-[#805030]">image</span>
                                          </span>
                                        )}
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-[#4a2507] truncate">{item.name || 'Untitled product'}</p>
                                          <p className="text-[10px] text-[#805030]">
                                            {item.quantity || 0} x {money(item.price)}
                                            {item.seller_name ? ` - ${item.seller_name}` : ''}
                                          </p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#805030] mb-1">Totals</p>
                                  <dl className="text-xs space-y-1">
                                    <div className="flex justify-between"><dt className="text-[#805030]">Subtotal</dt><dd className="font-bold text-[#4a2507]">{money(order.subtotal)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-[#805030]">Shipping</dt><dd className="font-bold text-[#4a2507]">{money(order.shipping)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-[#805030]">Tax</dt><dd className="font-bold text-[#4a2507]">{money(order.tax)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-[#805030]">Discount</dt><dd className="font-bold text-[#4a2507]">-{money(order.discount)}</dd></div>
                                    <div className="flex justify-between border-t border-[#ffede4] pt-1"><dt className="font-bold text-[#4a2507]">Total</dt><dd className="font-black text-[#4a2507]">{money(order.total)}</dd></div>
                                  </dl>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#805030] mb-1">Shipping Address</p>
                                  <p className="text-xs text-[#805030] whitespace-pre-line">{order.shipping_address || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-[#805030] mb-1">Last Updated</p>
                                  <p className="text-xs text-[#805030]">
                                    {order.updated_at ? `${new Date(order.updated_at).toLocaleDateString()} ${new Date(order.updated_at).toLocaleTimeString()}` : 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
{confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-[90vw] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffede4] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#b9002c]">delete</span>
            </div>
            <h3 className="text-xl font-bold text-[#4a2507] mb-2">Delete Order?</h3>
            <p className="text-sm text-[#805030] mb-6">
              This will permanently remove order{' '}
              <span className="font-bold text-[#4a2507]">{confirmDelete.id}</span> for{' '}
              <span className="font-bold text-[#4a2507]">{confirmDelete.buyer_name || confirmDelete.user_id}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busyId === confirmDelete.id}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#b9002c] hover:bg-[#9e0026] rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busyId === confirmDelete.id ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DeveloperLayout>
  )
}

export default DeveloperOrders
