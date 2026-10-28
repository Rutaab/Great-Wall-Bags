import React from "react";

const DesignSummaryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter'] flex">
      {/* FIXED SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-white border-r border-[#dca079]/20 z-50 flex flex-col">
        <div className="p-4 border-b border-[#dca079]/20">
          <span className="text-[#9e3c00] font-bold text-sm md:text-lg tracking-tight block leading-tight">Kinetix Pro</span>
          <span className="text-[#805030] text-xs hidden md:block mt-1">Studio Customizer</span>
        </div>

        <div className="p-4 border-b border-[#dca079]/20 hidden md:block">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#9e3c00] text-3xl">work</span>
            <div>
              <p className="text-[#805030] text-xs">Configuring</p>
              <p className="text-[#4a2507] font-semibold text-sm">Model 01</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2 md:px-4">
            {["Exterior", "Hardware", "Interior", "Straps"].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-[#805030] hover:text-[#9e3c00] hover:bg-[#fff4f0] rounded-lg transition-all text-sm">
                  <span className="material-symbols-outlined text-xl hidden md:inline">radio_button_unchecked</span>
                  <span className="text-xs md:text-sm font-medium">{item}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 mx-2 md:mx-4">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-[#ffd4bb] text-[#9e3c00] rounded-lg font-semibold text-sm">
              <span className="material-symbols-outlined text-xl hidden md:inline">checklist</span>
              <span>Review</span>
              <span className="ml-auto bg-[#9e3c00] text-white text-[10px] px-2 py-0.5 rounded-full hidden md:inline">Summary</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-[#dca079]/20">
          <a href="#" className="flex items-center gap-2 text-[#805030] hover:text-[#9e3c00] transition-colors text-sm">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="hidden md:inline">Help</span>
          </a>
        </div>
      </aside>

      {/* FIXED GLASS NAV */}
      <nav className="fixed top-0 left-20 md:left-64 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-[#dca079]/20 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <span className="text-[#9e3c00] font-bold text-lg tracking-tight">Studio Customizer</span>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#805030]">
            <a href="#" className="hover:text-[#9e3c00] transition-colors">Gallery</a>
            <a href="#" className="hover:text-[#9e3c00] transition-colors">Collections</a>
            <a href="#" className="hover:text-[#9e3c00] transition-colors">Inspiration</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#805030] cursor-pointer hover:text-[#9e3c00] transition-colors text-2xl">share</span>
          <span className="material-symbols-outlined text-[#805030] cursor-pointer hover:text-[#9e3c00] transition-colors text-2xl">history</span>
          <button className="bg-[#ff7936] hover:bg-[#9e3c00] text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-300 hover:scale-105">
            Add to Cart
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 md:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CENTER COLUMN — Images + Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* IMAGE GRID */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Front Profile", gradient: "from-[#9e3c00]/20 to-[#ff7936]/10" },
                { label: "Side Perspective", gradient: "from-[#dca079]/30 to-[#ff7936]/10" },
                { label: "Interior Details", gradient: "from-[#805030]/20 to-[#fff4f0]" },
              ].map((img) => (
                <div key={img.label} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.gradient} transition-all duration-300 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#4a2507] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    {img.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CRAFTING SPECIFICATION */}
            <section className="bg-[#ffede4] rounded-2xl p-6 border border-[#dca079]/20">
              <h2 className="text-[#9e3c00] text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">precision_manufacturing</span>
                Crafting Specification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "layers", label: "Material Base", value: "Matte Black Saffiano", desc: "Premium Italian leather" },
                  { icon: "handyman", label: "Hardware", value: "Brushed Gold", desc: "Antimicrobial coating" },
                  { icon: "text_fields", label: "Personalization", value: "Monogram 'J.L'", desc: "Foil pressed interior" },
                  { icon: "straighten", label: "Shoulder Strap", value: "Adjustable Tech-Webbing", desc: "Quick-release buckles" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white rounded-xl p-4 border border-[#dca079]/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#9e3c00] text-2xl">{spec.icon}</span>
                    <div>
                      <span className="text-[#805030] text-[10px] uppercase tracking-widest font-bold">{spec.label}</span>
                      <p className="text-[#4a2507] font-bold text-sm">{spec.value}</p>
                      <p className="text-[#805030] text-xs mt-0.5">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MASTER ARTISAN NOTE */}
            <div className="border-l-4 border-[#9e3c00] bg-white rounded-r-2xl p-5 shadow-md">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#9e3c00] text-2xl mt-0.5">info</span>
                <div>
                  <h3 className="text-[#4a2507] font-bold text-base">Artisan Build Process</h3>
                  <p className="text-[#805030] text-sm mt-1 leading-relaxed">
                    Each Kinetix Pro bag is meticulously handcrafted in our Florence workshop by master artisans
                    with over 20 years of experience. Every stitch, cut, and finish is inspected to meet our
                    exacting standards before shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Order Total (sticky) */}
          <div className="lg:sticky lg:top-24 self-start space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-[#dca079]/20 p-6">
              <h2 className="text-[#4a2507] text-lg font-bold mb-4">Order Total</h2>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Base Model", value: "$1,250.00" },
                  { label: "Saffiano Upgrade", value: "+$220.00" },
                  { label: "Custom Monogramming", value: "Free" },
                  { label: "Global Express", value: "Free" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-[#805030]">{item.label}</span>
                    <span className={`font-medium ${item.value === "Free" ? "text-green-600" : "text-[#4a2507]"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#dca079]/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#4a2507] font-bold">Total</span>
                    <span className="text-[#9e3c00] font-bold text-2xl">$1,470.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#fff4f0] rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#805030] text-lg">schedule</span>
                <span className="text-[#805030] text-sm font-medium">14 &ndash; 21 business days</span>
              </div>

              <button className="w-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white font-bold py-4 rounded-full text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl mb-3">
                PLACE ORDER
              </button>

              <div className="flex items-center justify-center gap-2 text-[#805030] text-xs">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Secure checkout</span>
              </div>
            </div>

            {/* SUPPORT CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#dca079]/20 p-5">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#004be3] text-2xl">headset_mic</span>
                <div>
                  <h3 className="text-[#4a2507] font-semibold text-sm">Need Assistance?</h3>
                  <a href="#" className="text-[#004be3] text-sm font-medium hover:underline">Chat with Specialist</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PILL TOOLBAR */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-lg border border-[#dca079]/30 rounded-full px-4 py-2 shadow-2xl">
          {[
            { icon: "rotate_3d", label: "Rotate" },
            { icon: "zoom_in", label: "Zoom" },
            { icon: "center_focus_strong", label: "Focus", active: true },
            { icon: "explosion", label: "Explode" },
          ].map((tool) => (
            <button
              key={tool.label}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                tool.active
                  ? "bg-[#ff7936] text-white shadow-lg"
                  : "text-[#805030] hover:bg-[#fff4f0] hover:text-[#9e3c00]"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tool.icon}</span>
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* MINI BOTTOM NAV — 3D Controls */}
        <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-1 bg-white/80 backdrop-blur-md border border-[#dca079]/30 rounded-xl p-1.5 shadow-lg">
          {["pan_tool", "touch_app", "3d_rotation", "flip_to_front"].map((icon) => (
            <button
              key={icon}
              className="p-2 rounded-lg text-[#805030] hover:bg-[#fff4f0] hover:text-[#9e3c00] transition-all"
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DesignSummaryPage;
