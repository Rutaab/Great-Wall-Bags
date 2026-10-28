import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerLayout from '../../components/seller/SellerLayout'
import { api } from '../../services/api'

interface Message {
  id: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  product: string
  productImage: string
  message: string
  createdAt: string
}

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

const Customer360: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    api.getMessages()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-[#9e3c00] border-t-transparent rounded-full" />
        </div>
      </SellerLayout>
    )
  }

  const today = messages.filter(m => {
    const d = new Date(m.createdAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })
  const thisWeek = messages.filter(m => {
    const diff = Date.now() - new Date(m.createdAt).getTime()
    return diff < 7 * 86400000
  })
  const uniqueBuyers = new Set(messages.map(m => m.buyerId || m.buyerEmail || m.buyerName)).size

  return (
    <SellerLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Contacts</h1>
        <p className="text-[#805030] font-medium text-sm">Messages from buyers who contacted you about your products</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Messages', value: messages.length, icon: 'mail', color: 'bg-[#004be3]' },
          { label: 'Unique Buyers', value: uniqueBuyers, icon: 'people', color: 'bg-[#9e3c00]' },
          { label: 'This Week', value: thisWeek.length, icon: 'date_range', color: 'bg-[#4a2507]' },
          { label: 'Today', value: today.length, icon: 'today', color: 'bg-[#ff7936]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#dca079]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white text-base">{s.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{s.value}</p>
            <p className="text-xs text-[#805030] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#dca079]/10 p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-[#dca079] mb-4">chat_bubble_outline</span>
          <h3 className="text-lg font-bold text-[#4a2507] mb-2">No messages yet</h3>
          <p className="text-sm text-[#805030] max-w-md mx-auto">
            When buyers click "Contact" on one of your products, their messages will appear here.
            Make sure your products are listed and visible to attract buyer inquiries.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => {
            const isExpanded = expandedId === msg.id
            const initials = msg.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-xl border shadow-sm transition-all ${
                  isExpanded ? 'border-[#ff7936]/40 shadow-md' : 'border-[#dca079]/10 hover:border-[#dca079]/30'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#004be3] to-[#0066ff] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-[#4a2507] truncate">{msg.buyerName}</p>
                      <span className="text-[10px] text-[#805030] flex-shrink-0">{timeAgo(msg.createdAt)}</span>
                    </div>
                    {msg.product && (
                      <p className="text-[10px] text-[#805030] flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[10px]">inventory_2</span>
                        <span className="truncate">About: {msg.product}</span>
                      </p>
                    )}
                    <p className={`text-sm text-[#805030] mt-1.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {msg.message}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-[#805030] text-sm transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#ffede4]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {/* Buyer info */}
                      <div className="bg-[#fff4f0] rounded-xl p-4">
                        <h4 className="text-[10px] font-bold text-[#805030] uppercase tracking-widest mb-3">Buyer Info</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-[#805030] text-sm">person</span>
                            <span className="font-bold text-[#4a2507]">{msg.buyerName}</span>
                          </div>
                          {msg.buyerEmail && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="material-symbols-outlined text-[#805030] text-sm">email</span>
                              <span className="text-[#805030]">{msg.buyerEmail}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[#805030]">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Sent {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Product info */}
                      {msg.product && (
                        <div className="bg-[#fff4f0] rounded-xl p-4">
                          <h4 className="text-[10px] font-bold text-[#805030] uppercase tracking-widest mb-3">Product</h4>
                          <div className="flex items-center gap-3">
                            {msg.productImage && (
                              <img src={msg.productImage} alt="" className="w-12 h-12 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#4a2507] truncate">{msg.product}</p>
                              {msg.productImage && (
                                <span className="text-[10px] text-[#805030]">Click image to view product</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Full message */}
                    <div className="bg-[#fff4f0] rounded-xl p-4 mt-4">
                      <h4 className="text-[10px] font-bold text-[#805030] uppercase tracking-widest mb-2">Full Message</h4>
                      <p className="text-sm text-[#4a2507] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </SellerLayout>
  )
}

export default Customer360
