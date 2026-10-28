import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useVerification, type RequestableRole } from '../../contexts/VerificationContext'
import type { UserRole } from '../../contexts/AuthContext'

const navItems = [
  { path: '/supplier/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/supplier/boutique-editor', icon: 'store', label: 'My Boutique' },
  { path: '/supplier/contact', icon: 'chat', label: 'Contacts' },
  { path: '/supplier/inventory', icon: 'inventory_2', label: 'Inventory' },
  { path: '/supplier/trend-pulse', icon: 'trending_up', label: 'Trend Pulse' },
  { path: '/supplier/warehouses', icon: 'warehouse', label: 'Warehouses' },
  { path: '/supplier/bulk-import', icon: 'upload_file', label: 'Bulk Import' },
  { path: '/supplier/orders', icon: 'shopping_cart', label: 'Orders' },
  { path: '/supplier/analytics', icon: 'insights', label: 'Analytics' },
  { path: '/supplier/payouts', icon: 'payments', label: 'Payouts' },
]

const searchItems = [
  { label: 'Dashboard', path: '/supplier/dashboard', keywords: 'dashboard home' },
  { label: 'My Boutique', path: '/supplier/boutique-editor', keywords: 'boutique store editor' },
  { label: 'Contacts', path: '/supplier/contact', keywords: 'contacts messages buyers inquiries' },
  { label: 'Inventory', path: '/supplier/inventory', keywords: 'inventory stock products' },
  { label: 'Trend Pulse', path: '/supplier/trend-pulse', keywords: 'trend pulse trends' },
  { label: 'Warehouses', path: '/supplier/warehouses', keywords: 'warehouses storage' },
  { label: 'Bulk Import', path: '/supplier/bulk-import', keywords: 'bulk import upload' },
  { label: 'Orders', path: '/supplier/orders', keywords: 'orders sales' },
{ label: 'Analytics', path: '/supplier/analytics', keywords: 'analytics stats metrics' },
  { label: 'Payouts', path: '/supplier/payouts', keywords: 'payouts payments earnings' },
]

const notifications = [
  { id: 1, text: 'New order received from Boutique A', time: '5m ago', unread: true },
  { id: 2, text: 'Inventory low on Premium Canvas Tote', time: '20m ago', unread: true },
  { id: 3, text: 'Warehouse shipment dispatched', time: '2h ago', unread: false },
  { id: 4, text: 'Trend Pulse weekly report ready', time: '5h ago', unread: false },
]

const UserAvatar: React.FC<{ src: string; name: string }> = ({ src, name }) => {
  const [errored, setErrored] = useState(false)
  if (errored || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ff7936] to-[#9e3c00] text-white text-xs font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }
  return (
    <img loading="lazy" src={src} alt="" className="w-full h-full object-cover" onError={() => setErrored(true)} />
  )
}

const allRoles: UserRole[] = ['buyer', 'seller', 'supplier', 'manufacturer']

const SupplierLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { submitRoleChangeRequest, getMyRoleChangeRequest } = useVerification()
  const [showRoleChange, setShowRoleChange] = useState(false)
  const [selectedNewRole, setSelectedNewRole] = useState<RequestableRole>('seller')
  const [roleChangeMsg, setRoleChangeMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setShowAvatarMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pendingRoleChange = getMyRoleChangeRequest()

  const handleRoleChangeSubmit = async () => {
    const ok = await submitRoleChangeRequest(selectedNewRole)
    setRoleChangeMsg(ok
      ? 'Role change request submitted. Your role stays unchanged until a developer enables it.'
      : 'Could not submit the request. Please try again.')
    setShowRoleChange(false)
    setTimeout(() => setRoleChangeMsg(''), 4000)
  }

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex">
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#ffede4] z-40 p-6">
        <div className="mb-8 px-2">
          <Link to="/" className="text-xl font-black text-[#9e3c00] tracking-tighter">Great Wall Bags</Link>
          <p className="text-[10px] text-[#805030] font-semibold mt-0.5">Supplier Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-r-full transition-all text-sm font-semibold ${
                  isActive
                    ? 'bg-[#ff7936] text-white shadow-md'
                    : 'text-[#805030] hover:bg-[#ffd4bb] hover:text-[#4a2507]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

      </aside>
      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-[#fff4f0]/80 backdrop-blur-xl border-b border-[#dca079]/10 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <button className="p-2 hover:bg-[#ffd4bb] rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[#9e3c00]">menu</span>
            </button>
            <span className="text-lg font-black text-[#9e3c00]">Great Wall Bags</span>
          </div>
          <div className="hidden md:flex items-center ml-auto mr-4 relative" ref={searchRef}>
            <div className="flex items-center bg-[#ffd4bb] rounded-full px-4 py-1.5 gap-2">
              <span className="material-symbols-outlined text-[#805030] text-sm">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm placeholder-[#805030] w-48 lg:w-64 outline-none"
                placeholder="Search orders or products..."
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearch(true) }}
                onFocus={() => setShowSearch(true)}
              />
            </div>
            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#dca079]/10 overflow-hidden z-50">
                {filteredSearch.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[#805030]">No results found</div>
                ) : filteredSearch.map(item => (
                  <button
                    key={item.path}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-[#4a2507] hover:bg-[#fff4f0] transition-colors flex items-center gap-3"
                    onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery('') }}
                  >
                    <span className="material-symbols-outlined text-[#805030] text-base">north_east</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {roleChangeMsg && (
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{roleChangeMsg}</span>
            )}
            {pendingRoleChange && (
              <span className="text-[10px] font-bold text-[#ff7936] bg-[#ff7936]/10 px-3 py-1 rounded-full">Change Pending</span>
            )}
            <button onClick={() => setShowRoleChange(true)} className="text-[10px] font-bold text-[#004be3] hover:text-[#9e3c00] px-3 py-1.5 rounded-full hover:bg-[#ffd4bb] transition-all hidden md:block">
              Request Role Change
            </button>
            <div className="relative" ref={notifRef}>
              <button className="p-2 hover:bg-[#ffd4bb] rounded-full transition-colors relative" onClick={() => setShowNotifications(!showNotifications)}>
                <span className="material-symbols-outlined text-[#9e3c00] text-lg">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#b9002c] rounded-full" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#dca079]/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#dca079]/10">
                    <span className="text-sm font-bold text-[#4a2507]">Notifications</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 flex items-start gap-3 ${n.unread ? 'bg-[#fff4f0]' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-[#b9002c]' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#4a2507]">{n.text}</p>
                          <span className="text-[10px] text-[#805030]">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={avatarRef}>
              <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#ff7936] cursor-pointer hover:opacity-90 transition-opacity">
                <UserAvatar src={user?.avatar || ''} name={user?.name || 'S'} />
              </button>
              {showAvatarMenu && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#dca079]/20 overflow-hidden z-50">
                  <div className="p-3 border-b border-[#ffede4]">
                    <p className="text-sm font-bold text-[#4a2507]">{user.name}</p>
                    <p className="text-[10px] text-[#805030] font-medium uppercase tracking-wider">{user.role}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => { navigate('/settings'); setShowAvatarMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">settings</span>
                      Settings
                    </button>
                    <button onClick={() => { navigate('/supplier/boutique-editor'); setShowAvatarMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">store</span>
                      My Boutique
                    </button>
                    <button onClick={() => { navigate('/supplier/payouts'); setShowAvatarMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">payments</span>
                      Payouts
                    </button>
                    <button onClick={() => { navigate('/'); setShowAvatarMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">public</span>
                      View Public Site
                    </button>
                    <div className="h-px bg-[#dca079]/10 my-0.5"></div>
                    <button onClick={() => { setShowAvatarMenu(false); setShowLogoutModal(true) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#b9002c] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {showRoleChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowRoleChange(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#4a2507]">Request Role Change</h3>
              <button onClick={() => setShowRoleChange(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ffede4] transition-colors">
                <span className="material-symbols-outlined text-[#805030]">close</span>
              </button>
            </div>
            <p className="text-sm text-[#805030] mb-6">Select the role you'd like to switch to. A developer will review your request.</p>
            <div className="space-y-3 mb-6">
              {allRoles.filter(r => r !== user?.role && r !== 'developer' && r !== 'buyer').map(role => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedNewRole === role
                      ? 'border-[#ff7936] bg-[#fff4f0]'
                      : 'border-[#dca079]/10 hover:border-[#dca079]/30'
                  }`}
                >
                  <input type="radio" name="newRole" value={role} checked={selectedNewRole === role} onChange={() => setSelectedNewRole(role as RequestableRole)} className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedNewRole === role ? 'border-[#ff7936]' : 'border-[#dca079]'
                  }`}>
                    {selectedNewRole === role && <div className="w-2.5 h-2.5 rounded-full bg-[#ff7936]" />}
                  </div>
                  <span className="text-sm font-bold text-[#4a2507] capitalize">{role}</span>
                </label>
              ))}
            </div>
            <button onClick={handleRoleChangeSubmit} className="w-full py-3 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-sm font-bold shadow-lg shadow-[#ff7936]/20 hover:opacity-90 transition-all">
              Submit Request
            </button>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-[90vw] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffede4] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#b9002c]">logout</span>
            </div>
            <h3 className="text-xl font-bold text-[#4a2507] mb-2">Logging out of your account</h3>
            <p className="text-sm text-[#805030] mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors">Cancel</button>
              <button onClick={() => { logout(); setShowLogoutModal(false) }} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#b9002c] hover:bg-[#9e0026] rounded-xl transition-colors">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierLayout
