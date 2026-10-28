import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { getCheckoutState, computeTotals, DELIVERY_DETAILS } from '../services/checkout'
import { formatPrice } from '../utils/currency'

const CheckoutReview: React.FC = () => {
  const navigate = useNavigate()
  const { items: cartItems } = useCart()
  const saved = getCheckoutState()
  const totals = computeTotals(cartItems)

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-body antialiased">
      <AppHeader />
      <div className="flex">
        {/* SideNavBar - Progress Tracker */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 w-64 bg-[#ffede4] shrink-0">
          <div className="mb-6 px-4">
            <h2 className="text-lg font-bold text-[#4a2507]">Checkout</h2>
            <p className="text-xs text-[#805030] uppercase tracking-widest font-bold">Great Wall Bags</p>
          </div>
          <nav className="flex flex-col gap-1">
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-medium text-sm">Shipping</span>
            </div>
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-medium text-sm">Payment</span>
            </div>
            <div className="bg-[#9e3c00] text-white rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
              <span className="font-medium text-sm">Review</span>
            </div>
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">sync</span>
              <span className="font-medium text-sm">Processing</span>
            </div>
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="font-medium text-sm">Success</span>
            </div>
          </nav>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {/* Step indicator (mobile) */}
            <div className="flex lg:hidden items-center gap-3 text-sm font-medium mb-8">
              <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">&#10003;</span>
              <span className="text-[#805030]">Shipping</span>
              <span className="text-[#dca079]">|</span>
              <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">&#10003;</span>
              <span className="text-[#805030]">Payment</span>
              <span className="text-[#dca079]">|</span>
              <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-[#9e3c00] font-bold">Review</span>
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-black text-[#4a2507] tracking-tighter mb-2">Order Review</h1>
              <p className="text-[#805030]">Verify your details before finalizing your curation.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              {/* Left: Summary Info */}
              <div className="xl:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shipping Address */}
                  <div className="bg-[#ffede4] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-[#9e3c00]">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="font-bold text-sm tracking-tight">SHIPPING ADDRESS</span>
                      </div>
                      <button onClick={() => navigate('/checkout/shipping')} className="text-[#004be3] text-xs font-semibold hover:underline">Edit</button>
                    </div>
                    <div className="text-[#4a2507] text-sm space-y-1">
                      <p className="font-bold">{saved.shipping.fullName || 'Shipping name not provided'}</p>
                      <p>{saved.shipping.address || '—'}</p>
                      {[saved.shipping.city, saved.shipping.zipCode].filter(Boolean).join(', ')}{saved.shipping.city || saved.shipping.zipCode ? ', ' : ''}{saved.shipping.country || ''}
                    </div>
                  </div>
                  {/* Payment Method */}
                  <div className="bg-[#ffede4] p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-[#9e3c00]">
                        <span className="material-symbols-outlined text-sm">credit_card</span>
                        <span className="font-bold text-sm tracking-tight">PAYMENT METHOD</span>
                      </div>
                      <button onClick={() => navigate('/checkout/payment')} className="text-[#004be3] text-xs font-semibold hover:underline">Edit</button>
                    </div>
                    {saved.paymentMethod === 'card' && saved.card && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#4a2507] rounded flex items-center justify-center">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-[#b31b25]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ff7936]"></div>
                          </div>
                        </div>
                        <div className="text-[#4a2507] text-sm">
                          <p className="font-bold">{saved.card.brand} •••• {saved.card.last4}</p>
                          <p className="text-[#805030]">Exp: {saved.card.expiry}</p>
                        </div>
                      </div>
                    )}
                    {saved.paymentMethod === 'paypal' && saved.paypal && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center">
                          <span className="text-white font-black text-xs">PP</span>
                        </div>
                        <div className="text-[#4a2507] text-sm">
                          <p className="font-bold">PayPal</p>
                          <p className="text-[#805030]">{saved.paypal.email}</p>
                        </div>
                      </div>
                    )}
                    {saved.paymentMethod === 'bank' && saved.bank && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#004be3] rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-sm">account_balance</span>
                        </div>
                        <div className="text-[#4a2507] text-sm">
                          <p className="font-bold">{saved.bank.bank}</p>
                          <p className="text-[#805030]">{saved.bank.accountMasked}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Shipping Method */}
                  <div className="md:col-span-2 bg-[#ffede4] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#c6d0ff] p-3 rounded-full">
                        <span className="material-symbols-outlined text-[#004be3]">rocket_launch</span>
                      </div>
                      <div>
                        <p className="text-[#9e3c00] font-bold text-sm tracking-tight">SHIPPING METHOD</p>
                        <p className="text-[#4a2507] font-semibold">{DELIVERY_DETAILS[saved.deliverySpeed].label} Delivery</p>
                        <p className="text-[#805030] text-xs">{DELIVERY_DETAILS[saved.deliverySpeed].desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#4a2507]">{totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</p>
                      <button onClick={() => navigate('/checkout/shipping')} className="text-[#004be3] text-xs font-semibold hover:underline">Change</button>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <h3 className="font-black text-xl text-[#4a2507] tracking-tight px-2">Cart Items ({cartItems.length})</h3>
                  {cartItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl flex gap-4 md:gap-6 items-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-[#ffe3d3] rounded-lg overflow-hidden flex-shrink-0">
                        <img loading="lazy" className="w-full h-full object-cover" alt={item.name} src={item.image} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-[#4a2507] truncate">{item.name}</h4>
                            <p className="text-xs text-[#805030]">Premium Quality</p>
                          </div>
                          <p className="font-bold text-[#9e3c00] whitespace-nowrap">{formatPrice((item.price * item.quantity))}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-xs bg-[#ffede4] px-2 py-1 rounded font-medium">Qty: {item.quantity}</span>
                          <span className="text-[10px] text-[#004be3] font-bold uppercase tracking-widest">Verified Seller</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Order Total & CTA */}
              <div className="sticky top-24">
                <div className="bg-[#ffd4bb] p-8 rounded-2xl shadow-xl">
                  <h3 className="text-2xl font-black text-[#4a2507] tracking-tighter mb-6">Order Total</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#805030]">Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#805030]">Shipping ({DELIVERY_DETAILS[saved.deliverySpeed].label})</span>
                      <span className="font-semibold">{totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}</span>
                    </div>
                    {saved.insurance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#805030]">Package Protection</span>
                        <span className="font-semibold">{formatPrice(totals.insurance)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#805030]">Estimated Tax (8.5%)</span>
                      <span className="font-semibold">{formatPrice(totals.tax)}</span>
                    </div>
                    {saved.promoTier && totals.discount > 0 && (
                      <div className="flex justify-between text-sm text-[#b9002c]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">sell</span>
                          Promo: {saved.promoTier.code}
                        </span>
                        <span className="font-semibold">-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-[#dca079]/30 flex justify-between items-end">
                      <span className="font-bold text-lg">Grand Total</span>
                      <span className="font-black text-3xl text-[#9e3c00] tracking-tighter leading-none">{formatPrice(totals.total)}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/checkout/processing')} className="w-full bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white py-4 rounded-xl font-bold text-lg active:scale-[0.98] transition-transform shadow-lg shadow-[#ff7936]/20 mb-4 flex items-center justify-center gap-2">
                    Place Order
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-[#805030] justify-center uppercase font-bold tracking-widest">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                      Secure Checkout Guaranteed
                    </div>
                    <p className="text-[10px] text-[#805030] leading-relaxed text-center italic">
                      By clicking "Place Order", you agree to Great Wall Bags' <a className="text-[#004be3] underline" href="/terms-of-use">Terms of Service</a> and <a className="text-[#004be3] underline" href="/privacy-policy">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#0041c8] text-3xl">policy</span>
                  <div>
                    <p className="text-xs font-bold text-[#4a2507]">30-Day Buyer Protection</p>
                    <p className="text-[10px] text-[#805030]">Full refund if items are not as described or lost in transit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default CheckoutReview