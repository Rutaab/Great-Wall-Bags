import React, { useState } from 'react';

const InternalLayoutPage: React.FC = () => {
  const [xRayMode, setXRayMode] = useState(true);
  const [selectedLining, setSelectedLining] = useState('Artisan Silk');
  const [selectedSleeve, setSelectedSleeve] = useState('16');
  const [rfidChecked, setRfidChecked] = useState(true);
  const [keyClipChecked, setKeyClipChecked] = useState(true);
  const [passportChecked, setPassportChecked] = useState(false);

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

        {/* Center Viewport */}
        <main className="flex-1 ml-20 md:ml-64 relative min-h-[calc(100vh-4rem)]">
          <div className="absolute inset-0 bg-gradient-radial from-[#ffd4bb]/40 via-[#fff4f0] to-[#fff4f0]">
            {/* Large Product Image with X-Ray Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-80 h-[32rem] md:w-96 md:h-[34rem] rounded-3xl bg-gradient-to-br from-[#ffd4bb]/60 to-[#ff7936]/10 shadow-2xl flex items-center justify-center relative ${
                xRayMode ? 'mix-blend-multiply opacity-80' : ''
              }`}>
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-[#dca079]/40">work</span>
                  <p className="text-[#805030]/60 text-sm mt-2 font-medium">Internal View</p>
                </div>

                {/* Technical Annotation Badges */}
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#004be3]/80 backdrop-blur-sm text-white text-[10px] font-semibold shadow-lg">
                    <span className="material-symbols-outlined text-xs">wifi_protected_setup</span>
                    RFID Shielding Block
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#004be3]/80 backdrop-blur-sm text-white text-[10px] font-semibold shadow-lg">
                    <span className="material-symbols-outlined text-xs">straighten</span>
                    16" Modular Sleeve
                  </div>
                </div>

                {/* Central X-Ray Crosshair */}
                {xRayMode && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border border-[#004be3]/30 rounded-full"></div>
                    <div className="absolute w-8 h-px bg-[#004be3]/20"></div>
                    <div className="absolute w-px h-8 bg-[#004be3]/20"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute top-4 left-6 z-30 flex flex-col gap-1">
              <button className="p-2.5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg text-[#805030] hover:bg-[#ffede4] transition-all">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
              <button className="p-2.5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg text-[#805030] hover:bg-[#ffede4] transition-all">
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <button className="p-2.5 rounded-xl bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg text-[#805030] hover:bg-[#ffede4] transition-all">
                <span className="material-symbols-outlined text-lg">fit_screen</span>
              </button>
            </div>

            {/* X-RAY VISION Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={() => setXRayMode(!xRayMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs shadow-lg transition-all ${
                  xRayMode
                    ? 'bg-[#004be3] text-white'
                    : 'bg-white/70 backdrop-blur-xl border border-[#dca079]/30 text-[#805030]'
                }`}
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                X-RAY VISION
                <div className={`w-8 h-4 rounded-full transition-colors ${
                  xRayMode ? 'bg-white/30' : 'bg-[#dca079]/30'
                } relative`}>
                  <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                    xRayMode ? 'left-4' : 'left-0.5'
                  }`}></div>
                </div>
              </button>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-[400px] bg-white border-l border-[#dca079]/20 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b border-[#dca079]/20">
            <p className="text-[#004be3] text-xs font-semibold tracking-wide uppercase mb-1">Internal Configurator</p>
            <h2 className="text-[#4a2507] text-xl font-bold">Interior Architecture</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Lining Selection */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Lining Selection</h3>
              <div className="space-y-3">
                {[
                  { name: 'Artisan Silk', desc: 'Premium woven silk lining' },
                  { name: 'Tech Microfiber', desc: 'Durable water-resistant' },
                ].map((lining) => {
                  const isSelected = selectedLining === lining.name;
                  return (
                  <button
                    key={lining.name}
                    onClick={() => setSelectedLining(lining.name)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-[#fff4f0] ring-2 ring-[#9e3c00] shadow-md'
                          : 'bg-[#fff4f0] hover:bg-[#ffede4] grayscale opacity-60 border border-[#dca079]/10'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                        lining.name === 'Artisan Silk'
                          ? 'from-[#d4af37] to-[#f0d68a]'
                          : 'from-[#4a4a4a] to-[#8a8a8a]'
                      } flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-white text-lg">checkroom</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#4a2507]' : 'text-[#805030]'}`}>{lining.name}</p>
                        <p className={`text-xs ${isSelected ? 'text-[#805030]' : 'text-[#dca079]'}`}>{lining.desc}</p>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[#9e3c00] text-2xl">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tech Integration - Sleeve Sizes */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Tech Integration</h3>
              <p className="text-[#805030] text-xs mb-3">Laptop / Tablet Sleeve</p>
              <div className="flex gap-3">
                {[
                  { label: '14"', value: '14', disabled: false },
                  { label: '16"', value: '16', disabled: false },
                  { label: 'No Sleeve', value: 'none', disabled: true },
                ].map((size) => (
                  <button
                    key={size.value}
                    disabled={size.disabled}
                    onClick={() => setSelectedSleeve(size.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      size.disabled
                        ? 'bg-[#fff4f0] text-[#dca079]/50 cursor-not-allowed line-through'
                        : selectedSleeve === size.value
                        ? 'bg-[#fff4f0] border-2 border-[#9e3c00] text-[#9e3c00] shadow-md'
                        : 'bg-[#fff4f0] border-2 border-transparent hover:border-[#dca079]/40 text-[#805030]'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Utility Modules - Checkboxes */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Utility Modules</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'RFID Blocking Pocket', checked: rfidChecked, onChange: setRfidChecked },
                  { label: 'Integrated Key Clip', checked: keyClipChecked, onChange: setKeyClipChecked },
                  { label: 'Hidden Passport Slot', checked: passportChecked, onChange: setPassportChecked },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.onChange(!item.checked)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#fff4f0] hover:bg-[#ffede4] transition-all"
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      item.checked
                        ? 'bg-[#9e3c00] border-[#9e3c00]'
                        : 'border-[#dca079] bg-white'
                    }`}>
                      {item.checked && (
                        <span className="material-symbols-outlined text-white text-xs">check</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${item.checked ? 'text-[#4a2507]' : 'text-[#805030]'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-6 border-t border-[#dca079]/20">
            <div className="bg-[#1a1a1a] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Configuration Total</span>
                <span className="text-white text-2xl font-bold">$485.00</span>
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Base Interior</span>
                  <span className="text-gray-300">$350.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Artisan Silk Lining</span>
                  <span className="text-gray-300">+$85.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">16" Sleeve + RFID + Key Clip</span>
                  <span className="text-gray-300">+$50.00</span>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all">
                Apply Configurations
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default InternalLayoutPage;
