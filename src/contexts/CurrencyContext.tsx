import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, ReactNode } from 'react'
import {
  BASE_CURRENCY,
  currencies,
  convert,
  describeUpdatedAt,
  formatNumber,
  formatPrice,
  getCurrency,
  getCurrencyState,
  getRate,
  refreshRates,
  setCurrency as setCurrencyStore,
  subscribeToCurrency,
  type CurrencyOption,
  type CurrencyState,
  type RatesStatus,
} from '../utils/currency'

/** How often the store re-pulls rates while the tab stays open. */
const POLL_INTERVAL_MS = 30 * 60 * 1000

export interface CurrencyContextType extends CurrencyState {
  /** All selectable currencies. */
  currencies: CurrencyOption[]
  currencyInfo: CurrencyOption
  baseCurrency: string
  setCurrency: (code: string) => void
  /** USD amount -> formatted string in the active currency. */
  formatPrice: (amountUsd: number, code?: string) => string
  /** USD amount -> plain number in the active currency. */
  convert: (amountUsd: number, code?: string) => number
  formatNumber: (value: number, maxDigits?: number) => string
  /** Live rate per 1 USD for any currency, or null when unavailable. */
  getRate: (code: string) => number | null
  refresh: (options?: { force?: boolean }) => Promise<void>
  isRefreshing: boolean
  status: RatesStatus
  /** e.g. "12 minutes ago" */
  updatedLabel: string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // The store is the source of truth; this component only mirrors it into context
  // and owns the polling lifecycle.
  const [, forceRender] = React.useReducer((n: number) => n + 1, 0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const unsubscribe = subscribeToCurrency(() => {
      if (mounted.current) forceRender()
    })
    // Pull rates as soon as the app is usable.
    void refreshRates()

    const interval = setInterval(() => { void refreshRates() }, POLL_INTERVAL_MS)

    // Coming back to the tab is the most common moment to look stale, so refresh
    // then if the current set is older than the poll window.
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refreshRates()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      mounted.current = false
      unsubscribe()
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const setCurrency = useCallback((code: string) => setCurrencyStore(code), [])
  const refresh = useCallback((options?: { force?: boolean }) => refreshRates(options), [])

  // `commit()` swaps in a new state object, so this snapshot's identity changes
  // exactly when the store changes. Depending on it (rather than only on the
  // stable callbacks) is what keeps the context value from going stale.
  const current = getCurrencyState()
  const value = useMemo<CurrencyContextType>(() => ({
    ...current,
    currencies,
    currencyInfo: getCurrency(current.currency),
    baseCurrency: BASE_CURRENCY,
    setCurrency,
    formatPrice,
    convert,
    formatNumber,
    getRate,
    refresh,
    isRefreshing: current.status === 'loading',
    updatedLabel: describeUpdatedAt(current.updatedAt),
  }), [current, setCurrency, refresh])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

/**
 * Subscribe to currency changes without pulling in the rest of the context.
 * `AppEntry` uses this so that switching currency re-renders the entire route
 * tree - that is what makes the change visible on every page, including in
 * components that never imported the context themselves.
 *
 * The version covers the rate set as well as the currency code, because prices
 * also have to be recomputed when fresh rates arrive.
 */
export function useCurrencyVersion(): string {
  return React.useSyncExternalStore(
    subscribeToCurrency,
    () => {
      const s = getCurrencyState()
      return `${s.currency}|${s.updatedAt ?? 0}|${s.status}`
    },
    () => `${BASE_CURRENCY}|0|idle`,
  )
}

export default CurrencyContext