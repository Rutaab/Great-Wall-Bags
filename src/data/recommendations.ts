import { Product } from './products'
export type { Product }
import { getAllProducts } from './productLookup'

const NEW_PRODUCT_WINDOW_DAYS = 14
const RECENCY_WEIGHT = 0.35
const RATING_WEIGHT = 0.35
const REVIEW_WEIGHT = 0.30

function resolveCreatedAt(product: Product): Date {
  if (product.createdAt) return new Date(product.createdAt)
  const prefix = product.id.split('-')[0]
  const dayMap: Record<string, number> = {
    fd: 3, fs: 5, bp: 15, lx: 20, sc: 25, tr: 30,
    bs: 35, kb: 40, ac: 45, tt: 12, hc: 50,
  }
  const daysAgo = dayMap[prefix] ?? 45
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d
}

function daysSinceCreation(product: Product): number {
  const created = resolveCreatedAt(product)
  const now = new Date()
  return Math.max(0, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
}

export function getRecencyBoost(product: Product): number {
  const days = daysSinceCreation(product)
  if (days >= NEW_PRODUCT_WINDOW_DAYS) return 0
  return (1 - days / NEW_PRODUCT_WINDOW_DAYS)
}

export function isNewProduct(product: Product): boolean {
  return daysSinceCreation(product) < NEW_PRODUCT_WINDOW_DAYS
}

export function scoreProduct(product: Product): number {
  const normalizedRating = product.rating / 5
  const normalizedReviews = Math.min(product.reviewCount, 2000) / 2000
  const recencyBoost = getRecencyBoost(product)
  return (
    normalizedRating * RATING_WEIGHT +
    normalizedReviews * REVIEW_WEIGHT +
    recencyBoost * RECENCY_WEIGHT
  )
}

export interface ScoredProduct {
  product: Product
  score: number
  isNew: boolean
  recencyBoost: number
}

export function getTopRated(limit: number = 12): ScoredProduct[] {
  const all: Product[] = getAllProducts()
  return all
    .map(product => ({
      product,
      score: scoreProduct(product),
      isNew: isNewProduct(product),
      recencyBoost: getRecencyBoost(product),
    }))
    .sort((a: ScoredProduct, b: ScoredProduct) => b.score - a.score)
    .slice(0, limit)
}

export function getTopRatedByCategory(category: string, limit: number = 8): ScoredProduct[] {
  const all: Product[] = getAllProducts()
  const cat = category.toLowerCase()
  return all
    .filter((p: Product) => p.category.toLowerCase() === cat)
    .map(product => ({
      product,
      score: scoreProduct(product),
      isNew: isNewProduct(product),
      recencyBoost: getRecencyBoost(product),
    }))
    .sort((a: ScoredProduct, b: ScoredProduct) => b.score - a.score)
    .slice(0, limit)
}

export function getRecommendedProducts(
  currentProductId?: string,
  category?: string,
  limit: number = 8
): ScoredProduct[] {
  const all: Product[] = getAllProducts()

  let candidates: Product[] = all
  if (category) {
    const cat = category.toLowerCase()
    candidates = all.filter((p: Product) => p.category.toLowerCase() === cat)
  }

  return candidates
    .filter((p: Product) => p.id !== currentProductId)
    .map(product => ({
      product,
      score: scoreProduct(product),
      isNew: isNewProduct(product),
      recencyBoost: getRecencyBoost(product),
    }))
    .sort((a: ScoredProduct, b: ScoredProduct) => b.score - a.score)
    .slice(0, limit)
}

export function getRecentlyAdded(limit: number = 8, category?: string): ScoredProduct[] {
  const all: Product[] = getAllProducts()
  let candidates: Product[] = category
    ? all.filter((p: Product) => p.category.toLowerCase() === category.toLowerCase())
    : all

  return candidates
    .map(product => ({
      product,
      score: scoreProduct(product),
      isNew: isNewProduct(product),
      recencyBoost: getRecencyBoost(product),
    }))
    .sort((a: ScoredProduct, b: ScoredProduct) => {
      const aDays = daysSinceCreation(a.product)
      const bDays = daysSinceCreation(b.product)
      return aDays - bDays
    })
    .slice(0, limit)
}

export function getNewArrivals(limit: number = 8): ScoredProduct[] {
  const all: Product[] = getAllProducts()
  return all
    .filter((p: Product) => isNewProduct(p))
    .map(product => ({
      product,
      score: scoreProduct(product),
      isNew: true,
      recencyBoost: getRecencyBoost(product),
    }))
    .sort((a: ScoredProduct, b: ScoredProduct) => b.recencyBoost - a.recencyBoost)
    .slice(0, limit)
}
