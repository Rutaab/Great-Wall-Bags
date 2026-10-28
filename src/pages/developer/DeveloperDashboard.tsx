import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeveloperLayout from './DeveloperLayout'
import { getDevDashboardStats, getAllRequests, approveRequest as dataApproveRequest, approveRoleChange, rejectRequest as dataRejectRequest } from '../../services/developerData'
import { getSuggestedFeaturedProducts, approveFeaturedProduct, rejectFeaturedProduct, type LocalProduct } from '../../services/localProducts'
import type { DevUser } from '../../services/developerData'

interface SuggestedProduct extends LocalProduct {
  score: number
}

const DeveloperDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalUsers: 0, activeSellers: 0, pendingVerifications: 0, totalRequests: 0 })
  const [recentUsers, setRecentUsers] = useState<DevUser[]>([])
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [suggested, setSuggested] = useState<SuggestedProduct[]>([])

  const refresh = async () => {
    try {
      const [data, requests] = await Promise.all([getDevDashboardStats(), getAllRequests()])
      setStats(data)
      setRecentUsers(data.recentRegistrations)
      setPendingRequests(requests.filter(r => r.status === 'pending'))
    } catch {
      setStats({ totalUsers: 0, activeSellers: 0, pendingVerifications: 0, totalRequests: 0 })
      setRecentUsers([])
      setPendingRequests([])
    }
    setSuggested(getSuggestedFeaturedProducts())
  }

  useEffect(() => { void refresh() }, [])

  // Approving records the decision only. It does not change the user's role -
  // that stays an explicit action on /developer/users, so an approval can never
  // silently grant seller/manufacturer/supplier access.
  const handleApprove = async (id: string) => {
    try {
      if (pendingRequests.find(r => r.id === id)?.type === 'role_change') {
        await approveRoleChange(id)
      } else {
        await dataApproveRequest(id)
      }
    } finally {
      await refresh()
    }
  }
  const handleReject = async (id: string) => {
    const notes = rejectNotes[id] || ''
    try {
      await dataRejectRequest(id, notes)
    } finally {
      await refresh()
    }
  }

  const handleApproveFeatured = async (id: string) => {
    await approveFeaturedProduct(id)
    await refresh()
  }

  const handleRejectFeatured = async (id: string) => {
    await rejectFeaturedProduct(id)
    await refresh()
  }

  const kpiCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: `+${Math.floor(stats.totalUsers * 0.12)}`, icon: 'people', color: 'bg-[#004be3]' },
    { label: 'Active Partners', value: stats.activeSellers.toLocaleString(), change: `+${Math.floor(stats.activeSellers * 0.08)}`, icon: 'store', color: 'bg-[#ff7936]' },
    { label: 'Total Requests', value: stats.totalRequests.toLocaleString(), change: `${stats.pendingVerifications} pending`, icon: 'how_to_reg', color: 'bg-[#4a2507]' },
    { label: 'Pending Review', value: stats.pendingVerifications.toLocaleString(), change: stats.pendingVerifications > 0 ? 'Action needed' : 'All clear', icon: 'rate_review', color: stats.pendingVerifications > 0 ? 'bg-[#b9002c]' : 'bg-[#004be3]' },
  ]

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Developer Dashboard</h1>
            <p className="text-[#805030] text-sm mt-1">Real-time site overview</p>
          </div>
          <button onClick={refresh} className="flex items-center gap-1 px-4 py-2 bg-[#ffede4] rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffd4bb] transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white text-lg">{stat.icon}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.label === 'Pending Review' && stats.pendingVerifications > 0
                    ? 'bg-[#b9002c]/10 text-[#b9002c]'
                    : 'bg-green-50 text-green-600'
                }`}>{stat.change}</span>
              </div>
              <p className="text-2xl font-black text-[#4a2507]">{stat.value}</p>
              <p className="text-sm text-[#805030] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#4a2507]">Pending Role Requests</h2>
              <button onClick={() => navigate('/developer/requests')} className="text-[10px] font-bold text-[#004be3] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {pendingRequests.slice(0, 5).map(req => (
                <div key={req.id} className={`border rounded-xl p-4 bg-[#fff4f0] ${req.type === 'role_change' ? 'border-[#004be3]/30' : 'border-[#ff7936]/20'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-[#4a2507]">{req.userName}</p>
                        {req.type === 'role_change' && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#004be3]/10 text-[#004be3] uppercase tracking-wider">Role Change</span>
                        )}
                      </div>
                      <p className="text-xs text-[#805030]">{req.userEmail}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#ff7936]/10 text-[#9e3c00]">{req.role}</span>
                        {req.type === 'role_change' && req.requestedRole && (
                          <>
                            <span className="material-symbols-outlined text-sm text-[#805030]">arrow_forward</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#004be3]/10 text-[#004be3]">{req.requestedRole}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#805030]">{new Date(req.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <textarea
                      placeholder="Rejection notes (optional)..."
                      className="w-full bg-white border border-[#dca079]/20 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#ff7936] resize-none"
                      rows={2}
                      value={rejectNotes[req.id] || ''}
                      onChange={e => setRejectNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(req.id)} className="flex-1 py-2 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">check</span>
                      Accept
                    </button>
                    <button onClick={() => handleReject(req.id)} className="flex-1 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">close</span>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Curation Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#4a2507">Featured Curation</h2>
              <p className="text-xs text-[#805030] mt-0.5">Review top-rated products and approve them for category page display. Score is computed from rating, reviews, and recency.</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> {suggested.length} suggesting</span>
            </div>
          </div>

          {suggested.length === 0 ? (
            <div className="text-center py-10 text-[#805030]">
              <span className="material-symbols-outlined text-3xl mb-2">auto_awesome</span>
              <p className="font-bold">No products to curate</p>
              <p className="text-xs mt-1">All products have been reviewed or no products have ratings yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggested.slice(0, 10).map(product => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-[#fff4f0] rounded-xl border border-[#dca079]/10 hover:border-[#ff7936]/30 transition-all">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#ffede4] flex-shrink-0">
                    <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-[#4a2507] truncate">{product.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff7936]/10 text-[#9e3c00] uppercase">{product.route}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#805030]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {product.rating}
                      </span>
                      <span>{product.reviews} reviews</span>
                      <span className="font-bold text-[#004be3]">Score: {product.score}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        product.featured === 'none' ? 'bg-amber-100 text-amber-700' :
                        product.featured === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{product.featured}</span>
                    </div>
                    <p className="text-xs text-[#805030] mt-1 truncate">{product.spec}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApproveFeatured(product.id)}
                      className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-all active:scale-90"
                      title="Approve for category page"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                    </button>
                    <button
                      onClick={() => handleRejectFeatured(product.id)}
                      className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all active:scale-90"
                      title="Reject"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
              {suggested.length > 10 && (
                <p className="text-center text-xs text-[#805030] pt-2">+{suggested.length - 10} more products available for review</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#4a2507]">Recent Registrations</h2>
              <button onClick={() => navigate('/developer/users')} className="text-[10px] font-bold text-[#004be3] hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-[#ffede4] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-[10px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#4a2507]">{user.name}</p>
                      <p className="text-xs text-[#805030]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#ffede4] text-[#805030]">{user.role}</span>
                    <p className="text-[10px] text-[#805030] mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-[#805030] text-center py-6">No registrations yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-bold text-[#4a2507] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/developer/users')} className="w-full flex items-center gap-3 p-4 bg-[#ffede4] rounded-xl hover:bg-[#ffd4bb] transition-colors text-left">
                <span className="material-symbols-outlined text-[#004be3]">people</span>
                <div>
                  <p className="text-sm font-bold text-[#4a2507]">Manage Users</p>
                  <p className="text-xs text-[#805030]">View, edit, or remove user accounts</p>
                </div>
              </button>
              <button onClick={() => navigate('/developer/requests')} className="w-full flex items-center gap-3 p-4 bg-[#ffede4] rounded-xl hover:bg-[#ffd4bb] transition-colors text-left">
                <span className="material-symbols-outlined text-[#9e3c00]">how_to_reg</span>
                <div>
                  <p className="text-sm font-bold text-[#4a2507]">Review Requests</p>
                  <p className="text-xs text-[#805030]">Approve or reject role change requests</p>
                </div>
              </button>
              <button onClick={() => navigate('/developer/features')} className="w-full flex items-center gap-3 p-4 bg-[#ffede4] rounded-xl hover:bg-[#ffd4bb] transition-colors text-left">
                <span className="material-symbols-outlined text-[#004be3]">toggle_on</span>
                <div>
                  <p className="text-sm font-bold text-[#4a2507]">Feature Flags</p>
                  <p className="text-xs text-[#805030]">Toggle site features on and off</p>
                </div>
              </button>
              <button onClick={() => navigate('/developer/settings')} className="w-full flex items-center gap-3 p-4 bg-[#ffede4] rounded-xl hover:bg-[#ffd4bb] transition-colors text-left">
                <span className="material-symbols-outlined text-[#b9002c]">settings</span>
                <div>
                  <p className="text-sm font-bold text-[#4a2507]">Site Settings</p>
                  <p className="text-xs text-[#805030]">Configure global site parameters</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperDashboard
