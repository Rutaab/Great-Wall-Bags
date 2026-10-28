/**
 * Currency conversion for the whole storefront.
 *
 * Every price in the app is authored in USD, so USD is the base here and each
 * amount is converted with the live USD rate for the selected currency.
 *
 * This is a module-level external store rather than React state on purpose: price
 * rendering happens in ~110 page components *and* in module-level helpers (for
 * example `money()` in DeveloperOrders.tsx), which cannot call hooks. Components
 * read `formatPrice()` at render time, and `AppEntry` subscribes to this store with
 * `useSyncExternalStore`, so a currency change re-renders the entire route tree and
 * every displayed price updates at once.
 */

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  /** Locale used for number grouping/decimal separators. */
  locale: string
}

export const BASE_CURRENCY = 'USD'

export const currencies: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', locale: 'ar-SA' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', locale: 'ar-KW' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', locale: 'ar-EG' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', locale: 'en-NG' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', locale: 'es-MX' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'nb-NO' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', locale: 'pl-PL' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', locale: 'tr-TR' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'zh-HK' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', locale: 'ur-PK' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', locale: 'id-ID' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ' },
]

export function getCurrency(code: string): CurrencyOption {
  return currencies.find(c => c.code === code) || currencies[0]
}

export type RatesStatus = 'idle' | 'loading' | 'live' | 'fallback' | 'error'

export interface CurrencyState {
  currency: string
  /** Rate per 1 USD, keyed by currency code. Always contains USD: 1. */
  rates: Record<string, number>
  /** Epoch ms of the rate set currently in use. */
  updatedAt: number | null
  status: RatesStatus
  /** Where the live rates came from, for display in Settings. */
  source: string | null
}

/**
 * Snapshot used only if every rate provider is unreachable. Keeps prices sane
 * instead of showing NaN; `status` becomes 'fallback' so the UI can say so.
 */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.8909,
  GBP: 0.7575,
  JPY: 157.67,
  CAD: 1.371,
  AUD: 1.512,
  CHF: 0.798,
  CNY: 7.124,
  INR: 88.2,
  AED: 3.6725,
  SAR: 3.75,
  KWD: 0.307,
  EGP: 48.6,
  NGN: 1540,
  ZAR: 18.4,
  BRL: 5.42,
  MXN: 18.7,
  SEK: 10.5,
  NOK: 10.7,
  PLN: 3.94,
  TRY: 41.2,
  SGD: 1.345,
  HKD: 7.82,
  KRW: 1380,
  PKR: 278,
  IDR: 16250,
  MYR: 4.21,
  NZD: 1.642,
}

const CURRENCY_STORAGE_KEY = 'hobags_currency'
const RATES_CACHE_KEY = 'hobags_exchange_rates'
/**
 * Live providers refresh daily, so a cached set is treated as fresh for an hour.
 * A set that fell back to the built-in snapshot is never considered fresh, so it
 * is retried on every poll tick instead of waiting out the TTL.
 */
const CACHE_TTL_MS = 60 * 60 * 1000

/** Frankfurter mirrors the ECB reference rates; open.er-api is the fallback. */
const RATE_SOURCES = [
  { name: 'Frankfurter (ECB)', url: `https://api.frankfurter.app/latest?from=${BASE_CURRENCY}` },
  { name: 'open.er-api.com', url: `https://open.er-api.com/v6/latest/${BASE_CURRENCY}` },
]

function readStoredCurrency(): string {
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY)
    // Guard against a stale/hand-edited value so the formatter never throws.
    return saved && currencies.some(c => c.code === saved) ? saved : BASE_CURRENCY
  } catch {
    return BASE_CURRENCY
  }
}

function readCachedRates(): { rates: Record<string, number>; updatedAt: number } | null {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.updatedAt !== 'number' || !parsed.rates) return null
    return parsed
  } catch {
    return null
  }
}

function writeCachedRates(rates: Record<string, number>, updatedAt: number) {
  try {
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates, updatedAt }))
  } catch {
    /* storage full or blocked - live rates still work for this session */
  }
}

let state: CurrencyState = (() => {
  const cached = readCachedRates()
  return {
    currency: readStoredCurrency(),
    rates: cached ? { ...FALLBACK_RATES, ...cached.rates } : FALLBACK_RATES,
    updatedAt: cached ? cached.updatedAt : null,
    status: cached ? 'live' : 'idle',
    source: cached ? 'cache' : null,
  }
})()

const listeners = new Set<() => void>()

export function subscribeToCurrency(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function getCurrencyState(): CurrencyState {
  return state
}

function commit(patch: Partial<CurrencyState>) {
  state = { ...state, ...patch }
  listeners.forEach(fn => fn())
}

export function setCurrency(code: string): void {
  if (!currencies.some(c => c.code === code)) return
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code)
  } catch {
    /* ignore */
  }
  if (state.currency === code) return
  commit({ currency: code })
}

export function getCurrencyCode(): string {
  return state.currency
}

/** Convert a USD amount into the active (or given) currency. */
export function convert(amountUsd: number, code: string = state.currency): number {
  const amount = Number(amountUsd)
  if (!Number.isFinite(amount)) return 0
  if (code === BASE_CURRENCY) return amount
  const rate = state.rates[code]
  // Unknown currency: fall back to the base amount rather than NaN.
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0 ? amount * rate : amount
}

/**
 * Format a USD amount in the active currency, e.g. `formatPrice(89.5)` -> "$89.50"
 * or "¥14,113" in JPY (yen has no minor unit, which Intl handles for us).
 */
export function formatPrice(amountUsd: number, code: string = state.currency): string {
  const { locale } = getCurrency(code)
  const value = convert(amountUsd, code)
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      // Banker's-free, stable 2dp for major units; Intl drops decimals for JPY/KRW.
      minimumFractionDigits: undefined,
      maximumFractionDigits: undefined,
    }).format(value)
  } catch {
    // Unknown currency code - show the plain converted number with the symbol.
    return `${getCurrency(code).symbol}${value.toFixed(2)}`
  }
}

/** Numeric-only formatting (no currency symbol), for inputs and charts. */
export function formatNumber(value: number, maxDigits = 2): string {
  const { locale } = getCurrency(state.currency)
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(Number(value) || 0)
  } catch {
    return String(value)
  }
}

export function getRate(code: string): number | null {
  const rate = state.rates[code]
  return typeof rate === 'number' && rate > 0 ? rate : null
}

let inFlight: Promise<void> | null = null

/** Fetch fresh USD-based rates. Safe to call concurrently; de-duplicates. */
export async function refreshRates(options: { force?: boolean } = {}): Promise<void> {
  const { force = false } = options
  if (!force && state.updatedAt && Date.now() - state.updatedAt < CACHE_TTL_MS && state.status === 'live') {
    return
  }
  if (inFlight) return inFlight

  commit({ status: 'loading' })

  const run = async (): Promise<void> => {
    for (const source of RATE_SOURCES) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 12000)
        const response = await fetch(source.url, { signal: controller.signal, cache: 'no-store' })
        clearTimeout(timer)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = await response.json()
        const raw = payload?.rates
        if (!raw || typeof raw !== 'object') throw new Error('no rates in payload')

        const rates: Record<string, number> = { USD: 1 }
        for (const [code, value] of Object.entries(raw as Record<string, unknown>)) {
          const numeric = Number(value)
          if (Number.isFinite(numeric) && numeric > 0) rates[code] = numeric
        }
        if (Object.keys(rates).length < 5) throw new Error('rate payload too small')

        // open.er-api reports the publish time as a unix timestamp; Frankfurter
        // publishes a business date. Prefer the provider timestamp when present,
        // otherwise stamp "now" since the fetch itself just succeeded.
        const providerTs = Number(payload?.time_last_update_unix)
        const updatedAt = Number.isFinite(providerTs) && providerTs > 0 ? providerTs * 1000 : Date.now()

        writeCachedRates(rates, updatedAt)
        commit({ rates, updatedAt, status: 'live', source: source.name })
        inFlight = null
        return
      } catch {
        // Try the next provider.
      }
    }
    // Every provider failed. Keep whatever dated set we already have so prices
    // stay stable, but mark it as not live so the UI can say the rates are
    // approximate. With no dated set we are serving the built-in snapshot, which
    // is still better than NaN - so this is 'fallback', not 'error'.
    commit({
      status: 'fallback',
      rates: state.updatedAt ? state.rates : FALLBACK_RATES,
      source: state.updatedAt ? state.source : 'built-in snapshot',
    })
    inFlight = null
  }

  inFlight = run()
  return inFlight
}

/** Human-readable "updated N minutes ago" label for the Settings UI. */
export function describeUpdatedAt(updatedAt: number | null, now = Date.now()): string {
  if (!updatedAt) return 'never'
  const minutes = Math.max(0, Math.round((now - updatedAt) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.round(minutes / 60)
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  return `${Math.round(hours / 24)} days ago`
}