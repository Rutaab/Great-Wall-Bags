import React, { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders } from '../../services/localOrders'
import { getProductsByUser } from '../../services/localProducts'
import SupplierLayout from '../../components/supplier/SupplierLayout'
import { formatPrice } from '../../utils/currency'

const SupplierAnalytics: React.FC = () => {
  const { user } = useAuth()

  const allOrders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user])

  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 86400000
  const recentOrders = useMemo(
    () => allOrders.filter(o => new Date(o.created_at).getTime() >= thirtyDaysAgo),
    [allOrders, thirtyDaysAgo]
  )

  const recentDelivered = useMemo(
    () => recentOrders.filter(o => o.status === 'delivered'),
    [recentOrders]
  )

  const totalSales30d = recentDelivered.reduce((s, o) => s + o.total, 0)
  const totalOrders30d = recentOrders.length
  const productsListed = products.filter(p => p.status === 'published').length
  const conversionRate = totalOrders30d > 0
    ? (recentDelivered.length / totalOrders30d) * 100
    : 0

  const dailySales = useMemo(() => {
    const days: { date: string; revenue: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now - i * 86400000)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart.getTime() + 86400000)
      const revenue = recentDelivered
        .filter(o => {
          const t = new Date(o.created_at).getTime()
          return t >= dayStart.getTime() && t < dayEnd.getTime()
        })
        .reduce((s, o) => s + o.total, 0)
      days.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
      })
    }
    return days
  }, [recentDelivered, now])

  const maxDaily = Math.max(...dailySales.map(d => d.revenue), 1)

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; sales: number; revenue: number }>()
    for (const order of allOrders.filter(o => o.status === 'delivered')) {
      for (const item of order.items) {
        if (item.seller_id !== user?.id) continue
        const existing = map.get(item.product_id) || { name: item.name, sales: 0, revenue: 0 }
        existing.sales += item.quantity
        existing.revenue += (item.price || 0) * item.quantity
        map.set(item.product_id, existing)
      }
    }
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
  }, [allOrders, user])

  return (
    <SupplierLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Analytics</h1>
        <p className="text-[#805030] text-sm">Performance insights for your boutique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sales (30d)', value: `$${totalSales30d.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${recentDelivered.length} orders`, color: 'text-[#9e3c00]' },
          { label: 'Total Orders', value: totalOrders30d.toString(), sub: 'Last 30 days', icon: 'shopping_cart', color: 'text-[#9e3c00]' },
          { label: 'Products Listed', value: productsListed.toString(), sub: `${products.length} total`, icon: 'inventory_2', color: 'text-[#004be3]' },
          { label: 'Completion Rate', value: `${conversionRate.toFixed(1)}%`, color: 'text-[#9e3c00]', change: conversionRate >= 50 ? 'Good' : 'Needs work' },
        ].map(m => (
          <div key={m.label} className="bg-white p-6 rounded-xl border border-[#dca079]/10 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] font-bold text-[#805030] uppercase tracking-wider">{m.label}</h3>
              {m.icon && <span className={`material-symbols-outlined text-lg ${m.color}`}>{m.icon}</span>}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-[#4a2507]">{m.value}</span>
              {m.change && <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded mb-1">{m.change}</span>}
            </div>
            {m.sub && <p className="text-[10px] text-[#805030] mt-1">{m.sub}</p>}
            {m.label === 'Total Sales (30d)' && (
              <div className="mt-4 h-12 flex items-end gap-1">
                {dailySales.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#ff7936]/20 rounded-t"
                    style={{ height: `${(d.revenue / maxDaily) * 100}%` }}
                    title={`${d.date}: {formatPrice(d.revenue)}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#dca079]/10">
          <h3 className="font-bold text-[#4a2507] mb-4">Sales Overview (Last 30 Days)</h3>
          {dailySales.some(d => d.revenue > 0) ? (
            <>
              <div className="h-48 flex items-end gap-1">
                {dailySales.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#4a2507] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                      {formatPrice(d.revenue)}
                    </div>
                    <div
                      className={`w-full rounded-t transition-all ${i === dailySales.length - 1 ? 'bg-[#ff7936]' : 'bg-[#ff7936]/30 hover:bg-[#ff7936]/60'}`}
                      style={{ height: `${(d.revenue / maxDaily) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-[#805030]">
                <span>{dailySales[0]?.date}</span>
                <span>{dailySales[14]?.date}</span>
                <span>{dailySales[29]?.date}</span>
              </div>
            </>
          ) : (
            <p className="text-[#805030] text-sm py-12 text-center">No sales data for this period.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10">
          <h3 className="font-bold text-[#4a2507] mb-4">Top Performing</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.slice(0, 3).map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffe3d3] flex items-center justify-center text-xs font-black text-[#805030]">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    <p className="text-[10px] text-[#805030]">{p.sales} sales</p>
                  </div>
                  <span className="text-[10px] font-bold text-green-700">+{p.sales > 0 ? Math.min(p.sales * 5, 99) : 0}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#805030] text-sm">No product sales yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ffe3d3]">
          <h3 className="font-bold text-sm text-[#4a2507]">Top Products by Revenue</h3>
        </div>
        {topProducts.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffe3d3] bg-[#fff4f0]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Sales</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffe3d3]">
              {topProducts.map(p => {
                const totalRev = topProducts.reduce((s, x) => s + x.revenue, 0)
                const share = totalRev > 0 ? (p.revenue / totalRev) * 100 : 0
                return (
                  <tr key={p.name} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{p.name}</td>
                    <td className="px-6 py-4 text-sm">{p.sales}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#9e3c00]">{formatPrice(p.revenue)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#ffede4] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-[#805030]">{share.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <p className="text-[#805030] text-sm">No product data yet.</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  )
}

export default SupplierAnalytics
