import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'
import VerificationGuard from '../../components/VerificationGuard'
import { tagGroups, type TagGroup, getRouteForTag } from '../../data/categoryTags'
import { getTopRatedByCategory } from '../../data/recommendations'
import RecommendedProducts from '../../components/RecommendedProducts'
import { useProducts } from '../../contexts/ProductContext'
import { useAuth } from '../../contexts/AuthContext'

const MAX_TAGS = 1

const COLOR_PALETTE = [
  '#1a1a1a', '#8B4513', '#D2B48C', '#F5F5DC',
  '#FFFFFF', '#808080', '#000080', '#0000FF',
  '#FF0000', '#800020', '#FFC0CB', '#800080',
  '#008000', '#808000', '#008080', '#FFD700',
  '#C0C0C0', '#C19A6B', '#DE5D83', '#98FF98',
]

const SIZE_OPTIONS = ['Small', 'Medium', 'Large']

const COMMON_MATERIALS = [
  'Leather', 'Canvas', 'Nylon', 'Polyester', 'Cotton',
  'Denim', 'Wool', 'Vegan Leather', 'Raffia', 'Straw',
  'Jute', 'Bamboo', 'Cork', 'Nubuck', 'Suede', 'Mesh',
  'Neoprene', 'Polycarbonate', 'Brushed Aluminum', 'ABS Composite',
]

const COLOR_NAME_MAP: Record<string, string> = {
  '#1a1a1a': 'Black', '#8B4513': 'Brown', '#D2B48C': 'Tan', '#F5F5DC': 'Beige',
  '#FFFFFF': 'White', '#808080': 'Gray', '#000080': 'Navy', '#0000FF': 'Blue',
  '#FF0000': 'Red', '#800020': 'Burgundy', '#FFC0CB': 'Pink', '#800080': 'Purple',
  '#008000': 'Green', '#808000': 'Olive', '#008080': 'Teal', '#FFD700': 'Gold',
  '#C0C0C0': 'Silver', '#C19A6B': 'Camel', '#DE5D83': 'Blush', '#98FF98': 'Mint',
}

interface ProductFormData {
  id?: string
  name: string
  spec: string
  price: number
  stock: number
  category: string
  tags: string[]
  image: string
  variants?: { name: string; options: string }[]
  material?: string
  bulk?: string
  bulkQty?: string
  status?: 'draft' | 'published'
}

const ManufacturerAddProduct: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const editData = (location.state as { product?: ProductFormData })?.product
  const isEditing = !!editData
  const { addProduct, updateProduct } = useProducts()
  const { user } = useAuth()
  const [selectedGroup, setSelectedGroup] = useState<TagGroup | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')
  const [bulkQty, setBulkQty] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [variants, setVariants] = useState<{ name: string; options: string }[]>([
    { name: 'Color', options: '' },
    { name: 'Size', options: '' },
    { name: 'Material', options: '' },
  ])
  const categoryKey = selectedGroup?.key || ''
  const topRated = useMemo(() => {
    if (!categoryKey) return []
    const categoryLabel = selectedGroup?.label || ''
    return getTopRatedByCategory(categoryLabel, 4)
  }, [categoryKey, selectedGroup?.label])

  useEffect(() => {
    if (!editData) return
    setName(editData.name)
    setDescription(editData.spec)
    setPrice(String(editData.price))
    setStock(String(editData.stock))
    setSelectedTags(editData.tags || [])
    const group = tagGroups.find(g => g.label === editData.category)
    setSelectedGroup(group || null)
    if (editData.bulk) setBulkPrice(editData.bulk)
    if (editData.bulkQty) setBulkQty(editData.bulkQty)
    if (editData.variants && editData.variants.length > 0) {
      setVariants(prev => prev.map(d => {
        const match = (editData.variants || []).find(v => v.name === d.name)
        return match ? { ...d, options: match.options } : d
      }))
    }
  }, [])

  const handleGroupSelect = (key: string) => {
    const group = tagGroups.find(g => g.key === key)
    setSelectedGroup(group || null)
    setSelectedTags([])
  }

  const toggleTag = (name: string) => {
    setSelectedTags(prev => {
      if (prev.includes(name)) return prev.filter(t => t !== name)
      if (prev.length >= MAX_TAGS) return prev
      return [...prev, name]
    })
  }

  const handlePublish = () => {
    if (!name.trim() || !price || !selectedGroup || selectedTags.length === 0) return
    setPublishing(true)
    const route = getRouteForTag(selectedTags[0]) || selectedGroup.route
    const matVariant = variants.find(v => v.name.trim().toLowerCase() === 'material')
    const material = matVariant?.options
      ? matVariant.options.split(',').map(s => s.trim()).filter(Boolean)[0]
      : ''
    const productData = {
      name: name.trim(),
      spec: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock || '0'),
      route,
      category: selectedGroup.label,
      tags: selectedTags,
      bulk: bulkPrice.trim() || undefined,
      bulkQty: bulkQty.trim() || undefined,
      variants: variants.filter(v => v.name.trim() && v.options.trim()),
      status: 'published' as const,
    }
    if (isEditing && editData?.id) {
      updateProduct(editData.id, material ? { ...productData, material } : productData)
    } else {
      addProduct(material ? { ...productData, material } : productData, user ? { id: user.id, name: user.name, role: user.role } : null)
    }
    setPublishing(false)
    navigate('/manufacturer/inventory')
  }

  return (
    <VerificationGuard>
    <ManufacturerLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">{isEditing ? 'Update Product' : 'Add New Product'}</h1>
            <p className="text-[#805030] text-sm">{isEditing ? 'Edit your product listing.' : 'Create a new product for your manufacturing line.'}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffede4] transition-colors">Save as Draft</button>
            <button onClick={handlePublish} disabled={publishing || !name.trim() || !price || !selectedGroup || selectedTags.length === 0} className="px-6 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg shadow-[#ff7936]/20 disabled:opacity-50">
              {publishing ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-5">
              <h3 className="font-bold text-sm text-[#4a2507]">Basic Information</h3>
              <div>
                <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="e.g. Premium Leather Tote" type="text" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" placeholder="Describe your product..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Price ($)</label>
                  <input value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="0.00" type="number" min="0" step="0.01" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Stock Quantity</label>
                  <input value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="0" type="number" min="0" />
                </div>
              </div>
              <div className="border-t border-[#dca079]/10 pt-4">
                <h3 className="text-[11px] font-bold text-[#9e3c00] uppercase tracking-widest mb-3">Bulk Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Bulk Price / Unit ($)</label>
                    <input value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="e.g. $245.00 / unit" type="text" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Min Bulk Qty</label>
                    <input value={bulkQty} onChange={e => setBulkQty(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="e.g. 10+" type="text" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Category Group</label>
                <select
                  className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]"
                  value={selectedGroup?.key || ''}
                  onChange={e => handleGroupSelect(e.target.value)}
                >
                  <option value="">Select a category group...</option>
                  {tagGroups.map(group => (
                    <option key={group.key} value={group.key}>{group.label}</option>
                  ))}
                </select>
              </div>

              {selectedGroup && (
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">
                    Product Tags <span className="text-[#805030]/60 font-normal normal-case">(choose up to {MAX_TAGS})</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedGroup.items.map(tag => (
                      <button
                        key={tag.name}
                        type="button"
                        onClick={() => toggleTag(tag.name)}
                        disabled={!selectedTags.includes(tag.name) && selectedTags.length >= MAX_TAGS}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          selectedTags.includes(tag.name)
                            ? 'bg-[#ff7936] text-white border-[#ff7936] shadow-sm'
                            : 'bg-[#fff4f0] text-[#805030] border-[#dca079]/20 hover:border-[#ff7936]/50 disabled:opacity-40'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedTags.map(name => (
                        <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ff7936]/10 text-[#9e3c00] rounded-full text-[10px] font-bold">
                          {name}
                          <button onClick={() => toggleTag(name)} className="hover:text-[#b9002c]">
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-5">
              <h3 className="font-bold text-sm text-[#4a2507]">Variants (Up to 3)</h3>
              <p className="text-[10px] text-[#805030]">Configure available options for your product.</p>
              {variants.map((v, i) => {
                const isColor = v.name === 'Color'
                const isSize = v.name === 'Size'
                const isMaterial = v.name === 'Material'
                const selectedSet = new Set(v.options.split(',').map(s => s.trim()).filter(Boolean))

                const toggleOption = (opt: string) => {
                  const next = new Set(selectedSet)
                  if (next.has(opt)) next.delete(opt); else next.add(opt)
                  setVariants(prev => prev.map((x, j) => j === i ? { ...x, options: [...next].join(', ') } : x))
                }

                return (
                <div key={i} className="bg-[#fff4f0] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#805030] uppercase tracking-wider">{v.name}</span>
                    {i > 0 && <button type="button" onClick={() => setVariants(prev => prev.map((x, j) => j === i ? { ...x, options: '' } : x))} className="text-[10px] text-[#b9002c]">Clear</button>}
                  </div>
                  {isColor && (
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map(hex => {
                        const isSelected = selectedSet.has(hex)
                        return (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => toggleOption(hex)}
                            title={COLOR_NAME_MAP[hex] || hex}
                            className={`w-8 h-8 rounded-full transition-all ${isSelected ? 'ring-2 ring-[#ff7936] ring-offset-2 scale-110' : 'ring-1 ring-[#dca079]/30 hover:ring-[#dca079]'}`}
                            style={{ backgroundColor: hex }}
                          >
                            {isSelected && <span className="flex items-center justify-center text-white text-xs font-bold drop-shadow-sm" style={{ textShadow: hex === '#FFFFFF' || hex === '#F5F5DC' || hex === '#FFC0CB' || hex === '#98FF98' || hex === '#FFD700' || hex === '#C0C0C0' || hex === '#D2B48C' ? '0 0 2px rgba(0,0,0,0.5)' : 'none', color: hex === '#FFFFFF' || hex === '#F5F5DC' || hex === '#FFC0CB' || hex === '#98FF98' || hex === '#FFD700' || hex === '#C0C0C0' || hex === '#D2B48C' ? '#333' : '#fff' }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {isSize && (
                    <div className="flex flex-wrap gap-2">
                      {SIZE_OPTIONS.map(size => {
                        const isSelected = selectedSet.has(size)
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleOption(size)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                              isSelected
                                ? 'bg-[#ff7936] text-white border-[#ff7936] shadow-sm'
                                : 'bg-white text-[#805030] border-[#dca079]/30 hover:border-[#ff7936]/50 hover:bg-[#fff4f0]'
                            }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {isMaterial && (
                    <div className="flex flex-wrap gap-2">
                      {COMMON_MATERIALS.map(mat => {
                        const isSelected = selectedSet.has(mat)
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => toggleOption(mat)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                              isSelected
                                ? 'bg-[#ff7936] text-white border-[#ff7936]'
                                : 'bg-white text-[#805030] border-[#dca079]/30 hover:border-[#ff7936]/50'
                            }`}
                          >
                            {mat}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {v.options && <p className="text-[9px] text-[#805030] mt-2">Selected: {v.options}</p>}
                </div>
                )
              })}
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-5">
              <h3 className="font-bold text-sm text-[#4a2507]">Product Images</h3>
              <div className="border-2 border-dashed border-[#dca079]/30 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-[#fff4f0] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-[#805030] mb-3">add_photo_alternate</span>
                <p className="text-sm text-[#805030]">Drop images here or click to upload</p>
                <p className="text-[10px] text-[#805030] mt-1">Recommended: 1200x1200px, JPG or PNG</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-5">
              <h3 className="font-bold text-sm text-[#4a2507]">Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Weight (kg)</label>
                  <input className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="0.0" type="number" step="0.1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Origin</label>
                  <input className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="e.g. Milan, Italy" type="text" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#dca079]/10">
              <h3 className="font-bold text-sm text-[#4a2507] mb-4">Listing Preview</h3>
              <div className="bg-[#fff4f0] rounded-lg overflow-hidden">
                <div className="aspect-square bg-[#ffe3d3]" />
                <div className="p-3">
                  <p className="text-xs font-bold text-[#4a2507]">{name || 'Product Name'}</p>
                  <p className="text-[10px] text-[#805030]">{selectedGroup?.label || 'Category'}</p>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedTags.map(name => (
                        <span key={name} className="text-[8px] px-1.5 py-0.5 bg-[#ff7936]/10 text-[#9e3c00] rounded-full font-medium">{name}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm font-black text-[#9e3c00] mt-1">${price || '0.00'}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#ff7936]/10 rounded-xl p-6 border border-[#ff7936]/20">
              <h4 className="font-bold text-sm text-[#9e3c00] mb-2">Pro Tip</h4>
              <p className="text-[10px] text-[#805030] leading-relaxed">Products with clear manufacturing specs and BOM details get prioritized by wholesale buyers.</p>
              <hr className="my-3 border-[#ff7936]/20" />
              <h4 className="font-bold text-sm text-[#9e3c00] mb-2">Manufacturing Ready</h4>
              <p className="text-[10px] text-[#805030] leading-relaxed">After listing, you can add BOM items, assign to production, and set up quality control checkpoints from your manufacturer dashboard.</p>
            </div>

            {topRated.length > 0 && (
              <RecommendedProducts
                title={`Top Rated in ${selectedGroup?.label || ''}`}
                viewAllLink={selectedGroup?.route || '#'}
                items={topRated}
                maxColumns={2}
              />
            )}
          </div>
        </div>
      </div>
    </ManufacturerLayout>
    </VerificationGuard>
  )
}

export default ManufacturerAddProduct
