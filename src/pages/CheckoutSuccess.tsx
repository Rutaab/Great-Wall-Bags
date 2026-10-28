import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getCheckoutState, formatAddress } from '../services/checkout';
import { formatPrice } from '../utils/currency'

interface OrderItem {
  product_id: string
  name: string
  image: string
  quantity: number
  price: number
}

interface StoredOrder {
  id: string
  buyer_email?: string
  total: number
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  insurance?: number
  payment_method?: string
  delivery_speed?: string
  shipping_address: string | null
  created_at: string
  items: OrderItem[]
}

function findOrder(orderId?: string): StoredOrder | null {
  try {
    const all: StoredOrder[] = JSON.parse(localStorage.getItem('hobags_local_orders') || '[]')
    if (orderId) return all.find(o => o.id === orderId) || null
    return all.length ? all[all.length - 1] : null
  } catch {
    return null
  }
}

const CheckoutSuccess: React.FC = () => {
  const { clearCart, items: cartItems } = useCart()
  const { user } = useAuth()
  const location = useLocation()
  const navState = location.state as { orderId?: string; items?: OrderItem[] } | null

  const [order] = useState<StoredOrder | null>(() => findOrder(navState?.orderId))
  const [orderDate] = useState(() => {
    const d = new Date(order?.created_at || Date.now())
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  })
  const [savedItems] = useState<OrderItem[]>(() => navState?.items || order?.items || cartItems)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  const savedCheckout = getCheckoutState()
  const deliverySpeed = (order?.delivery_speed as 'standard' | 'express' | 'priority') || savedCheckout.deliverySpeed || 'standard'
  const paymentMethod = order?.payment_method || savedCheckout.paymentMethod

  const subtotal = useMemo(() => savedItems.reduce((sum, it) => sum + it.price * it.quantity, 0), [savedItems])
  const shipping = order?.shipping ?? (deliverySpeed === 'express' ? 14.99 : deliverySpeed === 'priority' ? 29.99 : 0)
  const insurance = order?.insurance ?? 0
  const tax = order?.tax ?? subtotal * 0.085
  const discount = order?.discount ?? 0
  const total = order?.total ?? Math.max(0, subtotal + shipping + insurance + tax - discount)

  const estimatedDelivery = useMemo(() => {
    const start = new Date()
    const days = deliverySpeed === 'priority' ? 1 : deliverySpeed === 'express' ? 3 : 7
    start.setDate(start.getDate() + days)
    const end = new Date(start)
    end.setDate(end.getDate() + (deliverySpeed === 'priority' ? 1 : 2))
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(start)} - ${fmt(end)}`
  }, [deliverySpeed])

  const pointsEarned = Math.max(0, Math.floor(total))
  const pointsValue = (pointsEarned * 0.01).toFixed(2)
  const contactEmail = user?.email || order?.buyer_email || ''

  const paymentLabel = paymentMethod === 'card'
    ? 'Credit / Debit Card'
    : paymentMethod === 'paypal'
      ? savedCheckout.paypal?.email ? `PayPal (${savedCheckout.paypal.email})` : 'PayPal'
      : paymentMethod === 'bank' && savedCheckout.bank
        ? `Bank Transfer (${savedCheckout.bank.bank})`
        : 'Bank Transfer'

  const deliveryLabel = deliverySpeed === 'priority' ? 'Priority' : deliverySpeed === 'express' ? 'Express' : 'Standard'

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <AppHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8 lg:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary-container text-secondary mb-4 md:mb-6 shadow-xl shadow-secondary/10">
            <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-on-surface tracking-tighter mb-3 md:mb-4">Thank you for your order!</h1>
          <p className="text-on-surface-variant text-sm md:text-base max-w-lg mx-auto">
            Your curation of kinetic style is on its way. {contactEmail ? `A confirmation was sent to ${contactEmail}.` : 'Track it anytime from your Member Center.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="lg:col-span-2 bg-surface-container-low p-6 md:p-8 rounded-xl border-0">
            <div className="flex flex-col sm:flex-row justify-between gap-6 md:gap-8">
              <div>
                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Order Information</h3>
                <p className="text-xl md:text-2xl font-bold text-primary mb-1">#{order?.id || navState?.orderId || 'Pending'}</p>
                <p className="text-xs md:text-sm text-on-surface-variant">Placed on {orderDate}</p>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Payment: {paymentLabel}
                </p>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                  Delivery: {deliveryLabel}
                </p>
              </div>
              <div className="bg-surface-container-lowest p-3 md:p-4 rounded-lg flex items-center gap-3 md:gap-4 border border-outline-variant/15">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estimated Delivery</h4>
                  <p className="text-base md:text-lg font-bold text-on-surface">{estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-outline-variant/15">
              <h3 className="text-xs md:text-sm font-bold text-on-surface mb-3 md:mb-4">Order Summary</h3>
              <div className="space-y-3 md:space-y-4">
                {savedItems.length === 0 && (
                  <p className="text-xs md:text-sm text-on-surface-variant">No items found for this order.</p>
                )}
                {savedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-lowest rounded-lg flex-shrink-0 overflow-hidden">
                      <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs md:text-sm font-bold text-on-surface truncate">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-on-surface whitespace-nowrap">{formatPrice((item.price * item.quantity))}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 space-y-1 md:space-y-2 border-t border-outline-variant/10 text-xs md:text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping ({deliveryLabel})</span>
                  <span className={shipping === 0 ? "text-secondary font-bold" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                {insurance > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Package Protection</span>
                    <span>{formatPrice(insurance)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Promo Discount</span>
                    <span className="text-[#b9002c] font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base md:text-lg font-black text-on-surface pt-2">
                  <span>Total Paid</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {(order?.shipping_address || savedCheckout.shipping.address) && (
                <div className="mt-5 md:mt-6 pt-4 md:pt-5 border-t border-outline-variant/15">
                  <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Shipping Address</h4>
                  <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                    {order?.shipping_address || savedCheckout.shipping.fullName
                      ? `${savedCheckout.shipping.fullName ? `${savedCheckout.shipping.fullName}, ` : ''}${order?.shipping_address || formatAddress(savedCheckout.shipping)}`
                      : 'Shipping address on file'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-surface-container-lowest p-5 md:p-6 rounded-xl shadow-lg shadow-on-surface/5 flex flex-col items-center text-center">
              <h3 className="text-base md:text-lg font-bold text-on-surface mb-2">Want updates?</h3>
              <p className="text-[10px] md:text-xs text-on-surface-variant mb-4 md:mb-6">Follow your courier's journey in real-time through your Member Center.</p>
              <Link to="/order-history" className="w-full py-3 md:py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold active:scale-95 transition-transform shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-sm md:text-base">
                <span className="material-symbols-outlined">map</span>
                Track Order
              </Link>
            </div>

            <div className="bg-primary text-on-primary p-5 md:p-6 rounded-xl overflow-hidden relative group">
              <div className="relative z-10">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Exclusive Reward</span>
                <h3 className="text-lg md:text-xl font-black mt-3 md:mt-4 leading-tight">Join Kinetic Gold</h3>
                <p className="text-xs md:text-sm text-white/80 mt-2 mb-4 md:mb-6">Earn {pointsEarned.toLocaleString()} points for this purchase. That's ${pointsValue} toward your next curator find!</p>
                <button className="text-xs md:text-sm font-bold bg-white text-primary px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-surface-container-lowest transition-colors active:scale-95">Join Loyalty Program</button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-8xl md:text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              </div>
            </div>

            <div className="bg-surface-container p-5 md:p-6 rounded-xl">
              <h4 className="text-xs md:text-sm font-bold text-on-surface mb-2">The Weekly Kinetic</h4>
              <p className="text-[10px] md:text-xs text-on-surface-variant mb-3 md:mb-4">Get first access to limited edition bag drops and market trends.</p>
              <div className="relative">
                <input className="w-full bg-surface-container-lowest border-0 rounded-full py-2.5 md:py-3 px-4 text-xs md:text-sm focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/50" placeholder="email@example.com" type="email" />
                <button className="absolute right-1 top-1 bottom-1 px-3 md:px-4 bg-on-surface text-surface rounded-full text-[10px] md:text-xs font-bold transition-colors hover:bg-primary">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 md:mb-12 rounded-2xl overflow-hidden h-48 md:h-64 relative bg-surface-container">
          <div className="w-full h-full bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl md:text-6xl text-primary">photo_camera</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
            <h2 className="text-lg md:text-2xl font-black tracking-tight">Stay Kinetic.</h2>
            <p className="text-xs md:text-sm text-white/80">Share your new look with #KineticCurator for a chance to be featured.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutSuccess;