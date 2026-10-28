import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { getCheckoutState, saveCheckoutState, computeTotals, detectCardBrand, isValidCardNumber, ensureSecureContext, DELIVERY_DETAILS, type PaymentMethod } from '../services/checkout'
import { formatPrice } from '../utils/currency'

const CheckoutPayment: React.FC = () => {
  const navigate = useNavigate()
  const { items: cartItems } = useCart()
  const saved = getCheckoutState()

  const [securing, setSecuring] = useState(false)

  useEffect(() => {
    if (!ensureSecureContext()) setSecuring(true)
  }, [])

  const isSecure = typeof window !== 'undefined' && window.isSecureContext

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(saved.paymentMethod)
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: saved.card?.name || '',
    expiry: saved.card?.expiry || '',
    cvv: ''
  })
  const [paypalEmail, setPaypalEmail] = useState(saved.paypal?.email || '')
  const [bankInfo, setBankInfo] = useState({
    holder: saved.bank?.holder || '',
    bank: saved.bank?.bank || '',
    account: '',
    swift: saved.bank?.swift || ''
  })
  const [connecting, setConnecting] = useState(false)
  const [connectMsg, setConnectMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const totals = computeTotals(cartItems)
  const brand = detectCardBrand(cardInfo.number)

  const selectMethod = (m: PaymentMethod) => {
    setPaymentMethod(m)
    setConnectMsg(null)
    saveCheckoutState({ paymentMethod: m })
  }

  const formatCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 19)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  const handleConnectPaypal = () => {
    const email = paypalEmail.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setConnectMsg({ ok: false, text: 'Enter a valid PayPal email address.' })
      return
    }
    setConnecting(true)
    setConnectMsg(null)
    window.setTimeout(() => {
      saveCheckoutState({ paymentMethod: 'paypal', paypal: { email } })
      setConnecting(false)
      setConnectMsg({ ok: true, text: `PayPal account connected: ${email}` })
    }, 800)
  }

  const handleConnectBank = () => {
    const holder = bankInfo.holder.trim()
    const bankName = bankInfo.bank.trim()
    const account = bankInfo.account.trim()
    const swift = bankInfo.swift.trim().toUpperCase()
    if (!holder || !bankName) {
      setConnectMsg({ ok: false, text: 'Account holder and bank name are required.' })
      return
    }
    if (!/^\d{8,24}$/.test(account)) {
      setConnectMsg({ ok: false, text: 'Enter a valid account number (8-24 digits).' })
      return
    }
    if (!/^[A-Z0-9]{8,11}$/.test(swift)) {
      setConnectMsg({ ok: false, text: 'Enter a valid SWIFT/BIC code (8-11 characters).' })
      return
    }
    setConnecting(true)
    setConnectMsg(null)
    window.setTimeout(() => {
      saveCheckoutState({
        paymentMethod: 'bank',
        bank: { holder, bank: bankName, accountMasked: `•••• ${account.slice(-4)}`, swift },
      })
      setConnecting(false)
      setConnectMsg({ ok: true, text: `Bank account connected: •••• ${account.slice(-4)}` })
    }, 800)
  }

  const handleContinue = () => {
    if (paymentMethod === 'card') {
      const name = cardInfo.name.trim()
      const number = cardInfo.number.replace(/\s+/g, '')
      const [mm, yy] = cardInfo.expiry.split('/')
      const cvv = cardInfo.cvv.trim()
      if (!name) return setConnectMsg({ ok: false, text: 'Enter the cardholder name.' })
      if (!isValidCardNumber(number)) return setConnectMsg({ ok: false, text: 'Card number failed validation. Please re-check your card details.' })
      if (!mm || !yy || mm.length !== 2 || yy.length !== 2 || parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) {
        return setConnectMsg({ ok: false, text: 'Enter a valid expiry date (MM/YY).' })
      }
      if (!/^\d{3,4}$/.test(cvv)) return setConnectMsg({ ok: false, text: 'Enter a valid CVV / CVC code.' })
      saveCheckoutState({
        paymentMethod: 'card',
        card: { last4: number.slice(-4), brand: detectCardBrand(number), name, expiry: cardInfo.expiry },
      })
    } else if (paymentMethod === 'paypal') {
      if (!saved.paypal && !paypalEmail.trim()) {
        return setConnectMsg({ ok: false, text: 'Connect your PayPal account to continue.' })
      }
      if (paypalEmail.trim() && !saved.paypal) {
        const email = paypalEmail.trim()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return setConnectMsg({ ok: false, text: 'Enter a valid PayPal email address.' })
        }
        saveCheckoutState({ paymentMethod: 'paypal', paypal: { email } })
      }
    } else if (paymentMethod === 'bank') {
      if (!saved.bank) {
        return setConnectMsg({ ok: false, text: 'Connect your bank account to continue.' })
      }
    }
    setConnectMsg(null)
    navigate('/checkout/review')
  }

  if (securing) {
    return (
      <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-body flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-[#ff7936]/10 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[#9e3c00]">lock</span>
            </div>
            <p className="font-bold text-[#4a2507]">Connecting securely…</p>
            <p className="text-xs text-[#805030]">Upgrading this checkout to an encrypted HTTPS connection.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
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
            <div className="text-[#805030] px-4 py-3 flex items-center gap-3 opacity-60">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-medium text-sm">Shipping</span>
            </div>
            <div className="bg-[#9e3c00] text-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-md">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
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
        <main className="flex-1 p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Payment */}
            <div className="lg:col-span-8 space-y-8">
              {/* Step indicator (mobile) */}
              <div className="flex lg:hidden items-center gap-3 text-sm font-medium">
                <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">&#10003;</span>
                <span className="text-[#805030]">Shipping</span>
                <span className="text-[#dca079]">|</span>
                <span className="bg-[#9e3c00] text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-[#9e3c00] font-bold">Payment</span>
                <span className="text-[#dca079]">|</span>
                <span className="text-[#805030]">Review</span>
              </div>

              <section>
                <header className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl font-black tracking-tight text-[#4a2507]">Secure Payment</h1>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isSecure ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-[#b9002c]/10 border border-[#b9002c]/30 text-[#b9002c]'}`}>
                      <span className="material-symbols-outlined text-xs">{isSecure ? 'lock' : 'warning'}</span>
                      {isSecure ? 'HTTPS Secure Connection' : 'Insecure Connection'}
                    </span>
                  </div>
                  <p className="text-[#805030] font-medium">Choose your preferred transaction method</p>
                </header>

                {connectMsg && (
                  <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${connectMsg.ok ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-[#b9002c]/10 border border-[#b9002c]/30 text-[#b9002c]'}`}>
                    {connectMsg.text}
                  </div>
                )}

                {/* Payment Method Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: 'card' as const, icon: 'credit_card', label: 'Card' },
                    { id: 'paypal' as const, icon: 'account_balance_wallet', label: 'PayPal' },
                    { id: 'bank' as const, icon: 'account_balance', label: 'Bank' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      className={`p-4 rounded-xl flex flex-col items-center gap-3 transition-all active:scale-95 group ${
                        paymentMethod === method.id
                          ? 'bg-white border-2 border-[#9e3c00]'
                          : 'bg-[#ffede4] border-2 border-transparent hover:bg-[#ffdcc7]'
                      }`}
                      onClick={() => selectMethod(method.id)}
                    >
                      <span className={`material-symbols-outlined text-3xl ${
                        paymentMethod === method.id ? 'text-[#9e3c00]' : 'text-[#805030] group-hover:text-[#9e3c00]'
                      }`} style={paymentMethod === method.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {method.icon}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        paymentMethod === method.id ? 'text-[#9e3c00]' : 'text-[#805030] group-hover:text-[#9e3c00]'
                      }`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Card Detail Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-[#ffede4] rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-[#4a2507]">Credit / Debit Card</h3>
                      <div className="flex gap-2 items-center">
                        {brand !== 'Card' && <span className="text-[10px] font-black text-[#9e3c00] uppercase tracking-widest">{brand}</span>}
                        <div className="w-8 h-5 bg-[#ffd4bb] rounded-sm opacity-50"></div>
                        <div className="w-8 h-5 bg-[#ffd4bb] rounded-sm opacity-50"></div>
                        <div className="w-8 h-5 bg-[#ffd4bb] rounded-sm opacity-50"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Cardholder Name</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                          placeholder="Johnathan Doe"
                          type="text"
                          autoComplete="cc-name"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Card Number</label>
                        <div className="relative">
                          <input
                            className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium tracking-widest"
                            placeholder="0000 0000 0000 0000"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={cardInfo.number}
                            onChange={(e) => setCardInfo({...cardInfo, number: formatCardNumber(e.target.value)})}
                          />
                          <span className="material-symbols-outlined absolute right-3 top-3 text-[#805030] opacity-40">lock</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Expiry Date</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                          placeholder="MM / YY"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({...cardInfo, expiry: formatExpiry(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">CVV / CVC</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                          placeholder="···"
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          autoComplete="cc-csc"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-[#805030] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified_user</span>
                      Card details are validated in real time and are never stored in plain text.
                    </p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="bg-[#ffede4] rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="material-symbols-outlined text-[#9e3c00] text-5xl">account_balance_wallet</span>
                      <div>
                        <h3 className="text-lg font-bold text-[#4a2507]">Connect PayPal</h3>
                        <p className="text-xs text-[#805030]">Link your PayPal account to complete this checkout securely.</p>
                      </div>
                    </div>
                    <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">PayPal Email</label>
                    <input
                      className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                    />
                    {saved.paypal && (
                      <div className="mt-3 flex items-center gap-2 text-green-700 text-xs font-semibold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Connected as {saved.paypal.email}
                      </div>
                    )}
                    <button
                      onClick={handleConnectPaypal}
                      disabled={connecting || (!!saved.paypal && saved.paypal.email === paypalEmail.trim())}
                      className="mt-4 w-full sm:w-auto bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {connecting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                      {saved.paypal && saved.paypal.email === paypalEmail.trim() ? 'Connected' : connecting ? 'Connecting...' : 'Connect PayPal'}
                    </button>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="bg-[#ffede4] rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="material-symbols-outlined text-[#9e3c00] text-5xl">account_balance</span>
                      <div>
                        <h3 className="text-lg font-bold text-[#4a2507]">Connect Bank Account</h3>
                        <p className="text-xs text-[#805030]">Enter your bank details for a direct transfer. Data is encrypted and masked.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Account Holder</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                          placeholder="Johnathan Doe"
                          type="text"
                          autoComplete="cc-name"
                          value={bankInfo.holder}
                          onChange={(e) => setBankInfo({...bankInfo, holder: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Bank Name</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium"
                          placeholder="e.g. Chase"
                          type="text"
                          autoComplete="off"
                          value={bankInfo.bank}
                          onChange={(e) => setBankInfo({...bankInfo, bank: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">SWIFT / BIC</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium uppercase"
                          placeholder="CHASUS33"
                          type="text"
                          value={bankInfo.swift}
                          onChange={(e) => setBankInfo({...bankInfo, swift: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#805030] uppercase tracking-wider mb-2">Account Number</label>
                        <input
                          className="w-full bg-white border-none focus:ring-2 focus:ring-[#ff7936] rounded-lg py-3 px-4 text-sm font-medium tracking-widest"
                          placeholder="8-24 digits"
                          type="password"
                          inputMode="numeric"
                          maxLength={24}
                          value={bankInfo.account}
                          onChange={(e) => setBankInfo({...bankInfo, account: e.target.value.replace(/\D/g, '')})}
                        />
                        {saved.bank && (
                          <p className="mt-2 text-xs font-semibold text-green-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            {saved.bank.bank} · {saved.bank.accountMasked}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleConnectBank}
                      disabled={connecting || (!!saved.bank && saved.bank.holder === bankInfo.holder.trim() && saved.bank.bank === bankInfo.bank.trim() && saved.bank.swift === bankInfo.swift.trim().toUpperCase())}
                      className="mt-4 w-full sm:w-auto bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {connecting && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                      {saved.bank && saved.bank.holder === bankInfo.holder.trim() ? 'Connected' : connecting ? 'Connecting...' : 'Connect Bank Account'}
                    </button>
                  </div>
                )}
              </section>

              {/* Billing Address */}
              <section className="bg-[#ffede4] rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <div className="w-6 h-6 rounded-md bg-[#9e3c00] flex items-center justify-center cursor-pointer">
                      <span className="material-symbols-outlined text-white text-sm">check</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#4a2507]">Billing Address</h3>
                    <p className="text-sm text-[#805030]">Billing address is the same as my shipping address:</p>
                    <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-[#004be3]/30">
                      <p className="text-xs font-semibold text-[#805030] leading-relaxed">
                        {saved.shipping.fullName || 'Shipping information'}<br />
                        {saved.shipping.address || '—'}<br />
                        {[saved.shipping.city, saved.shipping.zipCode].filter(Boolean).join(', ')}{saved.shipping.city || saved.shipping.zipCode ? ', ' : ''}{saved.shipping.country || ''}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={handleContinue} className="flex-1 bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#ff7936]/20">
                  Continue to Review
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/checkout/shipping')} className="sm:w-auto bg-transparent border-2 border-[#dca079]/30 text-[#805030] font-bold py-4 px-8 rounded-full hover:bg-[#ffdcc7] transition-all active:scale-95">
                  Back
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-[#ffede4] rounded-2xl p-6 overflow-hidden">
                  <h3 className="text-xl font-black text-[#4a2507] mb-6 tracking-tight">Order Summary</h3>
                  <div className="space-y-4 mb-8">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover" alt={item.name} src={item.image} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#4a2507] line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-[#805030]">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-[#9e3c00] mt-1">{formatPrice((item.price * item.quantity))}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#dca079]/15 pt-6 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-[#805030]">
                      <span>Subtotal</span>
                      <span>{formatPrice(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-[#805030]">
                      <span>Shipping ({DELIVERY_DETAILS[saved.deliverySpeed].label})</span>
                      <span className={totals.shipping === 0 ? 'text-[#004be3] font-bold uppercase tracking-wider text-[10px]' : 'font-semibold'}>
                        {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                      </span>
                    </div>
                    {saved.insurance && (
                      <div className="flex justify-between text-sm font-medium text-[#805030]">
                        <span>Package Protection</span>
                        <span className="font-semibold">{formatPrice(totals.insurance)}</span>
                      </div>
                    )}
                    {saved.promoTier && totals.discount > 0 && (
                      <div className="flex justify-between text-sm font-medium text-[#b9002c]">
                        <span>Promo ({saved.promoTier.code})</span>
                        <span className="font-semibold">-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-medium text-[#805030]">
                      <span>Estimated Tax</span>
                      <span>{formatPrice(totals.tax)}</span>
                    </div>
                    <div className="pt-4 flex justify-between items-end">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#805030]">Total Amount</span>
                        <span className="text-3xl font-black text-[#9e3c00]">{formatPrice(totals.total)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#004be3] mb-1">USD</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#ffd4bb] rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#9e3c00]">verified_user</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4a2507]">Secure Transaction</p>
                    <p className="text-[10px] text-[#805030]">256-bit SSL encrypted connection</p>
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

export default CheckoutPayment