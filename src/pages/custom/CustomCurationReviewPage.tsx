import React from "react";

const CustomCurationReviewPage: React.FC = () => {
  return (
    <div className="bg-[#fff4f0] min-h-screen font-['Inter']">
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

      {/* HERO */}
      <section className="relative aspect-[21/9] mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9e3c00]/80 via-[#9e3c00]/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff4f0] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff7936]/20 to-transparent" />

        <div className="relative w-full h-full flex items-center justify-center group cursor-pointer overflow-hidden">
          <div className="w-4/5 h-4/5 bg-gradient-to-br from-[#dca079]/40 to-[#ff7936]/20 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <span className="material-symbols-outlined text-[#9e3c00] text-8xl opacity-60">work</span>
          </div>
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            <span className="bg-white/90 backdrop-blur-sm text-[#9e3c00] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <span className="material-symbols-outlined text-sm">360</span>
              360
            </span>
            <span className="bg-white/90 backdrop-blur-sm text-[#9e3c00] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <span className="material-symbols-outlined text-sm">zoom_in</span>
              Zoom
            </span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-[#c6d0ff]/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <span className="material-symbols-outlined text-sm text-[#9e3c00]">verified_user</span>
          <span className="text-[#4a2507] text-sm font-semibold">Artisan Crafted</span>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <h1 className="text-[#4a2507] text-3xl font-bold mb-6">Custom Curation Review</h1>

            {/* YOUR SPECIFICATIONS */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#dca079]/20 p-6 mb-6">
              <h2 className="text-[#9e3c00] text-lg font-semibold mb-4">Your Specifications</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#fff4f0] rounded-xl p-4 border border-[#dca079]/20">
                  <span className="text-[#805030] text-xs uppercase tracking-widest font-medium">Material</span>
                  <p className="text-[#4a2507] font-semibold mt-1">Midnight Saffiano Leather</p>
                </div>
                <div className="bg-[#fff4f0] rounded-xl p-4 border border-[#dca079]/20">
                  <span className="text-[#805030] text-xs uppercase tracking-widest font-medium">Hardware</span>
                  <p className="text-[#4a2507] font-semibold mt-1">Brushed Gold Finish</p>
                </div>
                <div className="bg-[#fff4f0] rounded-xl p-4 border border-[#dca079]/20">
                  <span className="text-[#805030] text-xs uppercase tracking-widest font-medium">Lining</span>
                  <p className="text-[#4a2507] font-semibold mt-1">Crimson Silk Twill</p>
                </div>
                <div className="bg-[#fff4f0] rounded-xl p-4 border border-[#dca079]/20">
                  <span className="text-[#805030] text-xs uppercase tracking-widest font-medium">Internal Tech</span>
                  <p className="text-[#4a2507] font-semibold mt-1">16" Padded Tech Sleeve</p>
                </div>
              </div>

              <div className="border-t border-[#dca079]/20 pt-4">
                <div className="bg-[#ffede4] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[#805030] text-xs uppercase tracking-widest font-medium">Monogramming</span>
                    <p className="text-[#4a2507] font-bold text-xl mt-1">ABC</p>
                    <span className="text-[#805030] text-xs">Foil Pressed</span>
                  </div>
                  <span className="material-symbols-outlined text-[#9e3c00] text-3xl">edit_note</span>
                </div>
              </div>
            </div>

            {/* SHARE LINK */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#dca079]/20 p-6">
              <h2 className="text-[#9e3c00] text-lg font-semibold mb-3">Share Your Curation</h2>
              <p className="text-[#805030] text-sm mb-4">Share this design with friends or your creator for feedback.</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value="https://kinetic.market/curation/abc123"
                  className="flex-1 bg-[#fff4f0] border border-[#dca079]/30 rounded-xl px-4 py-3 text-[#4a2507] text-sm font-medium outline-none focus:border-[#9e3c00] transition-colors"
                />
                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.innerText = "Copied!";
                    setTimeout(() => (btn.innerText = "Copy Link"), 2000);
                  }}
                  className="bg-[#ff7936] hover:bg-[#9e3c00] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-sm whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — 5 cols sticky */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-28 self-start">
            <div className="bg-white rounded-2xl shadow-xl border border-[#dca079]/20 p-6">
              <h2 className="text-[#4a2507] text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#805030]">Base Model</span>
                  <span className="text-[#4a2507] font-medium">$845.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#805030]">Leather Upgrade</span>
                  <span className="text-[#4a2507] font-medium">+$120.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#805030]">Custom Monogram</span>
                  <span className="text-[#4a2507] font-medium">Free</span>
                </div>
                <div className="border-t border-[#dca079]/30 pt-3 flex justify-between">
                  <span className="text-[#4a2507] font-bold">Total Investment</span>
                  <span className="text-[#9e3c00] font-bold text-xl">$965.00</span>
                </div>
              </div>

              <div className="bg-[#ff9193]/5 border border-[#b9002c]/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#b9002c] text-xl">info</span>
                <span className="text-[#4a2507] text-sm font-medium">Artisan Lead Time: 14 Days</span>
              </div>

              <button className="w-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white font-bold py-4 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl mb-3">
                Finalize & Purchase
              </button>

              <div className="flex items-center justify-center gap-2 text-[#805030] text-xs mb-6">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Secure checkout encrypted with 256-bit SSL</span>
              </div>

              {/* ASSISTANCE CARD */}
              <div className="bg-[#004be3]/10 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#004be3] text-2xl">support_agent</span>
                <div>
                  <h3 className="text-[#4a2507] font-semibold text-sm">Need a modification?</h3>
                  <p className="text-[#805030] text-xs mt-1">Contact our curation team for adjustments before finalizing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#dca079]/20 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-[#9e3c00] font-bold text-lg tracking-tight">Kinetic</span>
            <p className="text-[#805030] text-sm mt-2">Premium artisan marketplace for discerning collectors.</p>
          </div>
          <div>
            <h4 className="text-[#4a2507] font-semibold mb-3">Service</h4>
            <ul className="space-y-2 text-[#805030] text-sm">
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Shipping</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#4a2507] font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-[#805030] text-sm">
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Artisans</a></li>
              <li><a href="#" className="hover:text-[#9e3c00] transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#4a2507] font-semibold mb-3">Newsletter</h4>
            <div className="flex items-center border border-[#dca079]/30 rounded-xl overflow-hidden">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 text-sm text-[#4a2507] outline-none bg-transparent" />
              <button className="bg-[#ff7936] hover:bg-[#9e3c00] text-white px-3 py-2 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-[#dca079]/20 text-center text-[#805030] text-xs">
          &copy; 2026 Kinetic Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CustomCurationReviewPage;
