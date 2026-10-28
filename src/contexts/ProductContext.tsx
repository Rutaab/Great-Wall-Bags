import React, { createContext, useContext, ReactNode, useEffect } from 'react'
import { getStoredProducts, getProductsByRoute, getProductsByCategory, getTopProductsByRoutes, getSuggestedFeaturedProducts, approveFeaturedProduct, rejectFeaturedProduct, getProductsByUser, addLocalProduct, updateLocalProduct, deleteLocalProduct, addReviewToProduct, getProductReviews, migrateStorageIfNeeded, syncFromApi, type LocalProduct, type ReviewItem } from '../services/localProducts'
import type { UserRole } from './AuthContext'

interface AddProductData {
  name: string
  spec: string
  price: number
  stock: number
  route: string
  category: string
  tags: string[]
  image?: string
  bulk?: string
  bulkQty?: string
  material?: string
  status?: 'draft' | 'published'
  categories?: string[]
  variants?: { name: string; options: string }[]
}

interface ProductContextType {
  getProductsByRoute: (route: string) => LocalProduct[]
  getProductsByCategory: (category: string) => LocalProduct[]
  getTopProductsByRoutes: (routes: string[], perRoute?: number) => LocalProduct[]
  getSuggestedFeaturedProducts: () => (LocalProduct & { score: number })[]
  approveFeaturedProduct: (id: string) => LocalProduct | null
  rejectFeaturedProduct: (id: string) => LocalProduct | null
  getAllProducts: () => LocalProduct[]
  addProduct: (data: AddProductData, addedBy?: { id: string; name: string; role: UserRole } | null) => LocalProduct
  updateProduct: (id: string, updates: Partial<LocalProduct>) => LocalProduct | null
  deleteProduct: (id: string) => boolean
  getUserProducts: (userId: string) => LocalProduct[]
  addReview: (productId: string, review: { author: string; rating: number; text: string }) => LocalProduct | null
  getReviews: (productId: string) => ReviewItem[]
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  migrateStorageIfNeeded()
  useEffect(() => { syncFromApi() }, [])
  const addProduct = (data: AddProductData, addedBy?: { id: string; name: string; role: UserRole } | null) => {
    return addLocalProduct({ ...data, addedBy, status: data.status, categories: data.categories })
  }

  return (
    <ProductContext.Provider value={{
      getProductsByRoute,
      getProductsByCategory,
      getTopProductsByRoutes,
      getSuggestedFeaturedProducts,
      approveFeaturedProduct,
      rejectFeaturedProduct,
      getAllProducts: getStoredProducts,
      addProduct,
      updateProduct: updateLocalProduct,
      deleteProduct: deleteLocalProduct,
      getUserProducts: getProductsByUser,
      addReview: addReviewToProduct,
      getReviews: getProductReviews,
    }}>
      {children}
    </ProductContext.Provider>
  )
}
