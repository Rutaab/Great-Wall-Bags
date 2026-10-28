import React, { useState } from 'react';

const ExteriorDesignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Exterior');
  const [activeLeather, setActiveLeather] = useState('Pebbled');
  const [activeColor, setActiveColor] = useState('Black');

  const leatherTypes = ['Pebbled', 'Saffiano', 'Smooth', 'Nubuck', 'Patent', 'Grained', 'Vegan', 'Canvas', 'Denim'];
  const colorSwatches = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Brown', hex: '#4a2507' },
    { name: 'Blue', hex: '#004be3' },
    { name: 'Red', hex: '#b9002c' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Orange', hex: '#ff7936' },
  ];

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#fff4f0]/80 backdrop-blur-xl border-b border-[#dca079]/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <span className="text-[#4a2507] font-bold text-lg tracking-tight">Kinetic Marketplace</span>
          <div className="hidden md:flex items-center gap-6">
            <button className="text-[#805030] hover:text-[#9e3c00] text-sm font-medium transition-colors">Explore</button>
            <button className="text-[#9e3c00] text-sm font-semibold border-b-2 border-[#9e3c00] pb-0.5">Creators</button>
            <button className="text-[#805030] hover:text-[#9e3c00] text-sm font-medium transition-colors">Flash Sales</button>
            <button className="text-[#805030] hover:text-[#9e3c00] text-sm font-medium transition-colors">Analytics</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors relative">
            <span className="material-symbols-outlined text-[#805030] text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#b9002c]"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#ffd4bb] transition-colors">
            <span className="material-symbols-outlined text-[#805030] text-xl">shopping_bag</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            <span className="material-symbols-outlined text-base">person</span>
            Studio Mode
          </button>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Fixed Left Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-20 md:w-64 bg-white border-r border-[#dca079]/20 flex flex-col z-40">
          <div className="p-4 border-b border-[#dca079]/20">
            <h3 className="hidden md:block text-[#4a2507] font-bold text-sm">Creator Hub</h3>
            <p className="hidden md:block text-[#805030] text-xs mt-0.5">Elite Merchant</p>
            <div className="md:hidden flex justify-center">
              <span className="material-symbols-outlined text-[#9e3c00] text-xl">store</span>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {[
              { label: 'Dashboard', icon: 'dashboard' },
              { label: 'Inventory', icon: 'inventory_2', active: true },
              { label: 'Orders', icon: 'receipt_long' },
              { label: 'Analytics', icon: 'analytics' },
              { label: 'Storefront', icon: 'store' },
              { label: 'Settings', icon: 'settings' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-[#ffd4bb] text-[#9e3c00]'
                    : 'text-[#805030] hover:bg-[#ffede4]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-[#dca079]/20">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden md:inline">Add New Product</span>
            </button>
          </div>
        </aside>

        {/* Center 3D Canvas */}
        <main className="flex-1 ml-20 md:ml-64 relative min-h-[calc(100vh-4rem)]">
          <div className="absolute inset-0 bg-gradient-radial from-[#ffd4bb]/40 via-[#fff4f0] to-[#fff4f0]">
            {/* Live Preview Active Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
                </span>
                <span className="text-[#4a2507] text-xs font-semibold tracking-wide">Live Preview Active</span>
              </div>
            </div>

            {/* Main Handbag Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-96 md:w-80 md:h-[30rem] rounded-3xl bg-gradient-to-br from-[#ffd4bb]/60 to-[#ff7936]/20 shadow-2xl drop-shadow-[0_40px_80px_rgba(158,60,0,0.25)] flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-[#dca079]/40">work</span>
                  <p className="text-[#805030]/60 text-sm mt-2 font-medium">Exterior Preview</p>
                  {activeLeather && (
                    <p className="text-[#9e3c00] text-xs font-semibold mt-1">{activeLeather} Leather</p>
                  )}
                </div>
              </div>
            </div>

            {/* Camera Controls Floating Panel */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#805030] hover:bg-[#ffede4] text-xs font-semibold transition-all">
                  <span className="material-symbols-outlined text-base">3d_rotation</span>
                  Rotate
                </button>
                <div className="w-px h-6 bg-[#dca079]/20"></div>
                <button className="px-3 py-2 rounded-xl bg-[#ff7936] text-white text-xs font-semibold shadow-sm transition-all">FRONT</button>
                <button className="px-3 py-2 rounded-xl text-[#805030] hover:bg-[#ffede4] text-xs font-semibold transition-all">SIDE</button>
                <button className="px-3 py-2 rounded-xl text-[#805030] hover:bg-[#ffede4] text-xs font-semibold transition-all">INTERIOR</button>
                <div className="w-px h-6 bg-[#dca079]/20"></div>
                <button className="p-2 rounded-xl text-[#805030] hover:bg-[#ffede4] transition-all">
                  <span className="material-symbols-outlined text-base">add</span>
                </button>
                <button className="p-2 rounded-xl text-[#805030] hover:bg-[#ffede4] transition-all">
                  <span className="material-symbols-outlined text-base">remove</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-[400px] bg-white border-l border-[#dca079]/20 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b border-[#dca079]/20">
            <p className="text-[#004be3] text-xs font-semibold tracking-wide uppercase mb-1">Kinetic Series 01</p>
            <h2 className="text-[#4a2507] text-2xl font-bold">The Artisan Tote</h2>
            <p className="text-[#9e3c00] text-xl font-bold mt-1">$1,240.00</p>
          </div>

          {/* 3-Tab Bar */}
          <div className="flex border-b border-[#dca079]/20">
            {['Exterior', 'Hardware', 'Monogram'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === tab
                    ? 'text-[#9e3c00]'
                    : 'text-[#805030] hover:text-[#4a2507]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#9e3c00] rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Exterior Tab Content */}
            <div className={activeTab === 'Exterior' ? 'space-y-6' : 'hidden'}>
              {/* Leather Selection */}
              <div>
                <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Leather Selection</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {leatherTypes.map((leather) => (
                    <button
                      key={leather}
                      onClick={() => setActiveLeather(leather)}
                      className={`p-2.5 rounded-xl text-center text-xs font-medium transition-all ${
                        activeLeather === leather
                          ? 'ring-2 ring-[#9e3c00] bg-[#fff4f0] shadow-md'
                          : 'bg-[#fff4f0] hover:bg-[#ffede4] border border-[#dca079]/10'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg mb-1.5 bg-gradient-to-br ${
                        leather === 'Pebbled' ? 'from-[#4a2507] to-[#805030]' :
                        leather === 'Saffiano' ? 'from-[#5c3a21] to-[#8b5e3c]' :
                        leather === 'Smooth' ? 'from-[#3d2817] to-[#6b4c32]' :
                        leather === 'Nubuck' ? 'from-[#6b4c32] to-[#a17f5f]' :
                        leather === 'Patent' ? 'from-[#1a1a1a] to-[#3d3d3d]' :
                        leather === 'Grained' ? 'from-[#4a3520] to-[#7a5c3a]' :
                        leather === 'Vegan' ? 'from-[#2e7d32] to-[#66bb6a]' :
                        leather === 'Canvas' ? 'from-[#8b7355] to-[#c4a882]' :
                        'from-[#1a1a1a] via-[#2d2d2d] to-[#4a4a4a]'
                      }`}></div>
                      <span className={activeLeather === leather ? 'text-[#9e3c00]' : 'text-[#805030]'}>{leather}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Leather Color */}
              <div>
                <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Leather Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {colorSwatches.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color.name)}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          activeColor === color.name
                            ? 'ring-2 ring-[#9e3c00] ring-offset-2 scale-110'
                            : 'border-[#dca079]/30 hover:border-[#9e3c00]/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <span className={`text-[10px] font-medium ${
                        activeColor === color.name ? 'text-[#9e3c00]' : 'text-[#805030]'
                      }`}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Tab (hidden initially) */}
            <div className={activeTab === 'Hardware' ? 'flex items-center justify-center h-40 text-[#805030] text-sm' : 'hidden'}>
              <span className="text-[#dca079]/50">Hardware options loading...</span>
            </div>

            {/* Monogram Tab (hidden initially) */}
            <div className={activeTab === 'Monogram' ? 'flex items-center justify-center h-40 text-[#805030] text-sm' : 'hidden'}>
              <span className="text-[#dca079]/50">Monogram options loading...</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-[#dca079]/20 bg-white">
            <div className="flex items-center gap-3">
              <button className="flex-1 py-3 rounded-2xl bg-[#004be3] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:bg-[#0040c0] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Add to Cart
              </button>
              <button className="p-3 rounded-2xl bg-[#fff4f0] border border-[#dca079]/20 text-[#805030] hover:bg-[#ffede4] transition-all">
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
            <p className="text-center text-[#805030] text-xs mt-3 font-medium">
              Estimated delivery 2-3 weeks
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExteriorDesignPage;
