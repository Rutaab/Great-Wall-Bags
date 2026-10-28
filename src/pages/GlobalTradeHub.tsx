import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const services = [
  {
    icon: 'public',
    title: 'Cross-Border Sourcing',
    desc: 'Connect with verified bag manufacturers and suppliers across 180+ countries. Our platform simplifies international procurement with transparent pricing and direct communication.'
  },
  {
    icon: 'verified',
    title: 'Supplier Verification',
    desc: 'Every supplier on Great Wall Bags undergoes rigorous background checks, factory audits, and product quality assessments to ensure you partner with trusted manufacturers.'
  },
  {
    icon: 'security',
    title: 'Trade Assurance',
    desc: 'Protected payments, quality inspection services, and dispute resolution mechanisms safeguard every transaction on our global trade platform.'
  },
  {
    icon: 'local_shipping',
    title: 'Logistics & Freight',
    desc: 'End-to-end shipping solutions including FOB, CIF, EXW, and door-to-door delivery. We help you navigate customs, duties, and international shipping regulations.'
  },
  {
    icon: 'handshake',
    title: 'B2B Negotiation',
    desc: 'Direct messaging, quote requests, sample ordering, and bulk pricing negotiations — all within a secure platform designed for wholesale trade.'
  },
  {
    icon: 'trending_up',
    title: 'Market Intelligence',
    desc: 'Access real-time market data, pricing trends, and demand analytics for bag categories across global markets to make informed sourcing decisions.'
  }
]

const stats = [
  { value: '180+', label: 'Countries Served' },
  { value: '50K+', label: 'Verified Suppliers' },
  { value: '2M+', label: 'Products Listed' },
  { value: '98%', label: 'Satisfaction Rate' }
]

const GlobalTradeHub: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main>
        {/* Hero Banner */}
        <section className="relative h-56 md:h-80 overflow-hidden">
          <img loading="lazy" className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1566576912323-6e5b628a3f0b?w=800&h=250&q=60&fit=crop"
            alt="Global trade network"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a2507]/95 to-transparent flex items-center">
            <div className="px-6 md:px-16 max-w-3xl">
              <span className="bg-[#ff7936] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 block w-fit">Global Trade Services</span>
              <h1 className="text-3xl md:text-6xl font-black text-white mb-4 leading-tight">Worldwide Bag<br/>Sourcing Network</h1>
              <p className="text-white/80 text-base md:text-lg max-w-xl">Connect with verified manufacturers, negotiate bulk pricing, and ship globally with trade assurance. Your gateway to international bag trade.</p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#4a2507]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-[#ff7936]">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/60 font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-4">Global Trade Solutions</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">End-to-end services that make international bag trade seamless, secure, and profitable for buyers and suppliers worldwide.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-surface-container-low p-6 md:p-8 rounded-xl hover:shadow-xl transition-shadow group">
                <span className="material-symbols-outlined text-3xl text-[#ff7936] mb-4 group-hover:scale-110 transition-transform">{service.icon}</span>
                <h3 className="text-xl font-bold text-on-surface mb-3">{service.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Ready to Trade Globally?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Join thousands of businesses already sourcing and selling bags through Great Wall Bags global trade network.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#9e3c00] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Start Sourcing</button>
              <button onClick={() => navigate('/supplier/onboarding')} className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">Become a Supplier</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default GlobalTradeHub
