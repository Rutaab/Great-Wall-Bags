import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { LoadingState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const ManufacturerLandingPage: React.FC = () => {
  const [landing, setLanding] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const heroTitle = landing?.heroTitle || 'Design Factory'
  const heroSubtitle = landing?.heroSubtitle || 'End-to-end manufacturing control platform for modern bag production'
  const stats = landing?.stats || []

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getManufacturerHub()
      .then(d => { if (mounted) setLanding(d.landing || null) })
      .catch(() => { if (mounted) setLanding(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <ManufacturerLayout>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#ff7936] to-[#9e3c00] rounded-2xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{heroTitle}</h1>
            <p className="text-[#ffd4bb] text-lg mt-2 max-w-2xl">{heroSubtitle}</p>
          </div>
        </div>

        {/* Feature Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <div className="sm:col-span-3"><LoadingState label="Loading dashboard stats..." /></div>
          ) : stats.length === 0 ? (
            <p className="sm:col-span-3 text-center text-[#805030] text-sm py-6">No dashboard stats available yet.</p>
          ) : stats.map((stat: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-6 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#805030] text-sm font-medium">{stat.label}</span>
                <span className="material-symbols-outlined text-[#ff7936] text-2xl">{stat.icon}</span>
              </div>
              <p className="text-[#4a2507] text-4xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[#805030] text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-[#4a2507] text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: 'factory', title: 'Factory Hub', desc: 'Monitor real-time production', path: '/manufacturer/factory-hub' },
              { icon: 'precision_manufacturing', title: 'Production', desc: 'Track batch progress', path: '/manufacturer/production' },
              { icon: 'orders', title: 'Wholesale Orders', desc: 'Manage B2B contracts', path: '/manufacturer/wholesale-orders' },
              { icon: 'local_shipping', title: 'Logistics', desc: 'Track global shipments', path: '/manufacturer/logistics' },
            ].map((action, i) => (
              <div key={i} className="group bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ffede4] flex items-center justify-center group-hover:bg-[#ff7936] transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[#9e3c00] group-hover:text-white transition-colors">{action.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#4a2507] font-semibold">{action.title}</h3>
                  <p className="text-[#805030] text-sm mt-0.5">{action.desc}</p>
                  <Link to={action.path} className="inline-flex items-center gap-1 text-[#ff7936] text-sm font-medium mt-2 hover:text-[#9e3c00] transition-colors">
                    Open
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-[#4a2507] text-xl font-semibold mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Production', path: '/manufacturer/production', icon: 'precision_manufacturing' },
              { label: 'Wholesale Orders', path: '/manufacturer/wholesale-orders', icon: 'orders' },
              { label: 'Logistics', path: '/manufacturer/logistics', icon: 'local_shipping' },
              { label: 'QC Reports', path: '/manufacturer/qc-reports', icon: 'fact_check' },
              { label: 'Contracts', path: '/manufacturer/contracts', icon: 'description' },
              { label: 'Analytics', path: '/manufacturer/analytics', icon: 'analytics' },
              { label: 'Inventory', path: '/manufacturer/inventory', icon: 'inventory' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#dca079]/20 text-[#805030] hover:bg-[#ff7936] hover:text-white hover:border-[#ff7936] transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#dca079]/20 pt-6 pb-2">
          <p className="text-[#805030] text-sm">Select a section from the sidebar to get started.</p>
        </footer>
      </div>
    </ManufacturerLayout>
  )
}

export default ManufacturerLandingPage