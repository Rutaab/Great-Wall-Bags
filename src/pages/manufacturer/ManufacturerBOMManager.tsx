import React, { useEffect, useState } from 'react'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'
import { api } from '../../services/api'
import { formatPrice } from '../../utils/currency'

const ManufacturerBOMManager: React.FC = () => {
  const [boms, setBoms] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ product_id: '', material_name: '', material_sku: '', quantity_per_unit: '', unit: 'pcs', unit_cost: '', supplier_name: '', lead_time_days: '' })

  const fetchData = () => {
    api.getManufacturerBoms().then(setBoms).catch(() => {})
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = () => {
    if (!form.product_id.trim() || !form.material_name.trim()) {
      setError('Product and material name are required.')
      return
    }
    setSaving(true)
    setError('')
    api.createManufacturerBom({
      product_id: form.product_id.trim(),
      material_name: form.material_name.trim(),
      material_sku: form.material_sku.trim(),
      quantity_per_unit: parseFloat(form.quantity_per_unit) || 0,
      unit: form.unit,
      unit_cost: parseFloat(form.unit_cost) || 0,
      supplier_name: form.supplier_name.trim(),
      lead_time_days: parseInt(form.lead_time_days) || 0
    })
      .then(() => {
        setShowForm(false)
        setForm({ product_id: '', material_name: '', material_sku: '', quantity_per_unit: '', unit: 'pcs', unit_cost: '', supplier_name: '', lead_time_days: '' })
        fetchData()
      })
      .catch((e: any) => setError(e.message || 'Failed to create BOM.'))
      .finally(() => setSaving(false))
  }

  const groupedByProduct = boms.reduce((acc: any, item: any) => {
    if (!acc[item.product_id]) acc[item.product_id] = { items: [], totalCost: 0 }
    acc[item.product_id].items.push(item)
    acc[item.product_id].totalCost += item.quantity_per_unit * item.unit_cost
    return acc
  }, {} as Record<string, { items: any[]; totalCost: number }>)

  return (
    <ManufacturerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Bill of Materials</h1>
          <p className="text-[#805030] font-medium text-sm">Detailed BOM management with cost breakdown</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New BOM
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedByProduct).map(([productId, group]: [string, any]) => (
          <div key={productId} className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-[#fff4f0] border-b border-[#dca079]/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#4a2507]">Product: {productId}</h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-[#9e3c00]">{formatPrice(group.totalCost)}</p>
                <p className="text-[10px] text-[#805030]">Total Material Cost</p>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4] bg-[#fffaf7]">
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Material</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">SKU</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Qty/Unit</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Unit Cost</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Subtotal</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Supplier</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-[#805030] uppercase">Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffede4]">
                {group.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="px-6 py-3 font-bold text-sm text-[#4a2507]">{item.material_name}</td>
                    <td className="px-6 py-3 text-xs font-mono text-[#805030]">{item.material_sku || '--'}</td>
                    <td className="px-6 py-3 text-sm text-[#4a2507]">{item.quantity_per_unit} {item.unit}</td>
                    <td className="px-6 py-3 text-sm text-[#4a2507]">{formatPrice(item.unit_cost)}</td>
                    <td className="px-6 py-3 text-sm font-bold text-[#9e3c00]">{formatPrice((item.quantity_per_unit * item.unit_cost))}</td>
                    <td className="px-6 py-3 text-xs text-[#805030]">{item.supplier_name || '--'}</td>
                    <td className="px-6 py-3 text-xs text-[#805030]">{item.lead_time_days ? `${item.lead_time_days}d` : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {boms.length === 0 && (
          <div className="text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">account_tree</span>
            <p className="font-bold">No BOMs yet</p>
            <p className="text-sm mt-1">Create a Bill of Materials to track production costs.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#4a2507]">New BOM</h3>
                <p className="text-sm text-[#805030] mt-0.5">Add a material to a product's bill of materials</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#805030] hover:bg-[#ffede4] transition-colors" aria-label="Close">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Product <span className="text-[#b9002c]">*</span></label>
                  <input value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} placeholder="e.g. Leather Tote" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Material Name <span className="text-[#b9002c]">*</span></label>
                  <input value={form.material_name} onChange={e => setForm({ ...form, material_name: e.target.value })} placeholder="e.g. YKK Zip" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Material SKU</label>
                  <input value={form.material_sku} onChange={e => setForm({ ...form, material_sku: e.target.value })} placeholder="e.g. ZIP-WP10" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Supplier</label>
                  <input value={form.supplier_name} onChange={e => setForm({ ...form, supplier_name: e.target.value })} placeholder="e.g. Lumina Textiles" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Qty/Unit</label>
                  <input value={form.quantity_per_unit} onChange={e => setForm({ ...form, quantity_per_unit: e.target.value })} type="number" step="0.01" placeholder="e.g. 2" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Unit</label>
                  <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm focus:outline-none focus:border-[#ff7936] transition-colors">
                    <option>pcs</option>
                    <option>m</option>
                    <option>roll</option>
                    <option>set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Unit Cost ($)</label>
                  <input value={form.unit_cost} onChange={e => setForm({ ...form, unit_cost: e.target.value })} type="number" step="0.01" placeholder="e.g. 1.15" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Lead Time (days)</label>
                  <input value={form.lead_time_days} onChange={e => setForm({ ...form, lead_time_days: e.target.value })} type="number" placeholder="e.g. 14" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
                </div>
              </div>
              {error && <p className="text-[#b9002c] text-xs font-medium">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#9e3c00] to-[#ff7936] hover:shadow-lg hover:shadow-[#ff7936]/30 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                  {saving ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">account_tree</span>}
                  {saving ? 'Creating...' : 'Add BOM Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ManufacturerLayout>
  )
}

export default ManufacturerBOMManager
