import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const sellerId = searchParams.get('sellerId') || ''
  const sellerName = searchParams.get('sellerName') || 'Seller'
  const sellerRoleParam = searchParams.get('sellerRole') || 'Verified Seller'
  const productName = searchParams.get('product') || ''
  const productImage = searchParams.get('productImage') || ''
  const productId = searchParams.get('productId') || ''

  const sellerRoleLabel = sellerRoleParam.startsWith('Verified') ? sellerRoleParam : `Verified ${sellerRoleParam}`

  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!sellerId) {
    return (
      <div className="min-h-screen bg-[#fff4f0]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <span className="material-symbols-outlined text-6xl text-[#dca079]">error</span>
          <h2 className="text-2xl font-bold text-[#4a2507] mt-4">No seller specified</h2>
          <p className="text-[#805030] mt-2 mb-6 text-sm">There is no seller to contact for this product.</p>
          <Link to="/" className="bg-[#ff7936] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#9e3c00] transition-colors">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError(null)
    try {
      await api.sendMessage({
        sellerId,
        sellerName,
        product: productName,
        productImage,
        message: message.trim(),
      })
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507]">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 pb-24">
        <nav className="flex text-[11px] font-medium uppercase tracking-widest text-[#805030] mb-6 gap-2 items-center flex-wrap">
          <Link to="/" className="hover:text-[#ff7936] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          {productName && productId && (
            <>
              <Link to={`/product/${productId}`} className="hover:text-[#ff7936] transition-colors">{productName}</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </>
          )}
          <span className="text-[#4a2507] font-semibold">Contact</span>
        </nav>

        {sent ? (
          <div className="bg-white rounded-2xl border border-[#dca079]/10 p-10 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
            </div>
            <h2 className="text-2xl font-black text-[#4a2507] mb-2">Message Sent!</h2>
            <p className="text-sm text-[#805030] mb-2">
              Your message to <span className="font-bold text-[#4a2507]">{sellerName}</span> has been sent successfully.
            </p>
              <p className="text-xs text-[#805030] mb-8">They will receive a notification and can respond from their dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {productId && (
                <Link
                  to={`/product/${productId}`}
                  className="px-6 py-2.5 bg-[#ff7936] text-white font-bold text-sm rounded-xl hover:bg-[#9e3c00] transition-colors"
                >
                  Back to Product
                </Link>
              )}
              <Link
                to="/"
                className="px-6 py-2.5 bg-[#ffede4] text-[#4a2507] font-bold text-sm rounded-xl hover:bg-[#ffd4bb] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Seller + Product info */}
            <div className="bg-white rounded-2xl border border-[#dca079]/10 p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {sellerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4a2507]">{sellerName}</p>
                  <p className="text-[10px] text-[#805030] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px] text-[#004be3]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    {sellerRoleLabel}
                  </p>
                </div>
              </div>

              {productName && (
                <div className="flex items-center gap-4 bg-[#fff4f0] rounded-xl p-4">
                  {productImage && (
                    <img src={productImage} alt={productName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#805030] uppercase tracking-wider">Regarding Product</p>
                    <p className="text-sm font-bold text-[#4a2507] truncate">{productName}</p>
                    {productId && (
                      <Link to={`/product/${productId}`} className="text-[10px] text-[#ff7936] font-bold hover:underline">View product →</Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Message form */}
            <div className="bg-white rounded-2xl border border-[#dca079]/10 p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#4a2507] mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff7936] text-xl">chat</span>
                Send a Message
              </h2>
              <p className="text-xs text-[#805030] mb-5">Write your question, inquiry, or message to the seller below.</p>

              {user && (
                <div className="bg-[#ffede4] rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#805030] text-sm">person</span>
                  <div>
                    <p className="text-xs font-bold text-[#4a2507]">{user.name}</p>
                    <p className="text-[10px] text-[#805030]">{user.email}</p>
                  </div>
                  <span className="text-[10px] text-[#805030] ml-auto">Logged in as buyer</span>
                </div>
              )}

              {!user && (
                <div className="bg-[#fff4f0] border border-[#dca079]/20 rounded-xl px-4 py-3 mb-4 text-xs text-[#805030]">
                  <span className="font-bold text-[#4a2507]">Tip:</span> Log in before sending so the seller can reply to you.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Your Message *</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={6}
                    placeholder={
                      productName
                        ? `Hi, I'm interested in "${productName}". I'd like to know more about...`
                        : "Type your message here..."
                    }
                    className="w-full bg-[#fff4f0] border-none rounded-xl px-4 py-3 text-sm text-[#4a2507] focus:ring-2 focus:ring-[#ff7936] focus:border-transparent outline-none resize-none transition-shadow placeholder-[#805030]/50"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-[#ff7936]/20 hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ContactPage
