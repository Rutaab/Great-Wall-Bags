import React, { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders, type LocalOrder } from '../../services/localOrders'
import { getProductsByUser } from '../../services/localProducts'
import SellerLayout from '../../components/seller/SellerLayout'
import { formatPrice } from '../../utils/currency'

const periods = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'All Time']

function filterOrdersByPeriod(orders: LocalOrder[], period: string): LocalOrder[] {
  const now = Date.now()
  let cutoff: number
  switch (period) {
    case 'Last 7 Days':
      cutoff = now - 7 * 86400000
      break
    case 'Last 30 Days':
      cutoff = now - 30 * 86400000
      break
    case 'Last Quarter':
      cutoff = now - 90 * 86400000
      break
    default:
      cutoff = 0
  }
  return orders.filter(o => new Date(o.created_at).getTime() >= cutoff)
}

function weekLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `W${week}`
}

function groupRevenueByWeek(orders: LocalOrder[]): { label: string; revenue: number }[] {
  const map = new Map<string, number>()
  for (const o of orders) {
    const w = weekLabel(o.created_at)
    map.set(w, (map.get(w) || 0) + o.total)
  }
  return Array.from(map.entries()).map(([label, revenue]) => ({ label, revenue }))
}

const SellerAnalytics: React.FC = () => {
  const { user } = useAuth()
  const [period, setPeriod] = useState('Last 30 Days')

  const orders = useMemo(() => {
    if (!user) return []
    return filterOrdersByPeriod(getSellerOrders(user.id), period)
  }, [user, period])

  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const completedOrders = useMemo(() => orders.filter(o => o.status === 'delivered'), [orders])

  const totalRevenue = useMemo(
    () => completedOrders.reduce((sum, o) => sum + o.total, 0),
    [completedOrders]
  )

  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const productsListed = products.filter(p => p.status === 'published').length

  const weekData = useMemo(() => {
    const data = groupRevenueByWeek(completedOrders)
    const maxRev = Math.max(...data.map(d => d.revenue), 1)
    return data.map(d => ({ ...d, pct: (d.revenue / maxRev) * 100 }))
  }, [completedOrders])

  const topCategories = useMemo(() => {
    const catMap = new Map<string, { revenue: number; count: number }>()
    for (const order of completedOrders) {
      for (const item of order.items) {
        if (item.seller_id !== user?.id) continue
        const product = products.find(p => p.id === item.product_id)
        const cat = product?.category || 'Uncategorized'
        const existing = catMap.get(cat) || { revenue: 0, count: 0 }
        existing.revenue += (item.price || 0) * item.quantity
        existing.count += item.quantity
        catMap.set(cat, existing)
      }
    }
    const total = Array.from(catMap.values()).reduce((s, v) => s + v.revenue, 0) || 1
    return Array.from(catMap.entries())
      .map(([name, v]) => ({ name, revenue: v.revenue, pct: (v.revenue / total) * 100 }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [completedOrders, products, user])

  const customerInsights = useMemo(() => {
    const buyerMap = new Map<string, number>()
    for (const o of orders) {
      buyerMap.set(o.user_id, (buyerMap.get(o.user_id) || 0) + 1)
    }
    const buyerCount = buyerMap.size
    const repeatBuyers = Array.from(buyerMap.values()).filter(c => c > 1).length
    const repeatRate = buyerCount > 0 ? (repeatBuyers / buyerCount) * 100 : 0

    const completed = completedOrders
    const allItems = completed.flatMap(o => o.items.filter(i => i.seller_id === user?.id))
    const totalQty = allItems.reduce((s, i) => s + i.quantity, 0)
    const avgItems = completed.length > 0 ? totalQty / completed.length : 0

    // cart abandonment: orders that were cancelled / (cancelled + completed)
    const cancelled = orders.filter(o => o.status === 'cancelled').length
    const abandonment = (cancelled + completed.length) > 0
      ? (cancelled / (cancelled + completed.length)) * 100
      : 0

    return { avgOrderValue, repeatRate, avgItems, abandonment }
  }, [orders, completedOrders, user])

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Analytics</h1>
          <p className="text-[#805030] font-medium text-sm">Deep insights into your store performance.</p>
        </div>
        <div className="flex gap-2">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${period === p ? 'bg-[#9e3c00] text-white' : 'bg-white border border-[#dca079]/30 text-[#805030] hover:bg-[#fff4f0]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${totalOrders} orders` },
          { label: 'Total Orders', value: totalOrders.toString(), change: `${completedOrders.length} completed` },
          { label: 'Products Listed', value: productsListed.toString(), change: `${products.length} total` },
          { label: 'Avg Order Value', value: formatPrice(avgOrderValue), change: `${customerInsights.avgItems.toFixed(1)} items/order` },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-[#dca079]/10">
            <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">{s.label}</span>
            <h3 className="text-2xl font-black text-[#4a2507] mt-1">{s.value}</h3>
            <span className="text-[10px] font-bold text-[#9e3c00]">{s.change}</span>
          </div>
        ))}
      </div>

      {weekData.length > 0 ? (
        <div className="bg-white border border-[#dca079]/10 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-black text-[#4a2507] mb-8">Revenue Overview</h2>
          <div className="h-48 flex items-end gap-2">
            {weekData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#9e3c00] to-[#ff7936] rounded-t"
                  style={{ height: `${d.pct}%` }}
                  title={formatPrice(d.revenue)}
                />
                <span className="text-[8px] text-[#805030] font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#dca079]/10 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-xl font-black text-[#4a2507] mb-2">Revenue Overview</h2>
          <p className="text-[#805030] text-sm">No revenue data for this period yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
          <h2 className="text-lg font-black text-[#4a2507] mb-6">Top Categories</h2>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-[#4a2507]">{c.name}</span>
                    <span className="text-[#805030]">{formatPrice(c.revenue)}</span>
                  </div>
                  <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#805030] text-sm">No category data yet.</p>
          )}
        </div>
        <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
          <h2 className="text-lg font-black text-[#4a2507] mb-6">Customer Insights</h2>
          <div className="space-y-4">
            {[
              { label: 'Avg. Order Value', value: formatPrice(customerInsights.avgOrderValue), sub: `${customerInsights.avgItems.toFixed(1)} items per order` },
              { label: 'Repeat Purchase Rate', value: `${customerInsights.repeatRate.toFixed(1)}%`, sub: `${customerInsights.repeatRate >= 30 ? 'Good retention' : 'Room for improvement'}` },
              { label: 'Avg. Items Per Order', value: customerInsights.avgItems.toFixed(1), sub: `${totalOrders} total orders` },
              { label: 'Cancellation Rate', value: `${customerInsights.abandonment.toFixed(1)}%`, sub: `${customerInsights.abandonment <= 20 ? 'Healthy rate' : 'Review fulfillment process'}` },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between p-4 bg-[#fff4f0] rounded-xl">
                <div>
                  <p className="text-xs text-[#805030]">{c.label}</p>
                  <p className="font-bold text-[#4a2507] text-lg">{c.value}</p>
                </div>
                <span className="text-[10px] font-bold text-[#9e3c00]">{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerAnalytics
