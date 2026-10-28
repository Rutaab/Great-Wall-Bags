import React from 'react';

const QualityControlPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Sticky Glass Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#dca079]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9e3c00]">fact_check</span>
                <span className="font-semibold text-[#4a2507] text-lg tracking-tight">The Kinetic Curator</span>
              </div>
              <div className="relative hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#805030] text-sm">search</span>
                <input
                  type="text"
                  placeholder="Search inspections..."
                  className="w-64 pl-9 pr-3 py-2 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Dashboard</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-sm font-medium transition-colors">Production</a>
              <a href="#" className="text-[#9e3c00] font-medium text-sm border-b-2 border-[#ff7936] pb-1">QC</a>
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
            <h2 className="text-[#4a2507] font-semibold text-sm">QC Center</h2>
            <p className="text-[#805030] text-xs mt-0.5">Quality Assurance v4.2</p>
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
            <div className="px-3 py-3 rounded-lg bg-[#ffede4]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-sm">verified</span>
                <div>
                  <p className="text-[#4a2507] text-xs font-medium">QC Pass Rate Today</p>
                  <p className="text-green-600 text-xs font-semibold">97.8%</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Quality Assurance Protocol</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Manufacturer Control Center</h1>
                <p className="text-[#805030] text-sm mt-1">Monitor inspections, certifications, and quality metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">file_download</span>
                  Export Logs
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-sm font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Inspection
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 mb-8">
            {/* Monthly Pass Rate (span 2) */}
            <div className="col-span-6 lg:col-span-2 bg-white rounded-xl border border-[#dca079]/20 p-5 flex flex-col justify-center relative overflow-hidden hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[#ff7936]/10 text-7xl">verified_user</span>
              <p className="text-[#805030] text-xs font-medium mb-1">Monthly Pass Rate</p>
              <p className="text-[#4a2507] text-2xl font-bold">98.4%</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                <span className="text-green-600 text-xs font-medium">+1.2%</span>
              </div>
            </div>

            {/* Featured Image (span 4) */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden relative h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff7936]/30 to-[#9e3c00]/40 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-white/40 text-5xl">manufacturing</span>
                  <p className="text-white/60 text-sm mt-1">Factory Floor — Line 03</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <span className="absolute top-3 left-3 bg-[#b9002c] text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wider">LIVE FEED</span>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold drop-shadow-sm">Batch Certification: #KC-2024-0092</p>
                <p className="text-white/70 text-xs mt-0.5">Final quality assessment in progress</p>
              </div>
            </div>

            {/* Return Rate (span 2) */}
            <div className="col-span-6 lg:col-span-2 bg-white rounded-xl border border-[#b9002c]/30 p-5 border-l-4 border-l-[#b9002c] hover:shadow-lg transition-all">
              <p className="text-[#805030] text-xs font-medium mb-1">Return Rate</p>
              <p className="text-[#b9002c] text-2xl font-bold">0.42%</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#805030]">Cosmetic Defects</span>
                  <span className="text-[#4a2507] font-medium">62%</span>
                </div>
                <div className="w-full h-1.5 bg-[#ffe8eb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#b9002c] rounded-full" style={{width: '62%'}}></div>
                </div>
              </div>
            </div>

            {/* Certification Cards (span 4, 2x2) */}
            <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#dca079]/20 p-4 flex flex-col hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-[#ff7936]">verified</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-[#4a2507] text-sm font-medium">ISO-9001 Compliance</p>
                <p className="text-[#805030] text-xs mt-1">Valid until Dec 2025</p>
                <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Certified
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#dca079]/20 p-4 flex flex-col hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-[#004be3]">badge</span>
                  <span className="bg-[#ff7936]/10 text-[#ff7936] text-[10px] font-semibold px-2 py-0.5 rounded-full">Pending Review</span>
                </div>
                <p className="text-[#4a2507] text-sm font-medium">Batch Certification #BC-X991-A</p>
                <p className="text-[#805030] text-xs mt-1">Submitted Oct 28, 2024</p>
                <button className="mt-2 text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">Review now →</button>
              </div>
            </div>

            {/* Recent Inspection Reports (full-width) */}
            <div className="col-span-12 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
                <h3 className="text-[#4a2507] font-semibold text-sm">Recent Inspection Reports</h3>
                <a href="#" className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">View all →</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#ffede4]">
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Batch ID</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Inspector</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Result</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 'KC-BATCH-0092', inspector: 'Elena Rodriguez', date: 'Oct 28, 2024', result: 'Passed', resultColor: 'bg-green-600' },
                      { id: 'KC-BATCH-0091', inspector: 'Marcus Chen', date: 'Oct 27, 2024', result: 'Flagged', resultColor: 'bg-[#b9002c]' },
                      { id: 'KC-BATCH-0090', inspector: 'Sarah Kim', date: 'Oct 26, 2024', result: 'Passed', resultColor: 'bg-green-600' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3 text-[#4a2507] font-medium">{row.id}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.inspector}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`${row.resultColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.result}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View Report
                          </button>
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

export default QualityControlPage;
