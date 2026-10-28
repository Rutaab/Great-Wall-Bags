import React, { useMemo } from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders } from '../../services/localOrders'
import type { LocalOrder } from '../../services/localOrders'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface PayoutPeriod {
  period: string
  amount: string
  amountRaw: number
  status: 'Paid' | 'Scheduled'
  statusColor: string
  date: string
  payoutDate: Date
}

function sellerSubtotal(order: LocalOrder, sellerId: string): number {
  return order.items
    .filter(i => i.seller_id === sellerId)
    .reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0)
}

function groupOrdersIntoPeriods(orders: LocalOrder[], sellerId: string): PayoutPeriod[] {
  const map = new Map<string, { amount: number; orders: LocalOrder[] }>()

  for (const order of orders) {
    const subtotal = sellerSubtotal(order, sellerId)
    if (subtotal <= 0) continue

    const d = new Date(order.created_at)
    const year = d.getFullYear()
    const month = d.getMonth()
    const half = d.getDate() <= 15 ? 1 : 2
    const key = `${year}-${month}-${half}`

    if (!map.has(key)) map.set(key, { amount: 0, orders: [] })
    const entry = map.get(key)!
    entry.amount += subtotal
    entry.orders.push(order)
  }

  const now = Date.now()

  return Array.from(map.entries())
    .map(([key, { amount, orders }]) => {
      const [, monthIdxStr, halfStr] = key.split('-').map(Number)
      const monthIdx = monthIdxStr
      const year = Number(key.split('-')[0])
      const half = halfStr

      const monthFull = new Date(year, monthIdx, 1)
      const periodLabel =
        half === 1
          ? `${MONTHS[monthIdx]} 1-15, ${year}`
          : `${MONTHS[monthIdx]} 16-${new Date(year, monthIdx + 1, 0).getDate()}, ${year}`

      const payoutDate =
        half === 1
          ? new Date(year, monthIdx, 20, 12)
          : new Date(year, monthIdx + 1, 5, 12)

      const allDelivered = orders.length > 0 && orders.every(o => o.status === 'delivered')
      const status = allDelivered && payoutDate.getTime() <= now ? 'Paid' : 'Scheduled'

      return {
        period: periodLabel,
        amount: formatMoney(amount),
        amountRaw: amount,
        status,
        statusColor: status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-[#ff7936] bg-[#ff7936]/10',
        date: `${MONTHS[payoutDate.getMonth()]} ${payoutDate.getDate()}, ${payoutDate.getFullYear()}`,
        payoutDate,
      }
    })
    .sort((a, b) => b.payoutDate.getTime() - a.payoutDate.getTime())
}

const SellerPayouts: React.FC = () => {
  const { user } = useAuth()

  const { rows, totalEarned, thisMonth, pending, availableBalance } = useMemo(() => {
    const sellerId = user?.id || ''
    const orders = sellerId ? getSellerOrders(sellerId) : []
    if (orders.length === 0) {
      return { rows: [], totalEarned: 0, thisMonth: 0, pending: 0, availableBalance: 0 }
    }

    const delivered = orders.filter(o => o.status === 'delivered')
    const nonCancelled = orders.filter(o => o.status !== 'cancelled')

    const totalEarned = delivered.reduce((s, o) => s + sellerSubtotal(o, sellerId), 0)
    const pending = nonCancelled
      .filter(o => o.status !== 'delivered')
      .reduce((s, o) => s + sellerSubtotal(o, sellerId), 0)

    const now = new Date()
    const thisMonth = delivered
      .filter(o => {
        const d = new Date(o.created_at)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      })
      .reduce((s, o) => s + sellerSubtotal(o, sellerId), 0)

    const rows = groupOrdersIntoPeriods(nonCancelled, sellerId)

    return { rows, totalEarned, thisMonth, pending, availableBalance: thisMonth }
  }, [user])

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Payouts</h1>
          <p className="text-[#805030] font-medium text-sm">Track your earnings and payment history.</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#dca079]/10 flex items-center gap-6">
          <div>
            <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Available Balance</span>
            <p className="text-2xl font-black text-[#9e3c00]">{formatMoney(availableBalance)}</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm hover:shadow-md transition-all">
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Earned', value: formatMoney(totalEarned) },
          { label: 'This Month', value: formatMoney(thisMonth) },
          { label: 'Pending', value: formatMoney(pending) },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl border border-[#dca079]/10">
            <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">{s.label}</span>
            <h3 className="text-2xl font-black text-[#4a2507] mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
        <h2 className="text-xl font-black text-[#4a2507] mb-6">Payout History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffede4]">
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Period</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Amount</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffede4]">
              {rows.map(p => (
                <tr key={p.period} className="hover:bg-[#fff4f0] transition-colors">
                  <td className="py-4 font-bold text-sm">{p.period}</td>
                  <td className="py-4 font-bold text-sm">{p.amount}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.statusColor}`}>{p.status}</span>
                  </td>
                  <td className="py-4 text-sm text-[#805030]">{p.date}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-[#805030]">
                    No payout records yet. Earnings appear here once you receive orders.
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

export default SellerPayouts