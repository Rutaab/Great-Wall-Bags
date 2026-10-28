import React, { useEffect, useState } from 'react'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'
import { api } from '../../services/api'

const healthColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  if (score >= 25) return 'text-[#ff7936]'
  return 'text-red-600'
}

const healthBg = (score: number) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  if (score >= 25) return 'bg-[#ff7936]'
  return 'bg-red-500'
}

const statusDot: Record<string, string> = {
  operational: 'bg-green-500',
  idle: 'bg-yellow-500',
  maintenance: 'bg-[#ff7936]',
  offline: 'bg-gray-400',
  error: 'bg-red-500',
}

const SupplierPredictiveMaintenance: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>([])

  useEffect(() => {
    api.getManufacturerEquipment().then(setEquipment).catch(() => {})
  }, [])

  const critical = equipment.filter(e => e.health_score < 30).length
  const warning = equipment.filter(e => e.health_score >= 30 && e.health_score < 70).length
  const healthy = equipment.filter(e => e.health_score >= 70).length

  return (
    <ManufacturerLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Predictive Maintenance</h1>
        <p className="text-[#805030] font-medium text-sm">AI-driven equipment health monitoring &amp; maintenance scheduling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Assets', value: equipment.length, icon: 'precision_manufacturing', color: 'bg-[#4a2507]' },
          { label: 'Healthy', value: healthy, icon: 'check_circle', color: 'bg-green-600' },
          { label: 'Needs Attention', value: warning, icon: 'warning', color: 'bg-[#ff7936]' },
          { label: 'Critical', value: critical, icon: 'error', color: 'bg-red-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipment.map(eq => (
          <div key={eq.id} className="bg-white rounded-xl border border-[#dca079]/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusDot[eq.status] || 'bg-gray-400'}`} />
                <div>
                  <h3 className="font-bold text-[#4a2507]">{eq.name}</h3>
                  <p className="text-[10px] text-[#805030]">{eq.model} · {eq.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${healthColor(eq.health_score)}`}>{eq.health_score}%</div>
                <span className="text-[10px] text-[#805030]">Health Score</span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#ffede4] rounded-full mb-4">
              <div className={`h-full rounded-full ${healthBg(eq.health_score)}`} style={{ width: `${eq.health_score}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-[10px]">
              <div className="bg-[#fff4f0] rounded-lg p-2 text-center">
                <p className="font-bold text-[#4a2507]">{eq.runtime_hours?.toLocaleString()}h</p>
                <p className="text-[#805030]">Runtime</p>
              </div>
              <div className="bg-[#fff4f0] rounded-lg p-2 text-center">
                <p className="font-bold text-[#4a2507]">{eq.last_maintenance?.slice(0, 10) || '--'}</p>
                <p className="text-[#805030]">Last Maint.</p>
              </div>
              <div className="bg-[#fff4f0] rounded-lg p-2 text-center">
                <p className="font-bold text-[#4a2507]">{eq.next_maintenance?.slice(0, 10) || '--'}</p>
                <p className="text-[#805030]">Next Maint.</p>
              </div>
            </div>
          </div>
        ))}
        {equipment.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#805030]">
            <span className="material-symbols-outlined text-4xl mb-3">precision_manufacturing</span>
            <p className="font-bold">No equipment registered</p>
            <p className="text-sm mt-1">Add equipment to start monitoring maintenance.</p>
          </div>
        )}
      </div>
    </ManufacturerLayout>
  )
}

export default SupplierPredictiveMaintenance
