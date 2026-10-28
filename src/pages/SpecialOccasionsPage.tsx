import React from 'react';

const navLinks = [
  { label: 'Browse Bags', href: '#' },
  { label: 'Subscription Plans', href: '#' },
  { label: 'My Dashboard', href: '#' },
];

const vaultItems = [
  { name: 'The Saffron Envelope', price: '$3,450', status: '4 Units Left', color: 'from-amber-800 to-amber-600' },
  { name: 'Midnight Lotus Clutch', price: '$2,800', status: 'Final Call', color: 'from-indigo-900 to-indigo-700' },
  { name: 'Independence Silver Box', price: '$4,100', status: 'Waitlist Open', color: 'from-slate-600 to-slate-400' },
];

const SpecialOccasionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbf9f4] font-['Inter']">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#fbf9f4]/80 border-b border-[#f0eee9]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#001819] text-lg italic tracking-wide font-serif">The Atelier</span>
          </div>
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm tracking-wide text-[#001819]/70 hover:text-[#001819] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-[#f0eee9] transition-colors">
              <span className="material-symbols-outlined text-[#001819]">shopping_bag</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#f0eee9] transition-colors">
              <span className="material-symbols-outlined text-[#001819]">person</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">Curated Heritage</span>
            <h1 className="text-[#001819] text-8xl leading-[0.9] font-serif italic mt-4">
              Occasions of Significance.
            </h1>
            <p className="text-[#001819]/60 mt-6 text-sm leading-relaxed max-w-lg">
              Every culture marks time with ceremony. We've gathered pieces that honor those moments — from the
              lights of Diwali to the promise of a new lunar year.
            </p>
          </div>
          <div className="col-span-4 flex items-end justify-end">
            <div className="flex items-center gap-2 border border-[#001819]/20 px-4 py-2 text-sm text-[#001819]/70">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Current Region: India
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 h-[800px]">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Diwali Edit */}
          <div className="col-span-8 row-span-2 relative rounded-sm overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-[#001819]/80 to-transparent z-10" />
            <div className="w-full h-full bg-gradient-to-br from-amber-700 via-amber-900 to-orange-800 flex items-end p-10">
              <div className="relative z-20">
                <span className="text-[#775a19] bg-white/90 text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                  Limited Edition
                </span>
                <h2 className="text-white text-4xl font-serif italic mt-4">The Festival of Lights Edit</h2>
                <button className="mt-4 text-white text-sm border border-white px-6 py-3 hover:bg-white hover:text-[#001819] transition-colors">
                  Explore The Collection
                </button>
              </div>
            </div>
          </div>

          {/* Lunar New Year */}
          <div className="col-span-4 row-span-1 rounded-sm overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-red-800 via-red-700 to-rose-900 p-6 flex flex-col justify-end relative">
              <div className="absolute top-4 right-4">
                <span className="material-symbols-outlined text-white/80">travel_explore</span>
              </div>
              <h3 className="text-white text-lg font-serif italic">Lunar New Year</h3>
              <p className="text-white/60 text-xs mt-1">Global Arrival Feb 2025</p>
            </div>
          </div>

          {/* Exclusive Access */}
          <div className="col-span-4 row-span-1 rounded-sm overflow-hidden bg-[#fed488]/30 p-6 flex flex-col justify-center">
            <span className="material-symbols-outlined text-[#775a19] text-3xl">card_membership</span>
            <p className="text-[#001819] text-sm mt-3 leading-relaxed">
              Join The Atelier to pre-order occasion pieces.
            </p>
            <a href="#" className="text-[#775a19] text-sm mt-4 inline-block hover:underline">
              View Membership →
            </a>
          </div>
        </div>
      </section>

      {/* The Limited Vault Carousel */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-[#001819] text-2xl font-serif italic mb-8">The Limited Vault</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
          {vaultItems.map((item) => (
            <div
              key={item.name}
              className="flex-shrink-0 w-72 bg-[#f0eee9] rounded-sm overflow-hidden group cursor-pointer"
            >
              <div className={`h-48 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white/40 text-5xl">work</span>
              </div>
              <div className="p-5">
                <h4 className="text-[#001819] text-sm font-medium">{item.name}</h4>
                <p className="text-[#775a19] text-lg mt-1">{item.price}</p>
                <span className="inline-block text-[10px] uppercase tracking-wider text-[#b9002c] mt-2 font-medium">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Tier Upsell */}
      <section className="bg-[#182a3b] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">The Curator's Circle</span>
          <h3 className="text-white text-3xl font-serif italic mt-3">Never miss a global celebration again.</h3>
          <div className="flex justify-center mt-8">
            <div className="flex border border-[#775a19]/40">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 text-sm bg-transparent text-white placeholder-white/40 outline-none w-72"
              />
              <button className="px-6 py-3 bg-[#775a19] text-white text-sm tracking-wide hover:opacity-90 transition-opacity">
                Join Now
              </button>
            </div>
          </div>
          <div className="mt-10 inline-block border border-[#775a19]/30 px-8 py-4">
            <p className="text-[#775a19] text-xs uppercase tracking-wider">Atelier Gold Tier</p>
            <p className="text-white/70 text-sm mt-1">Priority access to all limited editions</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#f0eee9] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#001819] text-base italic font-serif mb-4">The Atelier</h4>
            <p className="text-[#001819]/50 text-xs leading-relaxed">
              Curating the world's finest accessories for the discerning collector.
            </p>
          </div>
          <div>
            <h5 className="text-[#001819] text-xs uppercase tracking-wider mb-4">Showrooms</h5>
            <ul className="space-y-2 text-xs text-[#001819]/60">
              <li>Paris — 8 Rue de la Paix</li>
              <li>New York — 422 West Broadway</li>
              <li>Global — By Appointment</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#001819] text-xs uppercase tracking-wider mb-4">Legal</h5>
            <ul className="space-y-2 text-xs text-[#001819]/60">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Shipping & Returns</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#001819] text-xs uppercase tracking-wider mb-4">Archive Status</h5>
            <div className="flex items-center gap-2 text-xs text-[#001819]/60">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpecialOccasionsPage;
