import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { api } from '../services/api'
import { formatPrice } from '../utils/currency'

interface OrderDisplay {
  id: string
  shortId: string
  status: string
  total: number
  createdAt: string
  items: Array<{ product_id: string; name: string; image: string; quantity: number; price: number }>
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  insurance?: number
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Processing', bg: 'bg-[#ff7936]/15', text: 'text-[#9e3c00]', icon: 'hourglass_top' },
  shipped: { label: 'Shipped', bg: 'bg-[#004be3]/15', text: 'text-[#004be3]', icon: 'local_shipping' },
  delivered: { label: 'Delivered', bg: 'bg-[#00a86b]/15', text: 'text-[#00a86b]', icon: 'check_circle' },
  cancelled: { label: 'Cancelled', bg: 'bg-[#b9002c]/15', text: 'text-[#b9002c]', icon: 'cancel' },
}

const MemberCenterPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [orders, setOrders] = useState<OrderDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(searchParams.get('order'))

  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) setExpandedId(orderParam)
  }, [searchParams])

  useEffect(() => {
    api.getOrders().then(async (data: Array<{ id: string; user_id: string; status: string; total: number; shipping_address: string | null; created_at: string; updated_at: string; subtotal?: number; shipping?: number; tax?: number; discount?: number; insurance?: number }>) => {
      const enriched = await Promise.all(
        data.map(async (o: any) => {
          let items: OrderDisplay['items'] = Array.isArray(o.items) ? o.items : []
          if (!items.length) {
            try {
              const detail = await api.getOrder(o.id)
              items = detail.items || []
            } catch {}
          }
          const itemsSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return {
            id: o.id,
            shortId: o.id.slice(-6),
            status: o.status,
            total: o.total,
            createdAt: o.created_at,
            items,
            subtotal: typeof (o as any).subtotal === 'number' ? (o as any).subtotal : itemsSubtotal,
            shipping: typeof (o as any).shipping === 'number' ? (o as any).shipping : 0,
            tax: typeof (o as any).tax === 'number' ? (o as any).tax : 0,
            discount: typeof (o as any).discount === 'number' ? (o as any).discount : 0,
            insurance: typeof (o as any).insurance === 'number' ? (o as any).insurance : 0,
          }
        })
      )
      enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setOrders(enriched)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#fff4f0]">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Order History</h1>
            <p className="text-[#805030] text-sm mt-1">{loading ? '' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}</p>
          </div>
          <button onClick={() => navigate('/account')} className="hidden md:flex items-center gap-2 text-sm font-bold text-[#805030] hover:text-[#4a2507] transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Account
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#9e3c00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 md:p-16 text-center border border-[#dca079]/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#ffede4] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#805030]">receipt_long</span>
            </div>
            <h2 className="text-xl font-black text-[#4a2507] mb-2">No orders yet</h2>
            <p className="text-sm text-[#805030] mb-6 max-w-sm mx-auto">Your order history is empty. Start shopping to see your orders here.</p>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full font-bold text-sm shadow-lg">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.pending
              const isExpanded = expandedId === order.id

              return (
                <div key={order.id} className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden transition-shadow hover:shadow-md">
                  {/* Order header - clickable summary */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left"
                  >
                    <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`material-symbols-outlined text-lg md:text-xl ${cfg.text}`}>{cfg.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm md:text-base font-bold text-[#4a2507]">Order #{order.shortId}</p>
                        <p className="text-[10px] md:text-xs text-[#805030]">{formatDate(order.createdAt)} &middot; {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-sm md:text-base font-black text-[#9e3c00]">{formatPrice(order.total)}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </div>
                      <span className={`material-symbols-outlined text-[#805030] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-[#dca079]/10">
                      {/* Items */}
                      {order.items.length > 0 ? (
                        <div className="p-4 md:p-6 space-y-3">
                          <p className="text-[10px] font-bold text-[#805030] uppercase tracking-wider">Items</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 md:gap-4 p-3 bg-[#fff4f0] rounded-lg">
                              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ffede4] rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img loading="lazy" className="w-full h-full object-cover" alt={item.name} src={item.image} />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#805030]">
                                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-bold text-[#4a2507] truncate">{item.name}</p>
                                <p className="text-[10px] text-[#805030]">Qty: {item.quantity} &middot; {formatPrice(item.price)} each</p>
                              </div>
                              <p className="text-xs font-black text-[#4a2507]">{formatPrice((item.price * item.quantity))}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 md:p-6 text-center">
                          <p className="text-xs text-[#805030]">Item details unavailable</p>
                        </div>
                      )}

                      {/* Order summary */}
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <div className="bg-[#fff4f0] rounded-xl p-4 space-y-1.5 text-sm">
                          <div className="flex justify-between text-[#805030]">
                            <span>Subtotal</span>
                            <span>{order.subtotal !== undefined ? formatPrice(order.subtotal) : formatPrice(order.total)}</span>
                          </div>
                          <div className="flex justify-between text-[#805030]">
                            <span>Shipping</span>
                            <span className={!order.shipping ? 'text-[#00a86b] font-bold' : 'font-semibold'}>
                              {order.shipping ? formatPrice(order.shipping) : 'FREE'}
                            </span>
                          </div>
                          {!!order.insurance && (
                            <div className="flex justify-between text-[#805030]">
                              <span>Package Protection</span>
                              <span>{formatPrice(order.insurance)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[#805030]">
                            <span>Estimated Tax</span>
                            <span>{formatPrice((order.tax || 0))}</span>
                          </div>
                          {!!order.discount && (
                            <div className="flex justify-between text-[#b9002c]">
                              <span>Promo Discount</span>
                              <span>-{formatPrice(order.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-black text-[#4a2507] pt-1.5 border-t border-[#dca079]/10">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order ID footer */}
                      <div className="px-4 md:px-6 pb-4 md:pb-6 flex items-center justify-between">
                        <p className="text-[10px] text-[#805030]/60">Order ID: {order.id}</p>
                        <button
                          onClick={() => navigator.clipboard?.writeText(order.id)}
                          className="text-[10px] font-bold text-[#004be3] hover:underline"
                        >
                          Copy ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MemberCenterPage
