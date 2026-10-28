const preloaded = new Set<string>()

export function preloadPage(importFn: () => Promise<any>) {
  const key = importFn.toString()
  if (preloaded.has(key)) return
  preloaded.add(key)
  importFn()
}

let idleCallback: number | null = null

export function preloadOnIdle(importFn: () => Promise<any>, priority: 'high' | 'low' = 'low') {
  if (priority === 'high') {
    preloadPage(importFn)
    return
  }
  if (typeof requestIdleCallback !== 'undefined') {
    if (idleCallback) cancelIdleCallback(idleCallback)
    idleCallback = requestIdleCallback(() => {
      preloadPage(importFn)
      idleCallback = null
    }, { timeout: 3000 })
  } else {
    setTimeout(() => preloadPage(importFn), 200)
  }
}

const linkPreloads = new WeakMap<HTMLElement, () => void>()

export function setupLinkPreload(element: HTMLElement, importFn: () => Promise<any>) {
  const handler = () => preloadPage(importFn)
  linkPreloads.set(element, handler)
  element.addEventListener('mouseenter', handler, { once: true })
}

export function teardownLinkPreload(element: HTMLElement) {
  const handler = linkPreloads.get(element)
  if (handler) {
    element.removeEventListener('mouseenter', handler)
    linkPreloads.delete(element)
  }
}

export enum RouteTier {
  Critical = 0,
  High = 1,
  Normal = 2,
  Low = 3,
  Deferred = 4,
}

const tierLoaders: Map<RouteTier, Array<() => Promise<any>>> = new Map()

export function registerRouteLoader(tier: RouteTier, loader: () => Promise<any>) {
  if (!tierLoaders.has(tier)) tierLoaders.set(tier, [])
  tierLoaders.get(tier)!.push(loader)
}

export function bootstrapRouteTiers() {
  const tiers = [RouteTier.Critical, RouteTier.High, RouteTier.Normal, RouteTier.Low, RouteTier.Deferred]
  let delay = 0
  for (const tier of tiers) {
    const loaders = tierLoaders.get(tier)
    if (loaders) {
      setTimeout(() => {
        for (const loader of loaders) {
          preloadPage(loader)
        }
      }, delay)
    }
    delay += 2000
  }
}
