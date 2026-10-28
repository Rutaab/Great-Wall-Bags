import React, { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders } from '../../services/localOrders'
import SupplierLayout from '../../components/supplier/SupplierLayout'
import { formatPrice } from '../../utils/currency'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SupplierPayouts: React.FC = () => {
  const { user } = useAuth()

  const allOrders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user])

  const deliveredOrders = useMemo(() => allOrders.filter(o => o.status === 'delivered'), [allOrders])
  const pendingOrders = useMemo(() => allOrders.filter(o => o.status === 'pending' || o.status === 'shipped'), [allOrders])

  const availableBalance = deliveredOrders.reduce((s, o) => s + o.total, 0)
  const pendingAmount = pendingOrders.reduce((s, o) => s + o.total, 0)

  const now = new Date()
  const thisMonth = deliveredOrders.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const paidThisMonth = thisMonth.reduce((s, o) => s + o.total, 0)

  const lastPayout = deliveredOrders.length > 0 ? deliveredOrders[0].total : 0

  const transactions = useMemo(() => {
    const entries: { date: string; description: string; amount: number; status: string }[] = []
    for (const order of deliveredOrders) {
      entries.push({
        date: formatDate(order.created_at),
        description: `Order Payout #${order.id.slice(-6)}`,
        amount: order.total,
        status: 'Completed',
      })
    }
    for (const order of pendingOrders) {
      entries.push({
        date: formatDate(order.created_at),
        description: `Order Payout #${order.id.slice(-6)}`,
        amount: order.total,
        status: 'Pending',
      })
    }
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [deliveredOrders, pendingOrders])

  return (
    <SupplierLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Payouts & Earnings</h1>
          <p className="text-[#805030] text-sm">Track your earnings and payment history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 md:col-span-2">
          <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Gross Revenue</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-black text-[#9e3c00]">{formatPrice(availableBalance)}</h2>
            <span className="text-sm text-[#805030]">USD</span>
          </div>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-[10px] font-bold text-[#805030] uppercase">Pending</p>
              <p className="font-bold text-[#4a2507]">{formatPrice(pendingAmount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#805030] uppercase">Paid This Month</p>
              <p className="font-bold text-[#4a2507]">{formatPrice(paidThisMonth)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#805030] uppercase">Last Payout</p>
              <p className="font-bold text-[#4a2507]">{formatPrice(lastPayout)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#dca079]/10">
          <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Orders Summary</span>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#805030]">Completed</span>
              <span className="font-bold text-green-700">{deliveredOrders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#805030]">Pending</span>
              <span className="font-bold text-[#ff7936]">{pendingOrders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#805030]">Total Orders</span>
              <span className="font-bold text-[#4a2507]">{allOrders.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ffe3d3]">
          <h3 className="font-bold text-sm text-[#4a2507]">Transaction History</h3>
        </div>
        {transactions.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffe3d3] bg-[#fff4f0]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#805030] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffe3d3]">
              {transactions.map(t => (
                <tr key={t.description + t.date} className="hover:bg-[#fff4f0] transition-colors">
                  <td className="px-6 py-4 text-sm">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-[#805030]">{t.description}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${t.amount >= 0 ? 'text-green-700' : 'text-[#b9002c]'}`}>
                    +{formatPrice(t.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      t.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      t.status === 'Pending' ? 'bg-[#c6d0ff] text-[#003ab5]' :
                      'bg-[#ffede4] text-[#805030]'
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <p className="text-[#805030] text-sm">No transactions yet.</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  )
}

export default SupplierPayouts
