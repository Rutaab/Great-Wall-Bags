import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const kpis = data?.kpis || []
  const trend = data?.trend || { months: [], values: [] }
  const revenue = data?.revenue || { total: '$0', segments: [] }
  const metrics = data?.metrics || []
  const topProducts = data?.topProducts || []

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.getManufacturerAnalytics()
      .then(d => { if (mounted) setData(d) })
      .catch(() => { if (mounted) setData(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <ManufacturerLayout><LoadingState label="Loading analytics..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Data & Insights</span>
          </div>
          <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Manufacturing Analytics</h1>
          <p className="text-[#805030] text-sm mt-1">Data-driven insights for production optimization</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
            <h3 className="text-[#4a2507] font-semibold text-sm mb-4">Monthly Production Trend</h3>
            {trend.values.length === 0 ? (
              <EmptyState icon="monitoring" title="No trend data yet" hint="Production trends will appear here." />
            ) : (
              <div className="flex items-end gap-3 h-40">
                {trend.values.map((h: number, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#ff7936] to-[#ffd4bb] hover:from-[#9e3c00] hover:to-[#ff7936] transition-all cursor-pointer"
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[10px] text-[#805030]">{(trend.months || [])[i] || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
            <h3 className="text-[#4a2507] font-semibold text-sm mb-4">Revenue by Category</h3>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#ff7936] via-[#ffd4bb] to-[#9e3c00] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#4a2507] text-xs font-bold">{revenue.total}</span>
                </div>
              </div>
            </div>
            {revenue.segments.length === 0 ? (
              <EmptyState icon="pie_chart" title="No revenue data" />
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {revenue.segments.map((seg: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-3 h-3 rounded ${seg.color}`}></div>
                    <span className="text-[#805030]">{seg.label}</span>
                    <span className="text-[#4a2507] font-medium ml-auto">{seg.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#805030] text-xs font-medium">{metric.label}</p>
                  <span className={`text-lg font-bold ${metric.invert ? 'text-[#b9002c]' : 'text-[#4a2507]'}`}>{metric.value}</span>
                </div>
                <div className="w-full h-2 bg-[#ffede4] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700`}
                    style={{ width: `${metric.invert ? 100 - metric.pct : metric.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
            <h2 className="text-[#4a2507] font-semibold text-sm">Top Products</h2>
            <div className="flex items-center gap-2">
              <span className="text-[#805030] text-xs">Last 30 days</span>
            </div>
          </div>
          {topProducts.length === 0 ? (
            <EmptyState icon="inventory_2" title="No product performance data" hint="Top product metrics will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#ffede4]">
                    {['Product', 'Units Produced', 'Revenue', 'Defect Rate', 'Trend'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                      <td className="px-4 py-3 text-[#4a2507] font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-[#805030]">{row.units}</td>
                      <td className="px-4 py-3 text-[#4a2507] font-medium">{row.revenue}</td>
                      <td className="px-4 py-3">
                        <span className={`${parseFloat(row.defects) > 2 ? 'text-[#b9002c]' : 'text-green-600'} text-xs font-medium`}>{row.defects}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${row.up ? 'text-green-600' : 'text-[#b9002c]'}`}>
                          <span className="material-symbols-outlined text-sm">{row.up ? 'trending_up' : 'trending_down'}</span>
                          {row.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            Export as PDF
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">table</span>
            Export as CSV
          </button>
        </div>
      </div>
    </ManufacturerLayout>
  )
}

export default AnalyticsPage