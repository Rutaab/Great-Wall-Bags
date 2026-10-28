import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/currency'

interface StudioLayoutProps {
  children: React.ReactNode
  title?: string
  onSave?: () => void
  onAddToCart?: () => void
  price?: number
}

const StudioLayout: React.FC<StudioLayoutProps> = ({ children, title = 'Design Studio', onSave, onAddToCart, price }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fff4f0] flex flex-col">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-[#fff4f0]/90 backdrop-blur-xl border-b border-[#dca079]/10">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-[#9e3c00] tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            Great Wall Bags
          </span>
          <span className="hidden sm:inline text-sm text-[#805030] ml-2">/ {title}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {price !== undefined && (
            <span className="text-sm font-black text-[#9e3c00]">{formatPrice(price)}</span>
          )}
          {onSave && (
            <button onClick={onSave} className="px-4 py-2 text-xs font-bold text-[#805030] border border-[#dca079]/30 rounded-full hover:bg-[#ffede4] transition-colors">
              Save
            </button>
          )}
          {onAddToCart && (
            <button onClick={onAddToCart} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg shadow-[#ff7936]/20 hover:shadow-xl transition-all">
              Add to Cart
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 pt-14">
        {children}
      </main>
    </div>
  )
}

export default StudioLayout
