import React from "react";

const ProductDetailStudioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter']">
      {/* FIXED GLASS NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-[#dca079]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-[#9e3c00] font-bold text-lg tracking-tight">Kinetic Marketplace</span>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#805030]">
              <a href="#" className="hover:text-[#9e3c00] transition-colors">Explore</a>
              <a href="#" className="hover:text-[#9e3c00] transition-colors">Creators</a>
              <a href="#" className="hover:text-[#9e3c00] transition-colors">Flash Sales</a>
              <a href="#" className="hover:text-[#9e3c00] transition-colors">Analytics</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#805030]">
            <span className="material-symbols-outlined cursor-pointer hover:text-[#9e3c00] transition-colors text-2xl">notifications</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#9e3c00] transition-colors text-2xl">shopping_bag</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#9e3c00] transition-colors text-2xl">account_circle</span>
          </div>
        </div>
      </nav>

      {/* BREADCRUMBS */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-[#805030] py-4">
          <a href="#" className="hover:text-[#9e3c00] transition-colors">Home</a>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <a href="#" className="hover:text-[#9e3c00] transition-colors">Studio Collection</a>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-[#4a2507] font-medium">Aero-Commute Pack</span>
        </div>
      </div>

      {/* 2-COL LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#ff7936]/20 via-[#dca079]/20 to-[#fff4f0] mb-4 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9e3c00]/10 to-transparent" />
              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined text-[#9e3c00] text-7xl opacity-40">work</span>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#9e3c00] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">360</span>
                View in 3D
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-[#dca079]/30 to-[#ff7936]/10 border border-[#dca079]/20 cursor-pointer transition-all duration-300 hover:border-[#9e3c00] hover:scale-105"
                />
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#ff7936]/10 text-[#9e3c00] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <span className="material-symbols-outlined text-sm">construction</span>
              Launch Custom Studio
            </div>

            <h1 className="text-[#4a2507] text-3xl md:text-4xl font-bold mb-2">Aero-Commute Pack</h1>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9e3c00] text-2xl font-bold">From $599.00</span>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-[#ff7936]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="material-symbols-outlined text-base">star</span>
                  ))}
                </div>
                <span className="text-[#805030]">4.9 (128 reviews)</span>
              </div>
            </div>

            {/* CUSTOMIZATION NOTICE */}
            <div className="bg-[#ffede4] border border-[#dca079]/30 rounded-xl p-4 flex items-start gap-3 mb-6">
              <span className="material-symbols-outlined text-[#9e3c00] text-xl mt-0.5">model_training</span>
              <div>
                <p className="text-[#4a2507] font-semibold text-sm">This product can be customized in our 3D Studio</p>
                <a href="/customizer" className="text-[#004be3] text-sm font-medium hover:underline mt-0.5 inline-block">
                  Open Studio Customizer &rarr;
                </a>
              </div>
            </div>

            {/* QUICK SPECS */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: "Ballistic Nylon", icon: "layers" },
                { label: "28L Capacity", icon: "inventory_2" },
                { label: "2.1 lbs", icon: "monitor_weight" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-white border border-[#dca079]/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-[#4a2507] shadow-sm"
                >
                  <span className="material-symbols-outlined text-[#9e3c00] text-lg">{spec.icon}</span>
                  {spec.label}
                </div>
              ))}
            </div>

            {/* COLOR SWATCHES */}
            <div className="mb-6">
              <span className="text-[#805030] text-xs uppercase tracking-widest font-medium block mb-3">Color</span>
              <div className="flex gap-3">
                {[
                  { color: "#1a1a1a", label: "Black" },
                  { color: "#4a5b3a", label: "Olive" },
                  { color: "#1e3a5f", label: "Navy" },
                  { color: "#ff7936", label: "Orange" },
                ].map((swatch) => (
                  <button
                    key={swatch.label}
                    className="group relative"
                  >
                    <div
                      className="w-10 h-10 rounded-full border-2 border-[#dca079]/30 transition-all duration-300 hover:scale-110 hover:border-[#9e3c00]"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#805030] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {swatch.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                START CUSTOMIZING
              </button>
              <button className="flex-1 border-2 border-[#dca079] text-[#4a2507] font-semibold py-4 rounded-xl text-lg transition-all duration-300 hover:bg-[#ffede4] hover:border-[#9e3c00]">
                Add to Cart
              </button>
            </div>

            {/* TABS */}
            <div className="mt-8">
              <div className="border-b border-[#dca079]/30 flex gap-6">
                {["Overview", "Specifications", "Customization Options"].map((tab) => (
                  <button
                    key={tab}
                    className={`pb-3 text-sm font-medium transition-colors ${
                      tab === "Overview"
                        ? "text-[#9e3c00] border-b-2 border-[#9e3c00]"
                        : "text-[#805030] hover:text-[#4a2507]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content — Overview */}
              <div className="py-6">
                <p className="text-[#805030] text-sm leading-relaxed mb-4">
                  The Aero-Commute Pack is designed for the modern professional who refuses to compromise
                  between style and utility. Crafted from aerospace-grade ballistic nylon with genuine leather
                  accents, this bag transitions seamlessly from boardroom to trail.
                </p>
                <ul className="space-y-2">
                  {[
                    "Water-resistant ballistic nylon exterior",
                    "Padded 16\" laptop compartment with fleece lining",
                    "Magnetic quick-access front pocket",
                    "Breathable mesh back panel with luggage pass-through",
                    "Hidden anti-theft back pocket",
                    "YKK AquaGuard zippers throughout",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#805030]">
                      <span className="material-symbols-outlined text-[#9e3c00] text-base mt-0.5">check_circle</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <section className="mt-16">
          <h2 className="text-[#4a2507] text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Velocity Sling", price: "$349.00", gradient: "from-[#9e3c00]/20 to-[#ff7936]/10" },
              { name: "Summit Duffel", price: "$795.00", gradient: "from-[#dca079]/30 to-[#805030]/10" },
              { name: "Apex Brief", price: "$599.00", gradient: "from-[#ff7936]/20 to-[#dca079]/10" },
              { name: "Orbit Crossbody", price: "$249.00", gradient: "from-[#805030]/20 to-[#9e3c00]/10" },
            ].map((product) => (
              <div key={product.name} className="group cursor-pointer">
                <div
                  className={`aspect-[4/5] rounded-2xl bg-gradient-to-br ${product.gradient} mb-3 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl`}
                />
                <h3 className="text-[#4a2507] font-semibold text-sm">{product.name}</h3>
                <span className="text-[#9e3c00] font-bold text-sm">{product.price}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetailStudioPage;
