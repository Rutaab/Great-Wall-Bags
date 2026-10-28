import React from 'react'
import type { ActiveSale } from '../services/salePrices'
import { formatMoney, saleDiscountPct, saleLabel } from '../services/salePrices'

interface DealPriceProps {
  sale: ActiveSale
  originalPrice: number
  size?: 'sm' | 'lg'
}

export const DealPrice: React.FC<DealPriceProps> = ({ sale, originalPrice, size = 'sm' }) => {
  const big = size === 'lg'
  const pct = saleDiscountPct(sale)
  return (
    <span className="inline-flex items-baseline gap-1.5 flex-wrap">
      <span className={`text-[#ff7936] ${big ? 'text-3xl md:text-4xl font-black' : 'text-xl font-black'}`}>
        {formatMoney(sale.sale_price)}
      </span>
      {originalPrice > sale.sale_price && (
        <>
          <span className={`text-[#805030] line-through ${big ? 'text-lg' : 'text-xs'}`}>{formatMoney(originalPrice)}</span>
          <span className={`text-[10px] font-bold text-[#b9002c] bg-[#b9002c]/10 px-2 py-0.5 rounded-full ${big ? 'self-center' : ''}`}>-{pct}%</span>
        </>
      )}
    </span>
  )
}

interface DealTagProps {
  sale: ActiveSale
  compact?: boolean
}

export const DealTag: React.FC<DealTagProps> = ({ sale, compact }) => {
  return (
    <span className={`inline-flex items-center gap-1 font-black uppercase rounded-sm ${
      sale.sale_type === 'flash' ? 'bg-[#ff7936] text-white' : 'bg-[#004be3] text-white'
    } ${compact ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] px-2.5 py-1'}`}>
      <span className="material-symbols-outlined" style={{ fontSize: compact ? 10 : 12 }}>
        {sale.sale_type === 'flash' ? 'bolt' : 'campaign'}
      </span>
      {saleLabel(sale)}
    </span>
  )
}