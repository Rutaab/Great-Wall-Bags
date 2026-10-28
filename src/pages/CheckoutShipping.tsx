import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { getCheckoutState, saveCheckoutState, computeTotals, applyPromoCode, removePromoCode, DELIVERY_DETAILS, type DeliverySpeed } from '../services/checkout'
import { formatPrice } from '../utils/currency'

const CheckoutShipping: React.FC = () => {
  const navigate = useNavigate()
  const { items: cartItems } = useCart()
  const saved = getCheckoutState()
  const [shippingInfo, setShippingInfo] = useState(saved.shipping)
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>(saved.deliverySpeed)
  const [insurance, setInsurance] = useState(saved.insurance)
  const [promoInput, setPromoInput] = useState(saved.promoCode)
  const [promoTier, setPromoTier] = useState(saved.promoTier)
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [formError, setFormError] = useState('')

  const totals = computeTotals(cartItems)

  const setSpeed = (speed: DeliverySpeed) => {
    setDeliverySpeed(speed)
    saveCheckoutState({ deliverySpeed: speed })
  }

  const toggleInsurance = () => {
    const next = !insurance
    setInsurance(next)
    saveCheckoutState({ insurance: next })
  }

  const handleApplyPromo = () => {
    const res = applyPromoCode(promoInput)
    if (res.ok && res.tier) {
      setPromoTier(res.tier)
      setPromoMsg({ ok: true, text: `Promo ${res.tier.code} applied.` })
    } else {
      setPromoTier(null)
      setPromoMsg({ ok: false, text: res.error || 'Invalid promo code.' })
    }
  }

  const handleRemovePromo = () => {
    removePromoCode()
    setPromoTier(null)
    setPromoInput('')
    setPromoMsg(null)
  }

  const handleContinue = () => {
    if (!shippingInfo.fullName.trim() || !shippingInfo.address.trim() || !shippingInfo.city.trim() || !shippingInfo.zipCode.trim() || !shippingInfo.country.trim()) {
      setFormError('Please complete all shipping fields before continuing.')
      return
    }
    saveCheckoutState({ shipping: shippingInfo, deliverySpeed, insurance })
    navigate('/checkout/payment')
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-body">
      <AppHeader />
      <div className="flex">
        {/* SideNavBar - Progress Tracker */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 w-64 bg-[#ffede4] shrink-0">
          <div className="mb-6 px-4">
            <h2 className="text-lg font-bold text-[#4a2507]">Checkout</h2>
            <p className="text-xs text-[#805030] uppercase tracking-widest font-bold">Great Wall Bags</p>
          </div>
          <nav className="flex flex-col gap-1">
            <div className="bg-[#9e3c00] text-white rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <span className="font-medium text-sm">Shipping</span>
            </div>
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-medium text-sm">Payment</span>
            </div>
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">fact_check</span>
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left: Forms */}
            <div className="xl:col-span-8 space-y-8">
              {/* Step indicator (mobile) */}
              <div className="flex lg:hidden items-center gap-3 text-sm font-medium">
                <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-[#9e3c00] font-bold">Shipping</span>
                <span className="text-[#dca079]">|</span>
                <span className="text-[#805030]">Payment</span>
                <span className="text-[#dca079]">|</span>
                <span className="text-[#805030]">Review</span>
              </div>

              {/* Shipping Address */}
              <section className="bg-[#ffede4] rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#9e3c00] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <h2 className="text-xl font-bold tracking-tight text-[#4a2507]">Shipping Logistics</h2>
                </div>
                {formError && (
                  <div className="mb-4 bg-[#b9002c]/10 border border-[#b9002c]/30 text-[#b9002c] px-4 py-3 rounded-lg text-sm font-semibold">{formError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#805030] uppercase mb-1">Full Name</label>
                    <input
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3] placeholder:text-[#805030]/50"
                      placeholder="e.g. Julianne Sterling"
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#805030] uppercase mb-1">Street Address</label>
                    <input
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3] placeholder:text-[#805030]/50"
                      placeholder="1242 Kinetic Avenue, Studio 4"
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#805030] uppercase mb-1">City</label>
                    <input
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3] placeholder:text-[#805030]/50"
                      placeholder="New York"
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#805030] uppercase mb-1">Postal Code</label>
                      <input
                        className="w-full bg-white border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3] placeholder:text-[#805030]/50"
                        placeholder="10001"
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#805030] uppercase mb-1">Country</label>
                      <select
                        className="w-full bg-white border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      >
                        <option value="">Select country</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Germany">Germany</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Speed */}
              <section className="bg-[#ffede4] rounded-xl p-6 md:p-8">
                <h3 className="text-sm font-bold text-[#805030] uppercase mb-6 tracking-widest">Delivery Speed</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(DELIVERY_DETAILS) as DeliverySpeed[]).map((id) => {
                    const option = DELIVERY_DETAILS[id]
                    const cost = id === 'standard' ? 0 : id === 'express' ? 14.99 : 29.99
                    return (
                      <label
                        key={id}
                        className={`relative flex flex-col p-4 bg-white rounded-lg cursor-pointer border-2 transition-all ${
                          deliverySpeed === id ? 'border-[#9e3c00]' : 'border-transparent hover:border-[#dca079]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          className="sr-only"
                          checked={deliverySpeed === id}
                          onChange={() => setSpeed(id)}
                        />
                        <div className={`absolute top-4 right-4 text-[#004be3] ${deliverySpeed === id ? 'block' : 'hidden'}`}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-bold text-[#9e3c00]">{option.label}</span>
                          {id === 'priority' && (
                            <span className="bg-[#b9002c] text-white text-[10px] px-2 py-0.5 rounded-full uppercase">Flash</span>
                          )}
                        </div>
                        <span className="text-xs text-[#805030] mb-4">{option.desc}</span>
                        <span className={`text-lg font-black mt-auto ${cost === 0 ? 'text-[#004be3]' : 'text-[#4a2507]'}`}>
                          {cost === 0 ? 'FREE' : formatPrice(cost)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>

              {/* Shipping Insurance */}
              <section className="bg-[#ffede4] rounded-xl p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg ${insurance ? 'bg-[#b9002c]/10' : 'bg-[#c6d0ff]'}`}>
                      <span className={`material-symbols-outlined ${insurance ? 'text-[#b9002c]' : 'text-[#004be3]'}`}>verified_user</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4a2507]">Package Protection</h3>
                      <p className="text-sm text-[#805030] max-w-md">Protect your curated collection from loss, theft, or damage during transit.</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-[#4a2507]">{insurance ? formatPrice(totals.insurance) : formatPrice(4.5)}</span>
                    <button
                      onClick={toggleInsurance}
                      className={`mt-2 text-xs font-bold uppercase tracking-tighter hover:underline ${insurance ? 'text-[#b9002c]' : 'text-[#004be3]'}`}
                    >
                      {insurance ? 'Remove Insurance' : 'Add Insurance'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                <button onClick={() => navigate('/cart')} className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#805030] font-semibold hover:text-[#9e3c00] transition-colors py-3">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Return to Cart
                </button>
                <button onClick={handleContinue} className="w-full sm:w-auto bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white px-8 md:px-10 py-4 rounded-xl font-bold shadow-lg shadow-[#ff7936]/20 active:scale-95 transition-all">
                  Proceed to Payment
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="xl:col-span-4 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold mb-6 flex justify-between items-center">
                  Order Summary
                  <span className="text-xs font-medium text-[#805030] bg-[#ffede4] px-2 py-1 rounded">{cartItems.length} Items</span>
                </h3>
                <div className="space-y-4 mb-8">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded bg-[#ffe3d3] overflow-hidden shrink-0">
                        <img loading="lazy" className="w-full h-full object-cover" alt={item.name} src={item.image} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-[#805030] uppercase">Qty: {item.quantity}</p>
                        <p className="text-sm font-black mt-1">{formatPrice((item.price * item.quantity))}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-[#dca079]/15 pt-6 text-sm">
                  <div className="flex justify-between text-[#805030]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#4a2507]">{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#805030]">
                    <span>Shipping ({DELIVERY_DETAILS[deliverySpeed].label})</span>
                    <span className={`font-bold ${totals.shipping === 0 ? 'text-[#004be3]' : 'text-[#4a2507]'}`}>
                      {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  {insurance && (
                    <div className="flex justify-between text-[#805030]">
                      <span>Package Protection</span>
                      <span className="font-bold text-[#4a2507]">{formatPrice(totals.insurance)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#805030]">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-[#4a2507]">{formatPrice(totals.tax)}</span>
                  </div>
                  {promoTier && totals.discount > 0 && (
                    <div className="flex justify-between text-[#b9002c]">
                      <span>Promo ({promoTier.code})</span>
                      <span className="font-bold">-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-[#dca079]/30">
                    <span>Total</span>
                    <span className="text-[#9e3c00]">{formatPrice(totals.total)}</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-[#ffede4] rounded-lg border border-dashed border-[#dca079]">
                  <div className="flex gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#004be3] text-sm">confirmation_number</span>
                    <span className="text-xs font-bold uppercase tracking-tight">Promo Code</span>
                  </div>
                  {promoTier ? (
                    <div className="flex items-center justify-between gap-2 bg-white rounded px-3 py-2">
                      <span className="text-xs font-bold text-[#004be3]">{promoTier.code} · {promoTier.label}</span>
                      <button onClick={handleRemovePromo} className="text-[10px] font-bold text-[#b9002c] uppercase hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        className="w-full bg-white border-none rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#004be3]"
                        placeholder="Enter code (e.g. KINETIC20)"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                      />
                      <button onClick={handleApplyPromo} className="bg-[#4a2507] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#9e3c00] transition-colors">Apply</button>
                    </div>
                  )}
                  {promoMsg && (
                    <p className={`mt-2 text-[11px] font-semibold ${promoMsg.ok ? 'text-green-700' : 'text-[#b9002c]'}`}>{promoMsg.text}</p>
                  )}
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

export default CheckoutShipping