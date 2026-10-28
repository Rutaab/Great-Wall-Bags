import React from 'react';

const ProductionTrackerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Sticky Glass Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#dca079]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9e3c00]">precision_manufacturing</span>
                <span className="font-semibold text-[#4a2507] text-lg tracking-tight">The Kinetic Curator</span>
              </div>
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">search</span>
                <input
                  type="text"
                  placeholder="Search production batches..."
                  className="w-64 pl-9 pr-3 py-2 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Dashboard</a>
              <a href="#" className="text-[#9e3c00] font-medium text-sm border-b-2 border-[#ff7936] pb-1">Production</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Inventory</a>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all">
                AK
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Fixed Left Sidebar */}
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-[#dca079]/20 overflow-y-auto">
          <div className="p-4 border-b border-[#dca079]/20">
            <h2 className="text-[#4a2507] font-semibold text-sm">Production Hub</h2>
            <p className="text-[#805030] text-xs mt-0.5">Control Center v4.2</p>
          </div>
          <nav className="p-3 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">factory</span>
              Factory Hub
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ffd4bb] text-[#9e3c00] font-medium text-sm transition-all">
              <span className="material-symbols-outlined text-lg">precision_manufacturing</span>
              Production
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">orders</span>
              Wholesale Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              Logistics
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">fact_check</span>
              QC Reports
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">description</span>
              Contracts
            </a>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#dca079]/20 bg-white">
            <div className="px-3 py-3 rounded-lg bg-[#ffede4]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#4a2507] text-xs font-medium">Live Production Health</span>
                <span className="text-green-600 text-xs font-medium">88%</span>
              </div>
              <div className="w-full h-2 bg-[#ffd4bb] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff7936] to-green-500 rounded-full" style={{width: '88%'}}></div>
              </div>
              <p className="text-[#805030] text-xs mt-1">All systems nominal</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6 max-w-7xl">
          {/* Hero: 8+4 grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
            {/* Left (8) */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-[#dca079]/20 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Real-time Operations</span>
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500 absolute"></span>
                  Live
                </span>
              </div>
              <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight mt-1">Kinetic Batch Status</h1>
              <p className="text-[#805030] text-sm mt-1">24 active lines, zero downtime 14h</p>
              <div className="flex items-center gap-3 mt-4">
                <button className="px-4 py-2 rounded-lg bg-[#ff7936] text-white text-sm font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Initiate New Batch
                </button>
                <button className="px-4 py-2 rounded-lg border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  View Analytics
                </button>
              </div>
            </div>

            {/* Right stacked (4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Stock Alert */}
              <div className="bg-[#b9002c] rounded-xl p-4 text-white flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ffd4bb]">inventory_2</span>
                <div>
                  <p className="font-semibold text-sm">Stock Alert</p>
                  <p className="text-white/80 text-xs mt-0.5">Aluminum Casing below 15%</p>
                  <button className="mt-2 text-xs text-[#ffd4bb] font-medium hover:text-white transition-colors">Reorder now →</button>
                </div>
              </div>
              {/* Active Shift */}
              <div className="bg-white rounded-xl border border-[#dca079]/20 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  ER
                </div>
                <div>
                  <p className="text-[#4a2507] text-sm font-medium">Elena Rodriguez</p>
                  <p className="text-[#805030] text-xs">Shift Supervisor — Active</p>
                </div>
                <span className="ml-auto relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
              </div>
            </div>
          </div>

          {/* Active Production Batches */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#4a2507] text-lg font-semibold">Active Production Batches</h3>
              <a href="#" className="text-[#9e3c00] text-sm font-medium hover:text-[#ff7936] transition-colors">View all batches →</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Premium Duffel — Batch C', pct: 74, state: 'In Progress', eta: 'Est. 2h 15m', color: 'from-[#ff7936] to-[#9e3c00]' },
                { name: 'Urban Backpack — Batch A', pct: 12, state: 'In Progress', eta: 'Est. 6h 40m', color: 'from-[#004be3] to-[#4a8cff]' },
                { name: 'Leather Tote — Batch D', pct: 100, state: 'Completed', eta: 'Done', color: 'from-green-500 to-emerald-600', completed: true },
                { name: 'Travel Organizer — Batch B', pct: 45, state: 'ON HOLD', eta: 'On Hold ⏸', color: 'from-[#b9002c] to-[#ff4d6d]', hold: true },
              ].map((batch, i) => (
                <div key={i} className={`bg-white rounded-xl border border-[#dca079]/20 overflow-hidden group hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all relative ${batch.hold ? 'opacity-80' : ''}`}>
                  {/* Hold overlay */}
                  {batch.hold && (
                    <div className="absolute inset-0 bg-[#4a2507]/5 flex items-center justify-center z-10 rounded-xl pointer-events-none">
                      <span className="bg-[#b9002c] text-white text-xs font-bold px-3 py-1 rounded-full rotate-[-12deg]">ON HOLD</span>
                    </div>
                  )}
                  <div className={`bg-gradient-to-br ${batch.color} h-28 flex items-center justify-center relative`}>
                    <span className="material-symbols-outlined text-white/30 text-4xl">backpack</span>
                    {batch.completed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">check</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-[#4a2507] font-medium text-sm truncate">{batch.name}</h4>
                    <div className="flex items-center justify-between mt-2 mb-1.5">
                      <span className={`text-xs font-medium ${batch.state === 'Completed' ? 'text-green-600' : batch.state === 'ON HOLD' ? 'text-[#b9002c]' : 'text-[#ff7936]'}`}>
                        {batch.state === 'Completed' && <span className="material-symbols-outlined text-green-600 text-sm align-text-bottom mr-0.5">check_circle</span>}
                        {batch.state}
                      </span>
                      <span className="text-[#805030] text-xs">{batch.eta}</span>
                    </div>
                    <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${batch.color} transition-all duration-700 group-hover:opacity-80`} style={{width: `${batch.pct}%`}}></div>
                    </div>
                    <p className="text-[#805030] text-xs mt-1 text-right">{batch.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Material Stock */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#4a2507] text-lg font-semibold">Raw Material Stock</h3>
              <button className="px-3 py-1.5 rounded-lg border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Report
              </button>
            </div>
            <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#dca079]/20 bg-[#ffede4]">
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Material</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Grade</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Quantity</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Consumption</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Aluminum Casing', grade: '6061-T6', qty: '1,240 kg', status: 'Low Stock', statusColor: 'bg-[#b9002c]', consumption: 85 },
                      { name: 'Leather Roll — Premium', grade: 'Full-Grain', qty: '520 units', status: 'Adequate', statusColor: 'bg-green-600', consumption: 42 },
                    ].map((mat, i) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${i === 0 ? 'from-[#b9002c]/20 to-[#b9002c]/5' : 'from-[#ff7936]/20 to-[#9e3c00]/5'} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-[#805030] text-sm">{i === 0 ? 'category' : 'styler'}</span>
                            </div>
                            <span className="text-[#4a2507] font-medium">{mat.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#805030]">{mat.grade}</td>
                        <td className="px-4 py-3 text-[#4a2507] font-medium">{mat.qty}</td>
                        <td className="px-4 py-3">
                          <span className={`${mat.statusColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{mat.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-[#ffede4] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${i === 0 ? 'bg-[#b9002c]' : 'bg-[#ff7936]'}`} style={{width: `${mat.consumption}%`}}></div>
                            </div>
                            <span className="text-[#805030] text-xs">{mat.consumption}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-[#dca079]/20 pt-6 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[#805030] text-xs">&copy; 2024 The Kinetic Curator. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Privacy Policy</a>
                <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Terms of Service</a>
                <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Shipping Info</a>
                <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Returns</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProductionTrackerPage;
