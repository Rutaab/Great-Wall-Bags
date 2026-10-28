import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders, updateOrderStatus, ORDERS_CHANGED_EVENT, LocalOrder } from '../../services/localOrders'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'
import { formatPrice } from '../../utils/currency'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const toKey = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const statusMeta: Record<string, { label: string; pill: string; icon: string }> = {
  pending: { label: 'Pending', pill: 'bg-[#ff7936]/20 text-[#9e3c00]', icon: 'hourglass_empty' },
  shipped: { label: 'Shipped', pill: 'bg-[#004be3]/10 text-[#004be3]', icon: 'local_shipping' },
  delivered: { label: 'Delivered', pill: 'bg-green-100 text-green-700', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', pill: 'bg-[#fb5151]/20 text-[#570008]', icon: 'cancel' },
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

const WholesaleOrdersPage: React.FC = () => {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(k => k + 1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [viewDate, setViewDate] = useState<Date>(() => new Date())
  const [rangeStart, setRangeStart] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const orders = useMemo<LocalOrder[]>(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user, refreshKey])

  useEffect(() => {
    const handler = () => triggerRefresh()
    window.addEventListener(ORDERS_CHANGED_EVENT, handler)
    return () => window.removeEventListener(ORDERS_CHANGED_EVENT, handler)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const myItems = (o: LocalOrder): LocalOrder['items'] => {
    if (!user) return []
    return o.items.filter(item => item.seller_id === user.id)
  }

  const subtotal = (o: LocalOrder): number => {
    return myItems(o).reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
  }

  const volume = (o: LocalOrder): number => {
    return myItems(o).reduce((sum, i) => sum + i.quantity, 0)
  }

  const counts = {
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  const kpis = [
    { label: 'Total Orders', value: orders.length.toString(), icon: 'orders', bg: 'bg-[#ff7936]/10', color: 'text-[#ff7936]', change: `${counts.delivered} delivered` },
    { label: 'Pending', value: counts.pending.toString(), icon: 'hourglass_empty', bg: 'bg-[#805030]/10', color: 'text-[#805030]' },
    { label: 'Shipped', value: counts.shipped.toString(), icon: 'local_shipping', bg: 'bg-[#004be3]/10', color: 'text-[#004be3]' },
    { label: 'Cancelled', value: counts.cancelled.toString(), icon: 'cancel', bg: 'bg-[#fb5151]/10', color: 'text-[#570008]' },
  ]

  const statuses = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled']

  const startKey = rangeStart ? toKey(rangeStart) : ''
  const endKey = rangeEnd ? toKey(rangeEnd) : ''

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const statusOk = filter === 'All' || o.status === filter.toLowerCase()
      if (!statusOk) return false
      if (search) {
        const q = search.toLowerCase()
        const haystack = `${o.id} ${o.buyer_name || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (rangeStart && rangeEnd) {
        const k = toKey(new Date(o.created_at))
        if (k < startKey || k > endKey) return false
      }
      return true
    })
  }, [orders, filter, search, rangeStart, rangeEnd, startKey, endKey])

  const handleStatusChange = (orderId: string, status: LocalOrder['status']) => {
    updateOrderStatus(orderId, status)
    triggerRefresh()
  }

  const partners = useMemo(() => {
    const map = new Map<string, { name: string; orders: number; value: number }>()
    for (const o of orders) {
      const name = o.buyer_name || 'Guest'
      const cur = map.get(name) || { name, orders: 0, value: 0 }
      cur.orders += 1
      cur.value += subtotal(o)
      map.set(name, cur)
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value)
  }, [orders])

  const handleSelectDay = (d: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d)
      setRangeEnd(null)
    } else {
      if (d.getTime() < rangeStart.getTime()) {
        setRangeEnd(rangeStart)
        setRangeStart(d)
      } else {
        setRangeEnd(d)
      }
    }
  }

  const resetRange = () => {
    setRangeStart(null)
    setRangeEnd(null)
    setViewDate(new Date())
  }

  const rangeLabel = () => {
    if (!rangeStart || !rangeEnd) return 'Select date range'
    const s = rangeStart, e = rangeEnd
    if (s.getFullYear() === e.getFullYear()) {
      return `${MONTH_SHORT[s.getMonth()]} ${s.getDate()} - ${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
    }
    return `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} - ${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = new Date(year, month, 1).getDay()
  const cellDates: (Date | null)[] = []
  for (let i = 0; i < leadingBlanks; i++) cellDates.push(null)
  for (let d = 1; d <= daysInMonth; d++) cellDates.push(new Date(year, month, d))

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const dayClasses = (d: Date) => {
    const key = toKey(d)
    const isStart = rangeStart && toKey(rangeStart) === key
    const isEnd = rangeEnd && toKey(rangeEnd) === key
    const inRange = rangeStart && rangeEnd && key >= startKey && key <= endKey
    if (isStart || isEnd) return 'bg-[#ff7936] text-white font-bold'
    if (inRange) return 'bg-[#ff7936]/15 text-[#4a2507]'
    return 'hover:bg-[#ffede4] text-[#4a2507]'
  }

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">B2B Operations</span>
          </div>
          <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Wholesale Orders</h1>
          <p className="text-[#805030] text-sm mt-1">Manage customer orders for your products — updates in real time.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-[#4a2507] text-2xl font-bold">{stat.value}</p>
                {stat.change ? (
                  <p className="text-green-700 text-xs font-bold">{stat.change}</p>
                ) : (
                  <p className="text-[#805030] text-xs">{stat.label}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#dca079]/20 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full sm:w-auto">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search orders by ID or partner..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {statuses.map(pill => (
                <button key={pill} onClick={() => setFilter(pill)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === pill ? 'bg-[#ff7936] text-white' : 'border border-[#dca079]/40 text-[#805030] hover:bg-[#ffede4]'}`}>{pill}</button>
              ))}
            </div>
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`flex items-center gap-2 text-sm rounded-lg px-2.5 py-1.5 transition-colors ${showCalendar ? 'bg-[#ff7936] text-white' : 'text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507]'}`}
              >
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>{rangeLabel()}</span>
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
              </button>
              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#dca079]/20 p-4 z-50 w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ffede4] transition-colors text-[#805030]" aria-label="Previous month">
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <span className="text-sm font-bold text-[#4a2507]">{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#ffede4] transition-colors text-[#805030]" aria-label="Next month">
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {WEEKDAYS.map((w, i) => (
                      <span key={i} className="text-center text-[10px] font-bold text-[#805030]">{w}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cellDates.map((d, i) => {
                      if (!d) return <span key={i} />
                      return (
                        <button
                          key={i}
                          onClick={() => { handleSelectDay(d); if (rangeStart && rangeEnd) setShowCalendar(false) }}
                          className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-colors ${dayClasses(d)}`}
                        >
                          {d.getDate()}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#dca079]/10">
                    <button onClick={resetRange} className="text-xs font-semibold text-[#805030] hover:text-[#4a2507] transition-colors">Clear</button>
                    <button onClick={() => setShowCalendar(false)} className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-xs font-semibold hover:bg-[#9e3c00] transition-colors">Apply</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-[#dca079] mb-4">orders</span>
              <p className="text-[#805030] font-medium">No wholesale orders yet. Orders placed on your products will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#ffede4]">
                    {['Order ID', 'Partner', 'Items', 'Volume', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => {
                    const meta = statusMeta[o.status] || { label: o.status, pill: '', icon: 'help' }
                    return (
                      <tr key={o.id} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors group">
                        <td className="px-4 py-3 text-[#4a2507] font-medium font-mono text-xs">#{o.id.slice(-6)}</td>
                        <td className="px-4 py-3 text-[#4a2507]">{o.buyer_name || 'Guest'}</td>
                        <td className="px-4 py-3 text-[#805030]">{myItems(o).map(i => `${i.name} x${i.quantity}`).join(', ') || '—'}</td>
                        <td className="px-4 py-3 text-[#805030]">{volume(o)} units</td>
                        <td className="px-4 py-3 text-[#4a2507] font-medium">{formatPrice(subtotal(o))}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${meta.pill}`}>
                            <span className="material-symbols-outlined text-sm">{meta.icon}</span>
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#805030]">
                          <p>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-[10px]">{timeAgo(o.created_at)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {o.status === 'pending' && (
                              <>
                                <button onClick={() => handleStatusChange(o.id, 'shipped')} className="text-[10px] font-bold text-white bg-[#004be3] px-2.5 py-1 rounded-full hover:bg-[#0041c8]">Ship</button>
                                <button onClick={() => handleStatusChange(o.id, 'cancelled')} className="text-[10px] font-bold text-[#805030] border border-[#dca079]/30 px-2.5 py-1 rounded-full hover:bg-[#ffede4]">Cancel</button>
                              </>
                            )}
                            {o.status === 'shipped' && (
                              <button onClick={() => handleStatusChange(o.id, 'delivered')} className="text-[10px] font-bold text-white bg-green-600 px-2.5 py-1 rounded-full hover:bg-green-700">Deliver</button>
                            )}
                            {o.status === 'cancelled' && <span className="text-[10px] text-[#805030]">Closed</span>}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center text-[#805030] text-sm">No orders match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[#4a2507] text-lg font-semibold mb-4">Buyers</h2>
          {partners.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#dca079]/20 p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-[#dca079] mb-4">groups</span>
              <p className="text-[#805030] font-medium">Buyers who order your products will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-sm font-bold">
                      {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-[#4a2507] font-medium text-sm">{partner.name}</h3>
                      <p className="text-[#805030] text-xs">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-[#dca079]/10 pt-3">
                    <div>
                      <p className="text-[#805030] text-xs">Total Orders</p>
                      <p className="text-[#4a2507] font-semibold">{partner.orders}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#805030] text-xs">Lifetime Value</p>
                      <p className="text-[#4a2507] font-semibold">{formatPrice(partner.value)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ManufacturerLayout>
  )
}

export default WholesaleOrdersPage