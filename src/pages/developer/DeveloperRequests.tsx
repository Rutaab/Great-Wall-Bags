import React, { useState, useEffect, useCallback } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { getAllRequests, getAllUsers, approveRequest, approveRoleChange, rejectRequest } from '../../services/developerData'
import type { DevUser } from '../../services/developerData'
import type { VerificationRequest } from '../../contexts/VerificationContext'

type RequestFilter = 'all' | 'pending' | 'approved' | 'rejected'

const filterTabs: { key: RequestFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const statusStyles: Record<string, string> = {
  pending: 'bg-[#ff7936]/10 text-[#9e3c00]',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

const DeveloperRequests: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [users, setUsers] = useState<DevUser[]>([])
  const [filter, setFilter] = useState<RequestFilter>('pending')
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})
  const [actionMsg, setActionMsg] = useState('')
  const [actionError, setActionError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setActionError('')
    try {
      // Both come from the backend, so the queue is the same one users submitted
      // their requests to - not a browser-local copy.
      const [r, u] = await Promise.all([getAllRequests(), getAllUsers()])
      setRequests(r)
      setUsers(u)
    } catch (err: any) {
      setRequests([])
      setUsers([])
      setActionError(err?.message || 'Could not load requests from the server')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = requests.filter(r => filter === 'all' || r.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  // Approving records the decision only. The user's role is untouched here - it has
  // to be set explicitly on /developer/users. The message says so, because
  // "approved" without a role change is otherwise easy to misread as "now a seller".
  const handleApprove = async (id: string) => {
    setActionMsg('')
    setActionError('')
    try {
      if (requests.find(r => r.id === id)?.type === 'role_change') {
        await approveRoleChange(id)
      } else {
        await approveRequest(id)
      }
      setActionMsg('Request approved. Assign the role on the Users page to grant access.')
      setTimeout(() => setActionMsg(''), 5000)
    } catch (err: any) {
      setActionError(err?.message || 'Could not approve the request')
    }
    await load()
  }

  const handleReject = async (id: string) => {
    setActionMsg('')
    setActionError('')
    const notes = rejectNotes[id] || ''
    try {
      await rejectRequest(id, notes)
      setActionMsg('Request rejected')
      setTimeout(() => setActionMsg(''), 2000)
    } catch (err: any) {
      setActionError(err?.message || 'Could not reject the request')
    }
    await load()
  }

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Role Requests</h1>
            <p className="text-[#805030] text-sm mt-1">
              {loading ? 'Loading...' : `${requests.filter(r => r.status === 'pending').length} pending, ${requests.length} total`}
            </p>
          </div>
          {actionMsg && (
            <span className="bg-[#004be3] text-white px-4 py-2 rounded-full text-xs font-bold">{actionMsg}</span>
          )}
        </div>

        {actionError && (
          <div className="mb-6 bg-[#b9002c]/10 border border-[#b9002c]/20 text-[#b9002c] px-4 py-3 rounded-xl text-sm font-bold">
            {actionError}
          </div>
        )}

        <p className="mb-6 text-[#805030] text-xs bg-[#ffede4] border border-[#dca079]/20 rounded-xl px-4 py-3">
          Approving a request records your decision only &mdash; it does not change the user's role.
          To grant access, set the role on the <a className="font-bold text-[#004be3] underline" href="/developer/users">Users</a> page.
        </p>

        <div className="flex items-center gap-2 bg-[#ffede4] rounded-xl p-1 mb-6">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-white text-[#9e3c00] shadow-sm'
                  : 'text-[#805030] hover:text-[#4a2507]'
              }`}
            >
              {tab.label}
              {tab.key === 'pending' && requests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-[#ff7936] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {sorted.map(req => (
            <div key={req.id} className="bg-white rounded-xl p-5 border border-[#dca079]/10 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {req.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#4a2507]">{req.userName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusStyles[req.status] || ''}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                      {req.type === 'role_change' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#004be3]/10 text-[#004be3] uppercase tracking-wider">Role Change</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#805030]">
                      <span>{req.userEmail}</span>
                      <span className="w-1 h-1 rounded-full bg-[#dca079]/40" />
                      {req.type === 'role_change' && req.requestedRole ? (
                        <>
                          <span className="font-bold uppercase">{req.role}</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          <span className="font-bold text-[#004be3] uppercase">{req.requestedRole}</span>
                        </>
                      ) : (
                        <span className="font-bold text-[#004be3] uppercase">{req.role}</span>
                      )}
                      <span className="w-1 h-1 rounded-full bg-[#dca079]/40" />
                      <span>{new Date(req.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <button onClick={() => setExpandedId(expandedId === req.id ? null : req.id)} className="text-[10px] font-bold text-[#004be3] bg-[#004be3]/10 px-3 py-1 rounded-full hover:bg-[#004be3]/20 transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">{expandedId === req.id ? 'expand_less' : 'expand_more'}</span>
                        {expandedId === req.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                    {expandedId === req.id && (
                      (() => {
                        const userRecord = users.find(u => u.id === req.userId)
                        const data = req.applicationData || {}
                        return (
                          <div className="mt-3 bg-[#ffede4] rounded-xl p-4 text-xs space-y-2">
                            <div className="font-bold text-[#4a2507] mb-2 border-b border-[#dca079]/20 pb-2">User Details</div>
                            <div><span className="font-bold text-[#4a2507]">Name:</span> <span className="text-[#805030]">{userRecord?.name || req.userName}</span></div>
                            <div><span className="font-bold text-[#4a2507]">Email:</span> <span className="text-[#805030]">{userRecord?.email || req.userEmail}</span></div>
                            <div><span className="font-bold text-[#4a2507]">Current Role:</span> <span className="text-[#805030] uppercase">{userRecord?.role || req.role}</span></div>
                            <div><span className="font-bold text-[#4a2507]">Account Created:</span> <span className="text-[#805030]">{userRecord?.createdAt ? new Date(userRecord.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                            <div className="font-bold text-[#4a2507] mt-4 mb-2 border-b border-[#dca079]/20 pb-2">Application Data</div>
                            {req.role === 'supplier' && (
                              <>
                                {data.brandName ? <div><span className="font-bold text-[#4a2507]">Brand Name:</span> <span className="text-[#805030]">{data.brandName}</span></div> : <div className="text-[#805030] italic">No brand name</div>}
                                {data.brandStory ? <div><span className="font-bold text-[#4a2507]">Brand Story:</span> <span className="text-[#805030]">{data.brandStory}</span></div> : null}
                                {data.taxId ? <div><span className="font-bold text-[#4a2507]">Tax ID:</span> <span className="text-[#805030]">{data.taxId}</span></div> : null}
                                {data.warehouseLocation ? <div><span className="font-bold text-[#4a2507]">Warehouse:</span> <span className="text-[#805030]">{data.warehouseLocation}</span></div> : null}
                                {data.shippingCapabilities && data.shippingCapabilities.length > 0 ? <div><span className="font-bold text-[#4a2507]">Shipping:</span> <span className="text-[#805030]">{data.shippingCapabilities.join(', ')}</span></div> : null}
                              </>
                            )}
                            {req.role === 'seller' && (
                              <>
                                {data.storeName ? <div><span className="font-bold text-[#4a2507]">Store Name:</span> <span className="text-[#805030]">{data.storeName}</span></div> : <div className="text-[#805030] italic">No store name</div>}
                                {data.tagline ? <div><span className="font-bold text-[#4a2507]">Tagline:</span> <span className="text-[#805030]">{data.tagline}</span></div> : null}
                                {data.productCategory ? <div><span className="font-bold text-[#4a2507]">Category:</span> <span className="text-[#805030]">{data.productCategory}</span></div> : null}
                                {data.sellerFullName ? <div><span className="font-bold text-[#4a2507]">Full Name:</span> <span className="text-[#805030]">{data.sellerFullName}</span></div> : null}
                                {data.bankAccount ? <div><span className="font-bold text-[#4a2507]">Bank Account:</span> <span className="text-[#805030]">{data.bankAccount}</span></div> : null}
                                {data.routingNumber ? <div><span className="font-bold text-[#4a2507]">Routing #:</span> <span className="text-[#805030]">{data.routingNumber}</span></div> : null}
                              </>
                            )}
                            {req.role === 'manufacturer' && (
                              <>
                                {data.companyName ? <div><span className="font-bold text-[#4a2507]">Company:</span> <span className="text-[#805030]">{data.companyName}</span></div> : <div className="text-[#805030] italic">No company name</div>}
                                {data.factoryLocation ? <div><span className="font-bold text-[#4a2507]">Location:</span> <span className="text-[#805030]">{data.factoryLocation}</span></div> : null}
                                {data.productionCapacity ? <div><span className="font-bold text-[#4a2507]">Capacity:</span> <span className="text-[#805030]">{data.productionCapacity.toLocaleString()} units/month</span></div> : null}
                                {data.yearsInBusiness ? <div><span className="font-bold text-[#4a2507]">Years:</span> <span className="text-[#805030]">{data.yearsInBusiness} years</span></div> : null}
                                {data.certifications && data.certifications.length > 0 ? <div><span className="font-bold text-[#4a2507]">Certifications:</span> <span className="text-[#805030]">{data.certifications.join(', ')}</span></div> : null}
                              </>
                            )}
                          </div>
                        )
                      })()
                    )}
                    {req.notes && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-1.5 rounded-lg">
                        Notes: {req.notes}
                      </p>
                    )}
                    {req.reviewedAt && (
                      <p className="text-[10px] text-[#805030] mt-1">
                        Reviewed: {new Date(req.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <textarea
                      placeholder="Rejection notes..."
                      className="w-56 bg-[#fff4f0] border border-[#dca079]/20 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#ff7936] resize-none"
                      rows={2}
                      value={rejectNotes[req.id] || ''}
                      onChange={e => setRejectNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {req.status !== 'pending' && (
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${statusStyles[req.status]}`}>
                        {req.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {req.status === 'rejected' && (
                        <button onClick={async () => {
                          await approveRequest(req.id)
                          setActionMsg('Request approved. Assign the role on the Users page to grant access.')
                          setTimeout(() => setActionMsg(''), 5000)
                          await load()
                        }} className="px-3 py-1.5 bg-green-600 text-white rounded-full text-[10px] font-bold hover:bg-green-700 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check</span>
                          Approve
                        </button>
                      )}
                      {req.status === 'approved' && (
                        <button onClick={async () => {
                          await rejectRequest(req.id, rejectNotes[req.id] || '')
                          setActionMsg('Request rejected')
                          setTimeout(() => setActionMsg(''), 2000)
                          await load()
                        }} className="px-3 py-1.5 bg-red-500 text-white rounded-full text-[10px] font-bold hover:bg-red-600 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">close</span>
                          Reject
                        </button>
                      )}
                    </div>
                    {req.status === 'approved' && (
                      <textarea
                        placeholder="Rejection notes..."
                        className="w-48 bg-[#fff4f0] border border-[#dca079]/20 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#ff7936] resize-none"
                        rows={2}
                        value={rejectNotes[req.id] || ''}
                        onChange={e => setRejectNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl text-[#dca079]">how_to_reg</span>
              <p className="text-sm font-bold text-[#805030] mt-3">No {filter === 'all' ? '' : filter} requests found.</p>
            </div>
          )}
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperRequests
