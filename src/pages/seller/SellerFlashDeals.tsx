import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getProductsByUser } from '../../services/localProducts'
import type { LocalProduct } from '../../services/localProducts'

type DealStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'ended'

interface FlashDeal {
  id: string
  product_id: string
  product_name: string
  product_image: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  original_price: number
  sale_price: number
  starts_at: string
  ends_at: string
  status: DealStatus
  sold: number
  max_units?: number
  createdAt: string
}

const statusColors: Record<DealStatus, string> = {
  active: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-yellow-100 text-yellow-700',
  ended: 'bg-gray-200 text-gray-500',
}

const statusLabels: Record<DealStatus, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  draft: 'Draft',
  paused: 'Paused',
  ended: 'Ended',
}

function storageKey(sellerId: string): string {
  return `hobags_seller_flashdeals_${sellerId}`
}

function loadDeals(sellerId: string): FlashDeal[] {
  try {
    const raw = localStorage.getItem(storageKey(sellerId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDeals(sellerId: string, deals: FlashDeal[]): void {
  localStorage.setItem(storageKey(sellerId), JSON.stringify(deals))
}

function rollover(deals: FlashDeal[]): { list: FlashDeal[]; changed: boolean } {
  const now = Date.now()
  let changed = false
  const list = deals.map(d => {
    if (d.status === 'scheduled' && d.starts_at && new Date(d.starts_at).getTime() <= now) {
      changed = true
      return { ...d, status: 'active' as DealStatus }
    }
    if (d.status === 'active' && d.ends_at && new Date(d.ends_at).getTime() <= now) {
      changed = true
      return { ...d, status: 'ended' as DealStatus }
    }
    return d
  })
  return { list, changed }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toLocalInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromLocalInput(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  return isNaN(d.getTime()) ? '' : d.toISOString()
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function computeSalePrice(original: number, type: string, value: number): number {
  if (type === 'percentage') {
    const pct = Math.min(100, Math.max(0, value))
    return Math.round(original * (100 - pct)) / 100
  }
  if (type === 'fixed') {
    return Math.max(0, original - value)
  }
  return original
}

const SellerFlashDeals: React.FC = () => {
  const { user } = useAuth()
  const sellerId = user?.id || ''

  const [deals, setDeals] = useState<FlashDeal[]>([])
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [msg, setMsg] = useState('')

  const [productId, setProductId] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(20)
  const [startsAt, setStartsAt] = useState(fromLocalInput(new Date().toISOString()))
  const [endsAt, setEndsAt] = useState(fromLocalInput(new Date(Date.now() + 7 * 86400000).toISOString()))
  const [maxUnits, setMaxUnits] = useState<number | ''>('')

  useEffect(() => {
    if (!sellerId) return
    setProducts(getProductsByUser(sellerId))
    const { list, changed } = rollover(loadDeals(sellerId))
    if (changed) saveDeals(sellerId, list)
    setDeals(list)
  }, [sellerId])

  const selectedProduct = useMemo(
    () => products.find(p => p.id === productId),
    [products, productId]
  )

  const salePrice = useMemo(
    () => computeSalePrice(selectedProduct?.price || 0, discountType, discountValue),
    [selectedProduct, discountType, discountValue]
  )

  const counts = useMemo(() => {
    const c = { active: 0, scheduled: 0, draft: 0, paused: 0, ended: 0, total: deals.length }
    deals.forEach(d => { c[d.status]++ })
    return c
  }, [deals])

  const flashNow = (v: string): string => fromLocalInput(v)

  const openForm = () => {
    setFormError('')
    const firstId = products[0]?.id || ''
    setProductId(firstId)
    setDiscountType('percentage')
    setDiscountValue(20)
    setStartsAt(fromLocalInput(new Date().toISOString()))
    setEndsAt(fromLocalInput(new Date(Date.now() + 7 * 86400000).toISOString()))
    setMaxUnits('')
    setShowForm(true)
  }

  const submitDeal = (e: React.FormEvent, launch: boolean) => {
    e.preventDefault()
    createDeal(launch)
  }

  const createDeal = (launch: boolean) => {
    setFormError('')
    const product = products.find(p => p.id === productId)
    if (!product) return setFormError('Please select a product for the flash deal')
    const original = Number(product.price) || 0
    if (original <= 0) return setFormError('Selected product has an invalid price')
    if (!startsAt) return setFormError('Start date is required')
    if (!endsAt) return setFormError('End date is required')
    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) return setFormError('End date must be after start date')
    if (salePrice <= 0 || salePrice >= original) return setFormError('Discount must produce a sale price between $0 and the original price')
    if (maxUnits !== '' && (isNaN(Number(maxUnits)) || Number(maxUnits) <= 0)) return setFormError('Max units must be a positive number')

    const deal: FlashDeal = {
      id: `fd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      discount_type: discountType,
      discount_value: Number(discountValue) || 0,
      original_price: original,
      sale_price: salePrice,
      starts_at: flashNow(startsAt),
      ends_at: flashNow(endsAt),
      status: launch
        ? new Date(startsAt).getTime() <= Date.now() ? 'active' : 'scheduled'
        : 'draft',
      sold: 0,
      max_units: maxUnits === '' ? undefined : Number(maxUnits),
      createdAt: new Date().toISOString(),
    }

    const next = [...deals, deal]
    setDeals(next)
    saveDeals(sellerId, next)
    setMsg(launch ? 'Flash deal launched' : 'Flash deal saved as draft')
    setTimeout(() => setMsg(''), 3000)
    setShowForm(false)
  }

  const updateStatus = (id: string, status: DealStatus) => {
    const next = deals.map(d => (d.id === id ? { ...d, status } : d))
    setDeals(next)
    saveDeals(sellerId, next)
  }

  const toggleLaunch = (d: FlashDeal) => {
    if (d.status === 'draft') {
      const startPassed = d.starts_at && new Date(d.starts_at).getTime() <= Date.now()
      updateStatus(d.id, startPassed ? 'active' : 'scheduled')
      return
    }
    if (d.status === 'active') return updateStatus(d.id, 'paused')
    if (d.status === 'paused') return updateStatus(d.id, 'active')
  }

  const deleteDeal = (d: FlashDeal) => {
    if (!window.confirm(`Delete flash deal "${d.product_name}"? This cannot be undone.`)) return
    const next = deals.filter(x => x.id !== d.id)
    setDeals(next)
    saveDeals(sellerId, next)
  }

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Flash Deals</h1>
          <p className="text-[#805030] font-medium text-sm">Create and manage time-limited promotions on your real products</p>
        </div>
        <button onClick={() => showForm ? setShowForm(false) : openForm()} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Close' : 'New Flash Deal'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active', value: counts.active, icon: 'local_fire_department', color: 'bg-[#ff7936]' },
          { label: 'Scheduled', value: counts.scheduled, icon: 'schedule', color: 'bg-[#004be3]' },
          { label: 'Draft', value: counts.draft, icon: 'edit_note', color: 'bg-[#805030]' },
          { label: 'Ended', value: counts.ended, icon: 'flag', color: 'bg-[#4a2507]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#dca079]/10 shadow-sm">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined text-white text-base">{s.icon}</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{s.value}</p>
            <p className="text-xs text-[#805030] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {msg && <p className="bg-green-50 text-green-700 text-sm font-bold px-4 py-3 rounded-xl border border-green-100 mb-6">{msg}</p>}

      {products.length === 0 && (
        <div className="bg-white rounded-xl border border-[#dca079]/10 p-16 text-center mb-6">
          <span className="material-symbols-outlined text-4xl text-[#dca079] mb-3">inventory_2</span>
          <p className="font-bold text-[#4a2507]">No products yet</p>
          <p className="text-sm text-[#805030] mt-1 mb-4">Create a product first, then launch a flash deal on it.</p>
          <Link to="/seller/add-product" className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm">
            Add Product
          </Link>
        </div>
      )}

      {showForm && products.length > 0 && (
        <form onSubmit={e => submitDeal(e, true)} className="bg-white rounded-xl border border-[#dca079]/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-[#4a2507]">Create Flash Deal</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-[#805030] hover:text-[#9e3c00]">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Product</label>
              <select value={productId} onChange={e => setProductId(e.target.value)} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.status === 'draft' ? '(draft)' : ''} — {formatMoney(p.price)}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-[#fff4f0]">
                <div className="w-14 h-14 rounded-xl bg-[#ffe3d3] overflow-hidden flex-shrink-0">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9e3c00]">
                      <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#4a2507] truncate">{selectedProduct.name}</p>
                  <p className="text-xs text-[#805030]">Original: {formatMoney(selectedProduct.price)} · {selectedProduct.category}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Discount Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">
                {discountType === 'percentage' ? 'Discount %' : 'Discount Amount ($)'}
              </label>
              <input
                type="number"
                min="0"
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Sale Price ($)</label>
              <input
                type="number"
                value={salePrice || ''}
                readOnly
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none text-[#9e3c00] font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Max Units (optional)</label>
              <input
                type="number"
                min="1"
                value={maxUnits}
                onChange={e => setMaxUnits(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 100"
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Start Date</label>
              <input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">End Date</label>
              <input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
            </div>
          </div>

          {formError && <p className="text-[#b9002c] text-sm font-bold mb-3">{formError}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => createDeal(false)} className="px-5 py-2.5 text-sm font-semibold text-[#805030] bg-[#fff4f0] hover:bg-[#ffede4] rounded-full transition-colors">
              Save Draft
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-sm font-bold shadow-sm">
              Launch Deal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...deals]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(d => {
            const isActive = d.status === 'active'
            const discountPct = d.discount_type === 'percentage' ? d.discount_value : Math.round((1 - d.sale_price / d.original_price) * 100)
            return (
              <div key={d.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${isActive ? 'border-[#ff7936]/30 ring-1 ring-[#ff7936]/20' : 'border-[#dca079]/10'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${statusColors[d.status]}`}>{statusLabels[d.status]}</span>
                  <span className="text-xs text-[#805030]">
                    {d.discount_type === 'percentage' ? `${d.discount_value}% OFF` : `${formatMoney(d.discount_value)} OFF`}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-[#ffe3d3] overflow-hidden flex-shrink-0">
                    {d.product_image ? (
                      <img src={d.product_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9e3c00]">
                        <span className="material-symbols-outlined text-sm">inventory_2</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#4a2507] truncate">{d.product_name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-[#ff7936]">{formatMoney(d.sale_price)}</span>
                      <span className="text-xs text-[#805030] line-through">{formatMoney(d.original_price)}</span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">-{discountPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#805030] mb-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                    {formatDate(d.starts_at)} → {formatDate(d.ends_at)}
                  </span>
                </div>

                {d.max_units ? (
                  <div className="w-full h-1.5 bg-[#ffede4] rounded-full mb-3">
                    <div className="h-full bg-[#ff7936] rounded-full" style={{ width: `${Math.min(100, (d.sold / d.max_units) * 100)}%` }} />
                  </div>
                ) : (
                  <div className="h-1.5 mb-3" />
                )}

                <div className="flex items-center gap-2">
                  {d.status === 'draft' && (
                    <button onClick={() => toggleLaunch(d)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      Launch Deal
                    </button>
                  )}
                  {d.status === 'active' && (
                    <button onClick={() => toggleLaunch(d)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
                      Pause
                    </button>
                  )}
                  {d.status === 'paused' && (
                    <button onClick={() => toggleLaunch(d)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      Resume
                    </button>
                  )}
                  {d.status === 'scheduled' && (
                    <button onClick={() => toggleLaunch(d)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
                      Pause
                    </button>
                  )}
                  {(d.status === 'active' || d.status === 'paused' || d.status === 'scheduled') && (
                    <button onClick={() => updateStatus(d.id, 'ended')} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      End
                    </button>
                  )}
                  <button
                    onClick={() => deleteDeal(d)}
                    title="Delete"
                    className="p-1.5 rounded-full text-[#805030] hover:bg-[#ffede4] hover:text-[#b9002c] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            )
          })}

        {deals.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">local_fire_department</span>
            <p className="font-bold">No flash deals yet</p>
            <p className="text-sm mt-1">Create a limited-time deal to drive urgent sales.</p>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}

export default SellerFlashDeals