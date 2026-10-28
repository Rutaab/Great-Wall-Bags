import React, { useMemo } from 'react'
import { getTopRated } from '../data/recommendations'
import RecommendedProducts from '../components/RecommendedProducts'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=333&q=60&fit=crop',
    alt: 'A hiker standing on a mountain summit wearing a large hiking backpack, overlooking a scenic valley at sunrise.',
    tag: 'Outdoor Adventure',
    title: 'Summit-Ready Backpacks',
    desc: 'Technical hiking packs built for the trail. Lightweight, durable, and ergonomic.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=333&q=60&fit=crop',
    alt: 'A hiker walking through a misty forest trail wearing a large backpack surrounded by towering pine trees.',
    tag: 'Trail Blazer',
    title: 'Forest Expedition Gear',
    desc: 'Rugged backpacks designed for long treks through the wilderness.',
  },
  {
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=333&q=60&fit=crop',
    alt: 'A young woman with a large travel backpack exploring a historic European street.',
    tag: 'Wanderlust',
    title: 'Global Travel Packs',
    desc: 'Durable travel backpacks for the jetsetter and backpacker alike.',
  },
  {
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=333&q=60&fit=crop',
    alt: 'A stylish person walking through a modern urban architecture space with a high-end designer shoulder bag, soft sunlight and clean shadows.',
    tag: 'Trending Now',
    title: 'Designer Shoulder Bags',
    desc: 'Elegant crossbody and shoulder bags for the modern woman. Luxury meets everyday functionality.',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKNNph0kUV11KmGXiQNyGRP_uU6RWs4z3zr-_CI80oNc6JNZyAb9tZct-ft6Jc1uJfYx8RQtG_5-jnwSGNbXTER0RObShCDp0gOCURBWRM6UDLJXNZ-8FEIVHg7RZa0WyQic1LezWck2IjcYTa0aK8A7R6Kv_T18rcAO5Wn3BmO2av8PFaQH6wdGGr7o8JsA7cdQEaylZ84Hv6EULdiPYN5zzbHxkzHf2Tk5HB86Qzz5U8pOYc5068s_yZg9b25SP8fWq4bxyXFzmb',
    alt: 'A professional leather briefcase with silver buckles resting on a wooden table, business and corporate style.',
    tag: 'Business Class',
    title: 'Executive Briefcases',
    desc: 'Premium leather briefcases for the corporate professional. Power meets sophistication.',
  },
  {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=333&q=60&fit=crop',
    alt: 'A traveler standing on a cliff edge overlooking a panoramic coastal view with a backpack on.',
    tag: 'Coastal Escape',
    title: 'Seaside Travel Gear',
    desc: 'Water-resistant bags for beach getaways and coastal explorations.',
  },
]

const HeroSection: React.FC = () => {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleDotClick = (index: number) => {
    setCurrent(index)
  }

  return (
    <section className="relative h-[300px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt={slide.alt}
            src={slide.image}
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 text-white">
            <span className="text-[#ff7936] font-bold tracking-widest uppercase text-xs md:text-sm mb-3 md:mb-4">{slide.tag}</span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black italic tracking-tighter max-w-4xl mb-4 md:mb-6">{slide.title}</h1>
            <p className="text-sm md:text-lg lg:text-xl max-w-xl mb-6 md:mb-8 font-medium text-white/90">
              {slide.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-xl shadow-[#ff7936]/20 transition-transform active:scale-95 text-white text-sm md:text-base w-full sm:w-auto">
                Shop the Collection
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-white/20 transition-all text-white text-sm md:text-base w-full sm:w-auto">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Dot Navigation */}
      <div className="absolute bottom-4 md:bottom-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-8 z-30 flex flex-row gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

const FeaturedCategories: React.FC = () => (
  <section className="px-6 py-16 bg-[#fff4f0]">
    <div className="flex justify-between items-end mb-10">
      <div>
        <h2 className="text-3xl font-black italic text-[#9e3c00] tracking-tight">Featured Categories</h2>
        <p className="text-[#805030] font-medium">Precision-selected for every lifestyle</p>
      </div>
      <Link to="/" className="text-[#004be3] font-bold flex items-center gap-1 group">
        Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
      <div className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden group cursor-pointer">
        <img loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="A professional business traveler in a tailored suit walking through a glass-walled airport terminal with a premium leather travel bag."
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h3 className="text-3xl font-bold text-white mb-2">Travel & Luxury</h3>
          <p className="text-white/80 text-sm max-w-xs">Italian leather and carbon fiber hardware for the global nomad.</p>
        </div>
      </div>
      <div className="md:col-span-2 relative rounded-lg overflow-hidden group cursor-pointer">
        <img loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="A minimalist overhead shot of a technical techwear backpack and various high-tech gadgets."
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=300&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h4 className="text-xl font-bold text-white">Work & School</h4>
        </div>
      </div>
      <div className="relative rounded-lg overflow-hidden group cursor-pointer">
        <img loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Close-up of a vibrant, high-performance sports gym bag with specialized compartments."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpxHrot_DStpC_s8hqdtlnqO5Waf5wv8VF5GGLe6V-iXn6hJl952KnDIogtsePVI056gg_W9hc439WNtuwbj7VoUjWlZY0kGeuCqrOsODFcFwUQt2G8QtD3_ektSKSmNLlhOwWKVRTAw1eQLtWuV7VSxwkW0VXXxSgl7f6P2WY5si6aCekyFg976GG-sHLspw3y9JjlTZqq2WlylG-R703AgCdiKO9fuFsc-1gVyanKS10vslfSe32Pq8a5oB3WXlose_tF8w-Pvvj"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h4 className="text-xl font-bold text-white">Sports & Gym</h4>
        </div>
      </div>
      <div className="relative rounded-lg overflow-hidden group cursor-pointer">
        <img loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="An outdoor enthusiast hiking through a misty mountain forest, wearing a technical hydration pack."
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h4 className="text-xl font-bold text-white">Outdoor Gear</h4>
        </div>
      </div>
    </div>
  </section>
)

const TrendingNow: React.FC = () => {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [justAdded, setJustAdded] = React.useState<Set<string>>(new Set())
  const products = [
    {
      id: 'fd-1',
      name: 'Veloce Leather Tote',
      price: 1240,
      origin: 'Milan, Italy',
      material: 'Hand-stitched Calfskin',
      badge: 'Limited Edition',
      badgeColor: 'tertiary',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop'
    },
    {
      id: 'fd-2',
      name: 'Aero-Commute Pack',
      price: 285,
      origin: 'Tokyo, Japan',
      material: 'Waterproof Cordura',
      badge: 'Bestseller',
      badgeColor: 'secondary',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop'
    },
    {
      id: 'fd-3',
      name: 'Heritage Duffel XL',
      price: 450,
      origin: 'London, UK',
      material: 'Waxed Canvas',
      badge: '',
      badgeColor: '',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=500&fit=crop'
    },
    {
      id: 'fd-4',
      name: 'Prism Crossbody',
      price: 610,
      origin: 'Paris, France',
      material: 'Saffiano Leather',
      badge: '-20% Flash Sale',
      badgeColor: 'tertiary',
      image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=400&h=500&fit=crop'
    }
  ]

  return (
    <section className="py-16 bg-[#ffe3d3]">
      <div className="px-6 mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic text-[#9e3c00] tracking-tight">Trending Now</h2>
          <p className="text-[#805030] font-medium">High velocity movers in the marketplace</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-[#dca079] flex items-center justify-center hover:bg-[#ffd4bb]">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-[#dca079] flex items-center justify-center hover:bg-[#ffd4bb]">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto px-6 pb-8 no-scrollbar">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="min-w-[280px] md:min-w-[320px] bg-white rounded-lg p-3 group cursor-pointer block"
          >
            <div className="relative h-[400px] mb-4 overflow-hidden rounded">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={product.name}
                src={product.image} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }}
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase ${
                  product.badgeColor === 'tertiary' ? 'bg-[#b9002c]' : 'bg-[#ff7936]'
                }`}>
                  {product.badge}
                </span>
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }); setJustAdded(prev => new Set(prev).add(product.id)); setTimeout(() => setJustAdded(prev => { const n = new Set(prev); n.delete(product.id); return n }), 1500) }} className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-colors ${justAdded.has(product.id) ? 'bg-green-600 text-white' : 'bg-white/80 text-[#4a2507]'}`}>
                  <span className="material-symbols-outlined text-lg">{justAdded.has(product.id) ? 'check' : 'add_shopping_cart'}</span>
                </button>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, badge: product.badge || '' }) }} className={`w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-colors ${isWishlisted(product.id) ? 'bg-[#b9002c] text-white' : 'bg-white/80 text-[#4a2507]'}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h5 className="font-bold text-lg text-[#4a2507]">{product.name}</h5>
                <span className="text-[#9e3c00] font-bold">${product.price.toLocaleString()}</span>
              </div>
              <p className="text-[#805030] text-sm">{product.origin} &bull; {product.material}</p>
              <div className="flex gap-2 pt-2">
                <span className="text-[10px] font-bold text-[#805030] bg-[#ffd4bb] px-2 py-1 rounded">Verified Seller</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

const RecentCurations: React.FC = () => (
  <section className="px-6 py-16 bg-[#fff4f0]">
    <h2 className="text-3xl font-black italic text-[#9e3c00] tracking-tight mb-10">Your Recent Curations</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-[#ffede4] rounded-lg p-6 border-l-4 border-[#9e3c00] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#ff7936]">
              <img
                className="w-full h-full object-cover"
                alt="A small leather artisan's workshop in Tuscany"
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop"
              />
            </div>
            <div>
              <h6 className="font-bold text-[#4a2507]">Luxury Weekenders</h6>
              <p className="text-xs text-[#805030]">Last updated 2h ago</p>
            </div>
          </div>
          <button className="text-[#805030] hover:text-[#9e3c00]">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        <div className="flex -space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#ffede4] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Product thumbnail"
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#ffede4] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Product thumbnail"
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#ffede4] flex items-center justify-center text-[10px] font-bold bg-[#ff7936] text-white">
            +4
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-[#ffd4bb] text-[#4a2507] font-bold text-xs py-2 rounded transition-colors hover:bg-[#ff7936] hover:text-white">
            View Collection
          </button>
          <button className="px-3 bg-[#ffd4bb] rounded transition-colors hover:bg-[#004be3] hover:text-white">
            <span className="material-symbols-outlined text-sm">share</span>
          </button>
        </div>
      </div>

      <div className="bg-[#ffede4] rounded-lg p-6 border-l-4 border-[#004be3] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#c6d0ff]">
              <img
                className="w-full h-full object-cover"
                alt="Modern urban city street at night"
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop"
              />
            </div>
            <div>
              <h6 className="font-bold text-[#4a2507]">Urban Commuter</h6>
              <p className="text-xs text-[#805030]">Last updated 1d ago</p>
            </div>
          </div>
          <button className="text-[#805030] hover:text-[#9e3c00]">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        <div className="flex -space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#ffede4] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Product thumbnail"
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#ffede4] flex items-center justify-center text-[10px] font-bold bg-[#c6d0ff] text-[#003ab5]">
            +12
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-[#ffd4bb] text-[#4a2507] font-bold text-xs py-2 rounded transition-colors hover:bg-[#c6d0ff] hover:text-[#003ab5]">
            View Collection
          </button>
          <button className="px-3 bg-[#ffd4bb] rounded transition-colors hover:bg-[#004be3] hover:text-white">
            <span className="material-symbols-outlined text-sm">share</span>
          </button>
        </div>
      </div>

      <button className="bg-[#ffe3d3] border-2 border-dashed border-[#dca079] rounded-lg p-6 flex flex-col items-center justify-center gap-2 group hover:bg-[#ffdcc7] transition-colors">
        <span className="material-symbols-outlined text-4xl text-[#805030] group-hover:scale-110 transition-transform">add_circle</span>
        <span className="font-bold text-[#4a2507]">New Curation</span>
        <span className="text-xs text-[#805030]">Collect global inspirations</span>
      </button>
    </div>
  </section>
)

const FlashDealsHub: React.FC = () => {
  const topRated = useMemo(() => getTopRated(8), [])

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] selection:bg-[#ff7936] selection:text-white">
      <AppHeader />

      <main className="max-w-[1920px] mx-auto pb-16 md:pb-0">
        <HeroSection />
        <FeaturedCategories />
        <TrendingNow />
        <RecentCurations />
      {topRated.length > 0 && (
        <div className="px-4 md:px-8 lg:px-12">
          <RecommendedProducts
            title="Top Rated on Great Wall Bags"
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

export default FlashDealsHub
