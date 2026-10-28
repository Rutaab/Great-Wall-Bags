import React from 'react';

const SmartContractsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Sticky Glass Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#dca079]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9e3c00]">description</span>
                <span className="font-semibold text-[#4a2507] text-lg tracking-tight">The Kinetic Curator</span>
              </div>
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">search</span>
                <input
                  type="text"
                  placeholder="Search agreements..."
                  className="w-64 pl-9 pr-3 py-2 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#9e3c00] font-medium text-sm border-b-2 border-[#ff7936] pb-1">Partnerships</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Marketplace</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Analytics</a>
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
            <h2 className="text-[#4a2507] font-semibold text-sm">Contracts Hub</h2>
            <p className="text-[#805030] text-xs mt-0.5">Smart Agreement v4.2</p>
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
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">orders</span>
              Wholesale Orders
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              Logistics
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ffd4bb] text-[#9e3c00] font-medium text-sm transition-all">
              <span className="material-symbols-outlined text-lg">fact_check</span>
              Review
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#805030] hover:bg-[#ffede4] hover:text-[#4a2507] text-sm transition-all">
              <span className="material-symbols-outlined text-lg">description</span>
              Contracts
            </a>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#dca079]/20 bg-white">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#ffede4]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004be3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004be3]"></span>
              </span>
              <div>
                <p className="text-[#4a2507] text-sm font-medium">Partner Status</p>
                <p className="text-[#805030] text-xs">Tier 1 Manufacturer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Enterprise Management</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Smart Contract Hub</h1>
                <p className="text-[#805030] text-sm mt-1">Manage, review, and negotiate enterprise agreements</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">add</span>
                Draft New Agreement
              </button>
            </div>
            {/* Decorative accent line */}
            <div className="mt-4 w-full h-px bg-gradient-to-r from-[#ff7936] via-[#dca079] to-transparent"></div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 mb-8">
            {/* Active Agreement (span 8) */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-[#004be3]/10 to-[#4a8cff]/5 flex items-center justify-center border-b border-[#dca079]/20">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[#805030]/20 text-6xl">description</span>
                  <p className="text-[#805030]/40 text-sm mt-1">Blueprint — Agreement Overview</p>
                </div>
                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Verified Seller
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#4a2507] text-sm font-semibold">SC-2024-8842-LT</p>
                    <p className="text-[#805030] text-xs">Long-term Partnership Agreement</p>
                  </div>
                  <span className="bg-[#ff7936]/10 text-[#ff7936] text-xs font-medium px-2.5 py-1 rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#ffede4] rounded-lg p-3">
                    <p className="text-[#805030] text-xs">Duration</p>
                    <p className="text-[#4a2507] text-sm font-semibold mt-0.5">24 Months</p>
                  </div>
                  <div className="bg-[#ffede4] rounded-lg p-3">
                    <p className="text-[#805030] text-xs">Volume</p>
                    <p className="text-[#4a2507] text-sm font-semibold mt-0.5">14,500 Units/Q</p>
                  </div>
                  <div className="bg-[#ffede4] rounded-lg p-3">
                    <p className="text-[#805030] text-xs">Token</p>
                    <p className="text-[#4a2507] text-sm font-semibold mt-0.5">USDC-Mainnet</p>
                  </div>
                </div>
                <div>
                  <p className="text-[#4a2507] text-sm font-semibold mb-3">Legal Milestones</p>
                  <div className="space-y-0">
                    {[
                      { phase: 'Phase 1: Initial Review', status: 'Completed', color: 'bg-green-500', icon: 'check_circle' },
                      { phase: 'Phase 2: Terms Negotiation', status: 'Completed', color: 'bg-green-500', icon: 'check_circle' },
                      { phase: 'Phase 3: Final Sign-off', status: 'Pending', color: 'bg-[#ff7936]', icon: 'schedule' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center gap-3 pb-4 last:pb-0 group">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full ${m.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-white text-sm">{m.icon}</span>
                          </div>
                          {i < 2 && <div className="w-0.5 h-6 bg-[#dca079]/20"></div>}
                        </div>
                        <div>
                          <p className="text-[#4a2507] text-sm">{m.phase}</p>
                          <p className={`text-xs ${m.status === 'Completed' ? 'text-green-600' : 'text-[#ff7936]'}`}>{m.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right sidebar (span 4) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              {/* Recent Changes */}
              <div className="bg-white rounded-xl border border-[#dca079]/20 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#4a2507] font-semibold text-sm">Recent Changes</h3>
                  <span className="material-symbols-outlined text-[#805030] text-sm">history</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-[#dca079]/10">
                    <div className="w-2 h-2 rounded-full bg-[#ff7936] mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#4a2507] text-sm">Price Clause Update</p>
                      <p className="text-[#805030] text-xs">Section 4.2 modified</p>
                      <p className="text-[#805030]/60 text-xs mt-0.5">2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[#4a2507] text-sm">Terms Accepted</p>
                      <p className="text-[#805030] text-xs">All parties signed off</p>
                      <p className="text-[#805030]/60 text-xs mt-0.5">5h ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Alert */}
              <div className="bg-[#b9002c] rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#ffd4bb]">notifications_active</span>
                  <span className="font-semibold text-sm">Smart Alert</span>
                </div>
                <p className="text-white/90 text-sm">Agreement #901 requires re-validation</p>
                <p className="text-[#ffd4bb] text-xs mt-1">Certificates expiring in 14 days</p>
                <button className="mt-3 text-xs text-white font-medium bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                  Review Now
                </button>
              </div>
            </div>

            {/* Secondary Contracts Row */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Pacific Electronics MoU', type: 'Memorandum of Understanding', badge: 'Urgent', badgeColor: 'bg-[#b9002c]' },
                { name: 'Cross-Border Logistics', type: 'Service Agreement', badge: 'Active', badgeColor: 'bg-[#004be3]' },
                { name: 'Storage & Warehousing', type: 'Facility Lease', badge: 'Review', badgeColor: 'bg-[#ff7936]' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-4 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff7936]/20 to-[#9e3c00]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#805030] text-lg">description</span>
                    </div>
                    <span className={`${card.badgeColor} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full`}>{card.badge}</span>
                  </div>
                  <p className="text-[#4a2507] text-sm font-medium">{card.name}</p>
                  <p className="text-[#805030] text-xs mt-0.5">{card.type}</p>
                  <button className="mt-3 text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors flex items-center gap-1">
                    View Details
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              ))}
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

export default SmartContractsPage;
