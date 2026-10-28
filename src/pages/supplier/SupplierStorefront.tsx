import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../../components/layout/AppHeader'
import Footer from '../../components/layout/Footer'
import { useProducts } from '../../contexts/ProductContext'
import { useAuth } from '../../contexts/AuthContext'
import { formatPrice } from '../../utils/currency'

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop'

interface StoreProduct {
  id: string
  name: string
  price: number
  rating: number
  reviews: number
  image: string
}

const SupplierStorefront: React.FC = () => {
  const { user } = useAuth()
  const { getUserProducts } = useProducts()
  const [products, setProducts] = useState<StoreProduct[]>([])

  useEffect(() => {
    if (!user) return
    const stored = getUserProducts(user.id).filter(p => p.status === 'published')
    const mapped: StoreProduct[] = stored.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      rating: p.rating,
      reviews: p.reviews,
      image: p.image,
    }))
    setProducts(mapped)
  }, [user, getUserProducts])

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507]">
      <AppHeader />
      <main>
        <section className="relative h-80 md:h-96 overflow-hidden">
          <img loading="lazy" src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=250&q=60&fit=crop" alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMG }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-6xl mx-auto flex items-end gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white bg-white shadow-2xl overflow-hidden flex-shrink-0">
                <img loading="lazy" src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMG }} />
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#004be3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Verified Supplier</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white">{user?.name || 'Artisan Leather Co.'}</h1>
                <p className="text-white/80 text-sm mt-1">Premium Handcrafted Bags & Accessories</p>
                <div className="flex items-center gap-6 mt-3 text-sm text-white/70">
                  <span>★ 4.8 (567 reviews)</span>
                  <span>12,400+ orders</span>
                  <span>Since 2020</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#dca079]/10">
                <h3 className="font-bold text-sm text-[#4a2507] mb-3">About the Maker</h3>
                <p className="text-[10px] text-[#805030] leading-relaxed">We curate premium handcrafted bags that transform everyday carry into a statement of style. Our pieces are sourced from independent artisans across the globe, focusing on sustainable materials and timeless design.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-[#dca079]/10">
                <h3 className="font-bold text-sm text-[#4a2507] mb-3">Shop Info</h3>
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between"><span className="text-[#805030]">Location</span><span className="font-bold">Milan, Italy</span></div>
                  <div className="flex justify-between"><span className="text-[#805030]">Member since</span><span className="font-bold">2020</span></div>
                  <div className="flex justify-between"><span className="text-[#805030]">Response time</span><span className="font-bold text-green-700">&lt; 2 hours</span></div>
                  <div className="flex justify-between"><span className="text-[#805030]">Followers</span><span className="font-bold">8,432</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-[#4a2507]">All Products ({products.length})</h2>
                <div className="flex items-center gap-2">
                  <select className="text-xs font-bold bg-white border border-[#dca079]/20 rounded-lg px-3 py-1.5 outline-none">
                    <option>Best Selling</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl overflow-hidden group hover:shadow-xl transition-all border border-[#dca079]/10">
                    <div className="aspect-square bg-[#ffe3d3] overflow-hidden">
                      <img loading="lazy" src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={e => { (e.target as HTMLImageElement).src = DEFAULT_IMG }} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-[#4a2507] group-hover:text-[#9e3c00] transition-colors truncate">{p.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-bold">{p.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-[#805030]">({p.reviews})</span>
                      </div>
                      <p className="font-black text-[#9e3c00] mt-2">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SupplierStorefront
