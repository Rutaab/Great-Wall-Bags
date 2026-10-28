import React from 'react';

const statCards = [
  { label: 'Total Listings', value: '14,240', icon: 'inventory_2' },
  { label: 'Active Buyers', value: '3,892', icon: 'group' },
  { label: 'Avg. Sale Price', value: '$248', icon: 'trending_up' },
];

const trendingItems = [
  { name: 'Vintage Weekenders', searches: '12.4k', growth: '+23%', up: true, color: 'from-orange-700 to-orange-500' },
  { name: 'Mini Crossbodies', searches: '9.8k', growth: '+15%', up: true, color: 'from-amber-700 to-amber-500' },
  { name: 'Structured Totes', searches: '7.2k', growth: '-4%', up: false, color: 'from-stone-700 to-stone-500' },
  { name: 'Convertible Backpacks', searches: '6.1k', growth: '+31%', up: true, color: 'from-teal-700 to-teal-500' },
  { name: 'Clutch Bags', searches: '4.8k', growth: '+8%', up: true, color: 'from-rose-700 to-rose-500' },
];

const categories = [
  { name: 'Backpacks', volume: '4,210', revenue: '$1.2M', growth: '+18%', trend: 'up' },
  { name: 'Luxury Handbags', volume: '3,850', revenue: '$3.8M', growth: '+12%', trend: 'up' },
  { name: 'Travel Duffels', volume: '2,140', revenue: '$890K', growth: '-3%', trend: 'down' },
  { name: 'Tote Bags', volume: '1,980', revenue: '$650K', growth: '+7%', trend: 'up' },
  { name: 'Crossbody Bags', volume: '1,670', revenue: '$540K', growth: '+22%', trend: 'up' },
];

const insights = [
  { title: 'Supply Chain Index', value: '74.2', change: '+2.1%', bars: [80, 65, 90, 75, 85, 70, 95] },
  { title: 'Consumer Confidence', value: '68.5', change: '+5.4%', bars: [60, 70, 65, 80, 75, 85, 78] },
  { title: 'Material Cost Index', value: '112.3', change: '-1.8%', bars: [90, 85, 95, 80, 88, 92, 86] },
];

const MarketPulsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Glass-nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#fff4f0]/80 border-b border-[#ffd4bb]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#9e3c00] text-lg font-semibold">Kinetic Marketplace</span>
          </div>
          <div className="flex items-center gap-8">
            {['Explore', 'Creators', 'Flash Sales', 'Analytics'].map((link, i) => (
              <a
                key={link}
                href="#"
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  i === 3
                    ? 'text-[#9e3c00] border-b-2 border-[#9e3c00] pb-1'
                    : 'text-[#4a2507]/70 hover:text-[#4a2507]'
                }`}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
              <span className="material-symbols-outlined text-[#4a2507]">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
              <span className="material-symbols-outlined text-[#4a2507]">person</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <h1 className="text-[#9e3c00] text-6xl font-bold tracking-tight">MarketPulse</h1>
        <p className="text-[#4a2507]/60 text-sm mt-2">Real-time Market Intelligence</p>
        <div className="grid grid-cols-3 gap-6 mt-10">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-sm p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#ff7936]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ff7936]">{stat.icon}</span>
              </div>
              <div>
                <p className="text-[#805030] text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-[#4a2507] text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-[#4a2507] text-lg font-medium mb-6">Trending Now</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {trendingItems.map((item) => (
            <div
              key={item.name}
              className="flex-shrink-0 w-56 bg-white rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white/40 text-3xl">work</span>
              </div>
              <div className="p-4">
                <h4 className="text-[#4a2507] text-sm font-medium truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#805030] text-xs">{item.searches} searches</span>
                  <span
                    className={`text-xs font-medium ${
                      item.up ? 'text-green-600' : 'text-[#b9002c]'
                    }`}
                  >
                    {item.growth}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Performance */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#4a2507] text-lg font-medium mb-6">Category Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#ffd4bb]">
                  <th className="text-left py-4 text-[#805030] font-medium">Category</th>
                  <th className="text-left py-4 text-[#805030] font-medium">Volume</th>
                  <th className="text-left py-4 text-[#805030] font-medium">Revenue</th>
                  <th className="text-left py-4 text-[#805030] font-medium">Growth</th>
                  <th className="text-left py-4 text-[#805030] font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.name} className="border-b border-[#ffd4bb]/50 hover:bg-[#fff4f0] transition-colors">
                    <td className="py-4 text-[#4a2507] font-medium">{cat.name}</td>
                    <td className="py-4 text-[#4a2507]">{cat.volume}</td>
                    <td className="py-4 text-[#4a2507]">{cat.revenue}</td>
                    <td className={`py-4 ${cat.trend === 'up' ? 'text-green-600' : 'text-[#b9002c]'}`}>{cat.growth}</td>
                    <td className="py-4">
                      <span className={`material-symbols-outlined ${cat.trend === 'up' ? 'text-green-600' : 'text-[#b9002c]'}`}>
                        {cat.trend === 'up' ? 'trending_up' : 'trending_down'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-[#4a2507] text-lg font-medium mb-6">Market Insights</h2>
        <div className="grid grid-cols-3 gap-6">
          {insights.map((insight) => (
            <div key={insight.title} className="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[#805030] text-xs uppercase tracking-wider">{insight.title}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[#4a2507] text-2xl font-semibold">{insight.value}</span>
                <span className={`text-xs ${insight.change.startsWith('+') ? 'text-green-600' : 'text-[#b9002c]'}`}>
                  {insight.change}
                </span>
              </div>
              <div className="flex items-end gap-1 mt-4 h-16">
                {insight.bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#ff7936]/30 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#ffd4bb] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#9e3c00] text-base font-semibold mb-4">Kinetic Marketplace</h4>
            <p className="text-[#805030]/50 text-xs leading-relaxed">
              Real-time market intelligence for bag creators and collectors.
            </p>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2 text-xs text-[#805030]/60">
              <li>Explore</li>
              <li>Creators</li>
              <li>Flash Sales</li>
              <li>Analytics</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2 text-xs text-[#805030]/60">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#4a2507] text-xs uppercase tracking-wider mb-4">Status</h5>
            <div className="flex items-center gap-2 text-xs text-[#805030]/60">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              All systems nominal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketPulsePage;
