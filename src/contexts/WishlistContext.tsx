import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { api } from '../services/api'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  badge: string
}

interface WishlistContextType {
  items: WishlistItem[]
  isWishlisted: (id: string) => boolean
  toggleWishlist: (item: WishlistItem) => Promise<void>
  removeFromWishlist: (id: string) => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [localItems, setLocalItems] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hobags_local_wishlist') || '[]')
    } catch {
      return []
    }
  })
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      setItems([])
      return
    }
    try {
      const data = await api.getWishlist()
      const productIds = data.map(w => w.product_id)
      const products = await Promise.allSettled(
        productIds.map(id => api.getProduct(id))
      )
      const fullItems: WishlistItem[] = []
      products.forEach((result) => {
        if (result.status === 'fulfilled') {
          const p = result.value
          fullItems.push({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            badge: p.badge || '',
          })
        }
      })
      setItems(fullItems)
    } catch {
      setItems([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  useEffect(() => {
    localStorage.setItem('hobags_local_wishlist', JSON.stringify(localItems))
  }, [localItems])

  const allItems = [...items, ...localItems.filter(li => !items.some(i => i.id === li.id))]

  const isWishlisted = useCallback((id: string) => {
    return allItems.some(item => item.id === id)
  }, [allItems])

  const toggleWishlist = useCallback(async (item: WishlistItem) => {
    const exists = allItems.some(i => i.id === item.id)

    if (exists) {
      setLocalItems(prev => prev.filter(i => i.id !== item.id))
      setItems(prev => prev.filter(i => i.id !== item.id))
      if (isLoggedIn) {
        try {
          await api.removeFromWishlist(item.id)
        } catch {}
      }
      return
    }

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    setLocalItems(prev => [...prev.filter(i => i.id !== item.id), item])
    try {
      await api.addToWishlist(item.id)
      const data = await api.getWishlist()
      const productIds = data.map(w => w.product_id)
      const products = await Promise.allSettled(
        productIds.map(id => api.getProduct(id))
      )
      const fullItems: WishlistItem[] = []
      products.forEach((result) => {
        if (result.status === 'fulfilled') {
          const p = result.value
          fullItems.push({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            badge: p.badge || '',
          })
        }
      })
      setLocalItems(prev => prev.filter(i => i.id !== item.id))
      setItems(fullItems)
    } catch {
      // keep in localItems
    }
  }, [isLoggedIn, allItems, navigate])

  const removeFromWishlist = useCallback((id: string) => {
    setLocalItems(prev => prev.filter(i => i.id !== id))
    setItems(prev => prev.filter(i => i.id !== id))
    api.removeFromWishlist(id).then(() => fetchWishlist()).catch(() => {})
  }, [fetchWishlist])

  const wishlistCount = allItems.length

  return (
    <WishlistContext.Provider value={{ items: allItems, isWishlisted, toggleWishlist, removeFromWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}
