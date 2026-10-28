import React, { useEffect, useState } from 'react'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'
import { api } from '../../services/api'

const scoreColor = (score: number) => {
  if (score >= 90) return 'text-green-700 bg-green-50'
  if (score >= 75) return 'text-blue-700 bg-blue-50'
  if (score >= 60) return 'text-yellow-700 bg-yellow-50'
  return 'text-red-700 bg-red-50'
}

const barColor = (score: number) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 75) return 'bg-blue-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const statusBadge: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  under_review: 'bg-yellow-100 text-yellow-700',
}

const ManufacturerScorecards: React.FC = () => {
  const [scorecards, setScorecards] = useState<any[]>([])

  useEffect(() => {
    api.getManufacturerScorecards().then(setScorecards).catch(() => {})
  }, [])

  const avgOverall = scorecards.length > 0
    ? Math.round(scorecards.reduce((s: number, c: any) => s + c.overall_score, 0) / scorecards.length)
    : 0

  return (
    <ManufacturerLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Supplier Scorecards</h1>
          <p className="text-[#805030] font-medium text-sm">Evaluate and compare supplier performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Suppliers', value: scorecards.filter(s => s.status === 'active').length, icon: 'factory', color: 'bg-[#004be3]' },
          { label: 'Under Review', value: scorecards.filter(s => s.status === 'under_review').length, icon: 'rate_review', color: 'bg-[#ff7936]' },
          { label: 'Avg Overall Score', value: `${avgOverall}%`, icon: 'stars', color: 'bg-[#4a2507]' },
          { label: 'Total Orders', value: scorecards.reduce((s: number, c: any) => s + c.total_orders, 0), icon: 'orders', color: 'bg-[#9e3c00]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#dca079]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white text-base">{s.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{s.value}</p>
            <p className="text-xs text-[#805030] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scorecards.map(sc => (
          <div key={sc.id} className="bg-white rounded-xl border border-[#dca079]/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-[#4a2507]">{sc.supplier_name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge[sc.status] || ''}`}>{sc.status}</span>
                </div>
                <p className="text-xs text-[#805030]">{sc.category.replace('_', ' ')} · {sc.total_orders} orders</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-black ${scoreColor(sc.overall_score).split(' ')[0]}`}>{sc.overall_score}%</div>
                <p className="text-[10px] text-[#805030]">Overall</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'On-Time Rate', value: sc.on_time_rate },
                { label: 'Quality Score', value: sc.quality_score },
                { label: 'Pricing Score', value: sc.pricing_score },
                { label: 'Communication', value: sc.communication_score },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs text-[#805030] mb-1">
                    <span>{m.label}</span>
                    <span className="font-bold">{m.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#ffede4] rounded-full">
                    <div className={`h-full rounded-full ${barColor(m.value)}`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {sc.notes && (
              <div className="bg-[#fff4f0] rounded-lg p-3 text-xs text-[#805030]">
                <span className="font-bold text-[#4a2507]">Notes: </span>{sc.notes}
              </div>
            )}
          </div>
        ))}
        {scorecards.length === 0 && (
          <div className="text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">scoreboard</span>
            <p className="font-bold">No supplier scorecards yet</p>
            <p className="text-sm mt-1">Add suppliers to start tracking their performance.</p>
          </div>
        )}
      </div>
    </ManufacturerLayout>
  )
}

export default ManufacturerScorecards
