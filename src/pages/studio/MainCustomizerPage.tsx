import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import StudioLayout from '../../components/studio/StudioLayout'
import Bag3DView from '../../components/studio/Bag3DView'
import ColorSwatch from '../../components/studio/ColorSwatch'
import MaterialCard from '../../components/studio/MaterialCard'
import ConfigSection from '../../components/studio/ConfigSection'
import { useCustomization, type ExteriorMaterial, type HardwareFinish, type StrapType, type InteriorLayout } from '../../contexts/CustomizationContext'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/currency'

type MainCategory = 'shape' | 'exterior' | 'hardware' | 'interior' | 'straps' | 'addons'

interface SidebarItem {
  key: MainCategory
  label: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  { key: 'shape', label: 'Shape', icon: 'shopping_bag' },
  { key: 'exterior', label: 'Exterior', icon: 'palette' },
  { key: 'hardware', label: 'Hardware', icon: 'handyman' },
  { key: 'interior', label: 'Interior', icon: 'chair' },
  { key: 'straps', label: 'Straps', icon: 'straighten' },
  { key: 'addons', label: 'Add-ons', icon: 'extension' },
]

const exteriorColors = [
  { color: '#8B4513', label: 'Saddle Brown' },
  { color: '#2F1B0E', label: 'Espresso' },
  { color: '#1C1C1C', label: 'Obsidian' },
  { color: '#800020', label: 'Burgundy' },
  { color: '#4A6741', label: 'Forest' },
  { color: '#2C3E50', label: 'Midnight' },
  { color: '#D2691E', label: 'Caramel' },
  { color: '#FFF8DC', label: 'Cream' },
  { color: '#708090', label: 'Slate' },
  { color: '#E8D5B7', label: 'Tan' },
  { color: '#CD853F', label: 'Peru' },
  { color: '#A0522D', label: 'Sienna' },
  { color: '#36454F', label: 'Charcoal' },
  { color: '#B22222', label: 'Firebrick' },
  { color: '#556B2F', label: 'Olive' },
]

const interiorColors = [
  { color: '#D2B48C', label: 'Tan' },
  { color: '#8B4513', label: 'Brown' },
  { color: '#2F2F2F', label: 'Dark' },
  { color: '#800020', label: 'Burgundy' },
  { color: '#4A6741', label: 'Forest' },
  { color: '#708090', label: 'Slate' },
  { color: '#FFF8DC', label: 'Cream' },
  { color: '#CD853F', label: 'Gold' },
]

const materials: { key: ExteriorMaterial; label: string; desc: string; pattern: 'leather' | 'canvas' | 'suede' | 'vegan' }[] = [
  { key: 'full-grain', label: 'Full-Grain Leather', desc: 'Premium durability, natural patina', pattern: 'leather' },
  { key: 'top-grain', label: 'Top-Grain Leather', desc: 'Smooth finish, refined look', pattern: 'leather' },
  { key: 'saffiano', label: 'Saffiano Leather', desc: 'Crosshatch texture, scratch resistant', pattern: 'leather' },
  { key: 'suede', label: 'Suede', desc: 'Soft nap, luxurious feel', pattern: 'suede' },
  { key: 'canvas', label: 'Premium Canvas', desc: 'Lightweight, durable, casual', pattern: 'canvas' },
  { key: 'vegan-leather', label: 'Vegan Leather', desc: 'Eco-friendly, cruelty-free', pattern: 'vegan' },
]

const hardwareOptions: { key: HardwareFinish; label: string; color: string }[] = [
  { key: 'gold', label: 'Gold', color: '#D4A017' },
  { key: 'silver', label: 'Silver', color: '#C0C0C0' },
  { key: 'matte-black', label: 'Matte Black', color: '#2F2F2F' },
  { key: 'brass', label: 'Brass', color: '#B5A642' },
  { key: 'rose-gold', label: 'Rose Gold', color: '#B76E79' },
]

const strapOptions: { key: StrapType; label: string; desc: string }[] = [
  { key: 'standard', label: 'Standard', desc: 'Matching leather handles' },
  { key: 'crossbody', label: 'Crossbody', desc: 'Long adjustable strap' },
  { key: 'chain', label: 'Chain', desc: 'Elegant metal chain' },
  { key: 'woven', label: 'Woven', desc: 'Artisan woven design' },
  { key: 'detachable', label: 'Detachable', desc: 'Removable strap' },
]

const interiorLayouts: { key: InteriorLayout; label: string; desc: string }[] = [
  { key: 'standard', label: 'Standard', desc: 'Open main compartment' },
  { key: 'tech-sleeve', label: 'Tech Sleeve', desc: 'Padded laptop pocket' },
  { key: 'organizer', label: 'Organizer', desc: 'Multiple zip pockets' },
  { key: 'minimal', label: 'Minimal', desc: 'Slim, lightweight build' },
]

const addonOptions = [
  { key: 'dust-bag', label: 'Dust Bag', icon: 'inventory_2' },
  { key: 'shoulder-pad', label: 'Shoulder Pad', icon: 'padding' },
  { key: 'lock-set', label: 'Lock Set', icon: 'lock' },
  { key: 'luggage-tag', label: 'Luggage Tag', icon: 'local_offer' },
  { key: 'key-holder', label: 'Key Holder', icon: 'vpn_key' },
]

const shapeOptions = [
  { key: 'tote' as const, label: 'Tote', icon: 'shopping_bag' },
  { key: 'crossbody' as const, label: 'Crossbody', icon: 'luggage' },
  { key: 'backpack' as const, label: 'Backpack', icon: 'backpack' },
  { key: 'clutch' as const, label: 'Clutch', icon: 'work' },
]

const MainCustomizerPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const {
    state, setExteriorColor, setExteriorMaterial, setHardwareFinish,
    setInteriorColor, setInteriorLayout, setStrapType, setMonogramText,
    setMonogramFont, toggleAddon, setBagShape, resetDesign, estimatedPrice,
    saveDesign,
  } = useCustomization()

  const [activeCategory, setActiveCategory] = useState<MainCategory>('exterior')
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  useEffect(() => {
    if (savedToast) {
      const t = setTimeout(() => setSavedToast(false), 2000)
      return () => clearTimeout(t)
    }
  }, [savedToast])

  const handleSave = useCallback(() => {
    saveDesign()
    setSavedToast(true)
  }, [saveDesign])

  const materialLabel = materials.find(m => m.key === state.exteriorMaterial)?.label || state.exteriorMaterial
  const shapeLabel = shapeOptions.find(s => s.key === state.bagShape)?.label || state.bagShape
  const hardwareLabel = hardwareOptions.find(h => h.key === state.hardwareFinish)?.label || state.hardwareFinish

  const handleAddToCart = useCallback(async () => {
    await addToCart({
      id: `custom_${Date.now()}`,
      name: `Custom ${shapeLabel} · ${materialLabel} · ${hardwareLabel}`,
      price: estimatedPrice,
      image: '',
    })
    navigate('/cart')
  }, [state, estimatedPrice, navigate, addToCart, shapeLabel, materialLabel, hardwareLabel])

  const renderRightPanel = () => {
    switch (activeCategory) {
      case 'shape':
        return (
          <ConfigSection title="Bag Shape">
            <div className="grid grid-cols-2 gap-3">
              {shapeOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setBagShape(opt.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    state.bagShape === opt.key
                      ? 'border-[#9e3c00] bg-[#fff4f0]'
                      : 'border-[#dca079]/20 bg-white hover:border-[#dca079]/40'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${state.bagShape === opt.key ? 'text-[#9e3c00]' : 'text-[#805030]'}`}>{opt.icon}</span>
                  <span className={`text-xs font-bold ${state.bagShape === opt.key ? 'text-[#9e3c00]' : 'text-[#805030]'}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </ConfigSection>
        )

      case 'exterior':
        return (
          <>
            <ConfigSection title="Exterior Color">
              <div className="flex flex-wrap gap-2">
                {exteriorColors.map(c => (
                  <ColorSwatch
                    key={c.color}
                    color={c.color}
                    label={c.label}
                    selected={state.exteriorColor === c.color}
                    onClick={() => setExteriorColor(c.color)}
                    size="sm"
                  />
                ))}
              </div>
            </ConfigSection>
            <ConfigSection title="Material">
              <div className="space-y-2">
                {materials.map(m => (
                  <MaterialCard
                    key={m.key}
                    label={m.label}
                    description={m.desc}
                    pattern={m.pattern}
                    selected={state.exteriorMaterial === m.key}
                    onClick={() => setExteriorMaterial(m.key)}
                  />
                ))}
              </div>
            </ConfigSection>
          </>
        )

      case 'hardware':
        return (
          <>
            <ConfigSection title="Hardware Finish">
              <div className="flex flex-wrap gap-2">
                {hardwareOptions.map(h => (
                  <ColorSwatch
                    key={h.key}
                    color={h.color}
                    label={h.label}
                    selected={state.hardwareFinish === h.key}
                    onClick={() => setHardwareFinish(h.key)}
                    size="sm"
                  />
                ))}
              </div>
            </ConfigSection>
            <ConfigSection title="Monogram">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#805030] block mb-1.5">Initials (max 3)</label>
                  <input
                    className="w-full bg-white border border-[#dca079]/30 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#9e3c00] uppercase"
                    placeholder="ABC"
                    maxLength={3}
                    value={state.monogramText}
                    onChange={e => setMonogramText(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#805030] block mb-1.5">Font Style</label>
                  <div className="flex gap-2">
                    {(['serif', 'sans', 'cursive'] as const).map(font => (
                      <button
                        key={font}
                        onClick={() => setMonogramFont(font)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${
                          state.monogramFont === font
                            ? 'border-[#9e3c00] bg-[#fff4f0] text-[#9e3c00]'
                            : 'border-[#dca079]/20 text-[#805030] hover:border-[#dca079]/40'
                        }`}
                      >
                        {font === 'serif' ? 'Serif' : font === 'sans' ? 'Sans' : 'Cursive'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ConfigSection>
          </>
        )

      case 'interior':
        return (
          <>
            <ConfigSection title="Interior Color">
              <div className="flex flex-wrap gap-2">
                {interiorColors.map(c => (
                  <ColorSwatch
                    key={c.color}
                    color={c.color}
                    label={c.label}
                    selected={state.interiorColor === c.color}
                    onClick={() => setInteriorColor(c.color)}
                    size="sm"
                  />
                ))}
              </div>
            </ConfigSection>
            <ConfigSection title="Interior Layout">
              <div className="space-y-2">
                {interiorLayouts.map(l => (
                  <MaterialCard
                    key={l.key}
                    label={l.label}
                    description={l.desc}
                    selected={state.interiorLayout === l.key}
                    onClick={() => setInteriorLayout(l.key)}
                    gradient="bg-gradient-to-br from-[#D2B48C] to-[#C4A882]"
                  />
                ))}
              </div>
            </ConfigSection>
          </>
        )

      case 'straps':
        return (
          <ConfigSection title="Strap Type">
            <div className="space-y-2">
              {strapOptions.map(s => (
                <MaterialCard
                  key={s.key}
                  label={s.label}
                  description={s.desc}
                  selected={state.strapType === s.key}
                  onClick={() => setStrapType(s.key)}
                  gradient="bg-gradient-to-br from-[#8B4513] to-[#A0522D]"
                />
              ))}
            </div>
          </ConfigSection>
        )

      case 'addons':
        return (
          <ConfigSection title="Add-ons ($15 each)">
            <div className="space-y-2">
              {addonOptions.map(a => (
                <button
                  key={a.key}
                  onClick={() => toggleAddon(a.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    state.addons.includes(a.key)
                      ? 'border-[#9e3c00] bg-[#fff4f0]'
                      : 'border-[#dca079]/20 bg-white hover:border-[#dca079]/40'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg ${state.addons.includes(a.key) ? 'text-[#9e3c00]' : 'text-[#805030]'}`}>{a.icon}</span>
                  <span className={`text-sm font-semibold ${state.addons.includes(a.key) ? 'text-[#9e3c00]' : 'text-[#4a2507]'}`}>{a.label}</span>
                  {state.addons.includes(a.key) && (
                    <span className="material-symbols-outlined text-sm text-[#9e3c00] ml-auto">check</span>
                  )}
                </button>
              ))}
            </div>
          </ConfigSection>
        )
    }
  }

  return (
    <StudioLayout
      title="Bag Customizer"
      onSave={handleSave}
      onAddToCart={handleAddToCart}
      price={estimatedPrice}
    >
      {/* Saved toast */}
      {savedToast && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg animate-bounce">
          Design Saved!
        </div>
      )}

      {/* Main 3-panel layout */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left sidebar - Main category nav */}
        <aside className="hidden md:flex flex-col w-16 lg:w-48 bg-white border-r border-[#dca079]/10 shrink-0">
          <div className="p-2 lg:p-3 space-y-0.5 flex-1 overflow-y-auto">
            {sidebarItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveCategory(item.key)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-3 rounded-xl transition-all ${
                  activeCategory === item.key
                    ? 'bg-[#ffede4] text-[#9e3c00]'
                    : 'text-[#805030] hover:bg-[#fff4f0]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="hidden lg:block text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="p-2 lg:p-3 border-t border-[#dca079]/10">
            <button
              onClick={resetDesign}
              className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-3 rounded-xl text-[#805030] hover:bg-[#fff4f0] transition-all text-xs font-bold"
            >
              <span className="material-symbols-outlined text-xl">refresh</span>
              <span className="hidden lg:block">Reset</span>
            </button>
          </div>
        </aside>

        {/* 3D Viewport - Center */}
        <div className="flex-1 relative bg-gradient-radial from-[#ffd4bb]/30 via-[#fff4f0] to-[#fff4f0] min-w-0">
          <Bag3DView className="w-full h-full" />

          {/* Mobile: tap to open panel */}
          <button
            onClick={() => setShowMobilePanel(true)}
            className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#4a2507] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Customize
          </button>

          {/* Active category label on viewport */}
          <div className="hidden md:block absolute top-4 left-4">
            <span className="text-[10px] font-bold text-[#805030] uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1.5 rounded-full">
              {sidebarItems.find(i => i.key === activeCategory)?.label}
            </span>
          </div>
        </div>

        {/* Right sidebar - Dynamic sub-options */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-white border-l border-[#dca079]/10 shrink-0">
          <div className="p-4 lg:p-5 flex-1 overflow-y-auto">
            {renderRightPanel()}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#dca079]/10 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#805030]">Estimated Total</span>
              <span className="text-lg font-black text-[#9e3c00]">{formatPrice(estimatedPrice)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2.5 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#fff4f0] transition-colors">
                Save
              </button>
              <button onClick={handleAddToCart} className="flex-1 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg">
                Add to Cart
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile bottom sheet */}
      {showMobilePanel && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/30" onClick={() => setShowMobilePanel(false)} />
          <div className="bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* Handle + category tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#dca079]/10">
              <div className="flex items-center gap-1 overflow-x-auto flex-1">
                {sidebarItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveCategory(item.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === item.key
                        ? 'bg-[#9e3c00] text-white'
                        : 'bg-[#fff4f0] text-[#805030]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMobilePanel(false)} className="text-[#805030] ml-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {renderRightPanel()}
            </div>

            <div className="border-t border-[#dca079]/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#805030]">Total</span>
                <span className="text-lg font-black text-[#9e3c00]">{formatPrice(estimatedPrice)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 py-2.5 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030]">
                  Save
                </button>
                <button onClick={handleAddToCart} className="flex-1 py-3 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-sm font-bold shadow-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}

export default MainCustomizerPage
