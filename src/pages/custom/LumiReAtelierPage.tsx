import React from "react";

const LumiReAtelierPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f4] font-['Inter'] text-[#001819]">
      {/* FIXED NAVBAR — Atelier */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fbf9f4]/80 backdrop-blur-md border-b border-[#775a19]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-[#775a19] font-serif italic font-bold text-xl tracking-wide">The Atelier</span>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#775a19]/70">
              <a href="#" className="hover:text-[#775a19] transition-colors">Browse Bags</a>
              <a href="#" className="text-[#775a19] font-semibold border-b-2 border-[#775a19] pb-0.5">Lumi Re-Atelier</a>
              <a href="#" className="hover:text-[#775a19] transition-colors">Bespoke Orders</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#775a19]/70">
            <span className="material-symbols-outlined cursor-pointer hover:text-[#775a19] transition-colors text-2xl">search</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#775a19] transition-colors text-2xl">favorite</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#775a19] transition-colors text-2xl">person</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative mt-16 bg-[#182a3b] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <span className="text-[#775a19] text-sm uppercase tracking-[0.3em] font-medium border border-[#775a19]/40 rounded-full px-4 py-1.5 inline-block mb-6">
              Lumi Re-Atelier
            </span>
            <h1 className="text-[#fbf9f4] font-serif italic text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
              Your Vision,<br />Our Craft
            </h1>
            <p className="text-[#f0eee9]/80 text-lg md:text-xl max-w-xl leading-relaxed">
              Where your imagination meets Italian artistry. Each piece is made-to-order,
              handcrafted in our Florence atelier using only the finest materials sourced
              from around the world.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#775a19]/20 to-transparent" />
      </section>

      {/* THE EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">The Process</span>
          <h2 className="text-[#001819] text-3xl md:text-4xl font-serif italic mt-2">The Experience</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: "edit_note",
              title: "Consultation",
              desc: "Begin with a one-on-one session with our design team to explore materials, silhouettes, and personalized details that reflect your unique style.",
            },
            {
              step: "02",
              icon: "handyman",
              title: "Creation",
              desc: "Our master artisans bring your vision to life, hand-cutting, stitching, and finishing every detail over the course of several weeks.",
            },
            {
              step: "03",
              icon: "local_shipping",
              title: "Delivery",
              desc: "Your completed piece is carefully packaged and shipped to your door, accompanied by a certificate of authenticity and care guide.",
            },
          ].map((step) => (
            <div
              key={step.step}
              className="bg-[#f0eee9] rounded-2xl p-6 md:p-8 border border-[#775a19]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-[#775a19]/40 text-4xl font-serif italic font-bold">{step.step}</span>
              <span className="material-symbols-outlined text-[#775a19] text-4xl block mt-2 mb-4">{step.icon}</span>
              <h3 className="text-[#001819] text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-[#001819]/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO GALLERY */}
      <section className="bg-[#f0eee9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">Portfolio</span>
            <h2 className="text-[#001819] text-3xl md:text-4xl font-serif italic mt-2">Past Creations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Aurea Satchel", materials: "Gold-embossed Calfskin, Silk lining" },
              { name: "Noir Commander", materials: "Matte Black Croc, Gunmetal hardware" },
              { name: "Celeste Duffle", materials: "Navy Saffiano, Palladium accents" },
              { name: "Terra Weekender", materials: "Rust nubuck, Brass rivets" },
              { name: "Blush Tote", materials: "Rose pebbled leather, Rose-gold chain" },
              { name: "Obsidian Clutch", materials: "Black patent, Onyx clasp" },
            ].map((item) => (
              <div key={item.name} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#182a3b]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#775a19]/20 to-[#182a3b]/80 transition-all duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001819]/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-[#fbf9f4] font-semibold text-lg">{item.name}</h3>
                  <p className="text-[#f0eee9]/70 text-sm mt-1">{item.materials}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-[#775a19] text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Story
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESPOKE INQUIRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">Get Started</span>
            <h2 className="text-[#001819] text-3xl md:text-4xl font-serif italic mt-2 mb-8">Bespoke Inquiry</h2>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Name</label>
                <input type="text" className="w-full bg-[#f0eee9] border border-[#775a19]/20 rounded-xl px-4 py-3 text-[#001819] text-sm outline-none focus:border-[#775a19] transition-colors" />
              </div>
              <div>
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Email</label>
                <input type="email" className="w-full bg-[#f0eee9] border border-[#775a19]/20 rounded-xl px-4 py-3 text-[#001819] text-sm outline-none focus:border-[#775a19] transition-colors" />
              </div>
              <div>
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Phone</label>
                <input type="tel" className="w-full bg-[#f0eee9] border border-[#775a19]/20 rounded-xl px-4 py-3 text-[#001819] text-sm outline-none focus:border-[#775a19] transition-colors" />
              </div>
              <div>
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Bag Type</label>
                <select className="w-full bg-[#f0eee9] border border-[#775a19]/20 rounded-xl px-4 py-3 text-[#001819] text-sm outline-none focus:border-[#775a19] transition-colors">
                  <option>Satchel</option>
                  <option>Tote</option>
                  <option>Duffel</option>
                  <option>Clutch</option>
                  <option>Backpack</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Material Preference</label>
                <div className="flex flex-wrap gap-3">
                  {["Calfskin", "Saffiano", "Crocodile", "Nubuck", "Patent", "Canvas"].map((m) => (
                    <label key={m} className="flex items-center gap-2 bg-[#f0eee9] border border-[#775a19]/20 rounded-lg px-4 py-2 cursor-pointer hover:border-[#775a19] transition-colors">
                      <input type="checkbox" className="accent-[#775a19]" />
                      <span className="text-[#001819] text-sm">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[#001819]/60 text-xs uppercase tracking-wider font-medium block mb-1.5">Message</label>
                <textarea rows={4} className="w-full bg-[#f0eee9] border border-[#775a19]/20 rounded-xl px-4 py-3 text-[#001819] text-sm outline-none focus:border-[#775a19] transition-colors resize-none" placeholder="Describe your vision..." />
              </div>
              <div className="sm:col-span-2">
                <button className="bg-[#182a3b] hover:bg-[#001819] text-[#fbf9f4] font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] text-sm">
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#f0eee9] rounded-2xl p-6 border border-[#775a19]/10 lg:sticky lg:top-24">
              <span className="material-symbols-outlined text-[#775a19] text-3xl mb-3">handcraft</span>
              <h3 className="text-[#001819] font-semibold text-base mb-2">Atelier Notes</h3>
              <p className="text-[#001819]/60 text-sm leading-relaxed">
                Each piece requires 4&ndash;6 weeks of meticulous craftsmanship by our master artisans in Florence.
                We personally source every material and inspect each bag at every stage of production.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#775a19] text-sm font-medium">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Certificate of Authenticity included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER — Atelier */}
      <footer className="bg-[#182a3b] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-[#fbf9f4] font-serif italic font-bold text-xl">The Atelier</span>
            <p className="text-[#f0eee9]/50 text-sm mt-2">Florence, Italy</p>
          </div>
          <div>
            <h4 className="text-[#fbf9f4] font-semibold mb-3 text-sm">Showrooms</h4>
            <ul className="space-y-2 text-[#f0eee9]/60 text-sm">
              <li>Florence</li>
              <li>Milan</li>
              <li>Paris</li>
              <li>London</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#fbf9f4] font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-[#f0eee9]/60 text-sm">
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">Returns Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#fbf9f4] font-semibold mb-3 text-sm">Connect</h4>
            <ul className="space-y-2 text-[#f0eee9]/60 text-sm">
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">Pinterest</a></li>
              <li><a href="#" className="hover:text-[#fbf9f4] transition-colors">hello@theatelier.com</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-[#775a19]/20 text-center text-[#f0eee9]/40 text-xs">
          &copy; 2026 The Atelier. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LumiReAtelierPage;
