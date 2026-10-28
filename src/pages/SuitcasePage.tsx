import React, { useState, useMemo, useEffect } from 'react'
import { getTopRatedByCategory } from '../data/recommendations'
import RecommendedProducts from '../components/RecommendedProducts'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useProducts } from '../contexts/ProductContext'
import CustomDropdown from '../components/CustomDropdown'
import { useActiveSalesMap } from '../services/salePrices'
import { DealPrice, DealTag } from '../components/DealPrice'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop'

interface DisplayProduct {
  id: string; name: string; spec: string; material: string
  price: number; bulk: string; bulkQty: string
  rating: number; reviews: number; image: string; badge: string
}

const sizeLabels = ['Carry-On (Up to 40L)', 'Medium (40L - 70L)', 'Large (70L+)'] as const
const materialLabels = ['Polycarbonate', 'Brushed Aluminum', 'ABS Composite', 'Fabric / Softside']
const featureLabels = ['SPINNER WHEELS', 'TSA LOCK', 'EXPANDABLE', 'USB CHARGING', 'BUILT-IN SCALE']

const SuitcasePage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<DisplayProduct[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set())
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [selectedWeightRange, setSelectedWeightRange] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null)
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('Sort by: Popular')
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { getProductsByRoute } = useProducts()
  const sales = useActiveSalesMap()
  const topRated = useMemo(() => getTopRatedByCategory('Travel', 8), [])

  useEffect(() => {
    const local = getProductsByRoute('/suitcase')
    const mapped: DisplayProduct[] = local.map(p => ({
      id: p.id, name: p.name, spec: p.spec, material: p.material,
      price: p.price, bulk: p.bulk, bulkQty: p.bulkQty,
      rating: p.rating, reviews: p.reviews, image: p.image, badge: p.badge,
    }))
    setProducts(mapped)
  }, [])

  const parseWeight = (s: string) => { const m = s.match(/[\d.]+/); return m ? parseFloat(m[0]) : 0 }
  const parseCapacity = (s: string) => { const m = s.match(/[\d]+/); return m ? parseInt(m[0]) : 0 }

  function inferSuitcaseSize(p: DisplayProduct): string {
    const spec = `${p.spec} ${p.material}`
    const cap = parseCapacity(spec)
    if (cap <= 40) return 'Carry-On (Up to 40L)'
    if (cap <= 70) return 'Medium (40L - 70L)'
    return 'Large (70L+)'
  }

  function inferWeightRange(p: DisplayProduct): string {
    const spec = `${p.spec} ${p.material}`
    const w = parseWeight(spec)
    if (w < 2.5) return 'Under 2.5 kg (Ultra-light)'
    if (w <= 4.0) return '2.5 kg - 4.0 kg (Standard)'
    return 'Over 4.0 kg (Heavy-duty)'
  }

  function inferSuitcaseFeatures(p: DisplayProduct): string[] {
    const text = `${p.name} ${p.badge} ${p.spec}`.toLowerCase()
    const result: string[] = []
    if (/spinner/i.test(text)) result.push('SPINNER WHEELS')
    if (/tsa/i.test(text)) result.push('TSA LOCK')
    if (/expandable/i.test(text)) result.push('EXPANDABLE')
    if (/usb|charging/i.test(text)) result.push('USB CHARGING')
    if (/scale|built.?in/i.test(text)) result.push('BUILT-IN SCALE')
    return result
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedSizes.size > 0 && !selectedSizes.has(inferSuitcaseSize(p))) return false
      if (selectedMaterials.size > 0) {
        const match = [...selectedMaterials].some(m => p.material.toLowerCase().includes(m.toLowerCase().replace(' / softside', '')))
        if (!match) return false
      }
      if (selectedWeightRange && inferWeightRange(p) !== selectedWeightRange) return false
      if (selectedFeatures.size > 0) {
        const pf = inferSuitcaseFeatures(p)
        const match = [...selectedFeatures].some(f => pf.includes(f))
        if (!match) return false
      }
      if (appliedMinPrice !== null && p.price < appliedMinPrice) return false
      if (appliedMaxPrice !== null && p.price > appliedMaxPrice) return false
      return true
    })
  }, [products, selectedSizes, selectedMaterials, selectedWeightRange, selectedFeatures, appliedMinPrice, appliedMaxPrice])

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts]
    if (sortBy === 'Price: Low to High') arr.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Price: High to Low') arr.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Name: A-Z') arr.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'Name: Z-A') arr.sort((a, b) => b.name.localeCompare(a.name))
    else arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return arr
  }, [filteredProducts, sortBy])

  const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value); else next.add(value)
    setter(next)
  }

  const handleAddToCart = (p: DisplayProduct) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image })
    setJustAdded(prev => new Set(prev).add(p.id))
    setTimeout(() => {
      setJustAdded(prev => {
        const next = new Set(prev)
        next.delete(p.id)
        return next
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter']">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-3 md:px-8 py-6 md:py-10">
        <nav className="flex text-[10px] font-bold uppercase tracking-widest text-[#805030] mb-4 gap-2 items-center">
          <Link to="/" className="hover:text-[#9e3c00]">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span>Travel &amp; Luggage</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#4a2507]">Suitcases</span>
        </nav>

        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-[#4a2507] tracking-tight mb-1 md:mb-2">Wheeled Luggage</h1>
          <p className="text-[#805030] max-w-3xl">Precision-engineered carry-on, medium, and large suitcases for the modern traveler. Lightweight materials, smooth-glide wheels, and TSA-approved security.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-between w-full bg-[#ffede4] px-4 py-3 rounded-xl text-sm font-bold text-[#4a2507]">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-base">filter_list</span> Filters</span>
            <span className="material-symbols-outlined transition-transform" style={{ transform: showFilters ? 'rotate(180deg)' : '' }}>expand_more</span>
          </button>
          <aside className={`w-full lg:w-72 flex-shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#ffede4] p-4 md:p-6 rounded-xl space-y-6 border border-[#dca079]/5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Size
                  {selectedSizes.size > 0 && <button onClick={() => setSelectedSizes(new Set())} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="space-y-3">
                  {sizeLabels.map((size) => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedSizes.has(size)} onChange={() => toggleSet(selectedSizes, size, setSelectedSizes)} className="rounded-sm border-[#9f6b48] text-[#9e3c00] focus:ring-[#ff7936]/20 w-4 h-4" />
                      <span className="text-sm font-medium group-hover:text-[#9e3c00] transition-colors">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Material
                  {selectedMaterials.size > 0 && <button onClick={() => setSelectedMaterials(new Set())} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="space-y-3">
                  {materialLabels.map((mat) => (
                    <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedMaterials.has(mat)} onChange={() => toggleSet(selectedMaterials, mat, setSelectedMaterials)} className="rounded-sm border-[#9f6b48] text-[#9e3c00] focus:ring-[#ff7936]/20 w-4 h-4" />
                      <span className="text-sm font-medium group-hover:text-[#9e3c00] transition-colors">{mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4">Color Palette</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: '#1a1a2e', label: 'Midnight Black' },
                    { color: '#1e3a5f', label: 'Navy Blue' },
                    { color: '#8b0000', label: 'Burgundy' },
                    { color: '#d4a574', label: 'Champagne' },
                    { color: '#2d5016', label: 'Forest Green' },
                  ].map((c) => (
                    <button key={c.label} title={c.label} onClick={() => setSelectedColor(selectedColor === c.color ? null : c.color)} className={`w-6 h-6 rounded-full transition-all hover:ring-2 hover:ring-offset-2 hover:ring-[#9e3c00] ${selectedColor === c.color ? 'ring-2 ring-offset-2 ring-[#9e3c00] scale-110' : ''}`} style={{ backgroundColor: c.color }} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Weight Range
                  {selectedWeightRange && <button onClick={() => setSelectedWeightRange(null)} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="space-y-3">
                  {['Under 2.5 kg (Ultra-light)', '2.5 kg - 4.0 kg (Standard)', 'Over 4.0 kg (Heavy-duty)'].map((w) => (
                    <label key={w} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="weight" checked={selectedWeightRange === w} onChange={() => setSelectedWeightRange(selectedWeightRange === w ? null : w)} className="border-[#9f6b48] text-[#9e3c00] focus:ring-[#ff7936]/20 w-4 h-4" />
                      <span className="text-sm font-medium group-hover:text-[#9e3c00] transition-colors">{w}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4">Wheel Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['Dual Spinner', 'Single Spinner', 'Inline Skate'].map((w) => (
                    <span key={w} className="bg-[#ffd4bb]/50 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#9e3c00] opacity-60 cursor-not-allowed">{w}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Supplier Region
                  {selectedRegion && <button onClick={() => setSelectedRegion('')} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#805030] text-sm pointer-events-none">public</span>
                  <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} className="w-full bg-white border border-[#dca079]/20 rounded-lg text-sm font-medium py-3 pl-9 pr-8 appearance-none cursor-pointer focus:ring-2 focus:ring-[#ff7936]/20 focus:border-[#ff7936] transition-all hover:border-[#ff7936]/50">
                    <option value="">All Regions</option>
                    <option value="Southeast Asia">Southeast Asia</option>
                    <option value="European Union">European Union</option>
                    <option value="North America">North America</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#805030] text-sm pointer-events-none">expand_more</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Special Features
                  {selectedFeatures.size > 0 && <button onClick={() => setSelectedFeatures(new Set())} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {featureLabels.map((f) => (
                    <span key={f} onClick={() => toggleSet(selectedFeatures, f, setSelectedFeatures)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold text-center cursor-pointer transition-colors ${selectedFeatures.has(f) ? 'bg-[#9e3c00] text-white' : 'bg-[#ffd4bb]/50 text-[#9e3c00] hover:bg-[#ffd4bb]'}`}>{f}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min $" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-white rounded-lg border-none py-2 px-3 text-xs focus:ring-2 focus:ring-[#ff7936]/20" />
                    <input type="number" placeholder="Max $" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-white rounded-lg border-none py-2 px-3 text-xs focus:ring-2 focus:ring-[#ff7936]/20" />
                  </div>
                  <button onClick={() => { setAppliedMinPrice(minPrice ? parseFloat(minPrice) : null); setAppliedMaxPrice(maxPrice ? parseFloat(maxPrice) : null) }} className="w-full bg-[#9e3c00] text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">Apply</button>
                </div>
              </div>
            </div>

            <div className="bg-[#9e3c00] rounded-xl p-6 text-[#fff0ea] relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Wholesale Tier 3</h4>
                <p className="text-sm opacity-80 mb-4">Save 15% on bulk suitcase orders over 500 units this month.</p>
                <button className="bg-white text-[#9e3c00] px-4 py-2 rounded-full text-xs font-black">GET COUPON</button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-semibold text-[#805030]">{filteredProducts.length === 0 ? 'No items match your filters' : `Showing 1-${Math.min(filteredProducts.length, 9)} of ${filteredProducts.length} items`}</p>
              <div className="flex items-center gap-2">
                <CustomDropdown
                  options={['Sort by: Popular', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A']}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16 text-[#805030]">
                  <span className="material-symbols-outlined text-4xl mb-3">search_off</span>
                  <p className="font-bold text-sm text-[#4a2507]">No products match your filters</p>
                  <p className="text-xs mt-1">Try adjusting or clearing the filters above.</p>
                </div>
              )}
              {sortedProducts.map((p) => {
                const sale = sales[p.id] || null
                const isFav = isWishlisted(p.id)
                const added = justAdded.has(p.id)
                return (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-[#dca079]/10 group flex flex-col">
                   <Link to={`/product/${p.id}`} className="relative aspect-square bg-[#fff4f0] overflow-hidden block">
                    <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.image} alt={p.name} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
                    {p.badge && <div className="absolute bottom-2 left-2 bg-[#004be3] text-[#f2f1ff] text-[10px] font-black px-2 py-0.5 rounded">{p.badge}</div>}
                    {sale && <div className="absolute top-2 right-2"><DealTag sale={sale} compact /></div>}
                    <div className="absolute inset-0 bg-[#9e3c00]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={(e) => { e.preventDefault(); handleAddToCart(p) }} className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${added ? 'text-green-600' : 'text-[#9e3c00]'}`}>
                        <span className="material-symbols-outlined text-lg md:text-[24px]">{added ? 'check' : 'add_shopping_cart'}</span>
                      </button>
                      <button onClick={(e) => { e.preventDefault(); toggleWishlist({ id: p.id, name: p.name, price: sale ? sale.sale_price : p.price, image: p.image, badge: p.badge }) }} className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 ${isFav ? 'text-[#b9002c]' : 'text-[#9e3c00]'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                    </div>
                  </Link>
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <h3 className="font-bold text-sm text-[#4a2507] group-hover:text-[#9e3c00] transition-colors leading-tight">{p.name}</h3>
                      <p className="text-[10px] text-[#805030]">{p.spec || p.material}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-[9px] font-bold bg-[#ffede4] text-[#805030] px-1.5 py-0.5 rounded">{p.material}</span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1 mb-2">
                        {sale ? (
                          <DealPrice sale={sale} originalPrice={sale.original_price} />
                        ) : (
                          <span className="text-xl font-black text-[#9e3c00]">${p.price.toFixed(0)}</span>
                        )}
                      </div>
                      <div className="bg-[#c6d0ff]/30 p-1.5 rounded-lg mb-2">
                        <div className="flex justify-between text-[9px] text-[#003ab5] font-bold">
                          <span>Bulk ({p.bulkQty})</span>
                          <span>{p.bulk}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-bold text-xs">{p.rating}</span>
                        <span className="text-[#805030] text-[10px]">({p.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>

            <div className="flex justify-center items-center gap-3 mt-10">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#9e3c00] hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#9e3c00] text-white font-bold text-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#ffdcc7] text-sm">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#ffdcc7] text-sm">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#9e3c00] hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      {topRated.length > 0 && (
        <div className="px-3 md:px-8 lg:px-12">
          <RecommendedProducts
            title="Top Rated Luggage"
            viewAllLink="/suitcase"
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

export default SuitcasePage
