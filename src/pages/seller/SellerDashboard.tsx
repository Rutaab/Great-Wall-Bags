import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders, type LocalOrder } from '../../services/localOrders'
import { getProductsByUser } from '../../services/localProducts'
import SellerLayout from '../../components/seller/SellerLayout'
import { formatPrice } from '../../utils/currency'

function computePeriodOrders(orders: LocalOrder[], days: number): LocalOrder[] {
  const cutoff = Date.now() - days * 86400000
  return orders.filter(o => new Date(o.created_at).getTime() >= cutoff)
}

function weekRevenue(orders: LocalOrder[]): number[] {
  const weeks: number[] = []
  const now = Date.now()
  for (let w = 0; w < 7; w++) {
    const end = now - w * 7 * 86400000
    const start = end - 7 * 86400000
    const total = orders
      .filter(o => {
        const t = new Date(o.created_at).getTime()
        return t >= start && t < end
      })
      .reduce((s, o) => s + o.total, 0)
    weeks.unshift(total)
  }
  return weeks
}

const SellerDashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showReport, setShowReport] = useState(false)

  const allOrders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user])

  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const currentOrders = useMemo(() => computePeriodOrders(allOrders, 30), [allOrders])
  const previousOrders = useMemo(() => {
    const now = Date.now()
    const end = now - 30 * 86400000
    const start = end - 30 * 86400000
    return allOrders.filter(o => {
      const t = new Date(o.created_at).getTime()
      return t >= start && t < end
    })
  }, [allOrders])

  const currentRevenue = currentOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.total, 0)
  const previousRevenue = previousOrders
    .filter(o => o.status === 'delivered')
    .reduce((s, o) => s + o.total, 0)
  const revenueChange = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue * 100)
    : currentRevenue > 0 ? 100 : 0
  const revenueChangeStr = `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(0)}%`

  const activeListings = products.filter(p => p.status === 'published').length
  const totalOrders = currentOrders.length
  const completedOrders = currentOrders.filter(o => o.status === 'delivered').length
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  const weekData = useMemo(() => weekRevenue(currentOrders.filter(o => o.status === 'delivered')), [currentOrders])
  const maxWeek = Math.max(...weekData, 1)

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; sold: number; revenue: number; image: string }>()
    for (const order of allOrders.filter(o => o.status === 'delivered')) {
      for (const item of order.items) {
        if (item.seller_id !== user?.id) continue
        const existing = map.get(item.product_id) || { name: item.name, sold: 0, revenue: 0, image: item.image }
        existing.sold += item.quantity
        existing.revenue += (item.price || 0) * item.quantity
        map.set(item.product_id, existing)
      }
    }
    const sorted = Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
    const maxRev = Math.max(...sorted.map(p => p.revenue), 1)
    return sorted.slice(0, 4).map(p => ({
      ...p,
      growth: p.sold > 0 ? `+${Math.min(p.sold, 100)}%` : '+0%',
      bar: (p.revenue / maxRev) * 100,
    }))
  }, [allOrders, user])

  const recentOrders = useMemo(() => allOrders.slice(0, 5), [allOrders])

  const reportMetrics = useMemo(() => {
    const currentCompleted = currentOrders.filter(o => o.status === 'delivered')
    const totalSales = currentCompleted.reduce((s, o) => s + o.total, 0)
    const avgOrder = currentOrders.length > 0
      ? currentCompleted.reduce((s, o) => s + o.total, 0) / currentOrders.length
      : 0
    const conv = currentOrders.length > 0 ? (completedOrders / currentOrders.length) * 100 : 0
    return { totalSales, orders: currentOrders.length, conversion: conv, avgOrder }
  }, [currentOrders, completedOrders])

  return (
    <SellerLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Seller Overview</h1>
          <p className="text-[#805030] font-medium text-sm">
            Your store is performing{' '}
            <span className={`font-bold ${revenueChange >= 0 ? 'text-[#9e3c00]' : 'text-red-600'}`}>
              {revenueChangeStr} {revenueChange >= 0 ? 'better' : 'worse'}
            </span>{' '}
            than last 30 days.
          </p>
        </div>
        <button
          onClick={() => navigate('/seller/products')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#dca079]/10 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Total Revenue</span>
              <h3 className="text-3xl font-black mt-1 text-[#9e3c00]">
                ${currentRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${revenueChange >= 0 ? 'bg-[#ff7936]/10 text-[#9e3c00]' : 'bg-red-50 text-red-600'}`}>
              {revenueChangeStr}
            </span>
          </div>
          <div className="h-16 flex items-end gap-1">
            {weekData.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#ff7936]/30 to-[#9e3c00]/10 rounded-t"
                style={{ height: `${maxWeek > 0 ? (h / maxWeek) * 100 : 0}%` }}
              />
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-3xl mb-4 text-[#9e3c00]">inventory_2</span>
          <div>
            <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Active Listings</span>
            <h3 className="text-2xl font-bold mt-1 text-[#9e3c00]">{activeListings}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-3xl mb-4 text-[#805030]">trending_up</span>
          <div>
            <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Completion Rate</span>
            <h3 className="text-2xl font-bold mt-1 text-[#805030]">{completionRate.toFixed(1)}%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-[#dca079]/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-[#4a2507]">Top Performing Products</h2>
            <button onClick={() => setShowReport(true)} className="text-xs font-bold text-[#9e3c00] hover:underline">Full Report</button>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((p) => (
                <div key={p.name} className="flex items-center gap-4 p-3 bg-[#fff4f0] rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-[#4a2507]">{p.name}</span>
                      <span className="text-xs font-bold text-[#9e3c00]">{p.growth}</span>
                    </div>
                    <div className="flex gap-4 text-[10px] text-[#805030]">
                      <span>{p.sold} sold</span>
                      <span>{formatPrice(p.revenue)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#ffede4] rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] rounded-full" style={{ width: `${p.bar}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#805030] text-sm">No sales data yet.</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl border border-[#dca079]/10">
          <h2 className="text-xl font-black text-[#4a2507] mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: 'edit', label: 'Edit Storefront', path: '/seller/storefront' },
              { icon: 'inventory', label: 'Manage Inventory', path: '/seller/products' },
              { icon: 'campaign', label: 'Create Promotion', path: '/seller/storefront' },
              { icon: 'payments', label: 'View Payouts', path: '/seller/payouts' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full py-4 px-6 bg-[#fff4f0] text-left font-bold rounded-lg flex items-center justify-between hover:bg-[#ffede4] transition-colors group"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#9e3c00]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-sm">chevron_right</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white border border-[#dca079]/10 rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-[#4a2507]">Recent Orders</h2>
          <button onClick={() => navigate('/seller/orders')} className="text-[10px] font-black text-[#9e3c00] px-4 py-2 border-2 border-[#9e3c00] rounded-full hover:bg-[#9e3c00] hover:text-white transition-all">View All Orders</button>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4]">
                  <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Order</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Customer</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Product</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Amount</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffede4]">
                {recentOrders.map(o => (
                  <tr key={o.id} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="py-4 font-bold text-sm">#{o.id.slice(-6)}</td>
                    <td className="py-4 text-sm text-[#805030]">{o.buyer_name || 'Guest'}</td>
                    <td className="py-4 text-sm">{o.items.map(i => i.name).join(', ')}</td>
                    <td className="py-4 font-bold text-sm">{formatPrice(o.total)}</td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        o.status === 'delivered' ? 'text-green-700 bg-green-100' :
                        o.status === 'shipped' ? 'text-[#004be3] bg-[#004be3]/10' :
                        o.status === 'cancelled' ? 'text-red-600 bg-red-50' :
                        'text-[#805030] bg-[#ffede4]'
                      }`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[#805030] text-sm">No orders yet.</p>
        )}
      </section>

      <section className="bg-white border border-[#dca079]/10 rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#4a2507]">Featured Status</h2>
            <p className="text-xs text-[#805030] mt-0.5">Products approved for category page display</p>
          </div>
        </div>
        {products.length === 0 ? (
          <p className="text-[#805030] text-sm">No products yet. Add products to see their featured status here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4]">
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Product</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Route</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Rating</th>
                  <th className="pb-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
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
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        p.status === 'published' ? 'text-green-700 bg-green-100' : 'text-[#805030] bg-[#ffede4]'
                      }`}>{p.status}</span>
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
      </section>

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl hide-scrollbar">
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }`}</style>
            <div className="sticky top-0 bg-white border-b border-[#ffede4] px-8 py-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-black text-[#4a2507]">Performance Report</h2>
                <p className="text-xs text-[#805030] font-medium">Top Products Analysis &mdash; Last 30 Days</p>
              </div>
              <button onClick={() => setShowReport(false)} className="w-10 h-10 rounded-full bg-[#fff4f0] flex items-center justify-center hover:bg-[#ffede4] transition-colors">
                <span className="material-symbols-outlined text-[#4a2507]">close</span>
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Total Sales</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">${reportMetrics.totalSales.toFixed(1)}</p>
                  <span className="text-[10px] font-bold text-[#9e3c00]">{revenueChangeStr} vs last period</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Orders</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">{reportMetrics.orders}</p>
                  <span className="text-[10px] font-bold text-[#9e3c00]">{totalOrders > 0 ? `+${Math.round((completedOrders / totalOrders) * 100)}%` : '0%'} completion</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Completion</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">{reportMetrics.conversion.toFixed(1)}%</p>
                  <span className="text-[10px] font-bold text-[#004be3]">{reportMetrics.conversion >= 50 ? 'On target' : 'Needs improvement'}</span>
                </div>
                <div className="bg-[#fff4f0] p-5 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Avg. Order</span>
                  <p className="text-3xl font-black text-[#4a2507] mt-1">${reportMetrics.avgOrder.toFixed(0)}</p>
                  <span className="text-[10px] font-bold text-[#9e3c00">vs last period</span>
                </div>
              </div>
              {topProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-[#4a2507] mb-4">Product Breakdown</h3>
                  <div className="space-y-3">
                    {topProducts.map(p => (
                      <div key={p.name} className="flex items-center justify-between p-3 bg-[#fff4f0] rounded-xl">
                        <div>
                          <p className="font-bold text-sm text-[#4a2507]">{p.name}</p>
                          <p className="text-[10px] text-[#805030]">{p.sold} units sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-[#4a2507]">{formatPrice(p.revenue)}</p>
                          <p className="text-[10px] font-bold text-[#9e3c00]">{p.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  )
}

export default SellerDashboard
