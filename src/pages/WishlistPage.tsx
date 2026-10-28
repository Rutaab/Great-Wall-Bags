import React from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter']">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <nav className="flex text-[10px] font-bold uppercase tracking-widest text-[#805030] mb-6 gap-2 items-center">
          <Link to="/" className="hover:text-[#9e3c00]">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#4a2507]">Favorites</span>
        </nav>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#4a2507] tracking-tight mb-2">My Favorites</h1>
            <p className="text-[#805030]">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          {items.length > 0 && (
            <button onClick={() => items.forEach(i => removeFromWishlist(i.id))} className="text-sm font-bold text-[#b9002c] hover:opacity-80 transition-opacity flex items-center gap-1">
              <span className="material-symbols-outlined text-base">delete_sweep</span>
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-[#dca079] mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <h2 className="text-2xl font-bold text-[#4a2507] mb-2">Your favorites list is empty</h2>
            <p className="text-[#805030] mb-8 max-w-md mx-auto">Save your favorite items by tapping the heart icon on any product.</p>
            <Link to="/" className="inline-block bg-[#9e3c00] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-[#dca079]/10 group flex flex-col">
                <Link to={`/product/${p.id}`} className="relative aspect-square bg-[#fff4f0] overflow-hidden block">
                  <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.image} alt={p.name} />
                  <div className="absolute bottom-2 left-2 bg-[#004be3] text-[#f2f1ff] text-[10px] font-black px-2 py-0.5 rounded">{p.badge}</div>
                  <div className="absolute top-2 right-2">
                    <button onClick={(e) => { e.preventDefault(); removeFromWishlist(p.id) }} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow text-[#b9002c] hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-[#4a2507] leading-tight mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-xl font-black text-[#9e3c00]">${p.price.toFixed(0)}</span>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image })} className="flex-1 bg-[#9e3c00] text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default WishlistPage
