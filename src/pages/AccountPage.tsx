import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useVerification } from '../contexts/VerificationContext'
import type { UserRole } from '../contexts/AuthContext'
import { api } from '../services/api'
import { formatPrice } from '../utils/currency'

const messages = [
  { icon: 'support_agent', color: 'bg-[#004be3]', title: 'Support: Ticket #8821', body: 'Your refund request for the "Traveler Pack" has been approved...' },
  { icon: 'campaign', color: 'bg-[#9e3c00]', title: 'Seller: Urban Edge', body: 'Check out the new seasonal collection just launched!' },
]

const products = [
  { id: 'lux-1', name: 'Urban Nomad Leather Pack', price: 285, original: 340, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', badge: "CURATOR'S PICK" },
  { id: 'travel-3', name: 'Aero Travel Shell 40L', price: 159, image: 'https://images.unsplash.com/photo-1562583489-bf23ec64651d?w=400&h=400&fit=crop' },
  { id: 'bus-2', name: 'Executive Slim Briefcase', price: 112, original: 220, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', badge: 'FLASH SALE' },
  { id: 'bp-4', name: 'Heritage Canvas Daypack', price: 89, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop' },
  { id: 'acc-2', name: 'Pixel Guard Camera Bag', price: 210, image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop' },
]

const partnerTabLabel = (role: UserRole | undefined, hasApprovedRequest: boolean) => {
  if (hasApprovedRequest || role === 'supplier' || role === 'seller' || role === 'manufacturer') return 'My Partnership'
  return 'Become a Partner'
}

const roleLabels: Record<UserRole, string> = {
  buyer: 'Buyer',
  seller: 'Seller',
  manufacturer: 'Manufacturer',
  supplier: 'Supplier',
  developer: 'Developer',
}

const roleIcons: Record<UserRole, string> = {
  buyer: 'shopping_bag',
  seller: 'storefront',
  manufacturer: 'factory',
  supplier: 'inventory_2',
  developer: 'code',
}

/** Roles a user may apply for. `developer` is not requestable under any circumstances. */
const requestableRoles: UserRole[] = ['seller', 'manufacturer', 'supplier']

const AccountPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isVerified, submitRoleChangeRequest } = useVerification()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general')
  const [showRolePicker, setShowRolePicker] = useState(false)
  const [roleRequestMsg, setRoleRequestMsg] = useState('')
  const [roleRequesting, setRoleRequesting] = useState<UserRole | null>(null)
  const [orders, setOrders] = useState<Array<{ id: string; name: string; total: number; status: string; delivery: string; statusClass: string }>>([])
  // The account's real role is the only thing that decides what they can do. A
  // pending or approved request never confers access on its own.
  const userRole = user?.role
  const tabs = React.useMemo(() => {
    const items: Array<{ id: string; label: string; icon: string }> = [
      { id: 'general', label: 'General', icon: 'person' },
    ]
    if (user && user.role !== 'developer' && user.email !== 'dev@hobags.com') {
      items.push({ id: 'supplier', label: partnerTabLabel(user.role, isVerified()), icon: 'badge' })
    }
    return items
  }, [user, isVerified])

  useEffect(() => {
    api.getOrders().then((data: Array<{ id: string; user_id: string; status: string; total: number; shipping_address: string | null; created_at: string; updated_at: string }>) => {
      setOrders(data.map(o => {
        const d = new Date(o.created_at)
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return {
          id: o.id,
          name: `Order #${o.id.slice(-6)}`,
          total: o.total,
          status: o.status === 'pending' ? 'Processing' : o.status === 'shipped' ? 'Shipped' : 'Delivered',
          delivery: o.status === 'pending' ? `Placed ${dateStr}` : `${o.status === 'shipped' ? 'Shipped' : 'Delivered'} ${dateStr}`,
          statusClass: o.status === 'pending' ? 'bg-[#ff7936]/20 text-[#9e3c00]' : o.status === 'shipped' ? 'bg-[#004be3]/20 text-[#004be3]' : 'bg-[#c6d0ff]/20 text-[#004be3]',
        }
      }))
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24">
        {/* Profile Header & Wallet */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="lg:col-span-2 bg-[#ffede4] rounded-xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start relative overflow-hidden">
            <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
              <img loading="lazy" alt="User profile" className="w-full h-full object-cover" src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face'}/>
            </div>
            <div className="relative z-10 flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${user?.role === 'developer' ? 'bg-[#4a2507] text-[#ff7936]' : 'bg-[#c6d0ff] text-[#003ab5]'}`}>{roleLabels[user?.role || 'buyer']}</span>
                {user?.role !== 'developer' && (
                  <button onClick={() => setShowRolePicker(!showRolePicker)} className="text-[#004be3] text-[10px] font-bold hover:underline">Request a different role</button>
                )}
              </div>
              {showRolePicker && (
                <div className="mb-4 bg-white rounded-xl p-4 shadow-xl border border-[#dca079]/20 max-w-xs text-left">
                  <p className="text-xs font-bold text-[#4a2507] mb-1">Request a role change</p>
                  <p className="text-[11px] text-[#805030] mb-3">
                    This sends a request to our team. Your role only changes after a developer approves
                    it and enables the new role for your account.
                  </p>
                  <div className="space-y-1">
                    {requestableRoles.filter(r => r !== user?.role).map(role => (
                      <button
                        key={role}
                        disabled={roleRequesting !== null}
                        onClick={async () => {
                          setRoleRequestMsg('')
                          setRoleRequesting(role)
                          try {
                            const ok = await submitRoleChangeRequest(role as Exclude<UserRole, 'buyer' | 'developer'>)
                            setRoleRequestMsg(ok
                              ? `Request sent. We'll notify you when your ${roleLabels[role]} access is enabled.`
                              : 'Could not send the request. Please try again.')
                            if (ok) setShowRolePicker(false)
                          } finally {
                            setRoleRequesting(null)
                          }
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-base text-[#805030]">{roleIcons[role]}</span>
                        <span className="font-medium">
                          {roleRequesting === role ? 'Sending...' : roleLabels[role]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {roleRequestMsg && (
                <p className="mb-3 text-xs font-bold text-[#004be3] max-w-xs">{roleRequestMsg}</p>
              )}
              <h1 className="text-2xl md:text-4xl font-black text-[#4a2507] tracking-tighter mb-2">{user?.name || 'Julian Vane'}</h1>
              <p className="text-[#805030] text-xs md:text-sm max-w-md">Member since October 2021. You've curated 142 items this year with a 98% satisfaction rate.</p>
              <div className="mt-4 md:mt-6 flex flex-wrap justify-center sm:justify-start gap-3">
                <button onClick={() => navigate('/settings')} className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white px-5 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm shadow-md active:scale-95 transition-transform hover:shadow-lg hover:shadow-[#ff7936]/30">Edit Profile</button>
                <button onClick={() => navigate('/order-history')} className="bg-white text-[#9e3c00] border border-[#dca079]/30 px-5 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-[#ffede4] transition-colors">Order History</button>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#ff7936]/10 rounded-full blur-3xl"></div>
          </div>
          <div className="bg-[#4a2507] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">Digital Wallet</span>
                <span className="material-symbols-outlined opacity-60">account_balance_wallet</span>
              </div>
              <p className="text-xs md:text-sm opacity-80 mb-1">Total Balance</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">$4,280.50</h2>
            </div>
            <div className="mt-6 md:mt-8 space-y-3">
              <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                <span className="opacity-60">Kinetic Points</span>
                <span className="font-bold">12,450 pts</span>
              </div>
              <button onClick={() => navigate('/checkout/payment')} className="w-full bg-white text-[#4a2507] py-2.5 md:py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#ffede4] transition-colors">Top Up Balance</button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#ffede4] rounded-xl p-1 mb-6 md:mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#9e3c00] shadow-sm'
                  : 'text-[#805030] hover:text-[#4a2507]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6 md:space-y-8">
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-5 md:p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-[#4a2507]">My Orders</h3>
                  <Link to="/order-history" className="text-[#004be3] text-xs font-bold hover:underline">View All</Link>
                </div>
                <div className="space-y-3 md:space-y-4 flex-1">
                  {orders.length === 0 ? (
                    <div className="p-6 text-center">
                      <span className="material-symbols-outlined text-3xl text-[#805030] mb-2">receipt_long</span>
                      <p className="text-xs font-bold text-[#805030]">No orders yet</p>
                      <p className="text-[10px] text-[#805030]/60 mt-1">Your order history will appear here</p>
                    </div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-3 md:gap-4 p-3 bg-[#fff4f0] rounded-lg cursor-pointer hover:bg-[#ffede4] transition-colors" onClick={() => navigate(`/order-history?order=${order.id}`)}>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#ff7936] to-[#9e3c00] rounded-lg flex items-center justify-center flex-shrink-0 text-white">
                        <span className="material-symbols-outlined text-sm md:text-base">receipt</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-bold text-[#4a2507] truncate">{order.name}</p>
                        <p className="text-[10px] text-[#805030]">{order.delivery}</p>
                      </div>
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="text-[10px] font-black text-[#4a2507]">{formatPrice(order.total)}</p>
                        <span className={`text-[10px] md:text-xs px-2 py-1 font-bold rounded whitespace-nowrap ${order.statusClass}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => navigate('/order-history')} className="w-full py-2.5 text-xs font-bold text-[#805030] hover:text-[#9e3c00] transition-colors border border-dashed border-[#dca079]/30 rounded-lg hover:border-[#9e3c00]/30">View All Orders</button>
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-5 md:p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-[#4a2507]">Message Center</h3>
                  <span className="bg-[#b9002c] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className="flex gap-3 md:gap-4 border-b border-[#ffede4] pb-3 md:pb-4 last:border-b-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${msg.color} flex items-center justify-center text-white flex-shrink-0`}>
                        <span className="material-symbols-outlined text-xs md:text-sm">{msg.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-bold text-[#4a2507]">{msg.title}</p>
                        <p className="text-[10px] md:text-xs text-[#805030] line-clamp-1">{msg.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 md:col-span-2 bg-[#ffede4] rounded-xl p-5 md:p-6 border border-[#dca079]/10">
                <h3 className="text-base md:text-lg font-bold tracking-tight text-[#4a2507] mb-4">Plans</h3>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#9e3c00] mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-xs md:text-sm text-[#4a2507]">Kinetic Prime</p>
                    <span className="text-[10px] text-[#9e3c00] font-black uppercase">Active</span>
                  </div>
                  <p className="text-[10px] text-[#805030] mb-4">Next billing: Nov 12, 2024</p>
                  <div className="w-full bg-[#ffede4] rounded-full h-1.5 mb-2">
                    <div className="bg-gradient-to-r from-[#ff7936] to-[#9e3c00] h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-[10px] text-right font-medium text-[#805030]">18/30 Days Remaining</p>
                </div>
                <button onClick={() => navigate('/subscription/plans')} className="w-full py-2 text-xs font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Manage Subscriptions</button>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] rounded-xl p-5 md:p-6 text-white relative overflow-hidden flex flex-col justify-between cursor-pointer group" onClick={() => navigate('/flash-deals')}>
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-black italic tracking-tighter mb-2">MY COUPONS</h3>
                  <p className="text-xs opacity-90 max-w-xs">You have 4 unclaimed rewards waiting for your next purchase.</p>
                </div>
                <div className="relative z-10 flex gap-3 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-lg flex-1 group-hover:bg-white/20 transition-colors">
                    <p className="text-[10px] uppercase font-bold opacity-70">Save</p>
                    <p className="text-xl md:text-2xl font-black">$25</p>
                    <p className="text-[8px] opacity-60">Orders over $200</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-lg flex-1 group-hover:bg-white/20 transition-colors">
                    <p className="text-[10px] uppercase font-bold opacity-70">Shipping</p>
                    <p className="text-xl md:text-2xl font-black">FREE</p>
                    <p className="text-[8px] opacity-60">Global priority</p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <span className="material-symbols-outlined text-7xl md:text-9xl">confirmation_number</span>
                </div>
              </div>
            </section>
            <section className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tighter text-[#4a2507] uppercase">Recommended For You</h2>
                  <p className="text-[#805030] text-xs md:text-sm">Based on your recent views in <span className="font-bold text-[#9e3c00]">Luxury Backpacks</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <div className="aspect-square bg-[#ffede4] rounded-lg overflow-hidden mb-2 md:mb-3 relative">
                      <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }}/>
                      {(product as any).badge && (product as any).badge !== 'FLASH SALE' && (
                        <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-[#004be3] text-white text-[8px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm">{(product as any).badge}</div>
                      )}
                      {(product as any).badge === 'FLASH SALE' && (
                        <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-[#b9002c] text-white text-[8px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm">FLASH SALE</div>
                      )}
                    </div>
                    <h4 className="text-xs md:text-sm font-semibold text-[#4a2507] line-clamp-1">{product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[#9e3c00] font-black text-sm md:text-base">{formatPrice(product.price)}</p>
                      {(product as any).original && (
                        <p className="text-[9px] md:text-[10px] text-[#805030] line-through opacity-60">{formatPrice((product as any).original)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Supplier & Manufacturer Tab */}
        {activeTab === 'supplier' && (
          <div className="space-y-6">
            {(user?.role === 'buyer' || user?.role === undefined) && user?.email !== 'dev@hobags.com' && !isVerified() ? (
              <section>
                <h2 className="text-2xl font-black text-[#4a2507] mb-2">Partner Tiers</h2>
                <p className="text-[#805030] mb-10 max-w-2xl">Choose the role that fits your business. Each tier unlocks tools designed to scale your operations on the Kinetic Curator marketplace.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Supplier */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center mb-4 shadow-sm">
                      <span className="material-symbols-outlined text-white text-xl">inventory_2</span>
                    </div>
                    <h3 className="text-lg font-black text-[#4a2507] mb-1">Supplier</h3>
                    <p className="text-xs text-[#805030] mb-5">List products &amp; reach millions of buyers worldwide.</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {[
                        'List unlimited products',
                        'Reach millions of buyers',
                        'Analytics &amp; sales dashboard',
                        'Secure payment processing',
                        'Warehouse capacity management',
                        'Supply chain tracking',
                        'Bulk order processing',
                        'Real-time inventory sync',
                        'Dedicated supplier support',
                        'Global shipping integration',
                      ].map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#805030]">
                          <span className="material-symbols-outlined text-sm text-[#ff7936] flex-shrink-0 mt-0.5">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/supplier/onboarding')} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all active:scale-95">Register as Supplier</button>
                  </div>

                  {/* Seller (MOST POPULAR) */}
                  <div className="bg-gradient-to-b from-[#F57330] to-[#d45a1f] rounded-xl p-6 shadow-xl text-[#fff0ea] flex flex-col relative scale-105 z-10">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#004be3] text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Most Popular</div>
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4 shadow-sm backdrop-blur-sm">
                      <span className="material-symbols-outlined text-white text-xl">storefront</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">Seller</h3>
                    <p className="text-xs text-white/70 mb-5">Full control. Zero complexity. Start your store today.</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {[
                        'Custom Storefront — Design your brand\'s look',
                        'Live Analytics — Real-time sales &amp; traffic',
                        'Marketing Suite — Promotions &amp; ads',
                        'Priority Support — 24/7 assistance',
                        'Flash deal &amp; campaign management',
                        'Product catalog management',
                        'Bulk pricing &amp; wholesale options',
                        'Customer insights &amp; 360 view',
                        'Payout tracking &amp; history',
                        'Multi-channel inventory sync',
                      ].map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                          <span className="material-symbols-outlined text-sm text-white flex-shrink-0 mt-0.5">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/seller/onboarding')} className="w-full py-2.5 rounded-xl bg-white text-[#F57330] text-sm font-black shadow-md hover:opacity-90 transition-all active:scale-95">Register as Seller</button>
                  </div>

                  {/* Manufacturer */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10 flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#004be3] to-[#4a8cff] flex items-center justify-center mb-4 shadow-sm">
                      <span className="material-symbols-outlined text-white text-xl">factory</span>
                    </div>
                    <h3 className="text-lg font-black text-[#4a2507] mb-1">Manufacturer</h3>
                    <p className="text-xs text-[#805030] mb-5">Production, wholesale &amp; global logistics operations.</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {[
                        'Production line management',
                        'Quality control &amp; reporting',
                        'B2B wholesale contracts',
                        'Global logistics integration',
                        'Real-time production tracking',
                        'Raw materials sourcing network',
                        'Smart contracts &amp; agreements',
                        'Factory capacity analytics',
                        'Compliance &amp; certification management',
                        'Dedicated account manager',
                      ].map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#805030]">
                          <span className="material-symbols-outlined text-sm text-[#004be3] flex-shrink-0 mt-0.5">check_circle</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate('/manufacturer/onboarding')} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#004be3] to-[#4a8cff] text-white text-sm font-bold shadow-sm hover:opacity-90 transition-all active:scale-95">Register as Manufacturer</button>
                  </div>
                </div>
              </section>
            ) : userRole === 'supplier' || userRole === 'seller' || userRole === 'manufacturer' ? (
              <section className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center mb-6 shadow-lg">
                  <span className="material-symbols-outlined text-white text-4xl">
                    {userRole === 'supplier' ? 'inventory_2' : userRole === 'seller' ? 'storefront' : 'factory'}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-[#4a2507] mb-2 capitalize">{userRole} Dashboard</h2>
                <p className="text-[#805030] mb-8 max-w-md">You're registered as a {userRole}. Access your dashboard to manage operations, track performance, and scale your business.</p>
                <button
                  onClick={() => navigate(
                    userRole === 'supplier' ? '/supplier/dashboard' : userRole === 'seller' ? '/seller/dashboard' : '/manufacturer/factory-hub'
                  )}
                  className="bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:opacity-90 transition-all active:scale-95"
                >
                  Go to Dashboard
                </button>
              </section>
            ) : null}

            {/* Verification & Shipping Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#ffede4] rounded-xl p-6 border border-[#dca079]/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#9e3c00] text-2xl">verified</span>
                  <h3 className="font-bold text-[#4a2507]">Verification Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[#dca079]/10">
                    <span className="text-sm text-[#805030]">Identity Verified</span>
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#dca079]/10">
                    <span className="text-sm text-[#805030]">Supplier Registration</span>
                    <span className="flex items-center gap-1 text-[#ff7936] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#dca079]/10">
                    <span className="text-sm text-[#805030]">Manufacturer Registration</span>
                    <span className="flex items-center gap-1 text-[#805030] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">radio_button_unchecked</span>
                      Not Registered
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-[#805030]">Account Type</span>
                    <span className="text-xs font-bold text-[#4a2507]">Individual</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#dca079]/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[#004be3] text-2xl">local_shipping</span>
                  <h3 className="font-bold text-[#4a2507]">Shipping Information</h3>
                </div>
                <p className="text-sm text-[#805030] mb-4">Manage your shipping preferences and track deliveries across all orders.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/shipping-info')} className="w-full border border-[#dca079]/30 text-[#805030] py-2.5 rounded-full font-bold text-sm hover:bg-[#ffede4] transition-colors">View Shipping Info</button>
                  <button onClick={() => navigate('/global-trade')} className="w-full border border-[#dca079]/30 text-[#805030] py-2.5 rounded-full font-bold text-sm hover:bg-[#ffede4] transition-colors">Global Trade Services</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AccountPage
