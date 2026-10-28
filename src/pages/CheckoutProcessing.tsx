import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import Footer from '../components/layout/Footer';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { getCheckoutState, computeTotals, DELIVERY_DETAILS } from '../services/checkout';
import { formatPrice } from '../utils/currency'

const CheckoutProcessing: React.FC = () => {
  const navigate = useNavigate()
  const { items: cartItems, clearCart } = useCart()
  const saved = getCheckoutState()
  const totals = computeTotals(cartItems)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(false)

  const methodLabel = saved.paymentMethod === 'card'
    ? 'Card'
    : saved.paymentMethod === 'paypal'
      ? 'PayPal'
      : 'Bank Transfer'

  const steps = [
    { label: 'Validating payment details', icon: 'lock' },
    { label: `Authorizing ${methodLabel}`, icon: 'verified_user' },
    { label: `Charging {formatPrice(totals.total)}`, icon: 'payments' },
    { label: 'Confirming your order', icon: 'fact_check' },
  ]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep(s => (s >= steps.length ? s : s + 1))
    }, 800)
    return () => window.clearInterval(timer)
  }, [steps.length])

  useEffect(() => {
    if (step < steps.length || placed) return
    setPlaced(true)
    api.createOrder()
      .then((order) => {
        clearCart()
        navigate('/checkout/success', { state: { orderId: order.id, items: order.items } })
      })
      .catch((err) => {
        setError(err?.message || 'Something went wrong while placing your order. Please try again.')
      })
  }, [step, steps.length, placed, navigate, clearCart])

  if (error) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col">
        <AppHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#b9002c]/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#b9002c]">error</span>
            </div>
            <h2 className="text-xl font-black">Order Couldn't Be Placed</h2>
            <p className="text-sm text-on-surface-variant">{error}</p>
            <button onClick={() => navigate('/cart')} className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white py-3 rounded-xl font-bold">
              Return to Cart
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const progress = Math.min(100, Math.round(((step + 1) / (steps.length + 1)) * 100))

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
        {/* Dynamic Background Element */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary-container rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-secondary-container rounded-full blur-[120px]"></div>
        </div>

        {/* Processing Card */}
        <div className="w-full max-w-sm md:max-w-2xl bg-surface-container-lowest rounded-xl p-6 md:p-12 relative z-10 flex flex-col items-center text-center">
          {/* Animated Visual */}
          <div className="relative w-28 h-28 md:w-40 md:h-40 mb-6 md:mb-10 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-dashed border-outline-variant/30 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-2 border-primary-container/40 rounded-full animate-spin-reverse"></div>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-surface-container rounded-full flex items-center justify-center shadow-sm relative">
              <span className="material-symbols-outlined text-3xl md:text-5xl text-primary animate-pulse">sync</span>
            </div>
            <div className="absolute top-0 right-0 p-1.5 md:p-2 bg-secondary text-on-secondary rounded-full flex items-center justify-center scale-90 shadow-lg">
              <span className="material-symbols-outlined text-[10px] md:text-sm">lock</span>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-black text-on-surface tracking-tighter leading-tight">Verifying Transaction</h2>
            <p className="text-on-surface-variant max-w-md mx-auto text-xs md:text-sm leading-relaxed">
              Charging <span className="font-bold text-on-surface">{formatPrice(totals.total)}</span> via <span className="font-bold text-on-surface">{methodLabel}</span>
              {' '}with {DELIVERY_DETAILS[saved.deliverySpeed].label.toLowerCase()} delivery.
            </p>
          </div>

          {/* Live Status Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 w-full mb-6 md:mb-10">
            {steps.map((s, i) => {
              const isDone = i < step
              const isCurrent = i === step
              const isPending = i > step
              return (
                <div key={i} className={`p-3 md:p-4 rounded-lg text-left flex items-start gap-3 transition-all ${isDone ? 'bg-secondary/10' : isCurrent ? 'bg-surface-container-low border border-secondary/30' : 'bg-surface-container-low opacity-60'}`}>
                  <span className={`material-symbols-outlined text-sm mt-0.5 ${isDone ? 'text-secondary' : isCurrent ? 'text-secondary animate-pulse' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: isDone || isCurrent ? "'FILL' 1" : 'none' }}>
                    {isDone ? 'check_circle' : s.icon}
                  </span>
                  <div className="flex-1">
                    <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-widest mb-0.5 ${isDone ? 'text-secondary' : isCurrent ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {isDone ? 'Complete' : isCurrent ? 'Processing' : 'Pending'}
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-on-surface">{s.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant/60 text-[10px] md:text-xs font-medium italic">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            Please do not refresh your browser or click the back button.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutProcessing;