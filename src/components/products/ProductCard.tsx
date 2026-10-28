import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/currency'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  timeLeft: string
  stock: number
  totalStock: number
  badge?: string
  badgeColor?: 'secondary' | 'tertiary' | 'primary'
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  
  const stockPercentage = (product.stock / product.totalStock) * 100
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <div onClick={() => navigate(`/product/${product.id}`)} className="bg-surface-container-lowest rounded-lg group overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
      <div className="relative h-64 bg-surface-container-low overflow-hidden">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={product.name} 
          src={product.image} 
        />
        
        <div className="absolute top-4 left-4 bg-tertiary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
          -{product.discount}% OFF
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-lg text-center min-w-[80px]">
          <p className="text-[10px] font-bold text-tertiary leading-none">ENDS IN</p>
          <p className="text-sm font-black text-on-surface">{product.timeLeft}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-on-surface">{product.name}</h3>
          {product.badge && (
            <span className={`text-${product.badgeColor} text-[10px] font-bold px-2 py-0.5 bg-${product.badgeColor}-container rounded-full`}>
              {product.badge}
            </span>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-primary">{formatPrice(product.price)}</span>
          <span className="text-sm text-on-surface-variant line-through">{formatPrice(product.originalPrice)}</span>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            <span>Stock Remaining</span>
            <span className={product.stock < 10 ? 'text-tertiary' : 'text-on-surface'}>
              {product.stock < 10 ? `${product.stock} left` : `${Math.round(stockPercentage)}% Reserved`}
            </span>
          </div>
          
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                product.stock < 10 
                  ? 'bg-gradient-to-r from-tertiary to-tertiary-fixed-dim' 
                  : 'bg-gradient-to-r from-primary-container to-primary'
              }`} 
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dim transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard