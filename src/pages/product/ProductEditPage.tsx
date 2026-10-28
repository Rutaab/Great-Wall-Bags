import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user?.email !== 'dev@hobags.com') {
    navigate('/account', { replace: true })
    return null
  }
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [badge, setBadge] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getProduct(id)
      .then(p => {
        setName(p.name)
        setDescription(p.description)
        setPrice(String(p.price))
        setOriginalPrice(p.original_price ? String(p.original_price) : '')
        setStock(String(p.stock))
        setImage(p.image)
        setBadge(p.badge || '')
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    setError('')
    try {
      await api.updateProduct(id, {
        name: name || undefined,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        image: image || undefined,
        badge: badge || undefined,
      })
      navigate(-1)
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf7]">
        <div className="animate-spin w-8 h-8 border-2 border-[#9e3c00] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-[#805030] text-sm font-bold hover:underline mb-6 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>

        <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter mb-8">Edit Product</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-[#dca079]/10 p-8 space-y-5">
          <div>
            <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Product Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" type="text" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936] resize-none" rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Price ($)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" type="number" step="0.01" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Original Price ($)</label>
              <input value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" type="number" step="0.01" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Stock</label>
              <input value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" type="number" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Badge</label>
              <input value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" placeholder="e.g. Best Seller" type="text" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1.5">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" type="text" />
            {image && (
              <div className="mt-3 w-24 h-24 rounded-lg overflow-hidden border border-[#dca079]/20">
                <img src={image} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffede4] transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg shadow-[#ff7936]/20 disabled:opacity-50 flex items-center gap-2">
            {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductEditPage
