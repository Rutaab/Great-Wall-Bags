import React, { useState, useEffect } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { getAllUsers, getAllRequests } from '../../services/developerData'

type LogEntry = {
  id: string
  type: 'user' | 'request' | 'system'
  action: string
  detail: string
  timestamp: string
  icon: string
  color: string
}

const DeveloperLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<'all' | 'user' | 'request' | 'system'>('all')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [users, requests] = await Promise.all([getAllUsers(), getAllRequests()])
        if (cancelled) return
        const entries: LogEntry[] = []

        users.forEach(u => {
          entries.push({
            id: `u-${u.id}`,
            type: 'user',
            action: 'User Registered',
            detail: `${u.name} (${u.email}) as ${u.role}`,
            timestamp: u.createdAt,
            icon: 'person_add',
            color: 'bg-[#004be3]',
          })
        })

        requests.forEach(r => {
          entries.push({
            id: `r-${r.id}`,
            type: 'request',
            action: `Request ${r.status}`,
            detail: `${r.userName} requested ${r.role}${r.notes ? ` — ${r.notes}` : ''}`,
            timestamp: r.reviewedAt || r.submittedAt,
            icon: r.status === 'approved' ? 'check_circle' : r.status === 'rejected' ? 'cancel' : 'hourglass_empty',
            color: r.status === 'approved' ? 'bg-green-600' : r.status === 'rejected' ? 'bg-[#b9002c]' : 'bg-[#ff7936]',
          })
        })

    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        setLogs(entries)
      } catch {
        if (!cancelled) setLogs([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.type === filter)

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">System Logs</h1>
            <p className="text-[#805030] text-sm mt-1">{logs.length} total events recorded</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#ffede4] rounded-xl p-1 mb-6">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'user' as const, label: 'Users' },
            { key: 'request' as const, label: 'Requests' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === tab.key ? 'bg-white text-[#9e3c00] shadow-sm' : 'text-[#805030] hover:text-[#4a2507]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dca079]/10">
          {filtered.map(entry => (
            <div key={entry.id} className="flex items-start gap-4 p-4 border-b border-[#ffede4] last:border-b-0 hover:bg-[#fff4f0] transition-colors">
              <div className={`w-9 h-9 rounded-lg ${entry.color} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className="material-symbols-outlined text-white text-sm">{entry.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-[#4a2507]">{entry.action}</span>
                  <span className="text-[10px] text-[#805030]">{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-xs text-[#805030]">{entry.detail}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-3xl text-[#dca079]">terminal</span>
              <p className="text-sm text-[#805030] mt-2">No logs found.</p>
            </div>
          )}
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperLogs
