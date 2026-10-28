import React from 'react';
import { formatPrice } from '../utils/currency'

const categories = [
  { name: 'Backpacks', href: '#' },
  { name: 'Luxury', href: '#' },
  { name: 'School', href: '#', active: true },
  { name: 'Travel', href: '#' },
  { name: 'Business', href: '#' },
];

const products = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  name: `Premium School Backpack ${i + 1}`,
  price: i === 0 ? 28.50 : i === 1 ? 32.00 : i === 2 ? 24.75 : 35.20,
  stock: i === 0 ? 1200 : i === 1 ? 850 : i === 2 ? 2100 : 640,
  rating: 4.5 + i * 0.1,
  specs: ['600D Polyester', '35L Capacity', 'Padded Straps', 'Laptop Sleeve'],
}));

const colors = ['bg-slate-500', 'bg-blue-500', 'bg-red-500', 'bg-orange-500', 'bg-emerald-500'];

const WholesalePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Glass-nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#fff4f0]/80 border-b border-[#ffd4bb]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#9e3c00] text-lg font-semibold">Kinetic Marketplace</span>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search wholesale products..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] placeholder-[#805030]/50 outline-none focus:border-[#ff7936] transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors relative">
              <span className="material-symbols-outlined text-[#4a2507]">person</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors relative">
              <span className="material-symbols-outlined text-[#4a2507]">shopping_cart</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b9002c] text-white text-[10px] flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Fixed Left Sidebar */}
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-[#ffede4] border-r border-[#ffd4bb] p-6 overflow-y-auto">
          <h3 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-4">Categories</h3>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.name}>
                <a
                  href={cat.href}
                  className={`block px-4 py-2.5 text-sm rounded-r-full transition-colors ${
                    cat.active
                      ? 'bg-[#ffd4bb] text-[#9e3c00] font-medium'
                      : 'text-[#805030] hover:bg-[#ffd4bb]/50'
                  }`}
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
          <button className="mt-6 w-full py-3 bg-gradient-to-r from-[#ff7936] to-[#ff5500] text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity">
            Flash Sales
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#805030]/60 mb-6">
            <a href="#" className="hover:text-[#9e3c00]">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-[#9e3c00]">Bulk Wholesale</a>
            <span>/</span>
            <span className="text-[#4a2507]">School Bags</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[#4a2507] text-2xl font-semibold">School Bags & Backpacks</h1>
              <p className="text-[#805030]/60 text-sm mt-1">
                Bulk pricing available for quantities of 50+ units
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#dca079] text-[#805030] text-sm rounded-sm hover:bg-[#ffd4bb] transition-colors">
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                Compare (3)
              </button>
              <button className="px-5 py-2.5 bg-[#004be3] text-white text-sm rounded-sm hover:bg-blue-700 transition-colors">
                Request Quote
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside className="w-72 flex-shrink-0">
              <div className="bg-[#ffede4] rounded-sm p-5 space-y-6">
                <div>
                  <h4 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-3">Material</h4>
                  <div className="space-y-2">
                    {['Polyester', 'Nylon', 'Canvas', 'Leather', 'Recycled Materials'].map((m) => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-[#ff7936]" />
                        <span className="text-sm text-[#805030]">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        className={`w-7 h-7 rounded-full ${c} border-2 border-transparent hover:border-[#4a2507] transition-all`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-3">Supplier Region</h4>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] outline-none">
                    <option>All Regions</option>
                    <option>Asia Pacific</option>
                    <option>North America</option>
                    <option>Europe</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-3">Special Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {['USB CHARGING', 'LAPTOP SLEEVE', 'WATERPROOF', 'RFID'].map((f) => (
                      <button
                        key={f}
                        className="px-3 py-1 text-[10px] border border-[#dca079] text-[#805030] rounded-full hover:bg-[#ffd4bb] transition-colors"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#4a2507] text-xs uppercase tracking-wider font-medium mb-3">Compliance</h4>
                  <div className="space-y-2">
                    {['REACH Certified', 'OEKO-TEX', 'ISO 9001'].map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-[#ff7936]" />
                        <span className="text-sm text-[#805030]">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#ff7936] to-[#ff5500] rounded-sm p-4 text-white">
                  <p className="text-xs uppercase tracking-wider font-medium">Wholesale Tier 3</p>
                  <p className="text-lg font-semibold mt-1">Save 15%</p>
                  <p className="text-xs mt-1 opacity-80">On orders of 100+ units</p>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#805030] text-sm">Showing 1-12 of 420 items</p>
                <select className="px-3 py-2 text-sm bg-white border border-[#ffd4bb] text-[#4a2507] outline-none">
                  <option>Sort: Best Match</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>

              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-sm p-5 flex gap-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-36 h-36 bg-gradient-to-br from-[#ff7936]/20 to-[#ffd4bb] rounded-sm flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#ff7936]/40 text-4xl">backpack</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#4a2507] text-base font-medium">{product.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-[#ff7936] text-xl font-semibold">{formatPrice(product.price)}</span>
                          <span className="text-[#805030]/60 text-xs ml-1">/ unit</span>
                        </div>
                        <span className="text-green-700 text-xs font-medium">{product.stock.toLocaleString()} in stock</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                        {product.specs.map((spec) => (
                          <span key={spec} className="text-[#805030] text-xs flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#ff7936] inline-block" />
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                          <span className="text-[#4a2507] text-xs font-medium">{product.rating}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 border border-[#dca079] text-[#805030] text-xs rounded-sm hover:bg-[#ffd4bb] transition-colors">
                            SAMPLE ORDER
                          </button>
                          <button className="px-4 py-2 bg-[#ff7936] text-white text-xs rounded-sm hover:bg-[#e06600] transition-colors">
                            BULK ORDER
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB Compare Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#004be3] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50">
        <span className="material-symbols-outlined">compare_arrows</span>
      </button>

      {/* Footer */}
      <footer className="border-t border-[#ffd4bb] py-12 ml-64">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#9e3c00] text-base font-semibold mb-4">Kinetic Marketplace</h4>
            <p className="text-[#805030]/50 text-xs leading-relaxed">
              B2B wholesale platform for bag creators and suppliers.
            </p>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Bulk Categories</h5>
            <ul className="space-y-2 text-xs text-[#805030]/60">
              <li>Backpacks</li>
              <li>Luxury</li>
              <li>School</li>
              <li>Travel</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2 text-xs text-[#805030]/60">
              <li>Supplier Portal</li>
              <li>Shipping Info</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2 text-xs text-[#805030]/60">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WholesalePage;
