import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const ProductionPage: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const kpis = data?.kpis || []
  const batches = data?.batches || []
  const schedule = data?.schedule || []
  const quality = data?.quality || []

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getManufacturerProduction()
      .then(d => { if (mounted) setData(d) })
      .catch(() => { if (mounted) setData(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <ManufacturerLayout><LoadingState label="Loading production..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Operations</span>
          </div>
          <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Production Management</h1>
          <p className="text-[#805030] text-sm mt-1">Track and manage all active production batches</p>
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

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#4a2507] text-lg font-semibold">Active Batches</h2>
            <button className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-sm font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">add</span>
              New Batch
            </button>
          </div>
          {batches.length === 0 ? (
            <EmptyState icon="precision_manufacturing" title="No production batches" hint="Batch data will appear here once scheduled." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {batches.map((batch: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden group hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                  <div className={`h-2 ${batch.status === 'COMPLETED' ? 'bg-green-500' : batch.status === 'ON HOLD' ? 'bg-[#ff7936]' : 'bg-[#004be3]'}`}></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#805030] text-xs font-mono">{batch.id}</span>
                      <span className={`${batch.statusColor} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full`}>{batch.status}</span>
                    </div>
                    <h3 className="text-[#4a2507] font-medium text-sm mb-3">{batch.name}</h3>
                    <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full transition-all duration-700 group-hover:opacity-80 ${batch.status === 'COMPLETED' ? 'bg-green-500' : batch.status === 'ON HOLD' ? 'bg-[#ff7936]' : 'bg-[#004be3]'}`} style={{width: `${batch.pct}%`}}></div>
                    </div>
                    <p className="text-[#4a2507] text-sm font-semibold text-right">{batch.pct}%</p>
                    <div className="flex items-center justify-between mt-3 text-xs text-[#805030] border-t border-[#dca079]/10 pt-3">
                      <span>Started {batch.start}</span>
                      <span>Est. {batch.est}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
            <h2 className="text-[#4a2507] font-semibold text-sm">Production Schedule</h2>
            <span className="text-[#805030] text-xs">Updated {schedule.length} scheduled batches</span>
          </div>
          {schedule.length === 0 ? (
            <EmptyState icon="calendar_month" title="No scheduled batches" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#ffede4]">
                    {['Batch ID', 'Product', 'Line', 'Start', 'End', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                      <td className="px-4 py-3 text-[#4a2507] font-medium font-mono text-xs">{row.id}</td>
                      <td className="px-4 py-3 text-[#4a2507]">{row.product}</td>
                      <td className="px-4 py-3 text-[#805030]">{row.line}</td>
                      <td className="px-4 py-3 text-[#805030]">{row.start}</td>
                      <td className="px-4 py-3 text-[#805030]">{row.end}</td>
                      <td className="px-4 py-3">
                        <span className={`${row.sColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quality.map((q: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#4a2507] font-semibold text-sm">{q.label}</h3>
                <span className={`${q.valueColor} text-lg font-bold`}>{q.value}</span>
              </div>
              <div className="w-full h-3 bg-[#ffede4] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${q.gradient} rounded-full`} style={{width: q.width}}></div>
              </div>
              <p className="text-[#805030] text-xs mt-2">{q.note}</p>
            </div>
          ))}
        </div>
      </div>
    </ManufacturerLayout>
  )
}

export default ProductionPage