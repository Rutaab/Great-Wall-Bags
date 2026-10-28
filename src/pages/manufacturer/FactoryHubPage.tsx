import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getProductsByUser } from '../../services/localProducts'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const FactoryHubPage: React.FC = () => {
  const { user } = useAuth()
  const [hub, setHub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const kpis = hub?.kpis || []
  const lines = hub?.lines || []
  const contracts = hub?.contracts || []
  const shipments = hub?.shipments || { active: 0, subtitle: '', activity: [] }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getManufacturerHub()
      .then(d => { if (mounted) setHub(d) })
      .catch(() => { if (mounted) setHub(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <ManufacturerLayout><LoadingState label="Loading factory hub..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat: any, i: number) => (
            <div key={i} className={`${stat.dark ? '' : 'bg-white'} rounded-xl border ${stat.dark ? 'border-transparent' : 'border-[#dca079]/20'} ${stat.red ? 'bg-[#b9002c]' : stat.dark ? 'bg-[#004be3]' : ''} p-5 ${stat.dark ? 'text-white' : ''} hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${stat.dark ? 'text-white/80' : 'text-[#805030]'} text-sm font-medium`}>{stat.label}</span>
                <span className={`material-symbols-outlined ${stat.dark ? '' : 'text-[#ff7936]'}`}>{stat.icon}</span>
              </div>
              <p className={`${stat.dark ? '' : 'text-[#4a2507]'} text-3xl font-bold tracking-tight`}>{stat.value}</p>
              <p className={`${stat.dark ? 'text-white/80' : 'text-[#805030]'} text-xs mt-1`}>{stat.sub}</p>
              {stat.capacity != null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={stat.dark ? 'text-white/80' : 'text-[#805030]'}>{stat.capacityLabel || 'Capacity'}</span>
                    <span className={`${stat.dark ? '' : 'text-[#4a2507]'} font-medium`}>{stat.capacity}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] rounded-full" style={{ width: `${stat.capacity}%` }}></div>
                  </div>
                </div>
              )}
              {stat.change && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                  <span className="text-green-600 text-xs font-medium">{stat.change}</span>
                  {stat.changeLabel && <span className="text-[#805030] text-xs ml-1">{stat.changeLabel}</span>}
                </div>
              )}
              {stat.width != null && (
                <div className="mt-3 w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#004be3] to-[#4a8cff] rounded-full" style={{ width: `${stat.width}%` }}></div>
                </div>
              )}
              {stat.status && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                  <span className="text-green-600 text-xs font-medium">{stat.status}</span>
                </div>
              )}
              {stat.critical && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffd4bb] text-sm">priority_high</span>
                  <span className="text-[#ffd4bb] text-xs font-medium">{stat.critical}</span>
                </div>
              )}
              {stat.improvement && (
                <div className="mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#ffd4bb] text-sm">arrow_downward</span>
                  <span className="text-[#ffd4bb] text-xs font-medium">{stat.improvement}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#4a2507] text-lg font-semibold">Active Production Lines</h3>
            <a href="/manufacturer/production" className="text-[#9e3c00] text-sm font-medium hover:text-[#ff7936] transition-colors">View all →</a>
          </div>
          {lines.length === 0 ? (
            <EmptyState icon="precision_manufacturing" title="No production lines reported" hint="Production line data will appear here once available." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lines.map((line: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all group">
                  <div className={`bg-gradient-to-br ${line.gradient} h-36 flex items-center justify-center relative`}>
                    <span className="material-symbols-outlined text-white/40 text-5xl">precision_manufacturing</span>
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">{line.name}</span>
                    {line.badge && <span className="absolute top-3 right-3 bg-white/90 text-[#4a2507] text-xs font-medium px-2 py-1 rounded-full">{line.badge}</span>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#4a2507] font-medium text-sm">{line.name}</span>
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {line.status}
                      </span>
                    </div>
                    <p className="text-[#805030] text-xs mb-3">Speed: {line.speed}</p>
                    <div className="w-full h-1.5 bg-[#ffede4] rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full bg-gradient-to-r ${line.gradient} transition-all duration-500 group-hover:opacity-80`} style={{ width: `${line.loading}%` }}></div>
                    </div>
                    <a href="/manufacturer/production" className="block w-full text-center py-2 rounded-lg border border-[#ff7936] text-[#9e3c00] text-sm font-medium hover:bg-[#ff7936] hover:text-white transition-all">View Details</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#4a2507] text-lg font-semibold">Recent Wholesale Contracts</h3>
            <div className="flex items-center gap-2">
              <a href="/manufacturer/wholesale-orders" className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-sm font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                New Contract
              </a>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
            {contracts.length === 0 ? (
              <EmptyState icon="description" title="No wholesale contracts" hint="Contract activity will appear here once available." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#dca079]/20 bg-[#ffede4]">
                      {['Contract ID', 'Entity', 'Volume', 'Deadline', 'Value', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3 text-[#4a2507] font-medium">{row.id}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.entity}</td>
                        <td className="px-4 py-3 text-[#4a2507]">{row.volume}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.deadline}</td>
                        <td className="px-4 py-3 text-[#4a2507] font-semibold">{row.value}</td>
                        <td className="px-4 py-3">
                          <span className={`${row.color} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#4a2507] text-lg font-semibold">Global Shipment Tracking</h3>
            <a href="/manufacturer/logistics" className="text-[#9e3c00] text-sm font-medium hover:text-[#ff7936] transition-colors">Track all →</a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden relative h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffede4] to-[#ffd4bb] flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[#805030]/30 text-6xl">map</span>
                  <p className="text-[#805030]/50 text-sm mt-2">Live Tracking Map</p>
                </div>
                {shipments.activity.slice(0, 3).map((_: any, i: number) => (
                  <span key={i} className={`absolute ${['top-1/4 left-1/3', 'top-1/2 left-2/3', 'top-3/4 left-1/2'][i]} flex h-4 w-4`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${['bg-[#ff7936]', 'bg-[#004be3]', 'bg-green-500'][i]} opacity-50`}></span>
                    <span className={`relative inline-flex rounded-full h-4 w-4 ${['bg-[#ff7936]', 'bg-[#004be3]', 'bg-green-500'][i]}`}></span>
                  </span>
                ))}
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                <p className="text-[#4a2507] text-xs font-semibold">{shipments.active} Active Shipments</p>
                <p className="text-[#805030] text-xs">{shipments.subtitle}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#dca079]/20 p-5 h-[320px] overflow-y-auto">
              <h4 className="text-[#4a2507] text-sm font-semibold mb-4">Recent Activity</h4>
              {shipments.activity.length === 0 ? (
                <EmptyState icon="local_shipping" title="No shipment activity" />
              ) : (
                <div className="space-y-0">
                  {shipments.activity.map((item: any, i: number) => (
                    <div key={i} className="relative flex gap-4 pb-6 last:pb-0 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-white text-sm">{item.dot}</span>
                        </div>
                        {i < shipments.activity.length - 1 && <div className="w-0.5 flex-1 bg-[#dca079]/20 mt-1"></div>}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-[#4a2507] font-medium text-sm">{item.title}</p>
                        <p className="text-[#805030] text-xs">{item.desc}</p>
                        <p className="text-[#805030]/60 text-xs mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#dca079]/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#4a2507] text-lg font-semibold">Featured Status</h3>
              <p className="text-[#805030] text-xs mt-0.5">Products approved for category page display</p>
            </div>
          </div>
          {products.length === 0 ? (
            <p className="text-[#805030] text-sm">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#dca079]/20 bg-[#ffede4]">
                    <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Route</th>
                    <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Rating</th>
                    <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                      <td className="px-4 py-3 text-[#4a2507] font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-[#805030]">{p.route}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {p.rating} ({p.reviews})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          p.featured === 'approved' ? 'bg-green-100 text-green-700' :
                          p.featured === 'rejected' ? 'bg-red-100 text-red-600' :
                          p.featured === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{p.featured}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="border-t border-[#dca079]/20 pt-6 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[#805030] text-xs">&copy; 2024 The Kinetic Curator. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Terms of Service</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Shipping Info</a>
              <a href="#" className="text-[#805030] hover:text-[#4a2507] text-xs transition-colors">Returns</a>
            </div>
          </div>
        </footer>
      </div>
    </ManufacturerLayout>
  )
}

export default FactoryHubPage