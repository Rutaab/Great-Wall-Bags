import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const ContractsPage: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const kpis = data?.kpis || []
  const featured = data?.featured || []
  const all = data?.all || []
  const changes = data?.changes || []

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getManufacturerContracts()
      .then(d => { if (mounted) setData(d) })
      .catch(() => { if (mounted) setData(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <ManufacturerLayout><LoadingState label="Loading contracts..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Legal & Partnerships</span>
          </div>
          <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Contract Management</h1>
          <p className="text-[#805030] text-sm mt-1">Smart contracts and partnership agreements</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-[#4a2507] text-2xl font-bold">{stat.value}</p>
                <p className="text-[#805030] text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {featured.map((c: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                <div className={`h-2 bg-gradient-to-r ${c.gradient}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#805030] text-xs font-mono">{c.id}</span>
                        <span className={`${c.badgeColor} text-[10px] font-semibold px-2 py-0.5 rounded-full`}>{c.badge}</span>
                      </div>
                      <h3 className="text-[#4a2507] font-semibold">{c.partner}</h3>
                      <p className="text-[#805030] text-xs">{c.type}</p>
                    </div>
                    <span className="text-[#4a2507] text-xl font-bold">{c.value}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-[#805030] text-xs">Duration</p>
                      <p className="text-[#4a2507] font-medium">{c.duration}</p>
                    </div>
                    <div>
                      <p className="text-[#805030] text-xs">Volume</p>
                      <p className="text-[#4a2507] font-medium">{c.volume}</p>
                    </div>
                    <div>
                      <p className="text-[#805030] text-xs">Expiry</p>
                      <p className="text-[#4a2507] font-medium">{c.expiry}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#805030] text-xs mb-2">Milestone Timeline</p>
                    <div className="flex items-center gap-1">
                      {c.milestones.map((pct: number, j: number) => (
                        <div key={j} className="flex-1 flex flex-col items-center">
                          <div className={`w-full h-1.5 rounded-full ${pct <= c.reached ? c.barColor : 'bg-[#ffede4]'}`}></div>
                          <span className="text-[10px] text-[#805030] mt-1">Q{j + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#dca079]/20">
                <h2 className="text-[#4a2507] font-semibold text-sm">All Contracts</h2>
              </div>
              {all.length === 0 ? (
                <EmptyState icon="description" title="No contracts" hint="Contract records will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#ffede4]">
                        {['ID', 'Partner', 'Type', 'Value', 'Status', 'Expiry', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {all.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                          <td className="px-4 py-3 text-[#4a2507] font-medium font-mono text-xs">{row.id}</td>
                          <td className="px-4 py-3 text-[#4a2507]">{row.partner}</td>
                          <td className="px-4 py-3 text-[#805030]">{row.type}</td>
                          <td className="px-4 py-3 text-[#4a2507] font-medium">{row.value}</td>
                          <td className="px-4 py-3">
                            <span className={`${row.sColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                          </td>
                          <td className="px-4 py-3 text-[#805030]">{row.expiry}</td>
                          <td className="px-4 py-3">
                            <button className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">Open</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <button className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">note_add</span>
              Draft New Agreement
            </button>

            <div className="bg-white rounded-xl border border-[#dca079]/20 p-5">
              <h2 className="text-[#4a2507] font-semibold text-sm mb-4">Recent Changes</h2>
              {changes.length === 0 ? (
                <EmptyState icon="history" title="No recent changes" />
              ) : (
                <div className="space-y-4">
                  {changes.map((change: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#dca079]/10 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-[#ffede4] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#805030] text-sm">{change.icon}</span>
                      </div>
                      <div>
                        <p className="text-[#4a2507] text-xs font-medium">{change.action}</p>
                        <p className="text-[#805030] text-[10px]">{change.user} — {change.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ManufacturerLayout>
  )
}

export default ContractsPage