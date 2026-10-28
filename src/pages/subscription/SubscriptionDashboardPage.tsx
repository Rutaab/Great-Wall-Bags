import React from 'react';

const navLinks = [
  { label: 'Browse Bags', href: '#' },
  { label: 'Subscription Plans', href: '#' },
  { label: 'My Dashboard', href: '#', active: true },
];

const upcomingRotations = [
  { name: 'Chanel Classic Flap', date: 'Estimated Oct 16', icon: 'event' },
  { name: 'Bottega Veneta Pouch', date: 'Estimated Nov 16', icon: 'event' },
];

const SubscriptionDashboardPage: React.FC = () => {
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
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  link.active
                    ? 'text-[#775a19] border-b-2 border-[#775a19] pb-1'
                    : 'text-[#001819]/70 hover:text-[#001819]'
                }`}
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

      {/* Dashboard Header */}
      <section className="pt-32 pb-10 max-w-7xl mx-auto px-6">
        <span className="text-[#775a19] text-xs uppercase tracking-[0.2em] font-medium">Welcome back, Elena</span>
        <h1 className="text-[#001819] text-5xl font-serif italic mt-2 font-light">Your Atelier Collective</h1>
      </section>

      {/* Currently Carrying + Membership Profile */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Currently Carrying Hero */}
          <div className="col-span-8 bg-[#f0eee9] rounded-sm p-8 flex gap-8 items-center">
            <div className="w-56 h-64 bg-gradient-to-br from-[#775a19]/20 to-[#001819]/10 rounded-sm flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#775a19] text-4xl">work</span>
            </div>
            <div className="flex-1">
              <span className="bg-[#775a19] text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                Currently Carrying
              </span>
              <h2 className="text-[#001819] text-2xl font-serif mt-4">Hermès Birkin 25</h2>
              <p className="text-[#001819]/60 text-sm mt-2 leading-relaxed">
                Togo leather, Palladium hardware. A timeless icon in the making.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-[#001819]/50 text-xs">Return Due</p>
                  <p className="text-[#001819] text-sm font-medium">Oct 14 · 12 days left</p>
                </div>
              </div>
              <button className="mt-4 bg-[#001819] text-white text-sm px-6 py-3 rounded-sm hover:opacity-90 transition-opacity">
                Request Return Pickup
              </button>
            </div>
          </div>

          {/* Membership Profile */}
          <div className="col-span-4 bg-[#182a3b] rounded-sm p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-white text-lg font-serif italic">The Curator Circle</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Subscription Tier</p>
                  <p className="text-white text-sm mt-1">Prestige Annual</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Next Billing</p>
                  <p className="text-white text-sm mt-1">Nov 01 2024</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider">Bag Value Limit</p>
                  <p className="text-white text-sm mt-1">$15,000</p>
                </div>
              </div>
            </div>
            <a href="#" className="text-[#775a19] text-sm mt-8 inline-block hover:underline">
              View Plan Benefits →
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Rotation Queue */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#001819] text-lg font-medium">Upcoming Rotation Queue</h2>
          <a href="#" className="text-[#775a19] text-sm hover:underline">Manage Queue</a>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {upcomingRotations.map((item) => (
            <div
              key={item.name}
              className="bg-[#f0eee9] rounded-sm p-6 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#775a19]/20 to-[#001819]/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#775a19]">{item.icon}</span>
              </div>
              <div>
                <h4 className="text-[#001819] text-sm font-medium">{item.name}</h4>
                <p className="text-[#001819]/50 text-xs mt-1">{item.date}</p>
              </div>
            </div>
          ))}
          <div className="bg-[#f0eee9] rounded-sm p-6 border-2 border-dashed border-[#d4cfc4] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e8e4db] transition-colors">
            <span className="material-symbols-outlined text-[#775a19]">add_circle</span>
            <span className="text-[#001819]/50 text-sm">Add to Rotation</span>
          </div>
        </div>
      </section>

      {/* Billing & Payments + Personal Details */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 gap-6">
          {/* Billing */}
          <div className="bg-[#f0eee9] rounded-sm p-8">
            <h3 className="text-[#001819] text-sm font-medium uppercase tracking-wider mb-6">Billing & Payments</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#001819]">credit_card</span>
                <span className="text-[#001819] text-sm">Visa ending 4494</span>
              </div>
              <button className="text-[#775a19] text-xs hover:underline">Edit</button>
            </div>
            <div className="border-t border-[#d4cfc4] pt-4 mt-4">
              <p className="text-[#001819]/60 text-xs uppercase tracking-wider mb-3">Past Invoices</p>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-[#775a19] text-sm hover:underline">
                  <span className="material-symbols-outlined text-sm">download</span>
                  September 2024
                </a>
                <a href="#" className="flex items-center gap-2 text-[#775a19] text-sm hover:underline">
                  <span className="material-symbols-outlined text-sm">download</span>
                  August 2024
                </a>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-[#f0eee9] rounded-sm p-8">
            <h3 className="text-[#001819] text-sm font-medium uppercase tracking-wider mb-6">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[#001819]/50 text-xs">Email</p>
                <p className="text-[#001819] text-sm">elena@collector.com</p>
              </div>
              <div>
                <p className="text-[#001819]/50 text-xs">Phone</p>
                <p className="text-[#001819] text-sm">+1 (212) 555-0192</p>
              </div>
              <div>
                <p className="text-[#001819]/50 text-xs">Shipping Address</p>
                <p className="text-[#001819] text-sm">422 West Broadway, New York, NY 10012</p>
              </div>
            </div>
            <a href="#" className="text-[#775a19] text-sm mt-6 inline-block hover:underline">
              Edit Profile Information →
            </a>
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

export default SubscriptionDashboardPage;
