import React, { useEffect, useMemo, useState } from 'react'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getProductsByUser } from '../../services/localProducts'
import type { LocalProduct } from '../../services/localProducts'
import { notifyDealsChanged } from '../../services/salePrices'

type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'ended'

interface Campaign {
  id: string
  name: string
  product_id: string
  product_name: string
  product_image: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  original_price: number
  sale_price: number
  starts_at: string
  ends_at: string
  status: CampaignStatus
  sold: number
  max_units?: number
  createdAt: string
}

const statusColors: Record<CampaignStatus, string> = {
  active: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-yellow-100 text-yellow-700',
  ended: 'bg-gray-200 text-gray-500',
}

const statusLabels: Record<CampaignStatus, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  draft: 'Draft',
  paused: 'Paused',
  ended: 'Ended',
}

function storageKey(sellerId: string): string {
  return `hobags_seller_campaigns_${sellerId}`
}

function loadCampaigns(sellerId: string): Campaign[] {
  try {
    const raw = localStorage.getItem(storageKey(sellerId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCampaigns(sellerId: string, campaigns: Campaign[]): void {
  localStorage.setItem(storageKey(sellerId), JSON.stringify(campaigns))
  notifyDealsChanged()
}

function rollover(campaigns: Campaign[]): { list: Campaign[]; changed: boolean } {
  const now = Date.now()
  let changed = false
  const list = campaigns.map(c => {
    if (c.status === 'scheduled' && c.starts_at && new Date(c.starts_at).getTime() <= now) {
      changed = true
      return { ...c, status: 'active' as CampaignStatus }
    }
    if (c.status === 'active' && c.ends_at && new Date(c.ends_at).getTime() <= now) {
      changed = true
      return { ...c, status: 'ended' as CampaignStatus }
    }
    return c
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

const defaultForm = (): Omit<Campaign, 'id' | 'status' | 'sold' | 'createdAt'> => {
  const now = new Date()
  const end = new Date(now.getTime() + 7 * 86400000)
  return {
    name: '',
    product_id: '',
    product_name: '',
    product_image: '',
    discount_type: 'percentage',
    discount_value: 10,
    original_price: 0,
    sale_price: 0,
    starts_at: fromLocalInput(now.toISOString()),
    ends_at: fromLocalInput(end.toISOString()),
    max_units: undefined,
  }
}

const SellerCampaigns: React.FC = () => {
  const { user } = useAuth()
  const sellerId = user?.id || ''

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [productId, setProductId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm())
  const [formError, setFormError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!sellerId) return
    setProducts(getProductsByUser(sellerId))
    const { list, changed } = rollover(loadCampaigns(sellerId))
    if (changed) saveCampaigns(sellerId, list)
    setCampaigns(list)
  }, [sellerId])

  const counts = useMemo(() => {
    const c = { active: 0, scheduled: 0, draft: 0, paused: 0, ended: 0, total: campaigns.length }
    campaigns.forEach(x => { c[x.status]++ })
    return c
  }, [campaigns])

  const salesProduct = useMemo(
    () => products.find(p => p.id === productId),
    [products, productId]
  )

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const raw = e.target.value
    setForm(prev => {
      const next = { ...prev, [field]: raw } as typeof prev
      if (field === 'original_price' || field === 'discount_type' || field === 'discount_value') {
        next.sale_price = computeSalePrice(
          Number(next.original_price) || 0,
          next.discount_type,
          Number(next.discount_value) || 0
        )
      }
      return next
    })
  }

  const startNew = () => {
    setEditingId(null)
    setForm(defaultForm())
    setProductId(products[0]?.id || '')
    setFormError('')
    setShowForm(true)
  }

  const onProductChange = (pid: string) => {
    setProductId(pid)
    const product = products.find(p => p.id === pid)
    if (!product) return
    const original = Number(product.price) || 0
    const sale = computeSalePrice(original, form.discount_type, Number(form.discount_value) || 0)
    setForm(prev => ({ ...prev, original_price: original, sale_price: sale }))
  }

  const editCampaign = (c: Campaign) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      product_id: c.product_id,
      product_name: c.product_name,
      product_image: c.product_image,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      original_price: c.original_price,
      sale_price: c.sale_price,
      starts_at: toLocalInput(c.starts_at) || toLocalInput(defaultForm().starts_at),
      ends_at: toLocalInput(c.ends_at) || toLocalInput(defaultForm().ends_at),
      max_units: c.max_units,
    })
    setProductId(c.product_id || '')
    setFormError('')
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormError('')
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const name = form.name.trim()
    const starts = form.starts_at
    const ends = form.ends_at
    const original = Number(form.original_price) || 0
    const sale = Number(form.sale_price) || 0

    if (name.length < 2) return setFormError('Campaign name must be at least 2 characters')
    if (!productId) return setFormError('Please select a product for this campaign')
    const selectedProduct = products.find(p => p.id === productId)
    if (!selectedProduct) return setFormError('Selected product no longer exists')
    if (!starts) return setFormError('Start date is required')
    if (!ends) return setFormError('End date is required')
    if (new Date(ends).getTime() <= new Date(starts).getTime()) return setFormError('End date must be after start date')
    if (original <= 0) return setFormError('Please enter a valid original price')
    if (sale <= 0 || sale >= original) return setFormError('Discount must produce a sale price between $0 and the original price')
    if (form.max_units !== undefined && form.max_units !== '' && (isNaN(Number(form.max_units)) || Number(form.max_units) <= 0)) {
      return setFormError('Max units must be a positive number')
    }

    const nowIso = new Date().toISOString()
    if (editingId) {
      const next = campaigns.map(c =>
        c.id === editingId
          ? {
              ...c,
              name,
              product_id: productId,
              product_name: selectedProduct.name,
              product_image: selectedProduct.image,
              discount_type: form.discount_type,
              discount_value: Number(form.discount_value) || 0,
              original_price: original,
              sale_price: sale,
              starts_at: fromLocalInput(starts),
              ends_at: fromLocalInput(ends),
              max_units: form.max_units === '' || form.max_units === undefined ? undefined : Number(form.max_units),
            }
          : c
      )
      setCampaigns(next)
      saveCampaigns(sellerId, next)
      setSavedMsg('Campaign updated')
    } else {
      const campaign: Campaign = {
        id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name,
        product_id: productId,
        product_name: selectedProduct.name,
        product_image: selectedProduct.image,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value) || 0,
        original_price: original,
        sale_price: sale,
        starts_at: fromLocalInput(starts),
        ends_at: fromLocalInput(ends),
        status: 'draft',
        sold: 0,
        max_units: form.max_units === '' || form.max_units === undefined ? undefined : Number(form.max_units),
        createdAt: nowIso,
      }
      const next = [...campaigns, campaign]
      setCampaigns(next)
      saveCampaigns(sellerId, next)
      setSavedMsg('Campaign saved as draft')
    }
    setTimeout(() => setSavedMsg(''), 3000)
    setShowForm(false)
    setEditingId(null)
  }

  const setStatus = (id: string, status: CampaignStatus) => {
    const next = campaigns.map(c => (c.id === id ? { ...c, status } : c))
    setCampaigns(next)
    saveCampaigns(sellerId, next)
  }

  const toggleLaunch = (c: Campaign) => {
    if (c.status === 'draft') {
      const startPassed = c.starts_at && new Date(c.starts_at).getTime() <= Date.now()
      setStatus(c.id, startPassed ? 'active' : 'scheduled')
      return
    }
    if (c.status === 'active') return setStatus(c.id, 'paused')
    if (c.status === 'paused') return setStatus(c.id, 'active')
  }

  const endCampaign = (c: Campaign) => {
    setStatus(c.id, 'ended')
  }

  const deleteCampaign = (c: Campaign) => {
    if (!window.confirm(`Delete campaign "${c.name}"? This cannot be undone.`)) return
    const next = campaigns.filter(x => x.id !== c.id)
    setCampaigns(next)
    saveCampaigns(sellerId, next)
  }

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Campaigns</h1>
          <p className="text-[#805030] font-medium text-sm">Start and manage your promotional campaigns</p>
        </div>
        <button onClick={startNew} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          Start New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active', value: counts.active, icon: 'campaign', color: 'bg-green-600' },
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

      {savedMsg && <p className="bg-green-50 text-green-700 text-sm font-bold px-4 py-3 rounded-xl border border-green-100 mb-6">{savedMsg}</p>}

      {showForm && (
        <form onSubmit={submitForm} className="bg-white rounded-xl border border-[#dca079]/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-[#4a2507]">{editingId ? 'Edit Campaign' : 'Start New Campaign'}</h3>
            <button type="button" onClick={cancelForm} className="text-xs font-bold text-[#805030] hover:text-[#9e3c00]">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Campaign Name</label>
              <input
                value={form.name}
                onChange={update('name')}
                placeholder="e.g. Summer Tote Blast"
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>

            {products.length > 0 && (
              <>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Product</label>
                  <select value={productId} onChange={e => onProductChange(e.target.value)} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.status === 'draft' ? '(draft)' : ''} — {formatMoney(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {salesProduct && (
                  <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-[#fff4f0]">
                    <div className="w-14 h-14 rounded-xl bg-[#ffe3d3] overflow-hidden flex-shrink-0">
                      {salesProduct.image ? (
                        <img src={salesProduct.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9e3c00]">
                          <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#4a2507] truncate">{salesProduct.name}</p>
                      <p className="text-[11px] text-[#805030]">Original: {formatMoney(salesProduct.price)} · Base price is used when selecting a product</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {products.length === 0 && (
              <div className="md:col-span-2 text-xs font-semibold text-[#b9002c] bg-[#b9002c]/5 px-3 py-2 rounded-lg">
                No products yet — create a product first, then start a campaign on it.
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Discount Type</label>
              <select value={form.discount_type} onChange={update('discount_type')} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">
                {form.discount_type === 'percentage' ? 'Discount %' : 'Discount Amount ($)'}
              </label>
              <input
                type="number"
                min="0"
                value={form.discount_value}
                onChange={update('discount_value')}
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Original Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.original_price || ''}
                onChange={update('original_price')}
                placeholder="99.99"
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Sale Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.sale_price || ''}
                readOnly
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none text-[#9e3c00] font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Start Date</label>
              <input type="datetime-local" value={form.starts_at} onChange={update('starts_at')} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">End Date</label>
              <input type="datetime-local" value={form.ends_at} onChange={update('ends_at')} className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase block mb-1">Max Units (optional)</label>
              <input
                type="number"
                min="1"
                value={form.max_units ?? ''}
                onChange={update('max_units')}
                placeholder="e.g. 100"
                className="w-full bg-[#fff4f0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
              />
            </div>
          </div>

          {formError && <p className="text-[#b9002c] text-sm font-bold mb-3">{formError}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancelForm} className="px-5 py-2.5 text-sm font-semibold text-[#805030] bg-[#fff4f0] hover:bg-[#ffede4] rounded-full transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-sm font-bold shadow-sm">
              {editingId ? 'Save Changes' : 'Save Campaign'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...campaigns]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(c => {
            const isActive = c.status === 'active'
            const discountPct = c.discount_type === 'percentage' ? c.discount_value : Math.round((1 - c.sale_price / c.original_price) * 100)
            return (
              <div key={c.id} className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${isActive ? 'border-[#ff7936]/30 ring-1 ring-[#ff7936]/20' : 'border-[#dca079]/10'}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                  <span className="text-xs text-[#805030]">
                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `${formatMoney(c.discount_value)} OFF`}
                  </span>
                </div>

                <h3 className="font-bold text-[#4a2507] mb-1">{c.name}</h3>

                {c.product_name && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ffe3d3] overflow-hidden flex-shrink-0">
                      {c.product_image ? (
                        <img src={c.product_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9e3c00]">
                          <span className="material-symbols-outlined text-sm">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#805030] truncate">{c.product_name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-[#ff7936]">{formatMoney(c.sale_price)}</span>
                  <span className="text-xs text-[#805030] line-through">{formatMoney(c.original_price)}</span>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">-{discountPct}%</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#805030] mb-3">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                    {formatDate(c.starts_at)} → {formatDate(c.ends_at)}
                  </span>
                </div>

                {c.max_units ? (
                  <div className="w-full h-1.5 bg-[#ffede4] rounded-full mb-3">
                    <div className="h-full bg-[#ff7936] rounded-full" style={{ width: `${Math.min(100, (c.sold / c.max_units) * 100)}%` }} />
                  </div>
                ) : (
                  <div className="h-1.5 mb-3" />
                )}

                <div className="flex items-center gap-2">
                  {c.status === 'draft' && (
                    <button onClick={() => toggleLaunch(c)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      Launch Campaign
                    </button>
                  )}
                  {c.status === 'active' && (
                    <button onClick={() => toggleLaunch(c)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
                      Pause
                    </button>
                  )}
                  {c.status === 'paused' && (
                    <button onClick={() => toggleLaunch(c)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                      Resume
                    </button>
                  )}
                  {c.status === 'scheduled' && (
                    <button onClick={() => toggleLaunch(c)} className="flex-1 py-1.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors">
                      Pause
                    </button>
                  )}
                  {(c.status === 'active' || c.status === 'paused' || c.status === 'scheduled') && (
                    <button onClick={() => endCampaign(c)} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      End
                    </button>
                  )}
                  <button
                    onClick={() => editCampaign(c)}
                    title="Edit"
                    className="p-1.5 rounded-full text-[#805030] hover:bg-[#ffede4] hover:text-[#9e3c00] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => deleteCampaign(c)}
                    title="Delete"
                    className="p-1.5 rounded-full text-[#805030] hover:bg-[#ffede4] hover:text-[#b9002c] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            )
          })}

        {campaigns.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">campaign</span>
            <p className="font-bold">No campaigns yet</p>
            <p className="text-sm mt-1 mb-4">Start your first campaign to promote your products.</p>
            <button onClick={startNew} className="px-5 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm">
              Start New Campaign
            </button>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}

export default SellerCampaigns