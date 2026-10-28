import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { getProductById, updateProductInLookup, Product, VariantGroup } from '../data/productLookup'
import { getStoredProducts } from '../services/localProducts'
import type { ReviewItem } from '../services/localProducts'
import { getRecommendedProducts } from '../data/recommendations'
import RecommendedProductsSection from '../components/RecommendedProducts'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useProducts } from '../contexts/ProductContext'
import { getActiveSale, formatMoney } from '../services/salePrices'
import { DealPrice, DealTag } from '../components/DealPrice'

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined ${sizeClass} ${i < Math.round(rating) ? 'text-amber-400' : 'text-[#dca079]/40'}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  )
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop'

const COLOR_NAME_MAP: Record<string, string> = {
  '#1a1a1a': 'Black', '#8B4513': 'Brown', '#D2B48C': 'Tan', '#F5F5DC': 'Beige',
  '#FFFFFF': 'White', '#808080': 'Gray', '#000080': 'Navy', '#0000FF': 'Blue',
  '#FF0000': 'Red', '#800020': 'Burgundy', '#FFC0CB': 'Pink', '#800080': 'Purple',
  '#008000': 'Green', '#808000': 'Olive', '#008080': 'Teal', '#FFD700': 'Gold',
  '#C0C0C0': 'Silver', '#C19A6B': 'Camel', '#DE5D83': 'Blush', '#98FF98': 'Mint',
  'black': 'Black', 'brown': 'Brown', 'tan': 'Tan', 'beige': 'Beige',
  'white': 'White', 'gray': 'Gray', 'navy': 'Navy', 'blue': 'Blue',
  'red': 'Red', 'burgundy': 'Burgundy', 'pink': 'Pink', 'purple': 'Purple',
  'green': 'Green', 'olive': 'Olive', 'teal': 'Teal', 'gold': 'Gold',
  'silver': 'Silver', 'camel': 'Camel', 'blush': 'Blush', 'mint': 'Mint',
}

const ProductImages: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [selected, setSelected] = useState(0)
  const [imgError, setImgError] = useState(false)
  const safeImages = images.filter(Boolean).length > 0 ? images : [FALLBACK_IMG]
  const currentSrc = imgError ? FALLBACK_IMG : safeImages[selected] || safeImages[0]

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 order-2 md:order-2 aspect-[4/5] bg-[#ffede4] rounded-xl overflow-hidden">
        <img loading="lazy" src={currentSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="hidden md:flex md:flex-col gap-2 overflow-y-auto no-scrollbar max-h-[520px] order-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => { setSelected(i); setImgError(false) }}
              className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === selected ? 'border-[#ff7936] shadow-md ring-2 ring-[#ff7936]/20' : 'border-[#dca079]/20 hover:border-[#dca079]/60'
              }`}
            >
              <img loading="lazy" src={img} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const VariantSelector: React.FC<{
  group: VariantGroup
  selected: string
  onChange: (value: string) => void
}> = ({ group, selected, onChange }) => {
  const isColor = group.name.toLowerCase() === 'color' || group.name.toLowerCase() === 'colour'

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#805030] uppercase tracking-wider">{group.name}</span>
        <span className="text-sm font-semibold text-[#4a2507]">{group.options.find(o => o.value === selected)?.label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              disabled={opt.available === false}
              className={`
                relative transition-all duration-200
                ${isColor
                  ? `w-10 h-10 rounded-full ${isSelected ? 'ring-2 ring-[#ff7936] ring-offset-2 scale-110' : 'ring-1 ring-[#dca079]/30 hover:ring-[#dca079]'} ${opt.available === false ? 'opacity-30 line-through cursor-not-allowed' : 'cursor-pointer'}`
                  : `px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-[#ff7936] bg-[#fff4f0] text-[#4a2507] font-bold shadow-sm'
                        : 'border-[#dca079]/30 text-[#805030] hover:border-[#dca079] hover:bg-[#fff4f0]/50'
                    } ${opt.available === false ? 'opacity-30 line-through cursor-not-allowed' : 'cursor-pointer'}`
                }
              `}
              title={opt.label}
            >
              {isColor ? (
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: opt.value }}
                />
              ) : (
                opt.label
              )}
              {isSelected && isColor && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-sm">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const QuantitySelector: React.FC<{
  value: number
  onChange: (val: number) => void
  max?: number
}> = ({ value, onChange, max = 999 }) => (
  <div className="flex items-center border border-[#dca079]/30 rounded-lg overflow-hidden">
    <button
      onClick={() => onChange(Math.max(1, value - 1))}
      className="w-11 h-11 flex items-center justify-center bg-[#fff4f0] hover:bg-[#ffe3d3] transition-colors text-[#4a2507] font-bold border-r border-[#dca079]/30 active:bg-[#ff7936]/10"
    >
      -
    </button>
    <span className="w-16 h-11 flex items-center justify-center font-bold text-[#4a2507] bg-white text-sm">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="w-11 h-11 flex items-center justify-center bg-[#fff4f0] hover:bg-[#ffe3d3] transition-colors text-[#4a2507] font-bold border-l border-[#dca079]/30 active:bg-[#ff7936]/10"
    >
      +
    </button>
  </div>
)

const WriteReviewForm: React.FC<{ onSubmit: (review: { author: string; rating: number; text: string }) => void }> = ({ onSubmit }) => {
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !text.trim()) return
    onSubmit({ author: author.trim(), rating, text: text.trim() })
    setAuthor('')
    setRating(5)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#fff4f0] rounded-xl p-6 mb-8 border border-[#dca079]/10">
      <h4 className="font-bold text-[#4a2507] text-lg mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#ff7936]">rate_review</span>
        Write a Review
      </h4>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Name</label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full bg-white border border-[#dca079]/30 rounded-lg px-4 py-2.5 text-sm text-[#4a2507] focus:ring-2 focus:ring-[#ff7936] focus:border-transparent outline-none transition-shadow"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all hover:scale-110"
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    star <= (hoverRating || rating) ? 'text-amber-400' : 'text-[#dca079]/40'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Review</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full bg-white border border-[#dca079]/30 rounded-lg px-4 py-2.5 text-sm text-[#4a2507] focus:ring-2 focus:ring-[#ff7936] focus:border-transparent outline-none resize-none transition-shadow"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Submit Review
        </button>
      </div>
    </form>
  )
}

const ReviewsSection: React.FC<{
  productRating: number
  productReviewCount: number
  reviews: ReviewItem[]
  onReviewAdded?: (review: { author: string; rating: number; text: string }) => void
}> = ({ productRating, productReviewCount, reviews: initialReviews, onReviewAdded }) => {
  const [showForm, setShowForm] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)

  useEffect(() => { setReviews(initialReviews) }, [initialReviews])

  const handleNewReview = (review: { author: string; rating: number; text: string }) => {
    onReviewAdded?.(review)
    setShowForm(false)
  }

  const starBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const r of reviews) {
      const star = Math.round(r.rating)
      if (star >= 1 && star <= 5) counts[star]++
    }
    const total = reviews.length
    if (total === 0) return [5, 4, 3, 2, 1].map(s => ({ star: s, pct: 0 }))
    return [5, 4, 3, 2, 1].map((star: number) => ({ star, pct: Math.round((counts[star] / total) * 100) }))
  }, [reviews])

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-[#dca079]/10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="text-center flex-shrink-0">
            <p className="text-4xl font-black text-[#4a2507]">{productRating}</p>
            <StarRating rating={productRating} size="sm" />
            <p className="text-xs text-[#805030] mt-1">{productReviewCount.toLocaleString()} reviews</p>
          </div>
          <div className="flex-1 space-y-1 min-w-[160px]">
            {starBreakdown.map(({ star, pct }: { star: number; pct: number }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right text-[#805030]">{star} ★</span>
                <div className="flex-1 h-2.5 bg-[#ffe3d3] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-[#805030]">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex-shrink-0 bg-[#ff7936] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#9e3c00] transition-colors flex items-center gap-2 shadow-sm w-full md:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-base">{showForm ? 'close' : 'rate_review'}</span>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && <WriteReviewForm onSubmit={handleNewReview} />}

      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12 text-[#805030]">
          <span className="material-symbols-outlined text-4xl mb-2">rate_review</span>
          <p className="text-sm font-medium">No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-[#dca079]/10 last:border-0 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#4a2507]">{review.author}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-[10px] text-[#805030]">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#805030] leading-relaxed ml-13 pl-1">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description')
  const [addedToCart, setAddedToCart] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [dynamicRating, setDynamicRating] = useState<number | null>(null)
  const [dynamicReviewCount, setDynamicReviewCount] = useState<number | null>(null)
  const { addReview, getReviews } = useProducts()
  const [sellerName, setSellerName] = useState('Great Wall Bags')
  const [sellerId, setSellerId] = useState('')
  const [sellerInitials, setSellerInitials] = useState('GW')
  const [sellerRole, setSellerRole] = useState('Verified Wholesale Supplier')
  const [sellerOrders, setSellerOrders] = useState('12,400+')
  const [sellerRating, setSellerRating] = useState('4.8')

  useEffect(() => {
    setLoading(true)
    const productId = id || ''
    const localProducts = getStoredProducts()
    const local = localProducts.find(p => p.id === productId)
    const localReviews = getReviews(productId)
    const hasLocalReviews = localReviews.length > 0
    setReviews(hasLocalReviews ? localReviews : [])

    const found = getProductById(productId)
    if (found && !hasLocalReviews) {
      setProduct(found)
      setDynamicRating(null)
      setDynamicReviewCount(null)
      setSellerName('Great Wall Bags')
      setSellerId('')
      setSellerInitials('GW')
      setSellerRole('Verified Wholesale Supplier')
      setSellerOrders('12,400+')
      setSellerRating('4.8')
      if (found?.variants) {
        const initial: Record<string, string> = {}
        found.variants.forEach(vg => {
          const available = vg.options.find(o => o.available !== false)
          if (available) initial[vg.name] = available.value
        })
        setSelectedVariants(initial)
      }
    } else if (local) {
      const mappedVariants = local.variants?.map(v => ({
        name: v.name,
        options: v.options.split(',').map(o => {
          const raw = o.trim()
          const isColor = v.name.toLowerCase() === 'color' || v.name.toLowerCase() === 'colour'
          return {
            value: isColor ? raw : raw.toLowerCase().replace(/\s+/g, '-'),
            label: isColor ? (COLOR_NAME_MAP[raw] || raw) : raw,
          }
        })
      }))
      const effectiveRating = hasLocalReviews
        ? localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length
        : local.rating
      setProduct({
        id: local.id,
        name: local.name,
        category: local.category,
        price: local.price,
        description: local.spec,
        details: [`Material: ${local.material}`, `Closure: ${local.closure}`],
        images: [local.image || FALLBACK_IMG],
        rating: Math.round(effectiveRating * 10) / 10,
        reviewCount: hasLocalReviews ? localReviews.length : local.reviews,
        stock: local.stock,
        badge: local.badge || undefined,
        material: local.material,
        bulk: local.bulk,
        bulkQty: local.bulkQty,
        variants: mappedVariants,
      })
      setDynamicRating(hasLocalReviews ? Math.round(effectiveRating * 10) / 10 : null)
      setDynamicReviewCount(hasLocalReviews ? localReviews.length : null)
      if (mappedVariants) {
        const initial: Record<string, string> = {}
        mappedVariants.forEach(vg => {
          const first = vg.options[0]
          if (first) initial[vg.name] = first.value
        })
        setSelectedVariants(initial)
      }
      if (local.addedBy) {
        const name = local.addedBy.name
        const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        setSellerName(name)
        setSellerId(local.addedBy.id || '')
        setSellerInitials(initials)
        setSellerRole(local.addedBy.role === 'seller' ? 'Verified Seller'
          : local.addedBy.role === 'supplier' ? 'Verified Supplier'
          : local.addedBy.role === 'manufacturer' ? 'Verified Manufacturer'
          : 'Verified Partner')
        setSellerOrders('50+')
        setSellerRating('4.5')
      } else {
        setSellerName('Great Wall Bags')
        setSellerId('')
        setSellerInitials('GW')
        setSellerRole('Verified Wholesale Supplier')
        setSellerOrders('12,400+')
        setSellerRating('4.8')
      }
    } else {
      setProduct(null)
    }
    setLoading(false)
    setAddedToCart(false)
    setQuantity(1)
    setActiveTab('description')
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-[#ff7936] border-t-transparent rounded-full" />
          <p className="text-sm text-[#805030] animate-pulse">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center">
        <div className="text-center px-4">
          <span className="material-symbols-outlined text-6xl text-[#dca079]">search_off</span>
          <h2 className="text-2xl font-bold text-[#4a2507] mt-4">Product Not Found</h2>
          <p className="text-[#805030] mt-2 mb-6">This product may have been removed or is no longer available.</p>
          <Link to="/" className="inline-block bg-[#ff7936] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#9e3c00] transition-colors shadow-lg shadow-[#ff7936]/20">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const recommendations = getRecommendedProducts(product.id, product.category, 8)

  const variantPriceModifier = product.variants?.reduce((total, vg) => {
    const sel = selectedVariants[vg.name]
    const opt = vg.options.find(o => o.value === sel)
    return total + (opt?.priceModifier || 0)
  }, 0) || 0

  const liveSale = getActiveSale(product.id)
  const baseDisplayPrice = liveSale ? liveSale.sale_price : product.price
  const currentPrice = baseDisplayPrice + variantPriceModifier
  const displayOriginal = liveSale ? liveSale.original_price + variantPriceModifier : product.originalPrice

  const handleVariantChange = (groupName: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupName]: value }))
  }

  const isOwnProduct = !!user && sellerId !== '' && sellerId === user.id

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: displayOriginal,
      image: product.images[0] || ''
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      originalPrice: displayOriginal,
      image: product.images[0] || ''
    })
    navigate('/checkout/shipping')
  }

  const handleReviewAdded = (review: { author: string; rating: number; text: string }) => {
    const updated = addReview(product.id, review)
    if (updated) {
      const newReviews = getReviews(product.id)
      setReviews(newReviews)
      setProduct(prev => prev ? { ...prev, rating: updated.rating, reviewCount: updated.reviews } : prev)
    }
  }

  const displayedRating = dynamicRating ?? product.rating
  const displayedReviewCount = dynamicReviewCount ?? product.reviewCount

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] selection:bg-[#ff7936] selection:text-white">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-8 pb-36 md:pb-16">
        {/* Breadcrumbs */}
        <nav className="flex text-[11px] font-medium uppercase tracking-widest text-[#805030] mb-6 gap-2 items-center flex-wrap">
          <Link to="/" className="hover:text-[#ff7936] transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <Link to={`/${product.category.toLowerCase()}`} className="hover:text-[#ff7936] transition-colors">{product.category}</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#4a2507] truncate max-w-[250px] font-semibold">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12">
          {/* Left - Images */}
          <div className="lg:sticky lg:top-24 self-start">
            <ProductImages images={product.images} name={product.name} />
          </div>

          {/* Right - Product Info */}
          <div className="space-y-5">
            {/* Title & Badge */}
            <div>
              {product.badge && (
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase mb-3 ${
                  product.badgeColor === 'tertiary' ? 'bg-[#b9002c] text-white' : 'bg-[#ff7936] text-white'
                }`}>
                  {product.badge}
                </span>
              )}
              {liveSale && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <DealTag sale={liveSale} />
                  <span className="text-[10px] font-bold text-[#b9002c] bg-[#b9002c]/5 px-2 py-1 rounded-sm uppercase">-{Math.round((1 - liveSale.sale_price / liveSale.original_price) * 100)}%</span>
                  {liveSale.ends_at && (
                    <span className="text-[10px] font-bold text-[#805030] uppercase">
                      Ends {new Date(liveSale.ends_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#4a2507] leading-tight">{product.name}</h1>
                {user?.email === 'dev@hobags.com' && (
                  <button onClick={() => { setEditing(true); setEditForm({ ...product }) }} className="mt-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ffede4] transition-colors flex-shrink-0 opacity-60 hover:opacity-100" title="Edit product">
                    <span className="material-symbols-outlined text-[18px] text-[#805030]">edit</span>
                  </button>
                )}
              </div>
              {product.subtitle && (
                <p className="text-sm text-[#805030] mt-1.5">{product.subtitle}</p>
              )}
              {product.model && (
                <p className="text-xs text-[#805030]/60 mt-1 font-mono">Model: {product.model}</p>
              )}
            </div>

            {/* Rating + Review Count */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={displayedRating} size="md" />
              <span className="text-sm font-bold text-[#4a2507]">{displayedRating.toFixed(1)}</span>
              <button onClick={() => setActiveTab('reviews')} className="text-xs text-[#805030] hover:text-[#ff7936] underline underline-offset-2 transition-colors">
                {displayedReviewCount.toLocaleString()} ratings
              </button>
              <span className="text-[#dca079]/40">|</span>
              <span className="text-xs text-[#805030]">{displayedReviewCount > 1000 ? '1K+' : displayedReviewCount}+ sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 bg-[#ffede4] px-4 py-3 rounded-xl">
              {liveSale ? (
                <DealPrice sale={liveSale} originalPrice={displayOriginal} size="lg" />
              ) : (
                <span className="text-3xl md:text-4xl font-black text-[#ff7936]">{formatMoney(currentPrice)}</span>
              )}
              {!liveSale && product.originalPrice && product.originalPrice > currentPrice && (
                <>
                  <span className="text-lg text-[#805030] line-through">{formatMoney(product.originalPrice)}</span>
                  <span className="text-xs font-bold text-[#b9002c] bg-[#b9002c]/10 px-2.5 py-0.5 rounded-full">
                    -{Math.round((1 - currentPrice / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
              {product.minOrder && (
                <span className="text-[10px] text-[#805030] ml-auto">Min: {product.minOrder} pcs</span>
              )}
            </div>

            {/* Stock + Best Seller */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className={`flex items-center gap-1.5 ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
              {product.verified && (
                <span className="text-[#004be3] font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Verified Seller
                </span>
              )}
              {product.isBestSeller && (
                <span className="text-[#ff7936] font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  Best Seller
                </span>
              )}
            </div>

            {/* About this item - Amazon style */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-[#dca079]/10">
                <h3 className="text-sm font-bold text-[#4a2507] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ff7936] text-base">checklist</span>
                  About this item
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#805030]">
                      <span className="text-[#ff7936] mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Origin & Material */}
            {(product.origin || product.material || product.weight || product.dimensions) && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#805030]">
                {product.origin && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#ff7936]">location_on</span>
                    <span className="font-medium">{product.origin}</span>
                  </span>
                )}
                {product.material && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#ff7936]">colorize</span>
                    <span className="font-medium">{product.material}</span>
                  </span>
                )}
                {product.weight && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#ff7936]">weight</span>
                    <span className="font-medium">{product.weight}</span>
                  </span>
                )}
                {product.dimensions && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#ff7936]">straighten</span>
                    <span className="font-medium">{product.dimensions}</span>
                  </span>
                )}
              </div>
            )}

            <hr className="border-[#dca079]/20" />

            {/* Variants - up to 3 */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-5">
                {product.variants.map((vg) => (
                  <VariantSelector
                    key={vg.name}
                    group={vg}
                    selected={selectedVariants[vg.name] || vg.options[0]?.value}
                    onChange={(val) => handleVariantChange(vg.name, val)}
                  />
                ))}
              </div>
            )}

            <hr className="border-[#dca079]/20" />

            {/* Quantity + Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {isOwnProduct ? (
                <div className="w-full flex items-center gap-3 bg-[#b9002c]/5 border border-[#b9002c]/20 rounded-xl px-4 py-3">
                  <span className="material-symbols-outlined text-[#b9002c]">storefront</span>
                  <div>
                    <p className="font-bold text-sm text-[#4a2507]">This is your product</p>
                    <p className="text-xs text-[#805030]">You can't order your own product. Place orders on products from other sellers.</p>
                  </div>
                </div>
              ) : (
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 999} />
              )}
              {!isOwnProduct && (
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 sm:flex-none px-8 py-3 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.97] ${
                    addedToCart
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white border-2 border-[#ff7936] text-[#ff7936] hover:bg-[#fff4f0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{addedToCart ? 'check' : 'shopping_cart'}</span>
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#ff7936]/20 flex items-center justify-center gap-2 text-sm active:scale-[0.97]"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  Buy Now
                </button>
              </div>
              )}
            </div>

            {/* Subscription/Save info */}
            <p className="text-[10px] text-[#805030] flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span>
              Secure transaction • Free shipping on orders over $50 • 30-day easy returns
            </p>

            {/* Min Order Info */}
            {product.minOrder && (
              <div className="text-xs text-[#805030] bg-[#ffe3d3] px-4 py-3 rounded-lg leading-relaxed">
                <span className="font-bold text-[#4a2507]">Bulk Pricing:</span> Minimum order of {product.minOrder.toLocaleString()} pieces.
                {product.verified && (
                  <span className="ml-2 text-[#ff7936] font-semibold">✓ Verified Supplier</span>
                )}
              </div>
            )}

            {/* Shipping / Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-[#dca079]/10 hover:border-[#dca079]/30 transition-colors">
                <span className="material-symbols-outlined text-[#ff7936] mt-0.5">local_shipping</span>
                <div>
                  <p className="text-xs font-bold text-[#4a2507]">Free Shipping</p>
                  <p className="text-[10px] text-[#805030]">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-[#dca079]/10 hover:border-[#dca079]/30 transition-colors">
                <span className="material-symbols-outlined text-[#ff7936] mt-0.5">currency_exchange</span>
                <div>
                  <p className="text-xs font-bold text-[#4a2507]">Easy Returns</p>
                  <p className="text-[10px] text-[#805030]">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-[#dca079]/10 hover:border-[#dca079]/30 transition-colors">
                <span className="material-symbols-outlined text-[#ff7936] mt-0.5">verified</span>
                <div>
                  <p className="text-xs font-bold text-[#4a2507]">Secure Checkout</p>
                  <p className="text-[10px] text-[#805030]">SSL encrypted payment</p>
                </div>
              </div>
            </div>

            {/* Seller Info - Etsy style */}
            <div className="bg-white rounded-xl p-5 border border-[#dca079]/10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white font-black text-lg">
                  {sellerInitials}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4a2507]">{sellerName}</p>
                  <p className="text-[10px] text-[#805030] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#004be3]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    {sellerRole}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const sid = sellerId || ''
                    navigate(`/contact?sellerId=${encodeURIComponent(sid)}&sellerName=${encodeURIComponent(sellerName)}&sellerRole=${encodeURIComponent(sellerRole)}&product=${encodeURIComponent(product.name)}&productImage=${encodeURIComponent(product.images[0] || '')}&productId=${encodeURIComponent(product.id)}`)
                  }}
                  className="ml-auto text-xs font-bold text-[#ff7936] border border-[#ff7936] px-4 py-1.5 rounded-full hover:bg-[#fff4f0] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  Contact
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-[#fff4f0] rounded-lg p-2">
                  <p className="font-black text-[#4a2507]">{sellerOrders}</p>
                  <p className="text-[10px] text-[#805030]">Orders</p>
                </div>
                <div className="bg-[#fff4f0] rounded-lg p-2">
                  <p className="font-black text-[#4a2507]">{sellerRating} ★</p>
                  <p className="text-[10px] text-[#805030]">Seller Rating</p>
                </div>
                <div className="bg-[#fff4f0] rounded-lg p-2">
                  <p className="font-black text-[#4a2507]">{product.stock > 100 ? '1K+' : product.stock}</p>
                  <p className="text-[10px] text-[#805030]">In Stock</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-xs text-[#805030] hover:text-[#ff7936] transition-colors">
              <span className="material-symbols-outlined text-base">share</span>
              Share this product
            </button>
          </div>
        </div>

        {/* Tabs: Description / Details / Reviews */}
        <div className="mb-12">
          <div className="flex border-b border-[#dca079]/20 mb-6 overflow-x-auto no-scrollbar">
            {(['description', 'details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab ? 'border-[#ff7936] text-[#ff7936]' : 'border-transparent text-[#805030] hover:text-[#4a2507]'
                }`}
              >
                {tab === 'description' ? 'Description' : tab === 'details' ? 'Details & Specs' : `Reviews (${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#dca079]/10">
              <p className="text-[#4a2507] leading-relaxed whitespace-pre-line">{product.description}</p>
              {product.images.length > 1 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.slice(1).map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#ffede4]">
                      <img loading="lazy" src={img} alt={`${product.name} gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#dca079]/10">
              {product.details && product.details.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#4a2507] mb-4">Product Details</h3>
                  <ul className="space-y-3">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#4a2507]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7936] mt-2.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-[#fff4f0] rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#805030] uppercase tracking-widest">Weight</p>
                  <p className="font-bold text-[#4a2507] mt-1">{product.weight || 'N/A'}</p>
                </div>
                <div className="bg-[#fff4f0] rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#805030] uppercase tracking-widest">Dimensions</p>
                  <p className="font-bold text-[#4a2507] mt-1">{product.dimensions || 'N/A'}</p>
                </div>
                <div className="bg-[#fff4f0] rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#805030] uppercase tracking-widest">Material</p>
                  <p className="font-bold text-[#4a2507] mt-1">{product.material || 'N/A'}</p>
                </div>
                <div className="bg-[#fff4f0] rounded-lg p-4">
                  <p className="text-[10px] font-bold text-[#805030] uppercase tracking-widest">Origin</p>
                  <p className="font-bold text-[#4a2507] mt-1">{product.origin || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection
              productRating={displayedRating}
              productReviewCount={displayedReviewCount}
              reviews={reviews}
              onReviewAdded={handleReviewAdded}
            />
          )}
        </div>

        {/* Related Products — recommendation engine */}
        {recommendations.length > 0 && (
          <RecommendedProductsSection
            title="You May Also Like"
            viewAllLink={`/${product.category.toLowerCase()}`}
            items={recommendations}
            maxColumns={4}
          />
        )}
      </main>

      {/* Mobile Sticky Add to Cart Bar - Amazon/Etsy style */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#dca079]/20 z-50 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-lg font-black text-[#ff7936]">{formatMoney(currentPrice)}</p>
            {displayOriginal && displayOriginal > currentPrice && (
              <p className="text-xs text-[#805030] line-through">{formatMoney(displayOriginal)}</p>
            )}
          </div>
          <div className="flex gap-2">
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 999} />
          </div>
          <button
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#ff7936]/20 flex items-center gap-1.5 active:scale-95 transition-transform flex-1 justify-center"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            Buy Now
          </button>
        </div>
      </div>

      <Footer />

      {user?.email === 'dev@hobags.com' && editing && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setEditing(false); setEditForm(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#dca079]/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-bold text-[#4a2507]">Edit Product</h2>
              <button onClick={() => { setEditing(false); setEditForm(null) }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ffede4] transition-colors">
                <span className="material-symbols-outlined text-[#805030]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Basic Info</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Name</label>
                    <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Subtitle</label>
                    <input value={editForm.subtitle || ''} onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Description</label>
                    <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" rows={3} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Model</label>
                    <input value={editForm.model || ''} onChange={e => setEditForm({ ...editForm, model: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                </div>
              </div>

              {/* Pricing & Status */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Pricing & Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Price ($)</label>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Original Price ($)</label>
                    <input type="number" value={editForm.originalPrice || ''} onChange={e => setEditForm({ ...editForm, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Stock</label>
                    <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Min Order</label>
                    <input type="number" value={editForm.minOrder || ''} onChange={e => setEditForm({ ...editForm, minOrder: e.target.value ? parseInt(e.target.value) : undefined })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Badge</label>
                    <input value={editForm.badge || ''} onChange={e => setEditForm({ ...editForm, badge: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Badge Color</label>
                    <select value={editForm.badgeColor || 'secondary'} onChange={e => setEditForm({ ...editForm, badgeColor: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                      <option value="secondary">Orange (default)</option>
                      <option value="tertiary">Red</option>
                      <option value="primary">Blue</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={editForm.verified || false} onChange={e => setEditForm({ ...editForm, verified: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#dca079]/30 rounded-full peer peer-checked:bg-[#004be3] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                    <span className="text-sm font-semibold text-[#4a2507]">Verified Seller</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={editForm.isBestSeller || false} onChange={e => setEditForm({ ...editForm, isBestSeller: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#dca079]/30 rounded-full peer peer-checked:bg-[#ff7936] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                    </label>
                    <span className="text-sm font-semibold text-[#4a2507]">Best Seller</span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Material</label>
                    <input value={editForm.material || ''} onChange={e => setEditForm({ ...editForm, material: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Origin</label>
                    <input value={editForm.origin || ''} onChange={e => setEditForm({ ...editForm, origin: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Weight</label>
                    <input value={editForm.weight || ''} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Dimensions</label>
                    <input value={editForm.dimensions || ''} onChange={e => setEditForm({ ...editForm, dimensions: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Rating</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Rating (0-5)</label>
                    <input type="number" step="0.1" min="0" max="5" value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: parseFloat(e.target.value) || 0 })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Review Count</label>
                    <input type="number" value={editForm.reviewCount} onChange={e => setEditForm({ ...editForm, reviewCount: parseInt(e.target.value) || 0 })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                  </div>
                </div>
              </div>

              {/* Details & Features */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Details & Features</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Details (one per line)</label>
                    <textarea value={editForm.details.join('\n')} onChange={e => setEditForm({ ...editForm, details: e.target.value.split('\n').filter(Boolean) })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" rows={4} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Features / About this item (one per line)</label>
                    <textarea value={(editForm.features || []).join('\n')} onChange={e => setEditForm({ ...editForm, features: e.target.value.split('\n').filter(Boolean) })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" rows={4} />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Images</h3>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Image URLs (one per line)</label>
                  <textarea value={editForm.images.join('\n')} onChange={e => setEditForm({ ...editForm, images: e.target.value.split('\n').filter(Boolean) })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" rows={3} />
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {editForm.images.slice(0, 5).map((url, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-[#dca079]/20 flex-shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Organization</h3>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Category</label>
                  <input value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#dca079]/10 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => { setEditing(false); setEditForm(null) }} className="px-5 py-2 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffede4] transition-colors">Cancel</button>
              <button onClick={() => {
                if (editForm) {
                  setProduct(editForm)
                  updateProductInLookup(editForm)
                  setEditing(false)
                  setEditForm(null)
                }
              }} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg shadow-[#ff7936]/20 hover:shadow-xl transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
