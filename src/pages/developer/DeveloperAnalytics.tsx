import React, { useState, useEffect } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { getAllUsers, getAllRequests } from '../../services/developerData'
import type { DevUser } from '../../services/developerData'
import type { VerificationRequest } from '../../contexts/VerificationContext'

const DeveloperAnalytics: React.FC = () => {
  const [users, setUsers] = useState<DevUser[]>([])
  const [requests, setRequests] = useState<VerificationRequest[]>([])

  useEffect(() => {
    // Both lists are served by the backend, so this must be async. Failures leave
    // the tables empty rather than showing stale browser-local data.
    let cancelled = false
    ;(async () => {
      try {
        const [u, r] = await Promise.all([getAllUsers(), getAllRequests()])
        if (!cancelled) {
          setUsers(u)
          setRequests(r)
        }
      } catch {
        if (!cancelled) {
          setUsers([])
          setRequests([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const buyers = users.filter(u => u.role === 'buyer').length
  const sellers = users.filter(u => u.role === 'seller').length
  const suppliers = users.filter(u => u.role === 'supplier').length
  const manufacturers = users.filter(u => u.role === 'manufacturer').length
  const devs = users.filter(u => u.role === 'developer').length

  const approvedRequests = requests.filter(r => r.status === 'approved').length
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length
  const pendingRequests = requests.filter(r => r.status === 'pending').length

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter mb-8">Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <div className="w-10 h-10 rounded-lg bg-[#004be3] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-lg">people</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{users.length}</p>
            <p className="text-sm text-[#805030] mt-1">Total Users</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <div className="w-10 h-10 rounded-lg bg-[#ff7936] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-lg">how_to_reg</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{requests.length}</p>
            <p className="text-sm text-[#805030] mt-1">Total Requests</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-lg">check_circle</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{approvedRequests}</p>
            <p className="text-sm text-[#805030] mt-1">Approved</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <div className="w-10 h-10 rounded-lg bg-[#b9002c] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-lg">pending</span>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{pendingRequests}</p>
            <p className="text-sm text-[#805030] mt-1">Pending Review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-black text-[#4a2507] mb-4">Users by Role</h2>
            <div className="space-y-4">
              {[
                { label: 'Buyers', count: buyers, color: 'bg-[#c6d0ff]', bar: 'bg-[#004be3]', pct: users.length ? Math.round(buyers / users.length * 100) : 0 },
                { label: 'Sellers', count: sellers, color: 'bg-[#ff7936]/10', bar: 'bg-[#ff7936]', pct: users.length ? Math.round(sellers / users.length * 100) : 0 },
                { label: 'Suppliers', count: suppliers, color: 'bg-[#004be3]/10', bar: 'bg-[#004be3]', pct: users.length ? Math.round(suppliers / users.length * 100) : 0 },
                { label: 'Manufacturers', count: manufacturers, color: 'bg-[#b9002c]/10', bar: 'bg-[#b9002c]', pct: users.length ? Math.round(manufacturers / users.length * 100) : 0 },
                { label: 'Developers', count: devs, color: 'bg-[#4a2507]/10', bar: 'bg-[#4a2507]', pct: users.length ? Math.round(devs / users.length * 100) : 0 },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-[#4a2507]">{row.label}</span>
                    <span className="text-xs text-[#805030]">{row.count} ({row.pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#ffede4] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-black text-[#4a2507] mb-4">Request Summary</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#fff4f0] p-4 rounded-xl text-center">
                <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Pending</span>
                <p className="text-2xl font-black text-[#ff7936] mt-1">{pendingRequests}</p>
              </div>
              <div className="bg-[#fff4f0] p-4 rounded-xl text-center">
                <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Approved</span>
                <p className="text-2xl font-black text-green-600 mt-1">{approvedRequests}</p>
              </div>
              <div className="bg-[#fff4f0] p-4 rounded-xl text-center">
                <span className="text-[10px] font-black uppercase text-[#805030] tracking-widest">Rejected</span>
                <p className="text-2xl font-black text-[#b9002c] mt-1">{rejectedRequests}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase text-[#805030] tracking-widest mb-3">Request Timeline</h3>
              <div className="space-y-3">
                {[...requests].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5).map(req => (
                  <div key={req.id} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${req.status === 'approved' ? 'bg-green-500' : req.status === 'rejected' ? 'bg-red-500' : 'bg-[#ff7936]'}`} />
                    <span className="text-[#4a2507] font-medium">{req.userName}</span>
                    <span className="text-[#805030]">{req.role}</span>
                    <span className="text-[10px] text-[#805030] ml-auto">{new Date(req.submittedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperAnalytics
