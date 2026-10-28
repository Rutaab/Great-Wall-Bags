import React from 'react';

const WholesaleManagerPage: React.FC = () => {
  const barHeights = [55, 72, 45, 88, 62, 76, 90, 68];

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Sticky Glass Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#dca079]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9e3c00]">orders</span>
                <span className="font-semibold text-[#4a2507] text-lg tracking-tight">The Kinetic Curator</span>
              </div>
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">search</span>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-64 pl-9 pr-3 py-2 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#9e3c00] font-medium text-sm border-b-2 border-[#ff7936] pb-1">Dashboard</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Inventory</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Logistics</a>
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
            <h2 className="text-[#4a2507] font-semibold text-sm">Wholesale Hub</h2>
            <p className="text-[#805030] text-xs mt-0.5">Control Center v4.2</p>
          </div>
          <nav className="p-3 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">factory</span>
              Factory Hub
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">precision_manufacturing</span>
              Production
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ffd4bb] text-[#9e3c00] font-medium text-sm transition-all">
              <span className="material-symbols-outlined text-lg">orders</span>
              Wholesale Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              Shipping
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
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#ffede4]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div>
                <p className="text-[#4a2507] text-sm font-medium">Support Status</p>
                <p className="text-[#805030] text-xs">Priority Line Active</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6 max-w-7xl">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Wholesale Management</h1>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">file_download</span>
                Export CSV
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-sm font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                New Contract
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 mb-8">
            {/* Live Revenue (span 8) */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#805030] text-sm font-medium">Live Revenue</p>
                  <p className="text-[#4a2507] text-3xl font-bold tracking-tight mt-1">$2.48M</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                    <span className="text-green-600 text-xs font-medium">+12.4%</span>
                    <span className="text-[#805030] text-xs ml-1">this quarter</span>
                  </div>
                </div>
                <span className="text-[#805030] text-xs">Updated 5m ago</span>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-3 h-32 mt-6">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[#805030] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">${Math.round(h * 28)}k</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#ff7936] to-[#9e3c00] hover:from-[#ff7936] hover:to-[#ff7936] transition-all duration-300 group-hover:scale-y-105 origin-bottom cursor-pointer"
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[#805030] text-[10px]">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Bulk Tiers (span 4, blue bg) */}
            <div className="col-span-12 lg:col-span-4 bg-[#004be3] rounded-xl p-5 text-white hover:shadow-lg hover:shadow-[#004be3]/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-white/80">layers</span>
                <h3 className="font-semibold text-sm">Active Bulk Tiers</h3>
              </div>
              <div className="space-y-3">
                {[
                  { tier: 'Tier 1', min: '500+', discount: '15% Off', desc: 'Entry volume pricing' },
                  { tier: 'Tier 2', min: '1k+', discount: '22% Off', desc: 'Preferred partner rate' },
                  { tier: 'Enterprise', min: '5k+', discount: 'Custom', desc: 'Negotiated terms' },
                ].map((t, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/15 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium text-sm">{t.tier}</span>
                      <span className="text-[#ffd4bb] text-xs font-semibold">{t.min}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/70 text-xs">{t.desc}</span>
                      <span className="text-[#ffd4bb] text-sm font-bold">{t.discount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Queue (full-width) */}
            <div className="col-span-12 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
                <h3 className="text-[#4a2507] font-semibold text-sm">Fulfillment Queue</h3>
                <a href="#" className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">Manage queue →</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#ffede4]">
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Partner Entity</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Volume</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Value</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { entity: 'Nexus Global Goods', volume: '14,500 units', value: '$847,200', status: 'Processing', statusColor: 'bg-[#ff7936]' },
                      { entity: 'Skyline Corp', volume: '8,200 units', value: '$423,900', status: 'Urgent', statusColor: 'bg-[#b9002c]' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7936]/20 to-[#9e3c00]/5 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#805030] text-sm">business</span>
                            </div>
                            <span className="text-[#4a2507] font-medium">{row.entity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#4a2507]">{row.volume}</td>
                        <td className="px-4 py-3 text-[#4a2507] font-semibold">{row.value}</td>
                        <td className="px-4 py-3">
                          <span className={`${row.statusColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supply Chain Distribution (span 6) */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <h3 className="text-[#4a2507] font-semibold text-sm mb-4">Supply Chain Distribution</h3>
              <div className="space-y-4">
                {[
                  { region: 'North America', pct: 65, color: 'bg-[#ff7936]' },
                  { region: 'European Union', pct: 24, color: 'bg-[#004be3]' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#4a2507] text-sm">{s.region}</span>
                      <span className="text-[#805030] text-xs font-medium">{s.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#ffede4] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700 hover:opacity-80`} style={{width: `${s.pct}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#dca079]/10 flex items-center justify-between text-xs">
                <span className="text-[#805030]">Rest of World</span>
                <span className="text-[#4a2507] font-medium">11%</span>
              </div>
            </div>

            {/* Inventory Health (span 6) */}
            <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <h3 className="text-[#4a2507] font-semibold text-sm mb-4">Inventory Health</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#ffede4] rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-[#ff7936] text-2xl">inventory_2</span>
                  <p className="text-[#4a2507] text-2xl font-bold mt-1">1,402</p>
                  <p className="text-[#805030] text-xs">SKU Count</p>
                </div>
                <div className="bg-[#b9002c]/10 rounded-xl p-4 text-center">
                  <span className="material-symbols-outlined text-[#b9002c] text-2xl">warning</span>
                  <p className="text-[#b9002c] text-2xl font-bold mt-1">12</p>
                  <p className="text-[#805030] text-xs">Reorder Alerts</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-[#805030]">Stock accuracy rate</span>
                <span className="text-green-600 font-medium">99.2%</span>
              </div>
            </div>
          </div>

          {/* FAB */}
          <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white shadow-lg hover:shadow-xl hover:shadow-[#ff7936]/30 transition-all flex items-center justify-center hover:scale-105 active:scale-95 z-40">
            <span className="material-symbols-outlined">add</span>
          </button>
        </main>
      </div>
    </div>
  );
};

export default WholesaleManagerPage;
