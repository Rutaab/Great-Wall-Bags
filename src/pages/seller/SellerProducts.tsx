import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerLayout from '../../components/seller/SellerLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { formatPrice } from '../../utils/currency'

const SellerProducts: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getUserProducts, deleteProduct } = useProducts()
  const [products, setProducts] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = statusFilter === 'all'
    ? products
    : products.filter(p => p.status === statusFilter)

  const refresh = () => {
    if (user) {
      setProducts(getUserProducts(user.id))
    }
  }

  useEffect(() => { refresh() }, [user])

  const totalSales = products.reduce((s, p) => s + (p.sales || 0), 0)
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0)
  const draftCount = products.filter(p => p.status === 'draft').length

  return (
    <SellerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Products</h1>
          <p className="text-[#805030] font-medium text-sm">Manage your product catalog.</p>
        </div>
        <button onClick={() => navigate('/seller/add-product')} className="px-6 py-2.5 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, icon: 'inventory_2' },
          { label: 'Published', value: products.length - draftCount, icon: 'check_circle' },
          { label: 'Drafts', value: draftCount, icon: 'drafts' },
          { label: 'Total Sales', value: totalSales, icon: 'trending_up' },
          { label: 'Total Stock', value: totalStock, icon: 'package_2' },
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

      <div className="bg-white border border-[#dca079]/10 rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-[#ffe3d3]">
          <span className="text-sm font-bold text-[#4a2507]">{filtered.length} products</span>
          <div className="flex gap-1">
            {(['all', 'published', 'draft'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === s ? 'bg-[#ff7936] text-white' : 'text-[#805030] hover:bg-[#ffede4]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#ffede4]">
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Product</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Status</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Price</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Stock</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Sales</th>
                <th className="pb-4 font-black uppercase text-[10px] text-[#805030] tracking-widest">Bulk</th>
                <th className="pb-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffede4]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#fff4f0] transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img loading="lazy" src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      <div>
                        <p className="text-sm font-bold text-[#4a2507]">{p.name}</p>
                        <p className="text-[10px] text-[#805030]">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
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
                  <td className="py-4">
                    <span className="font-bold text-sm text-[#9e3c00]">{formatPrice(p.price)}</span>
                  </td>
                  <td className="py-4">
                    <span className={`font-bold text-sm ${(p.stock || 0) === 0 ? 'text-[#9e3c00]' : (p.stock || 0) < 10 ? 'text-[#ff7936]' : ''}`}>{p.stock || 0}</span>
                  </td>
                  <td className="py-4 text-sm text-[#805030]">{p.sales || 0}</td>
                  <td className="py-4">
                    {p.bulk ? (
                      <span className="text-[10px] font-bold text-[#004be3]">{p.bulkQty} / {p.bulk}</span>
                    ) : (
                      <span className="text-[10px] text-[#805030]">—</span>
                    )}
                  </td>
                  <td className="py-4 text-right relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                      className="text-[#805030] hover:text-[#9e3c00] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-sm">more_vert</span>
                    </button>
                    {openMenuId === p.id && (
                      <div className="fixed inset-0 z-[70] flex items-center justify-center" onClick={() => setOpenMenuId(null)}>
                        <div className="absolute inset-0 bg-black/40" />
                        <div ref={menuRef} className="relative bg-white rounded-2xl shadow-2xl p-6 w-64 text-center" onClick={e => e.stopPropagation()}>
                          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#ffede4] flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-[#805030]">more_horiz</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#4a2507] mb-1">{p.name}</h3>
                          <p className="text-xs text-[#805030] mb-5">What would you like to do?</p>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => { setOpenMenuId(null); navigate('/seller/add-product', { state: { product: p } }) }}
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#ff7936] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                              Update
                            </button>
                            <button
                              onClick={() => { deleteProduct(p.id); setOpenMenuId(null); refresh() }}
                              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-[#b9002c]/30 text-[#b9002c] rounded-xl text-sm font-bold hover:bg-[#ffede4] transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[#805030] text-sm">
                    <span className="material-symbols-outlined text-3xl mb-2">inventory_2</span>
                    <p>No products yet. Start by adding your first product.</p>
                    <button onClick={() => navigate('/seller/add-product')} className="mt-3 px-4 py-2 bg-[#004be3] text-white rounded-full text-xs font-bold">+ Add Product</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  )
}

export default SellerProducts
