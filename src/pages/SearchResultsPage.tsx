import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/currency'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  badge?: string
  timeLeft?: string
}

interface SearchResultsPageProps {
  categoryName: string
  categorySlug: string
  products: Product[]
  totalResults?: number
}

const sortOptions = ['Relevance', 'Orders', 'Supplier', 'Price']

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  categoryName, 
  categorySlug,
  products,
  totalResults = 4281 
}) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('Relevance')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image
    })
    navigate('/checkout/shipping')
  }

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-on-surface tracking-tight">{categoryName}</h1>
            <p className="text-on-surface-variant text-xs md:text-sm mt-1">Found {totalResults} premium {categorySlug.toLowerCase()} results</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-lg">view_list</span>
            </button>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="mt-4 md:mt-6 bg-surface-container-low rounded-xl p-2 md:p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold uppercase text-on-surface-variant tracking-widest whitespace-nowrap pl-2 md:pl-3">Sort By:</span>
            {sortOptions.map(option => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all ${
                  sortBy === option
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {option === 'Price' ? (
                  <span className="flex items-center gap-1">
                    Price <span className="material-symbols-outlined text-sm">unfold_more</span>
                  </span>
                ) : option}
              </button>
            ))}
            <div className="hidden md:block h-5 w-px bg-outline-variant/30 mx-1"></div>
            <div className="flex items-center gap-2 pl-1 w-full md:w-auto mt-1 md:mt-0">
              <div className="relative flex-1 md:flex-initial">
                <input
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className="w-16 md:w-20 h-8 text-xs rounded-lg border border-outline-variant/20 bg-surface-container-lowest focus:ring-1 focus:ring-secondary focus:border-secondary px-2 placeholder:text-on-surface-variant/50"
                  placeholder="Min"
                  type="text"
                />
              </div>
              <span className="text-on-surface-variant text-xs font-bold">-</span>
              <div className="relative flex-1 md:flex-initial">
                <input
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className="w-16 md:w-20 h-8 text-xs rounded-lg border border-outline-variant/20 bg-surface-container-lowest focus:ring-1 focus:ring-secondary focus:border-secondary px-2 placeholder:text-on-surface-variant/50"
                  placeholder="Max"
                  type="text"
                />
              </div>
              <button className="bg-secondary text-on-secondary text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity">GO</button>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-base md:text-lg">verified</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sponsored Premium Listings</span>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-primary/5 border border-outline-variant/5">
                  <div className="aspect-[4/3] bg-surface overflow-hidden relative">
                    <img loading="lazy" alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }}/>
                    {product.timeLeft && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs md:text-sm text-tertiary">timer</span>
                        <span className="text-[9px] md:text-[10px] font-black text-tertiary">FLASH SALE: {product.timeLeft}</span>
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-secondary px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                        <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-tighter">{product.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-base md:text-lg text-on-surface leading-tight">{product.name}</h3>
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-tertiary cursor-pointer text-lg">favorite</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3 md:mb-4">
                      <span className="material-symbols-outlined text-secondary text-sm">star</span>
                      <span className="text-xs font-bold">{product.rating}</span>
                      <span className="text-on-surface-variant text-xs">({product.reviewCount} reviews)</span>
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <span className="text-xl md:text-2xl font-black text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice && <span className="text-on-surface-variant line-through text-xs md:text-sm ml-2">{formatPrice(product.originalPrice)}</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }} className="bg-gradient-to-r from-primary to-primary-container text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Shop Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-xl border border-outline-variant/5">
                  <div className="w-full sm:w-48 h-48 sm:h-full bg-surface overflow-hidden relative flex-shrink-0">
                    <img loading="lazy" alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }}/>
                    {product.timeLeft && (
                      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-tertiary">timer</span>
                        <span className="text-[9px] font-black text-tertiary">FLASH SALE: {product.timeLeft}</span>
                      </div>
                    )}
                    {product.badge && (
                      <div className="absolute top-2 right-2 bg-secondary px-2 py-0.5 rounded-full">
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">{product.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base md:text-lg text-on-surface">{product.name}</h3>
                        <span className="material-symbols-outlined text-on-surface-variant hover:text-tertiary cursor-pointer text-lg flex-shrink-0">favorite</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-secondary text-sm">star</span>
                        <span className="text-xs font-bold">{product.rating}</span>
                        <span className="text-on-surface-variant text-xs">({product.reviewCount} reviews)</span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">Premium quality {product.name.toLowerCase()} with durable construction and stylish design. Perfect for everyday use.</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-outline-variant/10">
                      <div>
                        <span className="text-xl md:text-2xl font-black text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice && <span className="text-on-surface-variant line-through text-xs md:text-sm ml-2">{formatPrice(product.originalPrice)}</span>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }} className="bg-gradient-to-r from-primary to-primary-container text-white px-4 md:px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Shop Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-10">
          {products.map((product) => (
            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="flex flex-col group cursor-pointer">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-2 md:mb-3">
                <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }} alt={product.name}/>
              </div>
              <div className="px-0.5 md:px-1">
                {product.badge && <div className="text-[9px] md:text-[10px] font-bold text-secondary uppercase mb-1 tracking-widest">Free Shipping</div>}
                <h4 className="text-xs md:text-sm font-semibold text-on-surface line-clamp-2">{product.name}</h4>
                <div className="mt-1 md:mt-2 flex items-center justify-between">
                  <span className="text-base md:text-lg font-black text-primary">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-0.5 text-[10px] md:text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs md:text-sm text-secondary">star</span> {product.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {products.map((product) => (
            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer flex gap-3 md:gap-4 bg-surface-container-lowest rounded-xl p-3 md:p-4 border border-outline-variant/5 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }} alt={product.name}/>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-on-surface truncate">{product.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-secondary text-xs">star</span>
                      <span className="text-[10px] md:text-xs font-bold">{product.rating}</span>
                      <span className="text-[10px] md:text-xs text-on-surface-variant">({product.reviewCount})</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm md:text-base font-black text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && <span className="text-[10px] md:text-xs text-on-surface-variant line-through ml-1 block">{formatPrice(product.originalPrice)}</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }} className="mt-2 self-start bg-gradient-to-r from-primary to-primary-container text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border-t border-outline-variant/20 pt-6 md:pt-8 mb-8 md:mb-12">
        <div className="text-xs md:text-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">1 - 24</span> of {totalResults} items</div>
        <div className="flex items-center gap-1 md:gap-2">
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm md:text-base">chevron_left</span></button>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-secondary text-on-secondary font-bold text-sm">1</button>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors">2</button>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors">3</button>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors">4</button>
          <span className="px-1 md:px-2 text-on-surface-variant text-sm">...</span>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface font-semibold text-sm transition-colors">{Math.ceil(totalResults / 24)}</button>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-sm md:text-base">chevron_right</span></button>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
