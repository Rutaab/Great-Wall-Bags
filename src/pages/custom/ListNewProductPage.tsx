import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { tagGroups, type TagGroup, getRouteForTag } from '../../data/categoryTags'

const navItems = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Inventory', icon: 'inventory_2', active: true },
  { label: 'Orders', icon: 'receipt_long' },
  { label: 'Analytics', icon: 'analytics' },
  { label: 'Storefront', icon: 'store' },
  { label: 'Settings', icon: 'settings' },
];

const ListNewProductPage: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate()
  const [selectedGroup, setSelectedGroup] = useState<TagGroup | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleGroupSelect = (key: string) => {
    const group = tagGroups.find(g => g.key === key)
    setSelectedGroup(group || null)
    setSelectedTags([])
  }

  const toggleTag = (name: string) => {
    setSelectedTags(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-[#ffede4] border-r border-[#ffd4bb] flex flex-col z-40">
        <div className="p-6 border-b border-[#ffd4bb]">
          <span className="text-[#9e3c00] text-base font-semibold">Creator Hub</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-r-full transition-colors ${
                item.active
                  ? 'bg-[#ffd4bb] text-[#9e3c00] font-medium'
                  : 'text-[#805030] hover:bg-[#ffd4bb]/50'
              }`}
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#ffd4bb]">
          <button className="w-full py-3 bg-gradient-to-r from-[#ff7936] to-[#ff5500] text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
            Add New Product
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <header className="h-16 border-b border-[#ffd4bb] bg-[#fff4f0]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
              <span className="material-symbols-outlined text-[#4a2507]">arrow_back</span>
            </button>
            <h1 className="text-[#4a2507] text-sm font-semibold tracking-wider">EDIT LISTING</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-[#805030] hover:bg-[#ffd4bb] transition-colors rounded-sm">
              Discard
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-sm bg-[#004be3] text-white rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Live Preview
            </button>
            <button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff7936] to-[#ff5500] text-white rounded-sm hover:opacity-90 transition-opacity">
              Publish
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex">
          {/* Left Form Column */}
          <div className="flex-1 p-6 space-y-8 max-w-4xl">
            {/* Studio Media */}
            <section>
              <h2 className="text-[#4a2507] text-sm font-medium uppercase tracking-wider mb-4">Studio Media</h2>
              <div className="grid grid-cols-4 gap-3">
                <div className="aspect-square border-2 border-dashed border-[#dca079] rounded-sm flex flex-col items-center justify-center cursor-pointer hover:bg-[#ffede4] transition-colors">
                  <span className="material-symbols-outlined text-[#ff7936] text-3xl">add_photo_alternate</span>
                  <span className="text-[#805030] text-xs mt-2">Upload Media</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-[#ff7936]/20 to-[#ffd4bb] rounded-sm relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#4a2507] text-sm">edit</span>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#b9002c] text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-[#ff7936]/20 to-[#ffd4bb] rounded-sm relative group cursor-pointer">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#4a2507] text-sm">edit</span>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#b9002c] text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <div className="aspect-square border-2 border-dashed border-[#dca079] rounded-sm flex items-center justify-center cursor-pointer hover:bg-[#ffede4] transition-colors">
                  <span className="material-symbols-outlined text-[#ff7936] text-3xl">add</span>
                </div>
              </div>
              <div className="mt-4 bg-[#ffede4] rounded-sm p-4">
                <p className="text-[#4a2507] text-xs font-medium uppercase tracking-wider mb-3">Studio Quality Checklist</p>
                <div className="grid grid-cols-2 gap-2">
                  {['High Resolution', 'Natural Lighting', 'Multiple Angles', 'Detail Shots'].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#ff7936]" defaultChecked />
                      <span className="text-[#805030] text-xs">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Product Tags — from sub main menu */}
            <section>
              <h2 className="text-[#4a2507] text-sm font-medium uppercase tracking-wider mb-4">Catalog Tags</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#805030] text-xs mb-1">Category Group</label>
                  <select
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] outline-none focus:border-[#ff7936]"
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
                    <label className="block text-[#805030] text-xs mb-1">Product Tags <span className="text-[#805030]/60 font-normal">(select all that apply)</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedGroup.items.map(tag => (
                        <button
                          key={tag.name}
                          type="button"
                          onClick={() => toggleTag(tag.name)}
                          className={`text-left px-3 py-2 rounded text-xs font-medium border transition-all ${
                            selectedTags.includes(tag.name)
                              ? 'bg-[#ff7936] text-white border-[#ff7936]'
                              : 'bg-white text-[#805030] border-[#ffd4bb] hover:border-[#ff7936]/50'
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedTags.map(name => {
                          const route = getRouteForTag(name)
                          return (
                            <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ff7936]/10 text-[#9e3c00] rounded text-[10px] font-medium">
                              {route ? (
                                <a href={route} className="hover:underline">{name}</a>
                              ) : name}
                              <button onClick={() => toggleTag(name)} className="hover:text-[#b9002c]">
                                <span className="material-symbols-outlined text-xs">close</span>
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Logistics */}
            <section>
              <h2 className="text-[#4a2507] text-sm font-medium uppercase tracking-wider mb-4">Logistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#805030] text-xs mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="BAG-SCH-001"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] placeholder-[#805030]/50 outline-none focus:border-[#ff7936]"
                  />
                </div>
                <div>
                  <label className="block text-[#805030] text-xs mb-1">Base Stock Inventory</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] placeholder-[#805030]/50 outline-none focus:border-[#ff7936]"
                  />
                </div>
                <div>
                  <label className="block text-[#805030] text-xs mb-1">Lead Time</label>
                  <select className="w-full px-3 py-2.5 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] outline-none focus:border-[#ff7936]">
                    <option>2-3 Weeks</option>
                    <option>4-6 Weeks</option>
                    <option>8-12 Weeks</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Tiered Pricing Strategy */}
            <section>
              <h2 className="text-[#4a2507] text-sm font-medium uppercase tracking-wider mb-4">Tiered Pricing Strategy</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { tier: 'Retail', price: 349, units: '1-9' },
                  { tier: 'Bulk 10+', price: 285, units: '10-49' },
                  { tier: 'Elite 50+', price: 240, units: '50+' },
                ].map((t) => (
                  <div key={t.tier} className="bg-white border border-[#ffd4bb] rounded-sm p-5">
                    <p className="text-[#805030] text-xs uppercase tracking-wider">{t.tier}</p>
                    <p className="text-[#4a2507] text-2xl font-semibold mt-2">${t.price}</p>
                    <p className="text-[#805030]/60 text-xs mt-1">{t.units} units</p>
                    <input
                      type="text"
                      defaultValue={`$${t.price}`}
                      className="w-full mt-3 px-2 py-1.5 text-sm border border-[#ffd4bb] text-[#4a2507] outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Artisanship Story */}
            <section>
              <h2 className="text-[#4a2507] text-sm font-medium uppercase tracking-wider mb-4">Artisanship Story</h2>
              <input
                type="text"
                placeholder="Headline (e.g., Handcrafted in Florence)"
                className="w-full px-4 py-3 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] placeholder-[#805030]/50 outline-none focus:border-[#ff7936] mb-3"
              />
              <textarea
                rows={4}
                placeholder="Describe the story behind this piece — materials, techniques, inspiration..."
                className="w-full px-4 py-3 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] placeholder-[#805030]/50 outline-none focus:border-[#ff7936] resize-none"
              />
            </section>
          </div>

          {/* Right Panel */}
          <aside className="w-80 border-l border-[#ffd4bb] bg-[#ffede4]/50 p-6 space-y-6">
            {/* Listing Health */}
            <div>
              <h3 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-4">Listing Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#805030]">Image Quality</span>
                    <span className="text-[#004be3] font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-[#ffd4bb] rounded-full overflow-hidden">
                    <div className="h-full bg-[#004be3] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#805030]">Description Depth</span>
                    <span className="text-[#ff7936] font-medium">70%</span>
                  </div>
                  <div className="h-2 bg-[#ffd4bb] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff7936] rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace Trend */}
            <div>
              <h3 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-4">Marketplace Trend</h3>
              <div className="space-y-3">
                {[
                  { name: 'Eco-friendly Backpacks', growth: '+24%', up: true },
                  { name: 'Minimalist Totes', growth: '+18%', up: true },
                  { name: 'Convertible Bags', growth: '+12%', up: true },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-[#805030] text-xs">{item.name}</span>
                    <span className={`text-xs font-medium ${item.up ? 'text-green-600' : 'text-[#b9002c]'}`}>
                      {item.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-[#ffd4bb] rounded-sm p-4">
              <h3 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-2">Quick Help</h3>
              <p className="text-[#805030] text-xs leading-relaxed">
                High-quality images increase conversion by up to 40%. Add at least 5 angles for best results.
              </p>
            </div>
          </aside>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="sticky bottom-0 bg-[#fff4f0] border-t border-[#ffd4bb] px-6 py-3 flex items-center justify-between lg:hidden">
          <span className="text-[#805030] text-xs">Draft saved · 2m ago</span>
          <button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff7936] to-[#ff5500] text-white rounded-sm">
            Publish
          </button>
        </div>

        {/* Simplified Footer */}
        <footer className="border-t border-[#ffd4bb] py-8 px-6">
          <div className="flex items-center justify-between text-xs text-[#805030]/50">
            <span>Kinetic Marketplace © 2024</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#805030]">Privacy</a>
              <a href="#" className="hover:text-[#805030]">Terms</a>
              <a href="#" className="hover:text-[#805030]">Support</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Preview Modal Overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 backdrop-blur-xl bg-black/60 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full bg-white rounded-sm shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[#4a2507]">close</span>
            </button>

            <div className="grid grid-cols-2">
              <div className="h-[500px] bg-gradient-to-br from-[#ff7936]/20 to-[#ffd4bb] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ff7936]/30 text-7xl">backpack</span>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[#ff7936] text-xs uppercase tracking-wider font-medium">New Arrival</span>
                  <h2 className="text-[#4a2507] text-2xl font-semibold mt-2">Premium School Backpack</h2>
                  <p className="text-[#805030]/60 text-sm mt-3 leading-relaxed">
                    Crafted from 600D polyester with padded shoulder straps and a dedicated laptop sleeve.
                    Available in multiple colorways for bulk orders.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#805030]">Retail Price</span>
                      <span className="text-[#4a2507] font-semibold">$349.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#805030]">Wholesale (10+)</span>
                      <span className="text-[#ff7936] font-semibold">$285.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#805030]">Stock</span>
                      <span className="text-green-700 font-medium">1,200 units</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#ffd4bb]">
                    <p className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-2">Artisanship</p>
                    <p className="text-[#805030]/60 text-xs italic">
                      "Handcrafted with precision — each stitch reflects our commitment to quality and durability."
                    </p>
                  </div>
                </div>

                <button className="w-full mt-8 py-3 bg-gradient-to-r from-[#ff7936] to-[#ff5500] text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
                  Add to Cart — $349.00
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListNewProductPage;
