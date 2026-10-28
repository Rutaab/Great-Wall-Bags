import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { api } from '../services/api'
import { getActiveSale } from '../services/salePrices'
import { getProductById } from '../services/localProducts'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

function mapCartItem(item: { id: string; product_id: string; quantity: number; name: string; price: number; image: string; stock: number }): CartItem {
  return {
    id: item.product_id,
    name: item.name || '',
    price: Number(item.price) || 0,
    image: item.image || '',
    quantity: item.quantity,
    originalPrice: undefined,
  }
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [localItems, setLocalItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hobags_local_cart') || '[]')
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([])
      return
    }
    try {
      const data = await api.getCart()
      setItems(data.map(mapCartItem))
    } catch {
      setItems([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const allItems = [...items, ...localItems.filter(li => !items.some(i => i.id === li.id))]

  useEffect(() => {
    localStorage.setItem('hobags_local_cart', JSON.stringify(allItems))
  }, [allItems])

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    const product = getProductById(item.id)
    if (user && product?.addedBy?.id === user.id) {
      alert("You can't order your own product.")
      return
    }
    const sale = getActiveSale(item.id)
    const usesLiveSale = !!sale && !item.originalPrice
    const price = usesLiveSale ? sale!.sale_price : item.price
    const originalPrice = usesLiveSale ? sale!.original_price : item.originalPrice
    const cartItem = { ...item, price, originalPrice }
    setLoading(true)
    try {
      await api.addToCart(item.id, 1, { name: cartItem.name, price: cartItem.price, image: cartItem.image })
      await fetchCart()
    } catch {
      const existing = localItems.find(i => i.id === item.id)
      if (existing) {
        setLocalItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1, price: cartItem.price, originalPrice: cartItem.originalPrice } : i))
      } else {
        setLocalItems(prev => [...prev, { ...cartItem, quantity: 1 }])
      }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (id: string) => {
    setLoading(true)
    try {
      const cartItems = await api.getCart()
      const found = cartItems.find(ci => ci.product_id === id)
      if (found) {
        await api.removeFromCart(found.id)
      }
      setLocalItems(prev => prev.filter(i => i.id !== id))
      await fetchCart()
    } catch {
      setLocalItems(prev => prev.filter(i => i.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (localItems.some(i => i.id === id)) {
      setLocalItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
    } else {
      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
    }
  }

  const clearCart = () => {
    setItems([])
    setLocalItems([])
    localStorage.removeItem('hobags_local_cart')
  }

  const cartCount = allItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: allItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
