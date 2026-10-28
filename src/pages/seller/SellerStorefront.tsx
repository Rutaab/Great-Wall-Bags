import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getStoredProducts } from '../../services/localProducts'
import { getActiveSale } from '../../services/salePrices'
import { DealPrice } from '../../components/DealPrice'
import type { ActiveSale } from '../../services/salePrices'
import { formatPrice } from '../../utils/currency'

interface StoreSettings {
  storeName: string
  storeDescription: string
  logo: string
  featuredProductIds: string[]
  internationalOrders: boolean
  promotions: boolean
  autoReply: boolean
}

interface ProductItem {
  id: string
  name: string
  price: number
  image: string
  deal?: ActiveSale | null
}

const defaultSettings: StoreSettings = {
  storeName: '',
  storeDescription: '',
  logo: '',
  featuredProductIds: [],
  internationalOrders: true,
  promotions: false,
  autoReply: true,
}

const SellerStorefront: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storageKey = user ? `hobags_seller_storefront_${user.id}` : ''

  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [myProducts, setMyProducts] = useState<ProductItem[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!user || !storageKey) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({ ...defaultSettings, ...parsed, storeName: parsed.storeName || `${user.name}'s Store` })
      } else {
        setSettings(s => ({ ...s, storeName: `${user.name}'s Store` }))
      }
    } catch {
      setSettings(s => ({ ...s, storeName: `${user.name}'s Store` }))
    }
    const all = getStoredProducts()
    const mine: ProductItem[] = all
      .filter(p => p.addedBy?.id === user.id && p.status === 'published')
      .map(p => ({ id: p.id, name: p.name, price: p.price, image: p.image, deal: getActiveSale(p.id) }))
    setMyProducts(mine)
    setInitialized(true)
  }, [user])

  const persist = (updated: StoreSettings) => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify(updated))
    setSettings(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => persist(settings)

  const handleReset = () => {
    const reset = { ...defaultSettings, storeName: user ? `${user.name}'s Store` : 'My Store' }
    persist(reset)
  }

  const handleLogoUpload = (files: FileList | null) => {
    if (!files || !files[0]) return
    const reader = new FileReader()
    reader.onload = (e) => update('logo', e.target?.result as string || '')
    reader.readAsDataURL(files[0])
  }

  const toggleFeatured = (productId: string) => {
    setSettings(prev => {
      const ids = prev.featuredProductIds.includes(productId)
        ? prev.featuredProductIds.filter(id => id !== productId)
        : prev.featuredProductIds.length < 4
          ? [...prev.featuredProductIds, productId]
          : prev.featuredProductIds
      return { ...prev, featuredProductIds: ids }
    })
  }

  const handlePreview = () => {
    if (!user) return
    window.open(`/store/${user.id}`, '_blank')
  }

  const featuredProducts = myProducts.filter(p => settings.featuredProductIds.includes(p.id))

  if (!initialized) return <SellerLayout><div className="p-8 text-center text-[#805030]">Loading...</div></SellerLayout>

  return (
    <SellerLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">My Storefront</h1>
          <p className="text-[#805030] font-medium text-sm">Customize how your brand looks to customers.</p>
        </div>
        <button onClick={handlePreview} className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">visibility</span>
          Preview Store
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
            <h2 className="text-lg font-black text-[#4a2507] mb-6">Brand Identity</h2>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[#4a2507] block mb-2">Store Name</label>
                <input
                  className="w-full bg-[#fff4f0] border border-[#dca079]/30 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent outline-none"
                  value={settings.storeName}
                  onChange={e => update('storeName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#4a2507] block mb-2">Store Description</label>
                <textarea
                  className="w-full bg-[#fff4f0] border border-[#dca079]/30 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent outline-none resize-none"
                  rows={4}
                  value={settings.storeDescription}
                  onChange={e => update('storeDescription', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#4a2507] block mb-2">Store Logo</label>
                <div
                  className="border-2 border-dashed border-[#dca079]/30 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-[#fff4f0] transition-colors cursor-pointer relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e.target.files)} />
                  {settings.logo ? (
                    <div className="text-center">
                      <img src={settings.logo} alt="Store logo" className="w-24 h-24 object-contain mx-auto mb-2 rounded-lg" />
                      <p className="text-xs text-[#805030]">Click to replace</p>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); update('logo', '') }}
                        className="mt-2 text-[10px] text-[#b9002c] font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-[#805030] mb-2">cloud_upload</span>
                      <p className="text-sm text-[#805030]">Upload your store logo (PNG, JPG, SVG)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-[#4a2507]">Featured Products</h2>
                <p className="text-sm text-[#805030] mt-1">Select up to 4 products to feature on your storefront.</p>
              </div>
              {myProducts.length > 0 && (
                <button onClick={() => setShowProductPicker(true)} className="px-4 py-2 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#fff4f0] transition-colors">
                  {settings.featuredProductIds.length > 0 ? 'Change' : 'Select Products'}
                </button>
              )}
            </div>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredProducts.map(p => (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden border border-[#dca079]/20">
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => toggleFeatured(p.id)} className="bg-white text-[#b9002c] rounded-full px-3 py-1 text-[10px] font-bold">Remove</button>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-[#4a2507] truncate">{p.name}</p>
                      {p.deal ? (
                        <DealPrice sale={p.deal} originalPrice={p.deal.original_price} />
                      ) : (
                        <p className="text-[9px] text-[#805030]">{formatPrice(p.price)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#805030]">
                <span className="material-symbols-outlined text-3xl mb-2">add_photo_alternate</span>
                <p className="text-sm">No featured products selected.</p>
                {myProducts.length > 0 ? (
                  <button onClick={() => setShowProductPicker(true)} className="mt-3 px-4 py-2 bg-[#004be3] text-white rounded-full text-xs font-bold">+ Select Products</button>
                ) : (
                  <button onClick={() => navigate('/seller/add-product')} className="mt-3 text-[#004be3] text-xs font-bold underline">Publish your first product</button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#dca079]/10 rounded-xl p-8">
            <h2 className="text-lg font-black text-[#4a2507] mb-6">Store Settings</h2>
            <div className="space-y-4">
              {[
                { key: 'internationalOrders' as const, label: 'Accept International Orders', desc: 'Ship to customers worldwide' },
                { key: 'promotions' as const, label: 'Enable Promotions', desc: 'Allow discount codes & flash sales' },
                { key: 'autoReply' as const, label: 'Auto-Reply to Reviews', desc: 'AI-generated response to customer reviews' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-[#fff4f0] rounded-xl cursor-pointer" onClick={() => update(item.key, !settings[item.key])}>
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-bold text-sm text-[#4a2507]">{item.label}</p>
                    <p className="text-[10px] text-[#805030]">{item.desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${settings[item.key] ? 'bg-[#9e3c00]' : 'bg-[#dca079]/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${settings[item.key] ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#9e3c00] to-[#ff7936] rounded-xl p-8 text-white">
            <span className="material-symbols-outlined text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
            <h3 className="font-black text-lg mb-2">Boost Your Sales</h3>
            <p className="text-sm text-white/80 mb-4">Promote your bestsellers with targeted campaigns.</p>
            <button onClick={() => navigate('/seller/campaigns')} className="bg-white text-[#9e3c00] font-bold px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity">
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 items-center">
        {saved && <span className="text-sm text-green-600 font-semibold">Settings saved!</span>}
        <button onClick={handleReset} className="px-8 py-3 border border-[#dca079]/30 rounded-full font-bold text-sm text-[#805030] hover:bg-[#fff4f0] transition-colors">Reset</button>
        <button onClick={handleSave} className="px-8 py-3 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all">Save Changes</button>
      </div>

      {showProductPicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setShowProductPicker(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-[90vw] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#dca079]/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-[#4a2507]">Select Featured Products</h2>
              <button onClick={() => setShowProductPicker(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ffede4] transition-colors">
                <span className="material-symbols-outlined text-[#805030]">close</span>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-[#ffede4]">
                <span className="text-[10px] font-bold text-[#805030] uppercase">{settings.featuredProductIds.length}/4 selected</span>
              </div>
              {myProducts.map(p => {
                const isFeatured = settings.featuredProductIds.includes(p.id)
                return (
                  <button key={p.id} onClick={() => toggleFeatured(p.id)} disabled={!isFeatured && settings.featuredProductIds.length >= 4}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${
                      isFeatured ? 'bg-[#ff7936]/10 border-[#ff7936]/30' : 'bg-[#fff4f0] border-transparent hover:bg-[#ffede4] disabled:opacity-40'
                    }`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isFeatured ? 'bg-[#ff7936] border-[#ff7936]' : 'border-[#dca079]/50'}`}>
                      {isFeatured && <span className="material-symbols-outlined text-white text-xs">check</span>}
                    </div>
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#4a2507] truncate">{p.name}</p>
                      {p.deal ? (
                        <DealPrice sale={p.deal} originalPrice={p.deal.original_price} />
                      ) : (
                        <p className="text-[10px] text-[#805030]">{formatPrice(p.price)}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  )
}

export default SellerStorefront
