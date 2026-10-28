import React from 'react'
import { useNavigate } from 'react-router-dom'
import SupplierLayout from '../../components/supplier/SupplierLayout'

const collections = [
  { name: 'Summer Glow Series', count: 12, status: 'Published', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
  { name: 'Motion & Balance', count: 8, status: 'Published', img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop' },
  { name: 'Minimal Wall Art', count: 24, status: 'Draft', img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=300&fit=crop' },
]

const SupplierBoutiqueEditor: React.FC = () => {
  const navigate = useNavigate()
  return (
    <SupplierLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Storefront Editor</h1>
            <p className="text-[#805030] text-sm">Curate your brand presence on Great Wall Bags.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/supplier/storefront')} className="px-6 py-2 rounded-full text-[#004be3] font-bold hover:bg-[#c6d0ff] transition-colors text-sm">Preview Public Site</button>
            <button onClick={() => alert('Changes saved successfully!')} className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] px-8 py-2 rounded-full text-white font-bold shadow-lg shadow-[#ff7936]/20 hover:scale-105 transition-transform text-sm">Save Changes</button>
          </div>
        </div>

        <section className="relative group h-72 md:h-96 rounded-xl overflow-hidden bg-[#ffede4]">
          <img loading="lazy" src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop" alt="" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-xl overflow-hidden">
              <img loading="lazy" src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Artisan Leather Co.</h2>
              <p className="text-white/80 text-sm">Premium Handcrafted Bags & Accessories</p>
            </div>
          </div>
          <button onClick={() => alert('Upload a new cover image for your banner.')} className="absolute top-6 right-6 bg-white/70 backdrop-blur p-3 rounded-full text-[#4a2507] hover:bg-white transition-all">
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#4a2507] flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[#9e3c00] text-base">description</span>
                Brand Narrative
              </h3>
              <span className="text-[10px] text-[#805030]">Last updated 2 days ago</span>
            </div>
            <textarea className="w-full bg-[#fff4f0] border-none rounded-xl p-4 text-sm text-[#4a2507] min-h-[140px] focus:ring-2 focus:ring-[#ff7936]/20 outline-none resize-none transition-all" placeholder="Describe your boutique's history and vision...">
              We curate premium handcrafted bags that transform everyday carry into a statement of style. Our pieces are sourced from independent artisans across the globe, focusing on sustainable materials and timeless design.
            </textarea>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dca079]/10 space-y-6">
            <h3 className="font-bold text-[#4a2507] flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-[#004be3] text-base">share</span>
              Connected Channels
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#fff4f0] rounded-lg">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs">I</div>
                <span className="text-[10px] font-semibold flex-1">@artisanleather</span>
                <span className="material-symbols-outlined text-xs text-[#805030]">check_circle</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#fff4f0] rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">W</div>
                <span className="text-[10px] font-semibold flex-1">artisanleather.co</span>
                <span className="material-symbols-outlined text-xs text-[#805030]">link</span>
              </div>
              <button onClick={() => alert('Connect your Instagram, Facebook, or TikTok account.')} className="w-full py-2 border-2 border-dashed border-[#dca079]/30 rounded-lg text-[10px] font-bold text-[#805030] hover:border-[#9e3c00] hover:text-[#9e3c00] transition-all">
                Add Social Link
              </button>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-[#4a2507]">Active Collections</h3>
              <p className="text-xs text-[#805030]">Drag to reorder how they appear to customers.</p>
            </div>
            <button onClick={() => navigate('/supplier/add-product')} className="px-4 py-2 bg-[#004be3] text-white rounded-full text-[10px] font-bold flex items-center gap-2 hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              New Collection
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map(c => (
              <div key={c.name} className="group relative bg-white rounded-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border border-[#dca079]/10">
                <div className="h-40 overflow-hidden bg-[#ffe3d3]">
                  <img loading="lazy" src={c.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#4a2507] text-sm">{c.name}</h4>
                  <p className="text-[10px] text-[#805030] uppercase font-bold mt-1">{c.count} Items • {c.status}</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => alert('Drag to reorder this collection.')} className="p-1 bg-white/90 rounded-md shadow-sm cursor-grab">
                    <span className="material-symbols-outlined text-xs">drag_indicator</span>
                  </button>
                  <button onClick={() => alert(`Manage "${c.name}" settings.`)} className="p-1 bg-white/90 rounded-md shadow-sm text-[#9e3c00]">
                    <span className="material-symbols-outlined text-xs">settings</span>
                  </button>
                </div>
              </div>
            ))}
            <div onClick={() => navigate('/supplier/add-product')} className="border-2 border-dashed border-[#dca079]/30 rounded-lg flex flex-col items-center justify-center p-8 text-[#805030] hover:border-[#9e3c00] hover:text-[#9e3c00] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
              <span className="text-xs font-bold">Create New</span>
            </div>
          </div>
        </section>

        <section className="bg-[#ffede4] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 bg-[#b9002c]/10 text-[#b9002c] rounded-full text-[10px] font-black tracking-widest uppercase">
              Flash Highlight Setup
            </div>
            <h3 className="text-3xl font-black text-[#4a2507] leading-none">Curator's Spotlight</h3>
            <p className="text-[#805030] text-sm leading-relaxed">Schedule a temporary hero highlight for a specific product or event. Spotlighted items appear at the very top of the marketplace search for 24 hours.</p>
            <button onClick={() => alert('Schedule a 24-hour hero spotlight for a featured product.')} className="bg-[#4a2507] text-white px-6 py-3 rounded-full text-xs font-bold hover:opacity-90 transition-opacity">Schedule Event</button>
          </div>
          <div className="w-full md:w-80 h-48 rounded-xl bg-white shadow-2xl shadow-[#9e3c00]/10 overflow-hidden relative">
            <img loading="lazy" src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#004be3]/10 flex items-center justify-center backdrop-blur-[2px]">
              <span className="material-symbols-outlined text-white text-4xl">event_note</span>
            </div>
          </div>
        </section>
      </div>
    </SupplierLayout>
  )
}

export default SupplierBoutiqueEditor
