import React, { useState, useEffect } from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders, updateOrderStatus, ORDERS_CHANGED_EVENT, LocalOrder } from '../../services/localOrders'
import { formatPrice } from '../../utils/currency'

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pending', bg: 'bg-[#805030]/10', text: 'text-[#805030]', icon: 'hourglass_empty' },
  shipped: { label: 'Shipped', bg: 'bg-[#004be3]/10', text: 'text-[#004be3]', icon: 'local_shipping' },
  delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', bg: 'bg-[#b9002c]/10', text: 'text-[#b9002c]', icon: 'cancel' },
}

const allowedTransitions: Record<string, string[]> = {
  pending: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

const SellerOrders: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const refresh = () => {
    if (user) {
      setOrders(getSellerOrders(user.id))
    }
  }

  useEffect(() => { refresh() }, [user])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener(ORDERS_CHANGED_EVENT, handler)
    return () => window.removeEventListener(ORDERS_CHANGED_EVENT, handler)
  }, [user])

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter)

  const handleStatusChange = (orderId: string, newStatus: LocalOrder['status']) => {
    updateOrderStatus(orderId, newStatus)
    refresh()
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const sellerItems = (order: LocalOrder) => {
    if (!user) return []
    return order.items.filter(item => item.seller_id === user.id)
  }

  const sellerSubtotal = (order: LocalOrder) => {
    return sellerItems(order).reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  }

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Orders</h1>
          <p className="text-[#805030] font-medium text-sm">Track and manage all customer orders.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                statusFilter === tab
                  ? 'bg-[#9e3c00] text-white'
                  : 'bg-white border border-[#dca079]/30 text-[#805030] hover:bg-[#fff4f0]'
              }`}
            >
              {tab === 'all' ? 'All' : statusConfig[tab]?.label || tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#dca079]/10 rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-[#ffe3d3]">
          <span className="text-sm font-bold text-[#4a2507]">{filtered.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffede4]">
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Order ID</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Customer</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Items</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Date</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Total</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                <th className="pb-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffede4]">
              {filtered.map(order => {
                const config = statusConfig[order.status]
                const myItems = sellerItems(order)
                return (
                  <tr key={order.id} className="hover:bg-[#fff4f0] transition-colors group">
                    <td className="py-4 font-bold text-sm">{order.id}</td>
                    <td className="py-4 text-sm text-[#805030]">{order.buyer_name || order.user_id.slice(0, 8)}</td>
                    <td className="py-4 text-sm">
                      {myItems.map((item, idx) => (
                        <span key={idx} className="block">
                          {item.name} x{item.quantity}
                          {idx < myItems.length - 1 && <span className="text-[#dca079] mx-1">|</span>}
                        </span>
                      ))}
                    </td>
                    <td className="py-4 text-sm text-[#805030]">{formatDate(order.created_at)}</td>
                    <td className="py-4 font-bold text-sm">{formatPrice(sellerSubtotal(order))}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${config?.bg || ''} ${config?.text || ''}`}>
                        <span className="material-symbols-outlined text-xs">{config?.icon || ''}</span>
                        {config?.label || order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {allowedTransitions[order.status]?.length > 0 && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {allowedTransitions[order.status].map(next => (
                            <button
                              key={next}
                              onClick={() => handleStatusChange(order.id, next as LocalOrder['status'])}
                              className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                                next === 'cancelled'
                                  ? 'text-[#b9002c] bg-[#b9002c]/10 hover:bg-[#b9002c]/20'
                                  : 'text-[#004be3] bg-[#004be3]/10 hover:bg-[#004be3]/20'
                              }`}
                            >
                              Mark {statusConfig[next]?.label || next}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[#805030] text-sm">
                    <span className="material-symbols-outlined text-3xl mb-2">receipt_long</span>
                    <p>No orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerOrders
