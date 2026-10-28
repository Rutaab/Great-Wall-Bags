import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useProducts } from '../contexts/ProductContext'
import { getTopRatedByCategory } from '../data/recommendations'
import RecommendedProducts from '../components/RecommendedProducts'
import { getActiveSale } from '../services/salePrices'
import { DealPrice, DealTag } from '../components/DealPrice'
import type { ActiveSale } from '../services/salePrices'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop'

interface DisplayProduct {
  id: string
  name: string
  price: number
  image: string
  deal?: ActiveSale | null
}

const categories = ['All', 'Tech Organizers', 'Straps & Hardware', 'Travel Accessories', 'Care Kits', 'Patches']

const bundles = [
  { name: 'Tech Kit', items: 'Tech Organizer + Cable Kit + Key Ring', price: 55, original: 69 },
  { name: 'Travel Kit', items: 'Wheels Base + Luggage Tags + Mesh Pod', price: 78, original: 99 },
  { name: 'Care Kit', items: 'Sweat-Proof Bag + Patch Collection', price: 35, original: 46 },
]

const AccessoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { getProductsByRoute } = useProducts()
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())
  const topRated = useMemo(() => getTopRatedByCategory('Accessories', 8), [])

  useEffect(() => {
    const stored = getProductsByRoute('/accessories')
    const mapped: DisplayProduct[] = stored.map(p => {
      const deal = getActiveSale(p.id)
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        deal,
      }
    })
    setProducts(mapped)
  }, [getProductsByRoute])

  const handleAddToCart = (item: DisplayProduct) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    setJustAdded(prev => new Set(prev).add(item.id))
    setTimeout(() => {
      setJustAdded(prev => { const next = new Set(prev); next.delete(item.id); return next })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507]">
      <AppHeader />
      <main className="pb-16 md:pb-0">
        <section className="relative h-[300px] overflow-hidden">
          <img loading="lazy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy2IdHGwFe3u3K7k6tsHWLFE5Kpp_TK7wrn3vpGvtWgC864tctG-8esLasz52d9jeyZumbkr5nmL9GLBtSQxYOY99_Eg7BAIeBL9DUBown7tCk00GFgf3BNVmGojGcBqOnxrUOYhPKPPdgtXlzDkMtl1Q28n9uO35SrMowasBACMhZL2q_RkDn6SmswNk3el9yGpGLzPz_Cphfy1njG4oiw0myU9R83EjkuxRVqGq0tGfe2wBAkEF1DJsxDoLnrqiGXkHSsTYhieUX?w=1920&h=600&fit=crop" alt="Accessories and add-ons" onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMG }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2507]/80 to-transparent flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-none mb-3">Accessories & Add-ons</h1>
            <p className="text-white/80 text-base max-w-md">Complete your carry with precision-crafted accessories designed for the modern journey.</p>
          </div>
        </section>

        <section className="px-3 md:px-8 mt-6 md:mt-8 mb-6 md:mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((cat, i) => (
              <button key={cat} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors ${i === 0 ? 'bg-[#ff7936] text-white' : 'bg-[#ffede4] text-[#805030] hover:bg-[#ffd4bb]'}`}>{cat}</button>
            ))}
          </div>
        </section>

        <section className="px-3 md:px-8 mb-8 md:mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((item) => {
              const isFav = isWishlisted(item.id)
              const added = justAdded.has(item.id)
              return (
              <Link key={item.id} to={`/product/${item.id}`} className="bg-white rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-[#ffe3d3] overflow-hidden relative">
                  <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={item.image} alt={item.name} onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMG }} />
                  {item.deal && <div className="absolute top-2 right-2"><DealTag sale={item.deal} compact /></div>}
                  <div className="absolute inset-0 bg-[#9e3c00]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(item) }} className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${added ? 'text-green-600' : 'text-[#9e3c00]'}`}>
                      <span className="material-symbols-outlined">{added ? 'check' : 'add_shopping_cart'}</span>
                    </button>
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist({ id: item.id, name: item.name, price: item.price, image: item.image, badge: '' }) }} className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 ${isFav ? 'text-[#b9002c]' : 'text-[#9e3c00]'}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm group-hover:text-[#9e3c00] transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    {item.deal ? (
                      <DealPrice sale={item.deal} originalPrice={item.deal.original_price} />
                    ) : (
                      <span className="text-lg font-bold text-[#9e3c00]">${item.price}</span>
                    )}
                    <span onClick={(e) => { e.preventDefault(); navigate(`/product/${item.id}`) }} className="material-symbols-outlined text-[#004be3] cursor-pointer hover:scale-110 transition-transform text-lg">add_circle</span>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        </section>

        <section className="mx-4 md:mx-8 mb-16 bg-[#ffede4] rounded-xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Bundle & Save</h2>
          <p className="text-[#805030] mb-8">Build the perfect kit and save up to 20%.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div key={bundle.name} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold mb-1">{bundle.name}</h3>
                <p className="text-xs text-[#805030] mb-4">{bundle.items}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#9e3c00]">${bundle.price}</span>
                  <span className="text-sm text-[#805030] line-through">${bundle.original}</span>
                </div>
                <button onClick={() => navigate('/accessories')} className="mt-4 w-full bg-[#004be3] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#0041c8] transition-colors">Add Bundle</button>
              </div>
            ))}
          </div>
        </section>
      {topRated.length > 0 && (
        <div className="px-4 md:px-8 lg:px-12">
          <RecommendedProducts
            title="Top Rated Accessories"
            viewAllLink="/accessories"
            items={topRated}
            maxColumns={4}
          />
        </div>
      )}
      </main>
      <Footer />
    </div>
  )
}

export default AccessoriesPage
