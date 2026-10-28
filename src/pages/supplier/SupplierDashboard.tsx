import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders } from '../../services/localOrders'
import { getProductsByUser } from '../../services/localProducts'
import SupplierLayout from '../../components/supplier/SupplierLayout'
import { formatPrice } from '../../utils/currency'

function fulfillmentTime(orders: { created_at: string; updated_at: string; status: string }[]): string {
  const delivered = orders.filter(o => o.status === 'delivered')
  if (delivered.length === 0) return '--'
  const totalHours = delivered.reduce((s, o) => {
    return s + (new Date(o.updated_at).getTime() - new Date(o.created_at).getTime())
  }, 0)
  const avgHours = totalHours / delivered.length / 3600000
  return avgHours < 24 ? `${avgHours.toFixed(1)}h` : `${(avgHours / 24).toFixed(1)}d`
}

const SupplierDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showSupplyReport, setShowSupplyReport] = useState(false)

  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const allOrders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user])

  const totalListings = products.filter(p => p.status === 'published').length
  const totalOrders = allOrders.length
  const completedOrders = allOrders.filter(o => o.status === 'delivered')
  const pendingOrders = allOrders.filter(o => o.status === 'pending')
  const shippedOrders = allOrders.filter(o => o.status === 'shipped')
  const cancelledOrders = allOrders.filter(o => o.status === 'cancelled')

  const activeBoutiques = new Set(allOrders.map(o => o.buyer_name || 'Guest')).size
  const completionRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0
  const avgFulfillment = fulfillmentTime(allOrders)

  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0)

  const recentOrders = useMemo(() => allOrders.slice(0, 4), [allOrders])

  const topBoutiques = useMemo(() => {
    const map = new Map<string, { revenue: number; products: Set<string>; count: number }>()
    for (const order of completedOrders) {
      const name = order.buyer_name || 'Guest'
      const existing = map.get(name) || { revenue: 0, products: new Set(), count: 0 }
      existing.revenue += order.total
      for (const item of order.items) {
        if (item.seller_id === user?.id) existing.products.add(item.product_id)
      }
      existing.count++
      map.set(name, existing)
    }
    const sorted = Array.from(map.entries())
      .map(([name, v]) => ({ name, revenue: v.revenue, products: v.products.size, count: v.count }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
    const maxRev = Math.max(...sorted.map(s => s.revenue), 1)
    return sorted.map(s => ({
      ...s,
      growth: s.count > 1 ? `+${Math.min(s.count * 10, 99)}%` : 'New',
      bar: (s.revenue / maxRev) * 100,
    }))
  }, [completedOrders, user])

  return (
    <SupplierLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Supply Overview</h1>
          <p className="text-[#805030] font-medium text-sm">
            Your supply chain is operating at{' '}
            <span className="text-[#004be3] font-bold">{completionRate.toFixed(0)}% efficiency</span> this period.
          </p>
        </div>
        <button
          onClick={() => navigate('/supplier/add-product')}
          className="px-6 py-2.5 bg-[#004be3] text-white font-bold rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: totalListings.toString(), change: `${products.length} total`, icon: 'inventory_2', color: '#004be3' },
          { label: 'Active Boutiques', value: activeBoutiques.toString(), change: `${totalOrders} orders`, icon: 'store', color: '#9e3c00' },
          { label: 'Completion Rate', value: `${completionRate.toFixed(0)}%`, change: `${completedOrders.length} delivered`, icon: 'warehouse', color: '#004be3' },
          { label: 'Avg. Fulfillment', value: avgFulfillment, change: `${pendingOrders.length} pending`, icon: 'timer', color: '#b9002c' },
        ].map(card => (
          <div key={card.label} className="bg-white p-5 rounded-xl border border-[#dca079]/10 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-2xl" style={{ color: card.color }}>{card.icon}</span>
              <span className="bg-[#ffede4] text-[#805030] px-2 py-0.5 rounded-full text-[10px] font-bold">{card.change}</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{card.value}</p>
            <p className="text-[10px] font-bold uppercase text-[#805030] tracking-widest mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#dca079]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#4a2507]">Order Fulfillment</h2>
            <button onClick={() => navigate('/supplier/orders')} className="text-[10px] font-bold text-[#004be3] hover:underline">View All Orders</button>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total', value: totalOrders, color: 'text-[#4a2507]' },
              { label: 'Pending', value: pendingOrders.length, color: 'text-[#ff7936]' },
              { label: 'Shipped', value: shippedOrders.length, color: 'text-[#004be3]' },
              { label: 'Delivered', value: completedOrders.length, color: 'text-green-700' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-[#fff4f0] rounded-xl">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-[#805030] font-bold uppercase">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="w-full h-3 bg-[#ffede4] rounded-full overflow-hidden flex">
            {totalOrders > 0 && (
              <>
                <div className="h-full bg-[#ff7936]" style={{ width: `${(pendingOrders.length / totalOrders) * 100}%` }} />
                <div className="h-full bg-[#004be3]" style={{ width: `${(shippedOrders.length / totalOrders) * 100}%` }} />
                <div className="h-full bg-green-500" style={{ width: `${(completedOrders.length / totalOrders) * 100}%` }} />
                <div className="h-full bg-red-400" style={{ width: `${(cancelledOrders.length / totalOrders) * 100}%` }} />
              </>
            )}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[#805030]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff7936]" />Pending</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#004be3]" />Shipped</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />Delivered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Cancelled</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10">
          <h2 className="text-lg font-black text-[#4a2507] mb-6">Supply Actions</h2>
          <div className="space-y-2">
            {[
              { icon: 'inventory', label: 'Stock Requests', path: '/supplier/inventory', desc: `${pendingOrders.length} pending approvals` },
              { icon: 'trending_up', label: 'Trend Pulse', path: '/supplier/trend-pulse', desc: 'Market insights' },
              { icon: 'shipment', label: 'Inbound Shipments', path: '/supplier/orders', desc: `${shippedOrders.length} in transit` },
              { icon: 'upload_file', label: 'Bulk Import', path: '/supplier/bulk-import', desc: 'CSV product upload' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 p-3 bg-[#fff4f0] rounded-lg hover:bg-[#ffede4] transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ffd4bb] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#9e3c00] text-base">{action.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#4a2507]">{action.label}</p>
                  <p className="text-[10px] text-[#805030]">{action.desc}</p>
                </div>
                <span className="material-symbols-outlined text-[#805030] text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#dca079]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#4a2507]">Recent Orders</h2>
            <button onClick={() => setShowSupplyReport(true)} className="text-[10px] font-bold text-[#004be3] hover:underline">View Report</button>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#ffede4]">
                    <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Order</th>
                    <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Customer</th>
                    <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Items</th>
                    <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                    <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ffede4]">
                  {recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-[#fff4f0] transition-colors">
                      <td className="py-3 font-bold text-sm">#{o.id.slice(-6)}</td>
                      <td className="py-3 text-sm text-[#805030]">{o.buyer_name || 'Guest'}</td>
                      <td className="py-3 text-sm font-medium">{o.items.filter(i => i.seller_id === user?.id).length}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          o.status === 'delivered' ? 'text-green-700 bg-green-100' :
                          o.status === 'shipped' ? 'text-[#004be3] bg-[#004be3]/10' :
                          o.status === 'cancelled' ? 'text-red-600 bg-red-50' :
                          'text-[#ff7936] bg-[#ff7936]/10'
                        }`}>
                          {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-bold text-[#9e3c00]">{formatPrice(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#805030] text-sm">No orders yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10">
          <h2 className="text-lg font-black text-[#4a2507] mb-4">Top Boutiques</h2>
          {topBoutiques.length > 0 ? (
            <div className="space-y-4">
              {topBoutiques.map((b, i) => (
                <div key={b.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ff7936] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-sm font-bold text-[#4a2507] truncate">{b.name}</span>
                      <span className="text-[10px] font-bold text-[#9e3c00]">{b.growth}</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[#805030]">
                      <span>${b.revenue.toFixed(0)}</span>
                      <span>{b.products} products</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#ffede4] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-[#004be3] to-[#4a8cff] rounded-full" style={{ width: `${b.bar}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#805030] text-sm">No boutique data yet.</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#fff4f0] to-[#ffede4] rounded-xl p-6 border border-[#dca079]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#004be3] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">insights</span>
            </div>
            <div>
              <h3 className="font-black text-[#4a2507]">Supply Chain Insight</h3>
              <p className="text-sm text-[#805030]">
                {totalOrders === 0
                  ? 'Start adding products and receiving orders to see insights here.'
                  : `${activeBoutiques} active boutiques · ${totalListings} products listed · $${totalRevenue.toFixed(0)} total revenue`}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/supplier/orders')} className="hidden md:flex items-center gap-1 px-4 py-2 bg-[#004be3] text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Review
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#dca079]/10 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-[#4a2507]">Featured Status</h2>
            <p className="text-xs text-[#805030] mt-0.5">Products approved for category page display</p>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="text-[#805030] text-sm">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4]">
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Product</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Route</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Rating</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Featured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffede4]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="py-3 font-bold text-sm text-[#4a2507]">{p.name}</td>
                    <td className="py-3 text-sm text-[#805030]">{p.route}</td>
                    <td className="py-3 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {p.rating} ({p.reviews})
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        p.featured === 'approved' ? 'bg-green-100 text-green-700' :
                        p.featured === 'rejected' ? 'bg-red-100 text-red-600' :
                        p.featured === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{p.featured}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showSupplyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl hide-scrollbar">
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }`}</style>
            <div className="sticky top-0 bg-white border-b border-[#ffede4] px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-black text-[#4a2507]">Fulfillment Report</h2>
                <p className="text-xs text-[#805030] font-medium">Order Analytics &mdash; All Time</p>
              </div>
              <button onClick={() => setShowSupplyReport(false)} className="w-10 h-10 rounded-full bg-[#fff4f0] flex items-center justify-center hover:bg-[#ffede4] transition-colors">
                <span className="material-symbols-outlined text-[#4a2507]">close</span>
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Total Shipped</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">{shippedOrders.length + completedOrders.length}</p>
                  <span className="text-[10px] font-bold text-[#004be3]">units this period</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Avg. Fulfillment</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">{avgFulfillment}</p>
                  <span className="text-[10px] font-bold text-[#004be3]">per order</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Completion Rate</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">{completionRate.toFixed(1)}%</p>
                  <span className="text-[10px] font-bold text-green-700">{completionRate >= 70 ? 'Exceeding target' : 'Needs improvement'}</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Revenue</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">${(totalRevenue / 1000).toFixed(1)}k</p>
                  <span className="text-[10px] font-bold text-[#9e3c00]">{totalOrders > 0 ? `+${Math.round((completedOrders.length / totalOrders) * 100)}%` : '0%'} completion</span>
                </div>
              </div>
              <div className="bg-[#004be3] text-[#f2f1ff] p-6 rounded-xl">
                <h4 className="font-black text-lg">Summary</h4>
                <p className="text-sm text-[#f2f1ff]/80 mt-1">
                  {totalListings > 0
                    ? `${totalListings} products listed across ${activeBoutiques} boutiques · ${totalOrders} total orders with ${completionRate.toFixed(0)}% fulfillment rate · $${totalRevenue.toFixed(0)} revenue generated.`
                    : 'Start listing products and fulfilling orders to generate insights.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  )
}

export default SupplierDashboard
