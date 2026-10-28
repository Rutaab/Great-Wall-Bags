import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import type { LocalProduct } from '../services/localProducts'
import { api } from '../services/api'
import { formatPrice } from '../utils/currency'

interface StoreData {
  storeName: string
  storeDescription: string
  logo: string
  featuredProductIds: string[]
  internationalOrders: boolean
  promotions: boolean
  autoReply: boolean
}

const BANNERS = [
  'https://images.unsplash.com/photo-1540228232483-1b64a7024923?w=1400&h=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1400&h=400&q=80&fit=crop',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=400&q=80&fit=crop',
]

const badgeStyles: Record<string, string> = {
  Premium: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white',
  Eco: 'bg-gradient-to-r from-emerald-500 to-green-400 text-white',
  Mini: 'bg-gradient-to-r from-pink-400 to-rose-300 text-white',
  Travel: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white',
  New: 'bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white',
}

const categoryImages: Record<string, string> = {
  'Tote Bags': 'https://images.unsplash.com/photo-1591561954555-607968c989ab?w=100&h=100&q=60&fit=crop',
  'Crossbody': 'https://images.unsplash.com/photo-1608532744002-3b0b2f6e6d5f?w=100&h=100&q=60&fit=crop',
  'Backpacks': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=100&h=100&q=60&fit=crop',
}

function renderStars(rating: number) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="material-symbols-outlined text-[12px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
      {half && <span className="material-symbols-outlined text-[12px] text-amber-400">star_half</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="material-symbols-outlined text-[12px] text-gray-300">star</span>
      ))}
    </span>
  )
}

const SellerPublicStorefront: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>()
  const [store, setStore] = useState<StoreData | null>(null)
  const [sellerName, setSellerName] = useState('')
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [bannerIndex] = useState(() => Math.floor(Math.random() * BANNERS.length))

  useEffect(() => {
    if (!sellerId) return
    let cancelled = false

    const load = async () => {
      setError('')
      try {
        // Storefront branding stays local (it is cosmetic and not in users.json).
        const raw = localStorage.getItem(`hobags_seller_storefront_${sellerId}`)
        if (raw) setStore(JSON.parse(raw))
      } catch { /* branding is optional */ }

      // The seller's identity comes from the backend, not a browser-local user
      // list. The public endpoint is served without auth and never includes
      // credentials, so it is safe for anonymous visitors.
      try {
        const seller = await api.getPublicSeller(sellerId)
        if (!cancelled && seller?.name) setSellerName(seller.name)
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Could not load this seller')
      }

      try {
        const productsRaw = localStorage.getItem('hobags_products')
        if (productsRaw) {
          const allProducts: LocalProduct[] = JSON.parse(productsRaw)
          if (!cancelled) {
            setProducts(allProducts.filter(p => p.addedBy?.id === sellerId && p.status === 'published'))
          }
        }
      } catch { /* no cached products */ }

      if (!cancelled) setLoading(false)
    }

    void load()
    return () => { cancelled = true }
  }, [sellerId])

  const storeName = store?.storeName || sellerName || 'Seller Store'
  const storeDesc = store?.storeDescription || ''
  const logo = store?.logo || ''

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return ['All', ...Array.from(cats)]
  }, [products])

  const filteredProducts = useMemo(
    () => activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  )

  const featuredProducts = useMemo(
    () => products.filter(p => store?.featuredProductIds?.includes(p.id)),
    [products, store]
  )

  const topProducts = useMemo(
    () => [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4),
    [products]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#9e3c00] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error && !sellerName) {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-[#dca079]/20 p-8 max-w-md w-full text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-[#805030] mb-3">storefront</span>
          <h1 className="text-xl font-black text-[#4a2507] mb-2">Store unavailable</h1>
          <p className="text-sm text-[#805030]">{error}</p>
          <Link to="/" className="inline-block mt-6 px-6 py-2.5 bg-[#9e3c00] text-white rounded-full text-sm font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf3ef] text-[#4a2507]">
      <AppHeader hideCategoryNav />

      {/* Hero Banner */}
      <section className="relative h-[340px] md:h-[400px] overflow-hidden">
        <img
          loading="lazy"
          src={BANNERS[bannerIndex]}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1205]/80 via-[#2a1205]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1205]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="max-w-7xl mx-auto flex items-end gap-7">
            {logo ? (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-[3px] border-white/80 bg-white shadow-2xl overflow-hidden flex-shrink-0 -mb-2">
                <img loading="lazy" src={logo} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-[3px] border-white/80 bg-gradient-to-br from-[#ff7936] to-[#9e3c00] shadow-2xl overflow-hidden flex-shrink-0 -mb-2 flex items-center justify-center">
                <span className="text-white text-4xl font-black">{storeName.charAt(0)}</span>
              </div>
            )}
            <div className="pb-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">Verified Seller</span>
                {store?.internationalOrders && (
                  <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-400/20">Worldwide Shipping</span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{storeName}</h1>
              {storeDesc && <p className="text-white/80 text-sm mt-2 max-w-2xl line-clamp-2">{storeDesc}</p>}
              <div className="flex items-center gap-6 mt-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">inventory_2</span>
                  <span className="font-semibold">{products.length} products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">star</span>
                  <span className="font-semibold">{products.length > 0 ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : '0.0'} avg. rating</span>
                </div>
                {store?.promotions && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">local_fire_department</span>
                    <span className="font-semibold">Active promotions</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#9e3c00] text-white shadow-lg shadow-[#9e3c00]/20 scale-105'
                  : 'bg-white text-[#805030] hover:bg-[#ffede4] border border-[#dca079]/10'
              }`}
            >
              {cat !== 'All' && categoryImages[cat] && (
                <img src={categoryImages[cat]} alt="" className="w-5 h-5 rounded-full object-cover" />
              )}
              {cat}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20' : 'bg-[#ffede4] text-[#805030]'}`}>
                {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#dca079]/10 shadow-sm">
              <h3 className="font-bold text-sm text-[#4a2507] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#9e3c00]">store</span>
                About
              </h3>
              <p className="text-xs text-[#805030] leading-relaxed">{storeDesc || 'Welcome to our store! We offer carefully curated products.'}</p>
              <div className="mt-5 space-y-3 pt-4 border-t border-[#dca079]/10">
                <div className="flex items-center gap-3 text-xs">
                  <span className="material-symbols-outlined text-base text-[#9e3c00]">calendar_month</span>
                  <span className="text-[#805030]">Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="material-symbols-outlined text-base text-[#9e3c00]">inventory_2</span>
                  <span className="text-[#805030]">{products.length} products listed</span>
                </div>
                {store?.internationalOrders && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="material-symbols-outlined text-base text-[#9e3c00]">public</span>
                    <span className="text-[#805030]">International shipping available</span>
                  </div>
                )}
                {store?.autoReply && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="material-symbols-outlined text-base text-[#9e3c00]">auto_awesome</span>
                    <span className="text-[#805030]">Instant replies enabled</span>
                  </div>
                )}
              </div>
            </div>

            {topProducts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#dca079]/10 shadow-sm">
                <h3 className="font-bold text-sm text-[#4a2507] mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#9e3c00]">trending_up</span>
                  Top Rated
                </h3>
                <div className="space-y-3">
                  {topProducts.slice(0, 3).map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 group">
                      <div className="w-12 h-12 rounded-xl bg-[#ffe3d3] overflow-hidden flex-shrink-0">
                        <img loading="lazy" src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#4a2507] truncate group-hover:text-[#9e3c00] transition-colors">{p.name}</p>
                        <p className="text-[10px] text-[#805030]">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-black text-[#4a2507] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#9e3c00]">stars</span>
                    Featured
                  </h2>
                  <span className="text-[10px] text-[#805030] font-medium">{featuredProducts.length} items</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {featuredProducts.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#dca079]/10"
                    >
                      <div className="aspect-[4/5] bg-[#ffe3d3] overflow-hidden relative">
                        <img loading="lazy" src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                          <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">View Details</span>
                          <span className="bg-white/90 backdrop-blur-sm text-[#9e3c00] px-2 py-0.5 rounded text-[10px] font-bold">
                            {(p.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {p.badge && (
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${badgeStyles[p.badge] || 'bg-gray-100 text-gray-600'}`}>
                              {p.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-[#805030] bg-[#fff4f0] px-2 py-0.5 rounded-full">{p.category}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#4a2507] truncate group-hover:text-[#9e3c00] transition-colors">{p.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(p.rating || 0)}
                          <span className="text-[10px] text-[#805030]">({p.reviews || 0})</span>
                        </div>
                        <p className="font-black text-lg text-[#9e3c00] mt-2">{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Products */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-[#4a2507] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9e3c00]">grid_view</span>
                  {activeCategory === 'All' ? 'All Products' : activeCategory}
                </h2>
                <span className="text-[10px] text-[#805030] font-medium">{filteredProducts.length} items</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map(p => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#dca079]/10"
                    >
                      <div className="aspect-[4/5] bg-[#ffe3d3] overflow-hidden relative">
                        <img loading="lazy" src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {p.badge && (
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[p.badge] || 'bg-gray-100 text-gray-600'}`}>
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                          <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">Quick View</span>
                          <span className="bg-white/90 backdrop-blur-sm text-[#9e3c00] px-2 py-0.5 rounded text-[10px] font-bold">
                            {(p.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] text-[#805030] bg-[#fff4f0] px-2 py-0.5 rounded-full">{p.category}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#4a2507] group-hover:text-[#9e3c00] transition-colors truncate">{p.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          {renderStars(p.rating || 0)}
                          <span className="text-[10px] text-[#805030]">({p.reviews || 0})</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-black text-lg text-[#9e3c00]">{formatPrice(p.price)}</p>
                          {p.spec && (
                            <span className="text-[9px] text-[#805030] bg-[#fff4f0] px-2 py-0.5 rounded-full">{p.spec}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#dca079]/10 p-16 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#dca079] mb-3">inventory_2</span>
                  <p className="text-[#805030] font-medium text-sm">No products in this category yet.</p>
                </div>
              )}
            </section>

            {/* Empty state for no products at all */}
            {products.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#dca079]/10 p-20 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#ffede4] flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-[#9e3c00]">storefront</span>
                </div>
                <h2 className="text-xl font-black text-[#4a2507] mb-2">Coming Soon</h2>
                <p className="text-sm text-[#805030] max-w-sm mx-auto">This store is getting ready. Check back soon for amazing bag collections!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}

export default SellerPublicStorefront
