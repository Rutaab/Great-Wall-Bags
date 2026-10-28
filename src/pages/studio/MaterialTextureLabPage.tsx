import React, { useState } from 'react';

const MaterialTextureLabPage: React.FC = () => {
  const [activeNav] = useState('Interior');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Leather', 'Technical', 'Textiles'];

  const premiumLeathers = [
    { name: 'Full-grain', badge: 'INCLUDED', active: true },
    { name: 'Saffiano', badge: '+$45', active: false },
    { name: 'Nubuck', badge: '+$60', active: false },
    { name: 'Patent', badge: '+$35', active: false },
  ];

  const technicalFabrics = [
    { name: 'Cordura 1000D', price: '+$20' },
    { name: 'Lightweight Ripstop', price: '+$15' },
  ];

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#fff4f0]/80 backdrop-blur-xl border-b border-[#dca079]/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <span className="text-[#4a2507] font-bold text-lg tracking-tight">Studio Customizer</span>
          <div className="hidden md:flex items-center gap-6">
            {['Gallery', 'Collections', 'Inspiration'].map((link) => (
              <button
                key={link}
                className="text-[#805030] hover:text-[#9e3c00] text-sm font-medium transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
            <span className="material-symbols-outlined text-[#805030] text-xl">share</span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
            <span className="material-symbols-outlined text-[#805030] text-xl">history</span>
          </button>
          <button className="px-4 py-2 rounded-full border-2 border-[#9e3c00] text-[#9e3c00] text-sm font-semibold hover:bg-[#ffd4bb] transition-all">
            Save Design
          </button>
          <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            <span className="material-symbols-outlined text-base mr-1 align-middle">shopping_cart</span>
            Add to Cart
          </button>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Fixed Left Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-20 md:w-64 bg-white border-r border-[#dca079]/20 flex flex-col z-40">
          <div className="p-4 border-b border-[#dca079]/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">token</span>
              </div>
              <span className="hidden md:block text-[#4a2507] font-bold text-sm">Kinetix Pro</span>
            </div>
            <div className="flex items-center gap-2 text-[#805030] text-xs">
              <span className="material-symbols-outlined text-base">work</span>
              <span className="hidden md:inline">Configuring Model 01</span>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {['Exterior', 'Hardware', 'Interior', 'Straps', 'Add-ons'].map((item) => (
              <button
                key={item}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeNav === item
                    ? 'bg-[#ffd4bb] text-[#9e3c00]'
                    : 'text-[#805030] hover:bg-[#ffede4]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item === 'Exterior' ? 'checkroom' : item === 'Hardware' ? 'handyman' : item === 'Interior' ? 'chair' : item === 'Straps' ? 'link' : 'add_box'}
                </span>
                <span className="hidden md:inline">{item}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-[#dca079]/20 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#805030] hover:bg-[#ffede4] transition-all">
              <span className="material-symbols-outlined text-xl">help</span>
              <span className="hidden md:inline">Help</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#805030] hover:bg-[#ffede4] transition-all">
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="hidden md:inline">Settings</span>
            </button>
            <button className="w-full mt-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
              <span className="hidden md:inline">View Summary</span>
              <span className="md:hidden">
                <span className="material-symbols-outlined text-base">summarize</span>
              </span>
            </button>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 ml-20 md:ml-64 relative min-h-[calc(100vh-4rem)]">
          <div className="absolute inset-0 bg-gradient-radial from-[#ffd4bb]/40 via-[#fff4f0] to-[#fff4f0]">
            {/* Extreme Macro Texture Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a2507]/80 via-[#805030]/60 to-[#dca079]/40 animate-pulse"></div>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '120px 120px',
                }}
              ></div>
              {/* Zoom Animation CSS */}
              <div className="absolute inset-0" style={{ animation: 'zoomInOut 8s ease-in-out infinite' }}>
                <style>{`
                  @keyframes zoomInOut {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                  }
                `}</style>
              </div>
            </div>

            {/* Overlay Badges */}
            <div className="absolute top-4 left-6 z-30 space-y-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <span className="material-symbols-outlined text-[#9e3c00] text-base">visibility</span>
                <span className="text-[#4a2507] text-xs font-semibold tracking-wide">Live Preview: Interior Lining</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <span className="material-symbols-outlined text-[#9e3c00] text-base">texture</span>
                <span className="text-[#4a2507] text-xs font-semibold tracking-wide">Detail Focus: Nappa Grade</span>
              </div>
            </div>

            {/* Center Crosshair Focus Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-2 border-[#9e3c00]/60 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border border-[#9e3c00]/40 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#9e3c00]/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-[#9e3c00]/40"></div>
              </div>
            </div>

            {/* Bottom summary inside canvas */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <div className="text-sm">
                  <span className="text-[#805030]">Base Model </span>
                  <span className="text-[#4a2507] font-semibold">$450.00</span>
                </div>
                <div className="w-px h-5 bg-[#dca079]/30"></div>
                <div className="text-sm">
                  <span className="text-[#805030]">Materials Extra </span>
                  <span className="text-[#9e3c00] font-semibold">+$45.00</span>
                </div>
                <button className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
                  View Summary
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-80 lg:w-96 bg-white border-l border-[#dca079]/20 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Material Library Heading */}
            <h2 className="text-[#4a2507] font-bold text-lg">Material Library</h2>

            {/* Category Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#9e3c00] text-white shadow-md'
                      : 'bg-[#fff4f0] text-[#805030] hover:bg-[#ffede4] border border-[#dca079]/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Premium Leathers */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Premium Leathers</h3>
              <div className="grid grid-cols-2 gap-3">
                {premiumLeathers.map((leather) => (
                  <button
                    key={leather.name}
                    className={`p-3 rounded-2xl text-left transition-all ${
                      leather.active
                        ? 'bg-[#fff4f0] ring-2 ring-[#004be3] shadow-md'
                        : 'bg-[#fff4f0] hover:bg-[#ffede4] border border-[#dca079]/10'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-xl mb-2 bg-gradient-to-br ${
                      leather.name === 'Full-grain' ? 'from-[#4a2507] to-[#805030]' :
                      leather.name === 'Saffiano' ? 'from-[#5c3a21] to-[#8b5e3c]' :
                      leather.name === 'Nubuck' ? 'from-[#6b4c32] to-[#a17f5f]' :
                      'from-[#1a1a1a] to-[#3d3d3d]'
                    }`}></div>
                    <p className={`text-xs font-semibold ${
                      leather.active ? 'text-[#004be3]' : 'text-[#4a2507]'
                    }`}>{leather.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      leather.badge === 'INCLUDED'
                        ? 'bg-[#004be3] text-white'
                        : 'bg-[#ffd4bb] text-[#9e3c00]'
                    }`}>{leather.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Fabrics */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Technical Fabrics</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {technicalFabrics.map((fabric) => (
                  <button
                    key={fabric.name}
                    className="flex-shrink-0 w-40 p-3 rounded-2xl bg-[#fff4f0] hover:bg-[#ffede4] border border-[#dca079]/10 transition-all text-left"
                  >
                    <div className="w-full h-10 rounded-xl mb-2 bg-gradient-to-br from-[#2d2d2d] to-[#6b6b6b]"></div>
                    <p className="text-[#4a2507] text-xs font-semibold">{fabric.name}</p>
                    <span className="text-[#9e3c00] text-[10px] font-bold">{fabric.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sustainable Textiles */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Sustainable Textiles</h3>
              <button className="w-full p-4 rounded-2xl bg-[#fff4f0] hover:bg-[#ffede4] border border-[#dca079]/10 transition-all text-left relative">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2e7d32] to-[#66bb6a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">recycling</span>
                  </div>
                  <div>
                    <p className="text-[#4a2507] text-sm font-semibold">OceanBound Knit</p>
                    <p className="text-[#805030] text-xs">Recycled marine plastics</p>
                  </div>
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#2e7d32] text-white text-[10px] font-bold">New</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MaterialTextureLabPage;
