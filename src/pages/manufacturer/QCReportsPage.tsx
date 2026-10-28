import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { LoadingState, EmptyState } from '../../components/manufacturer/ManufacturerState'
import ManufacturerLayout from '../../components/manufacturer/ManufacturerLayout'

const QCReportsPage: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ batch: '', inspector: '', type: 'Final' })

  const kpis = data?.kpis || []
  const records = data?.records || []
  const issues = data?.issues || []
  const certs = data?.certs || []

  const fetchData = () => {
    api.getManufacturerQC()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])

  const handleSubmit = () => {
    if (!form.batch.trim() || !form.inspector.trim()) {
      setError('Batch and inspector are required.')
      return
    }
    setSaving(true)
    setError('')
    api.createManufacturerInspection(form)
      .then(() => {
        setShowForm(false)
        setForm({ batch: '', inspector: '', type: 'Final' })
        fetchData()
      })
      .catch((e: any) => setError(e.message || 'Failed to create inspection.'))
      .finally(() => setSaving(false))
  }

  if (loading) return <ManufacturerLayout><LoadingState label="Loading QC reports..." /></ManufacturerLayout>

  return (
    <ManufacturerLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#004be3] text-xs font-semibold uppercase tracking-widest bg-[#004be3]/10 px-2.5 py-1 rounded-full">Quality Assurance</span>
          </div>
          <h1 className="text-[#4a2507] text-2xl font-bold tracking-tight">Quality Control Reports</h1>
          <p className="text-[#805030] text-sm mt-1">Inspection results and compliance tracking</p>
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
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#dca079]/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#dca079]/20 flex items-center justify-between">
              <h2 className="text-[#4a2507] font-semibold text-sm">Inspection Records</h2>
              <button onClick={() => setShowForm(true)} className="px-3 py-1.5 rounded-lg bg-[#ff7936] text-white text-xs font-medium hover:bg-[#9e3c00] transition-all flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">add</span>
                New Inspection
              </button>
            </div>
            {records.length === 0 ? (
              <EmptyState icon="fact_check" title="No inspection records" hint="Inspection results will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#ffede4]">
                      {['Report ID', 'Batch', 'Inspector', 'Type', 'Date', 'Result', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[#4a2507] font-semibold text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-[#dca079]/10 hover:bg-[#fff4f0] transition-colors">
                        <td className="px-4 py-3 text-[#4a2507] font-medium font-mono text-xs">{row.id}</td>
                        <td className="px-4 py-3 text-[#4a2507]">{row.batch}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.inspector}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.type}</td>
                        <td className="px-4 py-3 text-[#805030]">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 ${row.rColor} text-xs font-medium`}>
                            <span className="material-symbols-outlined text-sm">{row.resultIcon}</span>
                            {row.result}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${row.sColor} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-[#9e3c00] text-xs font-medium hover:text-[#ff7936] transition-colors">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#dca079]/20 p-5">
              <h2 className="text-[#4a2507] font-semibold text-sm mb-4">Recent Issues</h2>
              {issues.length === 0 ? (
                <EmptyState icon="check_circle" title="No issues reported" />
              ) : (
                <div className="space-y-3">
                  {issues.map((item: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#fff4f0] border border-[#dca079]/10">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[#4a2507] text-xs font-medium leading-relaxed">{item.issue}</p>
                        <span className={`shrink-0 ${item.sBg} ${item.sColor} text-[10px] font-semibold px-2 py-0.5 rounded-full`}>{item.severity}</span>
                      </div>
                      <p className="text-[#805030] text-[10px] mt-1">{item.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[#4a2507] text-lg font-semibold mb-4">Certifications & Compliance</h2>
          {certs.length === 0 ? (
            <EmptyState icon="verified" title="No certifications" hint="Compliance credentials will appear here." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certs.map((cert: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-[#dca079]/20 p-5 hover:shadow-lg hover:shadow-[#ff7936]/5 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`material-symbols-outlined text-2xl ${cert.iconColor}`}>{cert.icon}</span>
                    <span className={`${cert.sColor} text-[10px] font-semibold px-2.5 py-1 rounded-full`}>{cert.status}</span>
                  </div>
                  <h3 className="text-[#4a2507] font-medium text-sm">{cert.name}</h3>
                  <p className="text-[#805030] text-xs mt-1">Expires {cert.expiry}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#4a2507]">New Inspection</h3>
                <p className="text-sm text-[#805030] mt-0.5">Create a QC inspection record</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#805030] hover:bg-[#ffede4] transition-colors" aria-label="Close">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Batch <span className="text-[#b9002c]">*</span></label>
                <input value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} placeholder="e.g. PB-2024-08" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Inspector <span className="text-[#b9002c]">*</span></label>
                <input value={form.inspector} onChange={e => setForm({ ...form, inspector: e.target.value })} placeholder="e.g. Sarah Kim" className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm placeholder:text-[#805030]/60 focus:outline-none focus:border-[#ff7936] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4a2507] mb-1.5">Inspection Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-[#ffede4] border border-[#dca079]/30 text-[#4a2507] text-sm focus:outline-none focus:border-[#ff7936] transition-colors">
                  <option>Final</option>
                  <option>Mid-Line</option>
                  <option>Material</option>
                  <option>Pre-Prod</option>
                </select>
              </div>
              {error && <p className="text-[#b9002c] text-xs font-medium">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#4a2507] bg-[#ffede4] hover:bg-[#ffd4bb] rounded-xl transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ff7936] to-[#9e3c00] hover:shadow-lg hover:shadow-[#ff7936]/30 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                  {saving ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm">fact_check</span>}
                  {saving ? 'Creating...' : 'Create Inspection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ManufacturerLayout>
  )
}

export default QCReportsPage