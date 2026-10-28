import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { path: '/developer', icon: 'dashboard', label: 'Dashboard' },
  { path: '/developer/products', icon: 'inventory_2', label: 'Products' },
  { path: '/developer/orders', icon: 'shopping_bag', label: 'Orders' },
  { path: '/developer/users', icon: 'people', label: 'Users' },
  { path: '/developer/requests', icon: 'how_to_reg', label: 'Requests' },
  { path: '/developer/analytics', icon: 'insights', label: 'Analytics' },
  { path: '/developer/features', icon: 'toggle_on', label: 'Feature Flags' },
  { path: '/developer/logs', icon: 'terminal', label: 'System Logs' },
  { path: '/developer/settings', icon: 'settings', label: 'Site Settings' },
]

const searchItems = [
  { label: 'Products', path: '/developer/products', keywords: 'products catalog inventory delete remove' },
  { label: 'Orders', path: '/developer/orders', keywords: 'orders purchases checkout sales' },
  { label: 'Users', path: '/developer/users', keywords: 'users people accounts' },
  { label: 'Requests', path: '/developer/requests', keywords: 'requests verification approvals' },
  { label: 'Analytics', path: '/developer/analytics', keywords: 'analytics stats metrics' },
  { label: 'Feature Flags', path: '/developer/features', keywords: 'feature flags toggles' },
  { label: 'System Logs', path: '/developer/logs', keywords: 'system logs terminal' },
  { label: 'Site Settings', path: '/developer/settings', keywords: 'settings site config' },
  { label: 'Dashboard', path: '/developer', keywords: 'dashboard home' },
]

const notifications = [
  { id: 1, text: 'New user registration pending review', time: '2m ago', unread: true },
  { id: 2, text: 'Role change request from John Doe', time: '15m ago', unread: true },
  { id: 3, text: 'System backup completed', time: '1h ago', unread: false },
  { id: 4, text: 'New feature flag deployed', time: '3h ago', unread: false },
]

const DevAvatar: React.FC<{ src: string; name: string }> = ({ src, name }) => {
  const [errored, setErrored] = useState(false)
  if (errored || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ff7936] to-[#9e3c00] text-white text-sm font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }
  return (
    <img loading="lazy" src={src} alt="" className="w-full h-full object-cover" onError={() => setErrored(true)} />
  )
}

const DeveloperLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems

  const mobileFilteredSearch = mobileSearchQuery.trim()
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      )
    : searchItems

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex">
      {/* Mobile sidebar drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileMenu(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#ffede4] p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-black text-[#9e3c00]">Great Wall Bags</span>
              <button className="p-2 hover:bg-[#ffd4bb] rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>
                <span className="material-symbols-outlined text-[#9e3c00]">close</span>
              </button>
            </div>
            <div className="relative mb-6">
              <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2">
                <span className="material-symbols-outlined text-[#805030] text-sm">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm placeholder-[#805030] w-full outline-none"
                  placeholder="Search users, requests..."
                  type="text"
                  value={mobileSearchQuery}
                  onChange={e => { setMobileSearchQuery(e.target.value); setShowMobileSearch(true) }}
                />
              </div>
              {showMobileSearch && mobileSearchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#dca079]/10 overflow-hidden z-50">
                  {mobileFilteredSearch.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-[#805030]">No results found</div>
                  ) : mobileFilteredSearch.map(item => (
                    <button
                      key={item.path}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-[#4a2507] hover:bg-[#fff4f0] transition-colors flex items-center gap-3"
                      onClick={() => { navigate(item.path); setShowMobileMenu(false); setMobileSearchQuery(''); setShowMobileSearch(false) }}
                    >
                      <span className="material-symbols-outlined text-[#805030] text-base">north_east</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
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
            <div className="mt-auto pt-6 border-t border-[#dca079]/10 space-y-2">
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#ffede4] z-40 p-6">
        <div className="mb-8 px-2">
          <Link to="/" className="text-xl font-black text-[#9e3c00] tracking-tighter">Great Wall Bags</Link>
          <p className="text-[10px] text-[#805030] font-semibold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">code</span>
            Developer Console
          </p>
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
            <button className="p-2 hover:bg-[#ffd4bb] rounded-lg transition-colors" onClick={() => setShowMobileMenu(true)}>
              <span className="material-symbols-outlined text-[#9e3c00]">menu</span>
            </button>
            <span className="text-lg font-black text-[#9e3c00]">Great Wall Bags</span>
          </div>
          <div className="lg:hidden ml-auto mr-2">
            <button className="p-2 hover:bg-[#ffd4bb] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#9e3c00] text-lg">account_circle</span>
            </button>
          </div>
          <div className="hidden md:flex items-center ml-auto mr-4 relative" ref={searchRef}>
            <div className="flex items-center bg-[#ffd4bb] rounded-full px-4 py-1.5 gap-2">
              <span className="material-symbols-outlined text-[#805030] text-sm">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm placeholder-[#805030] w-48 lg:w-64 outline-none"
                placeholder="Search users, requests..."
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
          <div className="flex items-center gap-3">
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
                <DevAvatar src={user?.avatar || ''} name={user?.name || 'D'} />
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
                    <button onClick={() => { navigate('/developer/settings'); setShowAvatarMenu(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">admin_panel_settings</span>
                      Site Settings
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

export default DeveloperLayout
