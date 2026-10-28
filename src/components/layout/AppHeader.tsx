import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { desktopNavItems, mobileNavItems, getTagGroupByKey } from '../../data/categoryTags'
import { useDebounce } from '../../hooks/useDebounce'
import { demoProducts, DemoProduct } from '../../data/demoProducts'
import { formatPrice } from '../../utils/currency'

interface AppHeaderProps {
  hideCategoryNav?: boolean
}

const AppHeader: React.FC<AppHeaderProps> = ({ hideCategoryNav }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useLanguage()
  const { cartCount } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  // Which desktop category dropdown is pinned open by a click. Hover and keyboard
  // focus open the same panels via CSS; this covers touch/click.
  const [openDesktopKey, setOpenDesktopKey] = useState<string | null>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const debouncedQuery = useDebounce(searchQuery, 300)

  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const q = debouncedQuery.trim().toLowerCase()
    return demoProducts
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [debouncedQuery])

  const navigateToSearch = (query: string) => {
    const q = encodeURIComponent(query.trim())
    navigate(`/search?q=${q}`)
    setSearchQuery('')
    setShowSuggestions(false)
    setFocusedIndex(-1)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        navigateToSearch(suggestions[focusedIndex].name)
      } else if (searchQuery.trim()) {
        navigateToSearch(searchQuery)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setFocusedIndex(-1)
    }
  }

  const handleSuggestionClick = (product: DemoProduct) => {
    navigateToSearch(product.name)
  }

  // Close the pinned category dropdown whenever the route changes.
  useEffect(() => {
    setOpenDesktopKey(null)
  }, [pathname])

  useEffect(() => {
    if (suggestions.length > 0 && searchQuery.trim()) {
      setShowSuggestions(true)
      setFocusedIndex(-1)
    } else {
      setShowSuggestions(false)
    }
  }, [suggestions, searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // A category dropdown pinned open by a click closes on any outside click.
    const handleClickOutside = (e: MouseEvent) => {
      setOpenDesktopKey(prev => {
        if (!prev) return prev
        const target = e.target as Node
        const inside = Array.from(document.querySelectorAll('[data-category-nav]'))
          .some(el => el.contains(target))
        return inside ? prev : null
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-md' : ''}`}
      style={{ backdropFilter: 'blur(24px)', backgroundColor: 'rgba(255, 244, 240, 0.8)' }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-2.5 md:py-3 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-4 md:gap-8 flex-1 md:flex-initial">
          <Link to="/" className="text-lg md:text-2xl font-black italic text-[#9e3c00] tracking-tighter whitespace-nowrap">
            Great Wall Bags
          </Link>
          <div ref={searchRef} className="hidden xl:flex items-center bg-[#ffd4bb] rounded-full px-4 py-1.5 w-96 relative">
            <span className="material-symbols-outlined text-[#805030] mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#805030] outline-none"
              placeholder="Search the web for bags..."
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setFocusedIndex(-1) }}
              onKeyDown={handleSearch}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[#dca079]/20 overflow-hidden z-50">
                {suggestions.map((product, idx) => (
                  <button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === focusedIndex ? 'bg-[#ffede4]' : 'hover:bg-[#ffede4]'}`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#ffede4] flex-shrink-0">
                      <img loading="lazy" className="w-full h-full object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#4a2507] truncate">{product.name}</p>
                      <p className="text-xs text-[#805030]">{formatPrice(product.price)}</p>
                    </div>
                    <span className="material-symbols-outlined text-[#805030] text-base">search</span>
                  </button>
                ))}
                <button
                  onClick={() => navigateToSearch(searchQuery)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffede4] text-sm font-semibold text-[#4a2507] hover:bg-[#ffd4bb] transition-colors border-t border-[#dca079]/10"
                >
                  <span className="material-symbols-outlined text-base">search</span>
                  See all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 font-semibold tracking-tight text-sm">
          <div className="h-4 w-px bg-[#dca079] opacity-30 hidden lg:block"></div>
          <div className="flex items-center gap-2 lg:gap-4">
            {user?.email === 'dev@hobags.com' && (
              <button onClick={() => navigate('/customizer')} className="flex items-center gap-1 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
                <span className="material-symbols-outlined text-lg md:text-xl">view_in_ar</span>
                <span className="hidden lg:inline">3D Customization</span>
              </button>
            )}
            <button onClick={() => navigate('/wishlist')} className="flex items-center gap-1 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
              <span className="material-symbols-outlined text-lg md:text-xl">favorite</span>
              <span className="hidden lg:inline">Favorites</span>
            </button>
            <button onClick={() => navigate('/education')} className="flex items-center gap-1 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
              <span className="material-symbols-outlined text-lg md:text-xl">school</span>
              <span className="hidden lg:inline">Education</span>
            </button>
            <button onClick={() => navigate('/cart')} className="relative flex items-center gap-1 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
              <span className="material-symbols-outlined text-lg md:text-xl">shopping_cart</span>
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#004be3] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <div className="relative" ref={accountRef}>
              {isLoggedIn && user ? (
                <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
                  <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#ff7936] flex items-center justify-center bg-[#ff7936] text-white text-xs font-bold">
                    {user.avatar ? (
                      <img loading="lazy" className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="hidden lg:inline text-sm font-semibold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button onClick={() => navigate('/login')} className="flex items-center gap-1 text-[#4a2507] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded-lg whitespace-nowrap">
                  <span className="material-symbols-outlined text-lg md:text-xl">account_circle</span>
                  <span className="hidden lg:inline">Sign In</span>
                </button>
              )}
              {accountOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#dca079]/20 overflow-hidden z-50">
                  <div className="p-3 border-b border-[#ffede4]">
                    <p className="text-sm font-bold text-[#4a2507]">{user.name}</p>
                    <p className="text-[10px] text-[#805030] font-medium uppercase tracking-wider">{user.role}</p>
                  </div>
                  <div className="p-1.5">
                    <button onClick={() => { navigate('/account'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">account_circle</span>
                      My Account
                    </button>
                    {user.email === 'dev@hobags.com' && (
                      <button onClick={() => { navigate('/developer'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                        <span className="material-symbols-outlined text-[#805030] text-base">code</span>
                        Developer
                      </button>
                    )}
                    <button onClick={() => { navigate('/order-history'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">receipt_long</span>
                      Orders
                    </button>
                    <button onClick={() => { navigate('/settings'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">settings</span>
                      Settings
                    </button>
                    <button onClick={() => { navigate('/shipping-info'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">local_shipping</span>
                      Shipping Info
                    </button>
                    <div className="h-px bg-[#dca079]/10 my-0.5"></div>
                    <button onClick={() => { navigate('/customer-service'); setAccountOpen(false) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#4a2507] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-[#805030] text-base">help</span>
                      Help
                    </button>
                    <button onClick={() => { setAccountOpen(false); setShowLogoutModal(true) }} className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-[#b9002c] hover:bg-[#ffede4] rounded-lg transition-colors text-left">
                      <span className="material-symbols-outlined text-base">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-1">
          <button onClick={() => navigate('/education')} className="p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
            <span className="material-symbols-outlined">school</span>
          </button>
          {isLoggedIn && user ? (
            <button onClick={() => navigate('/account')} className="p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#ff7936] flex items-center justify-center bg-[#ff7936] text-white text-xs font-bold">
                {user.avatar ? (
                  <img loading="lazy" className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          )}
          <button onClick={() => navigate('/cart')} className="relative p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span className="absolute top-0.5 right-0.5 bg-[#004be3] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(true)} className="p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Category Nav — desktop only */}
      {!hideCategoryNav && <div className="hidden md:block bg-[#ffede4] border-t border-[#dca079]/10">
        <div className="px-4 md:px-6 pb-2.5 md:pb-0">
          <div className="max-w-[1920px] mx-auto flex items-center gap-3 md:gap-6 py-0 md:py-2.5">
            {desktopNavItems.map((item) => {
              const group = getTagGroupByKey(item.key)
              if (!group) {
                return (
                  <Link key={item.route} to={item.route!} className="text-xs md:text-sm font-medium text-[#805030] hover:text-[#9e3c00] whitespace-nowrap">
                    {item.label}
                  </Link>
                )
              }
              // The category hub page was removed, so this label is a dropdown
              // toggle only - it must not navigate anywhere.
              const isOpen = openDesktopKey === item.key
              return (
                <div key={item.key} data-category-nav className="relative group py-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setOpenDesktopKey(isOpen ? null : item.key)}
                    className="text-xs md:text-sm font-medium text-[#805030] hover:text-[#9e3c00] whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                  <div className={`absolute top-full left-0 pt-2 z-50 ${isOpen ? 'block' : 'hidden group-hover:block group-focus-within:block'}`}>
                    <div className="bg-white rounded-xl shadow-xl border border-[#dca079]/10 p-4 min-w-[220px] max-h-[70vh] overflow-y-auto hide-scrollbar">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#805030] mb-2">{group.label}</p>
                      <div className="space-y-0.5">
                        {group.items.map((tag) => (
                          <Link key={tag.name} to={tag.route} onClick={() => { setOpenDesktopKey(null); setMenuOpen(false) }} className="block px-2 py-1 text-xs text-[#4a2507] hover:bg-[#ffede4] rounded-lg hover:text-[#9e3c00]">
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              <Link to="/flash-deals" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#b9002c] bg-[#ff9193]/30 px-2 py-0.5 rounded hover:bg-[#ff9193] transition-colors">Flash Sales</Link>
            </div>
          </div>
        </div>
      </div>}

      <style>{`
        @keyframes slide-left { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-left { animation: slide-left 0.25s ease-out; }
        .hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white flex flex-col animate-slide-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#dca079]/10">
              <span className="font-black italic text-[#9e3c00] text-lg">Wello Bags</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-[#4a2507] hover:bg-[#ffd4bb] rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center bg-[#ffd4bb] rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-[#805030] mr-2 text-sm">search</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#805030] outline-none"
                  placeholder="Search the web for bags..."
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setFocusedIndex(-1) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
                        navigateToSearch(suggestions[focusedIndex].name)
                        setMenuOpen(false)
                      } else if (searchQuery.trim()) {
                        navigateToSearch(searchQuery)
                        setMenuOpen(false)
                      }
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setFocusedIndex(prev => Math.max(prev - 1, -1))
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false)
                      setFocusedIndex(-1)
                    }
                  }}
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="mt-2 bg-white rounded-xl shadow-lg border border-[#dca079]/10 overflow-hidden">
                  {suggestions.map((product, idx) => (
                    <button
                      key={product.id}
                      onClick={() => { handleSuggestionClick(product); setMenuOpen(false) }}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${idx === focusedIndex ? 'bg-[#ffede4]' : 'hover:bg-[#ffede4]'}`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#ffede4] flex-shrink-0">
                        <img loading="lazy" className="w-full h-full object-cover" src={product.image} alt={product.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#4a2507] truncate">{product.name}</p>
                        <p className="text-xs text-[#805030]">{formatPrice(product.price)}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => { navigateToSearch(searchQuery); setMenuOpen(false) }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffede4] text-sm font-semibold text-[#4a2507] hover:bg-[#ffd4bb] transition-colors border-t border-[#dca079]/10"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                    See all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 px-5 py-5 overflow-y-auto hide-scrollbar">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#805030] px-3 pb-2">Shop by Category</p>
              <div className="flex flex-col">
                {mobileNavItems.map((item) => {
                  const group = getTagGroupByKey(item.key)
                  const isExpanded = expandedMobile === item.key
                  if (!group) {
                    return (
                      <Link key={item.route} to={item.route!} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                        {item.label}
                      </Link>
                    )
                  }
                  // Responsive screens get the dropdown only: the row is a toggle,
                  // never a link to the removed hub page.
                  return (
                    <div key={item.key}>
                      <button
                        type="button"
                        onClick={() => setExpandedMobile(isExpanded ? null : item.key)}
                        aria-expanded={isExpanded}
                        aria-haspopup="true"
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm"
                      >
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <span className="material-symbols-outlined text-base transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}>expand_more</span>
                      </button>
                      {isExpanded && (
                        <div className="ml-7 pl-3 border-l-2 border-[#dca079]/20 space-y-0.5 mt-0.5 mb-1">
                          {group.items.map((tag) => (
                            <Link key={tag.name} to={tag.route} onClick={() => setMenuOpen(false)} className="block px-3 py-1.5 text-xs text-[#805030] hover:bg-[#ffede4] rounded-lg hover:text-[#9e3c00]">{tag.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
                <Link to="/accessories" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                  <span className="material-symbols-outlined text-base">watch</span>
                  Accessories
                </Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                  <span className="material-symbols-outlined text-base">favorite</span>
                  Favorites
                </Link>
                <Link to="/flash-deals" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                  <span className="material-symbols-outlined text-base">local_fire_department</span>
                  Flash Deals
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-[#dca079]/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#805030] px-3 pb-2">More</p>
                <Link to="/education" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                  <span className="material-symbols-outlined text-base">school</span>
                  Education
                </Link>
                {user?.email === 'dev@hobags.com' && (
                  <Link to="/customizer" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                    <span className="material-symbols-outlined text-base">view_in_ar</span>
                    3D Customization
                  </Link>
                )}
                {user?.email === 'dev@hobags.com' && (
                  <>
                    <Link to="/supplier/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                      <span className="material-symbols-outlined text-base">inventory_2</span>
                      Supplier
                    </Link>
                    <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                      <span className="material-symbols-outlined text-base">storefront</span>
                      Seller
                    </Link>
                    <Link to="/manufacturer/factory-hub" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[#4a2507] font-semibold hover:bg-[#ffd4bb] rounded-lg text-sm">
                      <span className="material-symbols-outlined text-base">precision_manufacturing</span>
                      Manufacturer
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { logout(); setShowLogoutModal(false) }}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#b9002c] hover:bg-[#9e0026] rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AppHeader
