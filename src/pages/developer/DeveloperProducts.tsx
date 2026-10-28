import React, { useState, useEffect } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { useProducts } from '../../contexts/ProductContext'
import { formatPrice } from '../../utils/currency'

const DeveloperProducts: React.FC = () => {
  const { getAllProducts, deleteProduct } = useProducts()
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const refresh = () => {
    setProducts(getAllProducts())
  }

  useEffect(() => { refresh() }, [])

  const filtered = searchQuery.trim()
    ? products.filter(p =>
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.route || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteProduct(confirmDelete.id)
    setConfirmDelete(null)
    refresh()
    setActionMsg(`Product "${confirmDelete.name}" deleted successfully`)
    setTimeout(() => setActionMsg(null), 3000)
  }

  const publishedCount = products.filter(p => p.status === 'published').length
  const draftCount = products.filter(p => p.status === 'draft').length

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Products</h1>
            <p className="text-[#805030] text-sm mt-1">Full catalog control — view and delete any product on the site</p>
          </div>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-[#ffede4] text-[#805030] rounded-full text-xs font-bold hover:bg-[#ffd4bb] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        {actionMsg && (
          <div className="mb-6 px-4 py-3 bg-green-100 text-green-800 rounded-xl text-sm font-bold">
            {actionMsg}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: products.length, icon: 'inventory_2' },
            { label: 'Published', value: publishedCount, icon: 'check_circle' },
            { label: 'Drafts', value: draftCount, icon: 'drafts' },
            { label: 'Search', value: filtered.length, icon: 'search' },
          ].map(s => (
            <div key={s.label} className="bg-white p-4 rounded-xl border border-[#dca079]/10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#9e3c00]">{s.icon}</span>
                <div>
                  <p className="text-[10px] font-bold text-[#805030] uppercase">{s.label}</p>
                  <p className="text-xl font-black text-[#4a2507]">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2 border border-[#dca079]/10 max-w-sm">
            <span className="material-symbols-outlined text-[#805030] text-sm">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm placeholder-[#805030] w-full outline-none"
              placeholder="Search by name, category, route..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white border border-[#dca079]/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4] bg-[#fff4f0]">
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Product</th>
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Category</th>
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Route</th>
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Price</th>
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                  <th className="py-3 px-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Added By</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffede4]">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img loading="lazy" src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        <div>
                          <p className="text-sm font-bold text-[#4a2507]">{p.name}</p>
                          <p className="text-[10px] text-[#805030]">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#805030]">{p.category || '—'}</td>
                    <td className="py-3 px-4 text-sm text-[#805030]">{p.route || '—'}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-[#9e3c00]">{formatPrice(Number(p.price || 0))}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'draft' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#805030]/10 text-[#805030] rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">drafts</span>
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Published
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#805030]">
                      {p.addedBy?.name || 'System / Imported'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#b9002c]/30 text-[#b9002c] rounded-full text-[10px] font-bold hover:bg-[#ffede4] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[#805030] text-sm">
                      <span className="material-symbols-outlined text-3xl mb-2">inventory_2</span>
                      <p>{searchQuery ? 'No products match your search.' : 'No products found.'}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-[90vw] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffede4] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#b9002c]">delete</span>
            </div>
            <h3 className="text-xl font-bold text-[#4a2507] mb-2">Delete Product?</h3>
            <p className="text-sm text-[#805030] mb-6">
              This will permanently remove <span className="font-bold text-[#4a2507]">{confirmDelete.name}</span> from the site. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#b9002c] hover:bg-[#9e0026] rounded-xl transition-colors">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </DeveloperLayout>
  )
}

export default DeveloperProducts
