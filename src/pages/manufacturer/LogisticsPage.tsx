import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const LogisticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ origin: '', destination: '', status: 'In Transit', eta: '' })

  const activeRoutes = data?.activeRoutes ?? 0
  const change = data?.change || ''
  const changeLabel = data?.changeLabel || ''
  const customs = data?.customs || []
  const lanes = data?.lanes || []
  const onTime = data?.onTime || '—'
  const telemetry = data?.telemetry || []
  const carriers = data?.carriers ?? 1
  const customsAlerts = data?.customsAlerts ?? 0

  const fetchData = () => {
    api.getManufacturerLogistics()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])

  const handleSubmit = () => {
    if (!form.origin.trim() || !form.destination.trim()) {
      setError('Origin and destination are required.')
      return
    }
    setSaving(true)
    setError('')
    api.createManufacturerShipment({ ...form, eta: form.eta || 'TBD' })
      .then(() => {
        setShowForm(false)
        setForm({ origin: '', destination: '', status: 'In Transit', eta: '' })
        fetchData()
      })
      .catch((e: any) => setError(e.message || 'Failed to create shipment.'))
      .finally(() => setSaving(false))
  }

  if (loading) return <ManufacturerLayout><LoadingState label="Loading logistics..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Global Operations</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Global Logistics Control</h1>
            <p className="text-[#805030] text-sm mt-1">Monitor shipments, customs, and carrier performance in real time</p>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff7936] to-[#9e3c00] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">add</span>
            New Shipment
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden relative h-[340px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffede4] to-[#ffd4bb]/60 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-[#805030]/30 text-6xl">map</span>
                <p className="text-[#805030]/50 text-sm mt-2">Live Interactive Tracking Map</p>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 300">
                <line x1="80" y1="240" x2="250" y2="120" stroke="#ff7936" strokeWidth="2" strokeDasharray="8 4" className="opacity-40" />
                <line x1="250" y1="120" x2="420" y2="80" stroke="#004be3" strokeWidth="2" strokeDasharray="8 4" className="opacity-40" />
                <line x1="420" y1="80" x2="520" y2="200" stroke="#b9002c" strokeWidth="2" strokeDasharray="8 4" className="opacity-30" />
                <circle cx="80" cy="240" r="4" fill="#ff7936" />
                <circle cx="250" cy="120" r="4" fill="#004be3" />
                <circle cx="420" cy="80" r="4" fill="#9e3c00" />
                <circle cx="520" cy="200" r="4" fill="#b9002c" />
              </svg>
              <span className="absolute top-1/3 left-1/4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7936] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7936]"></span>
              </span>
              <span className="absolute top-1/4 left-2/3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004be3] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004be3]"></span>
              </span>
            </div>
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-lg px-4 py-3 shadow-sm border border-white/50">
              <p className="text-[#4a2507] text-sm font-semibold">Active Routes — {activeRoutes.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-green-600 text-sm">trending_up</span>
                <span className="text-green-600 text-xs font-medium">{change}</span>
                {(changeLabel && <span className="text-[#805030] text-xs ml-1">{changeLabel}</span>)}
              </div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-white/90 backdrop-blur-sm text-[#4a2507] text-xs font-medium px-3 py-1.5 rounded-full border border-[#dca079]/20">All Carriers</span>
              <span className="bg-[#ff7936] text-white text-xs font-medium px-3 py-1.5 rounded-full">Real-time</span>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-[#dca079]/20">
              <div className="flex -space-x-2">
                {['#ff7936', '#004be3', '#b9002c'].slice(0, carriers).map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{background: `linear-gradient(135deg, white, ${c})`}}>
                    <span className="text-white text-[8px] font-bold">{['D', 'F', 'P'][i]}</span>
                  </div>
                ))}
              </div>
              <span className="text-[#4a2507] text-xs font-medium">{carriers} Carrier APIs Connected</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-[#dca079]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#4a2507] font-semibold text-sm">Customs Pending</h3>
              <span className="bg-[#b9002c]/10 text-[#b9002c] text-xs font-medium px-2 py-0.5 rounded-full">{customsAlerts} Alerts</span>
            </div>
            {customs.length === 0 ? (
              <EmptyState icon="gavel" title="No pending customs" />
            ) : (
              <div className="space-y-3">
                {customs.map((item: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-[#fff4f0] border border-[#dca079]/20 hover:border-[#b9002c]/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className={`${item.iconColor} text-sm mt-0.5`}>
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                      </span>
                      <div>
                        <p className="text-[#4a2507] text-sm font-medium">{item.title}</p>
                        <p className="text-[#805030] text-xs mt-0.5">{item.desc}</p>
                        <span className={`inline-block mt-1.5 ${item.actionColor} text-xs font-medium`}>{item.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-4 py-2 rounded-lg border border-[#dca079]/40 text-[#805030] text-sm font-medium hover:bg-[#ffede4] transition-all flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">fact_check</span>
              Review All Documentation
            </button>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-[#dca079]/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#4a2507] font-semibold text-sm">Lane Performance</h3>
              <a href="#" className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">Details →</a>
            </div>
            {lanes.length === 0 ? (
              <EmptyState icon="route" title="No lane data" hint="Lane performance will appear here." />
            ) : (
              <div className="space-y-4">
                {lanes.map((lane: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#4a2507] text-sm">{lane.label}</span>
                      <span className="text-[#805030] text-xs font-medium">{lane.value}</span>
                    </div>
                    <div className={`w-full h-2 ${lane.bg} rounded-full overflow-hidden`}>
                      <div className={`h-full ${lane.color} rounded-full transition-all duration-700 hover:opacity-80`} style={{width: lane.width}}></div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-[#dca079]/10 flex items-center justify-between text-xs">
                  <span className="text-[#805030]">On-time delivery rate</span>
                  <span className="text-green-600 font-medium">{onTime}</span>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
              <h3 className="text-[#4a2507] font-semibold text-sm">Carrier Telemetry</h3>
              <span className="text-[#805030] text-xs">Last updated 2 min ago</span>
            </div>
            {telemetry.length === 0 ? (
              <EmptyState icon="sensors" title="No telemetry data" hint="Shipment tracking feeds will appear here." />
            ) : (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#ffede4] sticky top-0">
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Tracking ID</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Origin</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Destination</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3 text-[#4a2507] font-medium">{row.id}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.origin}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.dest}</td>
                        <td className="px-4 py-3">
                          <span className={`${row.statusColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3 text-[#4a2507]">{row.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#4a2507]">New Shipment</h3>
                <p className="text-sm text-[#805030] mt-0.5">Create a new carrier tracking record</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#805030] hover:bg-[#ffede4] transition-colors" aria-label="Close">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Origin <span className="text-[#b9002c]">*</span></label>
                <input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Shanghai, CN" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Destination <span className="text-[#b9002c]">*</span></label>
                <input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Los Angeles, US" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm focus:outline-none focus:border-[#ff7936] transition-colors">
                  <option>In Transit</option>
                  <option>Customs Hold</option>
                  <option>Delayed</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">ETA</label>
                <input value={form.eta} onChange={e => setForm({ ...form, eta: e.target.value })} placeholder="e.g. Dec 22, 2024" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
              </div>
              {error && <p className="text-[#b9002c] text-xs font-medium">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ff7936] to-[#9e3c00] hover:shadow-lg hover:shadow-[#ff7936]/30 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                  {saving ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">local_shipping</span>}
                  {saving ? 'Creating...' : 'Create Shipment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ManufacturerLayout>
  )
}

export default LogisticsPage