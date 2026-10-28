import React, { useState } from 'react';

const HardwareMonogrammingPage: React.FC = () => {
  const [activeNav] = useState('Hardware');
  const [activeFinish, setActiveFinish] = useState('Matte Onyx');
  const [monogramText, setMonogramText] = useState('KP');
  const [activeFont, setActiveFont] = useState('Serif');
  const [appMethod, setAppMethod] = useState('Hot Stamped');

  const finishes = [
    { name: 'Matte Onyx', color: '#2d2d2d' },
    { name: 'Polished Silver', color: '#c0c0c0' },
    { name: 'Brushed Gold', color: '#d4af37' },
    { name: 'Gunmetal', color: '#4a4a4a' },
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

        {/* Center 3D Canvas */}
        <main className="flex-1 ml-20 md:ml-64 relative min-h-[calc(100vh-4rem)]">
          <div className="absolute inset-0 bg-gradient-radial from-[#ffd4bb]/40 via-[#fff4f0] to-[#fff4f0]">
            {/* Macro gradient hardware placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90%] h-[80%] max-w-3xl rounded-3xl bg-gradient-to-br from-[#2d2d2d] via-[#4a4a4a] to-[#6b6b6b] shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                <div className="relative z-10 text-center">
                  <span className="material-symbols-outlined text-7xl text-white/20">handyman</span>
                  <p className="text-white/30 text-sm mt-2 font-medium">Hardware Macro View</p>
                </div>

                {/* Monogram Floating Preview Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl px-12 py-8 border border-white/20 shadow-2xl">
                    <span className="text-white text-7xl md:text-8xl font-serif tracking-widest drop-shadow-lg">
                      {monogramText || 'KP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera HUD Badge */}
            <div className="absolute top-4 left-6 z-30">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7936] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff7936]"></span>
                </span>
                <span className="text-[#4a2507] text-xs font-semibold tracking-wide">Cam Focus: Hardware 04</span>
              </div>
            </div>

            {/* Bottom Pill Toolbar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-[#dca079]/30 shadow-lg">
                {[
                  { label: 'Rotate', icon: '3d_rotation', active: false },
                  { label: 'Zoom', icon: 'zoom_in', active: false },
                  { label: 'Focus', icon: 'center_focus_strong', active: true },
                  { label: 'Explode', icon: 'call_to_action', active: false },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      tool.active
                        ? 'bg-[#ff7936] text-white shadow-md'
                        : 'text-[#805030] hover:bg-[#ffede4]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tool.icon}</span>
                    <span className="hidden sm:inline">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="w-96 bg-white border-l border-[#dca079]/20 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Hardware Finish Section */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Hardware Finish</h3>
              <div className="grid grid-cols-2 gap-3">
                {finishes.map((finish) => (
                  <button
                    key={finish.name}
                    onClick={() => setActiveFinish(finish.name)}
                    className={`p-3 rounded-2xl transition-all ${
                      activeFinish === finish.name
                        ? 'bg-[#fff4f0] border-2 border-[#9e3c00] shadow-md'
                        : 'bg-[#fff4f0] border-2 border-transparent hover:border-[#dca079]/40'
                    }`}
                  >
                    <div
                      className={`w-full h-10 rounded-xl mb-2 ${
                        finish.name === 'Brushed Gold' ? 'bg-gradient-to-r from-[#d4af37] to-[#f0d68a]' : ''
                      } ${finish.name === 'Matte Onyx' ? 'bg-[#2d2d2d]' : ''} ${
                        finish.name === 'Polished Silver' ? 'bg-gradient-to-r from-[#c0c0c0] to-[#e8e8e8]' : ''
                      } ${finish.name === 'Gunmetal' ? 'bg-[#4a4a4a]' : ''}`}
                    ></div>
                    <p className={`text-xs font-medium ${
                      activeFinish === finish.name ? 'text-[#9e3c00]' : 'text-[#805030]'
                    }`}>{finish.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Monogramming Section */}
            <div>
              <h3 className="text-[#4a2507] font-semibold text-sm mb-3">Monogramming</h3>
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="text-[#805030] text-xs font-medium mb-1.5 block">Initials (max 3 characters)</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                    className="w-full px-5 py-3 rounded-full bg-[#fff4f0] border-2 border-[#dca079]/20 text-[#4a2507] text-center text-lg font-bold tracking-[0.3em] uppercase focus:outline-none focus:border-[#9e3c00] transition-all"
                    placeholder="KP"
                  />
                </div>

                {/* Font Typography */}
                <div>
                  <label className="text-[#805030] text-xs font-medium mb-2 block">Font</label>
                  <div className="flex gap-2">
                    {['Serif', 'Sans', 'Cursive'].map((font) => (
                      <button
                        key={font}
                        onClick={() => setActiveFont(font)}
                        className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition-all ${
                          activeFont === font
                            ? 'bg-[#9e3c00] text-white shadow-md'
                            : 'bg-[#fff4f0] text-[#805030] hover:bg-[#ffede4] border border-[#dca079]/20'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Application Method */}
                <div>
                  <label className="text-[#805030] text-xs font-medium mb-2 block">Application Method</label>
                  <div className="space-y-2">
                    {[
                      { value: 'Hot Stamped', desc: 'Debossed gold foil' },
                      { value: 'Laser Engraved', desc: 'Precision etched' },
                      { value: 'Metal Plate', desc: 'Attached nameplate' },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setAppMethod(method.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                          appMethod === method.value
                            ? 'bg-[#ffd4bb] border-2 border-[#9e3c00]'
                            : 'bg-[#fff4f0] border-2 border-transparent hover:bg-[#ffede4]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          appMethod === method.value ? 'border-[#9e3c00]' : 'border-[#dca079]'
                        }`}>
                          {appMethod === method.value && (
                            <div className="w-2 h-2 rounded-full bg-[#9e3c00]"></div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold ${appMethod === method.value ? 'text-[#9e3c00]' : 'text-[#4a2507]'}`}>{method.value}</p>
                          <p className="text-[#805030] text-xs">{method.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary Footer */}
          <div className="p-5 border-t border-[#dca079]/20 bg-white">
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#805030]">Base Price</span>
                <span className="text-[#4a2507] font-medium">$1,450.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#805030]">Customizations</span>
                <span className="text-[#9e3c00] font-medium">+$120.00</span>
              </div>
              <div className="border-t border-[#dca079]/20 pt-1.5 flex justify-between">
                <span className="text-[#4a2507] font-bold">Total</span>
                <span className="text-[#4a2507] text-xl font-bold">$1,570.00</span>
              </div>
            </div>
            <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all tracking-wide">
              CONFIRM DESIGN
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HardwareMonogrammingPage;
