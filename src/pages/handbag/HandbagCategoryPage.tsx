import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../../components/layout/AppHeader'
import Footer from '../../components/layout/Footer'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useProducts } from '../../contexts/ProductContext'
import { getTopRatedByCategory, getTopRated } from '../../data/recommendations'
import RecommendedProducts from '../../components/RecommendedProducts'
import CustomDropdown from '../../components/CustomDropdown'
import { useActiveSalesMap } from '../../services/salePrices'
import { DealPrice, DealTag } from '../../components/DealPrice'

export interface CategoryProduct {
  id: string; name: string; spec: string; material: string; closure: string
  price: number; bulk: string; bulkQty: string; rating: number; reviews: number
  image: string; badge: string
}

type Product = CategoryProduct

export interface CategoryConfig {
  title: string; description: string; route: string; breadcrumbLabel: string
  parentLabel?: string
  parentRoute?: string
  products?: CategoryProduct[]
}

const DEFAULT_PARENT_LABEL = 'Handbags & Fashion'

const routeToCategory: Record<string, string> = {
  '/tote-bag': 'Luxury', '/shoulder-bag': 'Luxury', '/crossbody-bag': 'Luxury',
  '/satchel': 'Luxury', '/bucket-bag': 'Luxury', '/clutch': 'Luxury',
  '/wristlet': 'Luxury', '/envelope-bag': 'Luxury', '/box-bag': 'Luxury',
  '/saddle-bag': 'Luxury', '/baguette-bag': 'Luxury', '/camera-bag-fashion': 'Luxury',
  '/kiss-lock-bag': 'Luxury',
  '/daypack': 'Backpack', '/laptop-backpack': 'Backpack', '/rucksack': 'Backpack',
  '/drawstring-backpack': 'Backpack', '/mini-backpack': 'Backpack',
  '/anti-theft-backpack': 'Backpack', '/clear-backpack': 'Backpack',
  '/travel-backpack': 'Backpack', '/rolling-backpack': 'Backpack', '/hiking-backpack': 'Backpack',
  '/duffel-bag': 'Travel', '/weekender-bag': 'Travel', '/garment-bag': 'Travel',
  '/toiletry-bag': 'Travel', '/makeup-bag': 'Travel',
  '/briefcase': 'School', '/messenger-bag': 'School', '/laptop-bag': 'School',
  '/portfolio': 'School', '/backpack-school': 'School', '/teacher-bag': 'School',
  '/handwoven-bags': 'Handcrafted', '/embroidered-totes': 'Handcrafted',
  '/leather-craft': 'Handcrafted', '/beaded-clutches': 'Handcrafted',
  '/macrame-knotwork': 'Handcrafted', '/artisan-patchwork': 'Handcrafted',
  '/diaper-bags': 'Kids', '/kids-backpacks': 'Kids', '/baby-changing-kits': 'Kids',
  '/toddler-totes': 'Kids', '/kids-lunch-bags': 'Kids', '/baby-bottle-carriers': 'Kids',
  '/waist-bag': 'Accessories', '/sling-bag': 'Accessories', '/chest-rig': 'Accessories',
  '/canvas-tote': 'Accessories', '/string-bag': 'Accessories', '/cooler-bag': 'Accessories',
  '/foldable-bag': 'Accessories',
  '/camera-bag': 'Business', '/drone-bag': 'Business', '/tool-bag': 'Business',
  '/first-aid-bag': 'Business', '/craft-bag': 'Business', '/cash-bag': 'Business',
  '/security-bag': 'Business', '/lunch-bag': 'Business',
  '/gym-bag': 'Sports', '/drawstring-sack-pack': 'Sports', '/yoga-mat-bag': 'Sports',
  '/swim-bag': 'Sports', '/ski-boot-bag': 'Sports', '/golf-bag': 'Sports',
  '/tactical-bag': 'Sports', '/hydration-pack': 'Sports', '/cycling-bag': 'Sports',
  '/crossfit-gym': 'Sports', '/running': 'Sports', '/swimming': 'Sports',
  '/tennis': 'Sports', '/outdoor': 'Sports',
}

const sizeLabels = ['Small', 'Medium', 'Large'] as const
const materialLabels = ['Leather', 'Vegan Leather', 'Canvas', 'Suede', 'Fabric']
const closureLabels = ['Zip', 'Flap', 'Drawstring', 'Magnetic', 'Kiss-lock']
const featureLabels = ['ADJUSTABLE STRAP', 'RFID BLOCKING', 'WATER RESISTANT', 'DETACHABLE STRAP', 'LINED INTERIOR']

function inferSize(p: Product): string {
  const low = p.name.toLowerCase()
  if (low.includes('mini') || low.includes('small') || low.includes('clutch') || low.includes('wristlet')) return 'Small'
  if (low.includes('large') || low.includes('max') || low.includes('xl') || low.includes('weekender') || low.includes('duffel')) return 'Large'
  if (p.price < 150) return 'Small'
  if (p.price >= 400) return 'Large'
  return 'Medium'
}

function inferFeatures(p: Product): string[] {
  const text = `${p.name} ${p.spec}`.toLowerCase()
  const result: string[] = []
  if (/adjustable/i.test(text)) result.push('ADJUSTABLE STRAP')
  if (/rfid/i.test(text)) result.push('RFID BLOCKING')
  if (/waterproof|water.?resist/i.test(text)) result.push('WATER RESISTANT')
  if (/detachable/i.test(text)) result.push('DETACHABLE STRAP')
  if (/lined|interior/i.test(text)) result.push('LINED INTERIOR')
  return result
}

const HandbagCategoryPage: React.FC<{ config: CategoryConfig }> = ({ config }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set())
  const [selectedClosures, setSelectedClosures] = useState<Set<string>>(new Set())
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null)
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('Sort by: Popular')
  const pageSize = 9
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const sales = useActiveSalesMap()
  const { getProductsByRoute } = useProducts()
  const { title, description, breadcrumbLabel, route } = config
const parentLabel = config.parentLabel || DEFAULT_PARENT_LABEL
  // The per-category hub pages were removed, so a parent only renders as a link
  // when that page actually still exists; otherwise it is plain breadcrumb text.
  const parentRoute = config.parentRoute
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(getProductsByRoute(route))
    setPage(1)
    const handler = () => {
      setProducts(getProductsByRoute(route))
      setPage(1)
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [route])

  useEffect(() => { setPage(1) }, [selectedSizes, selectedMaterials, selectedClosures, selectedFeatures, selectedColor, selectedRegion, appliedMinPrice, appliedMaxPrice])

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedSizes.size > 0 && !selectedSizes.has(inferSize(p))) return false
      if (selectedMaterials.size > 0) {
        const match = [...selectedMaterials].some(m => p.material.toLowerCase().includes(m.toLowerCase()))
        if (!match) return false
      }
      if (selectedClosures.size > 0 && !selectedClosures.has(p.closure)) return false
      if (selectedFeatures.size > 0) {
        const productFeatures = inferFeatures(p)
        const match = [...selectedFeatures].some(f => productFeatures.includes(f))
        if (!match) return false
      }
      if (appliedMinPrice !== null && p.price < appliedMinPrice) return false
      if (appliedMaxPrice !== null && p.price > appliedMaxPrice) return false
      return true
    })
  }, [products, selectedSizes, selectedMaterials, selectedClosures, selectedFeatures, appliedMinPrice, appliedMaxPrice])

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts]
    if (sortBy === 'Price: Low to High') arr.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Price: High to Low') arr.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Name: A-Z') arr.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'Name: Z-A') arr.sort((a, b) => b.name.localeCompare(a.name))
    else arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return arr
  }, [filteredProducts, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize))
  const pageProducts = sortedProducts.slice((page - 1) * pageSize, page * pageSize)
  const hasCatalog = products.length > 0
  const hasActiveFilters = selectedSizes.size > 0 || selectedMaterials.size > 0
    || selectedClosures.size > 0 || selectedFeatures.size > 0
    || appliedMinPrice !== null || appliedMaxPrice !== null

  const toggleSet = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(value)) next.delete(value); else next.add(value)
    setter(next)
  }

  const clearAllFilters = () => {
    setSelectedSizes(new Set())
    setSelectedMaterials(new Set())
    setSelectedClosures(new Set())
    setSelectedFeatures(new Set())
    setSelectedColor(null)
    setSelectedRegion('')
    setMinPrice('')
    setMaxPrice('')
    setAppliedMinPrice(null)
    setAppliedMaxPrice(null)
  }

  const parentCategory = routeToCategory[route]
  const topRated = useMemo(() => {
    if (parentCategory) return getTopRatedByCategory(parentCategory, 8)
    return getTopRated(8)
  }, [parentCategory])

  const handleAddToCart = (p: Product) => {
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
          {parentRoute ? (
            <Link to={parentRoute} className="hover:text-[#9e3c00]">{parentLabel}</Link>
          ) : (
            <span>{parentLabel}</span>
          )}
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#4a2507]">{breadcrumbLabel}</span>
        </nav>

        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-[#4a2507] tracking-tight mb-1 md:mb-2">{title}</h1>
          <p className="text-[#805030] max-w-3xl">{description}</p>
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
                    { color: '#1a1a2e', label: 'Black' },
                    { color: '#8b4513', label: 'Brown' },
                    { color: '#800020', label: 'Burgundy' },
                    { color: '#d4a574', label: 'Beige' },
                    { color: '#2d5016', label: 'Olive' },
                    { color: '#4a0e4e', label: 'Plum' },
                  ].map((c) => (
                    <button key={c.label} title={c.label} onClick={() => setSelectedColor(selectedColor === c.color ? null : c.color)} className={`w-6 h-6 rounded-full transition-all hover:ring-2 hover:ring-offset-2 hover:ring-[#9e3c00] ${selectedColor === c.color ? 'ring-2 ring-offset-2 ring-[#9e3c00] scale-110' : ''}`} style={{ backgroundColor: c.color }} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Closure Type
                  {selectedClosures.size > 0 && <button onClick={() => setSelectedClosures(new Set())} className="text-[9px] text-[#b9002c] font-bold hover:underline">clear</button>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {closureLabels.map((c) => (
                    <span key={c} onClick={() => toggleSet(selectedClosures, c, setSelectedClosures)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${selectedClosures.has(c) ? 'bg-[#9e3c00] text-white' : 'bg-[#ffd4bb]/50 text-[#9e3c00] hover:bg-[#ffd4bb]'}`}>{c}</span>
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
                    <option value="Italy">Italy</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Southeast Asia">Southeast Asia</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#805030] text-sm pointer-events-none">expand_more</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-4 flex justify-between items-center">
                  Features
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
                <h4 className="text-lg font-bold mb-2">Wholesale Tier 2</h4>
                <p className="text-sm opacity-80 mb-4">Save 12% on bulk orders over 250 units this quarter.</p>
                <button className="bg-white text-[#9e3c00] px-4 py-2 rounded-full text-xs font-black">GET COUPON</button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-semibold text-[#805030]">{!hasCatalog ? 'No products in this category yet' : filteredProducts.length === 0 ? 'No items match your filters' : `Showing ${Math.min(filteredProducts.length, (page - 1) * pageSize + 1)}-${Math.min(page * pageSize, filteredProducts.length)} of ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`}</p>
              <div className="flex items-center gap-2">
                <CustomDropdown
                  options={['Sort by: Popular', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A']}
                  value={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {pageProducts.length === 0 && (
                <div className="col-span-full text-center py-16 text-[#805030]">
                  <span className="material-symbols-outlined text-4xl mb-3">{hasCatalog ? 'search_off' : 'inventory_2'}</span>
                  <p className="font-bold text-sm text-[#4a2507]">{hasCatalog ? 'No products match your filters' : 'No products in this category yet'}</p>
                  <p className="text-xs mt-1">{hasCatalog ? 'Try adjusting or clearing the filters above.' : 'Products added to this category will appear here automatically.'}</p>
                  {hasCatalog && hasActiveFilters && (
                    <button onClick={clearAllFilters} className="mt-4 text-xs font-bold text-[#9e3c00] underline underline-offset-2 hover:text-[#805030] transition-colors">
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
              {pageProducts.map((p) => {
                const isFav = isWishlisted(p.id)
                const added = justAdded.has(p.id)
                const sale = sales[p.id] || null
                const displayPrice = sale ? sale.sale_price : p.price
                return (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-[#dca079]/10 group flex flex-col">
                  <Link to={`/product/${p.id}`} className="relative aspect-square bg-[#fff4f0] overflow-hidden block">
                    <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.image} alt={p.name} />
                    {sale && (
                      <div className="absolute top-2 left-2 z-10">
                        <DealTag sale={sale} compact />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-[#004be3] text-[#f2f1ff] text-[10px] font-black px-2 py-0.5 rounded">{p.badge}</div>
                    <div className="absolute inset-0 bg-[#9e3c00]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={(e) => { e.preventDefault(); handleAddToCart(p) }} className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${added ? 'text-green-600' : 'text-[#9e3c00]'}`}>
                        <span className="material-symbols-outlined text-lg md:text-[24px]">{added ? 'check' : 'add_shopping_cart'}</span>
                      </button>
                      <button onClick={(e) => { e.preventDefault(); toggleWishlist({ id: p.id, name: p.name, price: displayPrice, image: p.image, badge: sale ? (sale.sale_type === 'flash' ? 'Flash Deal' : 'Campaign') : p.badge }) }} className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 ${isFav ? 'text-[#b9002c]' : 'text-[#9e3c00]'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                      </button>
                    </div>
                  </Link>
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <div className="mb-2">
                      <h3 className="font-bold text-sm text-[#4a2507] group-hover:text-[#9e3c00] transition-colors leading-tight">{p.name}</h3>
                      <p className="text-[10px] text-[#805030]">{p.spec}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="text-[9px] font-bold bg-[#ffede4] text-[#805030] px-1.5 py-0.5 rounded">{p.material}</span>
                      <span className="text-[9px] font-bold bg-[#ffede4] text-[#805030] px-1.5 py-0.5 rounded">{p.closure}</span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1 mb-2">
                        {sale ? (
                          <DealPrice sale={sale} originalPrice={p.price} />
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

            {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6 md:mt-10">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#9e3c00] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-[#9e3c00] text-white' : 'bg-[#ffede4] text-[#805030] hover:bg-[#ffdcc7]'}`}>
                {p}
              </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#ffede4] text-[#805030] hover:bg-[#9e3c00] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            )}
          </div>
        </div>
      </main>

      {topRated.length > 0 && (
        <div className="px-3 md:px-8 lg:px-12">
          <RecommendedProducts
            title={`Top Rated in ${title}`}
            viewAllLink={route}
            items={topRated}
            maxColumns={4}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}

export default HandbagCategoryPage
