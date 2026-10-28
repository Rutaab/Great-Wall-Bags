import React, { useEffect, useState } from 'react'
import SupplierLayout from '../../components/supplier/SupplierLayout'
import { api } from '../../services/api'

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  maintenance: 'bg-yellow-100 text-yellow-700',
}

const emptyForm = {
  name: '',
  location: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  capacity: '',
  status: 'active',
  managerName: '',
  managerPhone: '',
  managerEmail: '',
  description: '',
}

type FormErrors = { name?: string; location?: string }

const inputCls =
  'w-full border border-[#dca079]/40 rounded-lg px-3 py-2 text-sm text-[#4a2507] bg-white focus:outline-none focus:border-[#ff7936] focus:ring-2 focus:ring-[#ff7936]/20'

const errInputCls =
  'w-full border border-red-400 rounded-lg px-3 py-2 text-sm text-[#4a2507] bg-white focus:outline-none focus:ring-2 focus:ring-red-200'

const labelCls = 'block text-xs font-bold text-[#805030] mb-1'

const SupplierWarehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formMsg, setFormMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = () => {
    api.getSupplierWarehouses().then(setWarehouses).catch(() => setWarehouses([]))
  }

  useEffect(() => {
    load()
  }, [])

  const utilizationPct = (w: any) => w.capacity > 0 ? Math.round((w.utilized / w.capacity) * 100) : 0

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setFormMsg(null)
    setShowForm(true)
  }

  const openEdit = (w: any) => {
    setEditingId(w.id)
    setForm({
      name: w.name || '',
      location: w.location || '',
      line1: w.address?.line1 || '',
      line2: w.address?.line2 || '',
      city: w.address?.city || '',
      state: w.address?.state || '',
      country: w.address?.country || '',
      zip: w.address?.zip || '',
      capacity: w.capacity != null ? String(w.capacity) : '',
      status: w.status || 'active',
      managerName: w.manager?.name || '',
      managerPhone: w.manager?.phone || '',
      managerEmail: w.manager?.email || '',
      description: w.description || '',
    })
    setErrors({})
    setFormMsg(null)
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setEditingId(null)
    setErrors({})
    setFormMsg(null)
  }

  const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field as keyof FormErrors]) setErrors(er => ({ ...er, [field]: undefined }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMsg(null)
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = 'Please fill out the warehouse name.'
    if (!form.location.trim()) errs.location = 'Please fill out the location.'
    setErrors(errs)
    if (errs.name || errs.location) return

    const payload = {
      name: form.name,
      location: form.location,
      capacity: Number(form.capacity) || 0,
      status: form.status,
      address: {
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
      },
      manager: {
        name: form.managerName,
        phone: form.managerPhone,
        email: form.managerEmail,
      },
      description: form.description,
    }

    setSaving(true)
    try {
      if (editingId) {
        await api.updateSupplierWarehouse(editingId, payload)
        setFormMsg({ type: 'success', text: 'Warehouse updated successfully.' })
      } else {
        await api.createSupplierWarehouse(payload)
        setFormMsg({ type: 'success', text: 'Warehouse added successfully.' })
      }
      load()
      setTimeout(() => closeForm(), 700)
    } catch (err: any) {
      if (err?.status === 404 && editingId) {
        setFormMsg({ type: 'error', text: 'This warehouse no longer exists (it may have been deleted in another tab or window). The list has been refreshed.' })
        load()
        setTimeout(() => closeForm(), 1600)
      } else {
        setFormMsg({ type: 'error', text: `Could not save the warehouse. ${err?.message || 'Please try again.'}` })
        load()
      }
    } finally {
      setSaving(false)
    }
  }

  const removeWarehouse = async (w: any) => {
    if (!window.confirm(`Delete warehouse "${w.name}"? This cannot be undone.`)) return
    setDeletingId(w.id)
    try {
      await api.deleteSupplierWarehouse(w.id)
      load()
    } catch (err: any) {
      load()
      if (err?.status === 404) return
      window.alert(`Could not delete the warehouse. ${err?.message || 'Please try again.'}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <SupplierLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Warehouses</h1>
          <p className="text-[#805030] font-medium text-sm">Manage your global warehouse network</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-xs shadow-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition">
          <span className="material-symbols-outlined text-sm">add</span>
          Add Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {warehouses.map(w => {
          const pct = utilizationPct(w)
          return (
            <div key={w.id} className="bg-white rounded-xl border border-[#dca079]/10 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#4a2507]">{w.name}</h3>
                  <p className="text-xs text-[#805030] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {w.location}
                  </p>
                  {w.address && (w.address.city || w.address.country || w.address.line1) && (
                    <p className="text-[10px] text-[#805030] mt-0.5">
                      {[w.address.line1, w.address.line2, w.address.city, w.address.state, w.address.country, w.address.zip].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[w.status] || 'bg-gray-100 text-gray-600'}`}>
                  {w.status}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[#805030] mb-1">
                    <span>Capacity</span>
                    <span className="font-bold">{w.utilized.toLocaleString()} / {w.capacity.toLocaleString()} units</span>
                  </div>
                  <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-[#ff7936]' : 'bg-[#004be3]'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                {w.manager && (w.manager.name || w.manager.email) && (
                  <div className="text-[10px] text-[#805030] pt-1 border-t border-[#ffede4]">
                    Manager: <strong>{w.manager.name || '—'}</strong>
                    {w.manager.email ? ` • ${w.manager.email}` : ''}
                  </div>
                )}
                <div className="flex justify-between items-center text-[10px] text-[#805030] pt-2 border-t border-[#ffede4]">
                  <span>Utilization: <strong>{pct}%</strong></span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(w)} className="text-[#004be3] font-bold hover:underline flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">edit</span> Edit
                    </button>
                    <button onClick={() => removeWarehouse(w)} disabled={deletingId === w.id} className="text-red-500 font-bold hover:underline flex items-center gap-0.5 disabled:opacity-50">
                      <span className="material-symbols-outlined text-xs">delete</span> {deletingId === w.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {warehouses.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">warehouse</span>
            <p className="font-bold">No warehouses yet</p>
            <p className="text-sm mt-1">Click "Add Warehouse" to create your first warehouse.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeForm}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffede4]">
              <h2 className="text-lg font-black text-[#4a2507]">{editingId ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
              <button onClick={closeForm} className="text-[#805030] hover:text-[#4a2507]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {formMsg && (
              <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-bold ${formMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Warehouse Name *</label>
                <input className={errors.name ? errInputCls : inputCls} value={form.name} onChange={set('name')} placeholder="e.g. Central Fulfillment Center" />
                {errors.name && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Location (City, Country) *</label>
                <input className={errors.location ? errInputCls : inputCls} value={form.location} onChange={set('location')} placeholder="e.g. Karachi, Pakistan" />
                {errors.location && <p className="text-[11px] text-red-600 font-bold mt-1">{errors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={form.line1} onChange={set('line1')} placeholder="Street address" />
              </div>
              <div>
                <label className={labelCls}>Address (line 2)</label>
                <input className={inputCls} value={form.line2} onChange={set('line2')} placeholder="Suite / floor" />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className={labelCls}>State / Province</label>
                <input className={inputCls} value={form.state} onChange={set('state')} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} value={form.country} onChange={set('country')} />
              </div>
              <div>
                <label className={labelCls}>ZIP / Postal Code</label>
                <input className={inputCls} value={form.zip} onChange={set('zip')} />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Capacity (units)</label>
                <input className={inputCls} type="number" min="0" value={form.capacity} onChange={set('capacity')} placeholder="e.g. 10000" />
              </div>

              <div className="md:col-span-2 pt-2 border-t border-[#ffede4]">
                <p className="text-xs font-black text-[#4a2507] uppercase tracking-wide mb-3">Warehouse Manager</p>
              </div>
              <div>
                <label className={labelCls}>Manager Name</label>
                <input className={inputCls} value={form.managerName} onChange={set('managerName')} />
              </div>
              <div>
                <label className={labelCls}>Manager Phone</label>
                <input className={inputCls} value={form.managerPhone} onChange={set('managerPhone')} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Manager Email</label>
                <input className={inputCls} type="email" value={form.managerEmail} onChange={set('managerEmail')} />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Notes / Description</label>
                <textarea className={inputCls} rows={3} value={form.description} onChange={set('description')} placeholder="Loading docks, cold storage, security details, etc." />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2 mt-2">
                <button type="button" onClick={closeForm} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#805030] hover:bg-[#ffede4] disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#9e3c00] to-[#ff7936] hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                  {saving ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                  ) : (
                    <>{editingId ? 'Save Changes' : 'Save Warehouse'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SupplierLayout>
  )
}

export default SupplierWarehouses