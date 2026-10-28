import React from 'react'
import { Link } from 'react-router-dom'
import type { ScoredProduct } from '../data/recommendations'
import { formatPrice } from '../utils/currency'

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-xs ${i < Math.round(rating) ? 'text-amber-400' : 'text-[#dca079]/40'}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        star
      </span>
    ))}
  </div>
)

interface Props {
  title?: string
  viewAllLink?: string
  items: ScoredProduct[]
  maxColumns?: 2 | 3 | 4 | 5
}

const RecommendedProducts: React.FC<Props> = ({
  title = 'Recommended For You',
  viewAllLink,
  items,
  maxColumns = 4,
}) => {
  if (items.length === 0) return null

  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }

  return (
      <section className="mt-8 md:mt-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-lg md:text-2xl font-black text-[#4a2507]">{title}</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#805030] bg-[#ffede4] px-2.5 py-1 rounded-full">
            Score Ranked
          </span>
        </div>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-sm font-bold text-[#ff7936] hover:underline flex items-center gap-1 transition-all hover:gap-2">
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        )}
      </div>
      <div className={`grid ${gridCols[maxColumns]} gap-4`}>
        {items.map(({ product, isNew, score }) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-xl overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-0.5 relative"
          >
            <div className="aspect-square bg-[#ffede4] overflow-hidden relative">
              <img loading="lazy" src={product.images[0] || product.image} alt={product.name} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&h=800&fit=crop' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {isNew && (
                <span className="absolute top-2 left-2 bg-[#004be3] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  New
                </span>
              )}
              {product.badge && !isNew && (
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md ${
                  product.badgeColor === 'tertiary' ? 'bg-[#b9002c] text-white' :
                  product.badgeColor === 'secondary' ? 'bg-[#004be3] text-white' :
                  'bg-[#ff7936] text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>
            <div className="p-2 md:p-4">
                <h3 className="font-bold text-xs md:text-sm text-[#4a2507] group-hover:text-[#ff7936] transition-colors truncate">{product.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <StarRating rating={product.rating} />
                <span className="text-[10px] text-[#805030] font-medium">({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="font-black text-[#9e3c00]">{formatPrice(product.price)}</p>
                <span className="text-[9px] text-[#805030]/60 font-mono">score: {(score * 100).toFixed(0)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RecommendedProducts
