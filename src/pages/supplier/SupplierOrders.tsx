import React, { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders, updateOrderStatus, ORDERS_CHANGED_EVENT } from '../../services/localOrders'
import SupplierLayout from '../../components/supplier/SupplierLayout'
import { formatPrice } from '../../utils/currency'

const statusDisplay: Record<string, string> = {
  pending: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusColors: Record<string, string> = {
  pending: 'bg-[#ff7936]/20 text-[#9e3c00]',
  shipped: 'bg-[#004be3]/10 text-[#004be3]',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-[#fb5151]/20 text-[#570008]',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Ordered ${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Ordered ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `Ordered ${days}d ago`
}

const SupplierOrders: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)

  const allOrders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user, refreshKey])

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return allOrders
    const statusMap: Record<string, string> = { Processing: 'pending', Shipped: 'shipped', Delivered: 'delivered' }
    return allOrders.filter(o => o.status === (statusMap[activeTab] || activeTab.toLowerCase()))
  }, [allOrders, activeTab])

  useEffect(() => {
    const handler = () => triggerRefresh()
    window.addEventListener(ORDERS_CHANGED_EVENT, handler)
    return () => window.removeEventListener(ORDERS_CHANGED_EVENT, handler)
  }, [])

  const pending = allOrders.filter(o => o.status === 'pending').length
  const shipped = allOrders.filter(o => o.status === 'shipped').length
  const delivered = allOrders.filter(o => o.status === 'delivered').length
  const cancelled = allOrders.filter(o => o.status === 'cancelled').length

  const handleShip = (orderId: string) => {
    updateOrderStatus(orderId, 'shipped')
    triggerRefresh()
  }

  const handleDeliver = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered')
    triggerRefresh()
  }

  const handleCancel = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
    triggerRefresh()
  }

  return (
    <SupplierLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Orders</h1>
          <p className="text-[#805030] text-sm">Manage and fulfill customer orders.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Processing', 'Shipped', 'Delivered'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${activeTab === tab ? 'bg-[#9e3c00] text-white' : 'bg-[#ffede4] text-[#805030] hover:bg-[#ffe3d3]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: allOrders.length.toString(), change: `${delivered} delivered` },
          { label: 'Pending', value: pending.toString(), color: 'text-[#9e3c00]' },
          { label: 'Shipped', value: shipped.toString(), color: 'text-[#004be3]' },
          { label: 'Cancelled', value: cancelled.toString(), color: 'text-[#b9002c]' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-xl border border-[#dca079]/10">
            <p className="text-[10px] font-bold text-[#805030] uppercase">{s.label}</p>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-black ${s.color || 'text-[#4a2507]'}`}>{s.value}</p>
              {s.change && <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{s.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffe3d3] bg-[#fff4f0]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Total</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffe3d3]">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-[#fff4f0] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-sm">#{o.id.slice(-6)}</span>
                    <p className="text-[10px] text-[#805030]">{timeAgo(o.created_at)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4a2507]">{o.buyer_name || 'Guest'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${statusColors[o.status] || ''}`}>
                      {statusDisplay[o.status] || o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{o.items.filter(i => i.seller_id === user?.id).length} items</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#9e3c00]">{formatPrice(o.items.filter(i => i.seller_id === user?.id).reduce((s, i) => s + Number(i.price) * i.quantity, 0))}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {o.status === 'pending' && (
                        <>
                          <button onClick={() => handleShip(o.id)} className="text-[10px] font-bold text-white bg-[#004be3] px-3 py-1.5 rounded-full hover:bg-[#0041c8]">Ship</button>
                          <button onClick={() => handleCancel(o.id)} className="text-[10px] font-bold text-[#805030] border border-[#dca079]/30 px-3 py-1.5 rounded-full hover:bg-[#ffede4]">Cancel</button>
                        </>
                      )}
                      {o.status === 'shipped' && (
                        <button onClick={() => handleDeliver(o.id)} className="text-[10px] font-bold text-white bg-green-600 px-3 py-1.5 rounded-full hover:bg-green-700">Deliver</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#dca079]/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-[#dca079] mb-4">shopping_cart</span>
          <p className="text-[#805030] font-medium">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} orders yet.</p>
        </div>
      )}
    </SupplierLayout>
  )
}

export default SupplierOrders
