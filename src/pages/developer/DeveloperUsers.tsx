import React, { useState, useEffect, useCallback } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { getAllUsers, updateUser, deleteUser } from '../../services/developerData'
import type { DevUser } from '../../services/developerData'
import type { UserRole } from '../../contexts/AuthContext'

const roleColors: Record<string, string> = {
  buyer: 'bg-[#c6d0ff] text-[#003ab5]',
  seller: 'bg-[#ff7936]/10 text-[#9e3c00]',
  supplier: 'bg-[#004be3]/10 text-[#004be3]',
  manufacturer: 'bg-[#b9002c]/10 text-[#b9002c]',
  developer: 'bg-[#4a2507] text-[#ff7936]',
}

/** Roles that can be assigned here. `developer` is deliberately absent: it is
 *  derived server-side from the reserved developer email and can never be granted. */
const allRoles: UserRole[] = ['buyer', 'seller', 'manufacturer', 'supplier']

/** Filterable roles, including the developer role so those rows stay reachable. */
const filterRoles: UserRole[] = ['buyer', 'seller', 'manufacturer', 'supplier', 'developer']

const DeveloperUsers: React.FC = () => {
  const [users, setUsers] = useState<DevUser[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editingUser, setEditingUser] = useState<DevUser | null>(null)
  const [editForm, setEditForm] = useState<Partial<DevUser>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Users come from the backend's users.json. There is no browser-side copy to
      // fall back to, so a failure here is shown rather than silently papered over.
      const list = await getAllUsers()
      setUsers(list.map(u => ({ ...u, createdAt: u.createdAt || new Date().toISOString() })))
    } catch (err: any) {
      setUsers([])
      setError(err?.message || 'Could not load users from the server')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter && u.role !== roleFilter) return false
    return true
  })

  // This page is the only surface in the app that can change a role. The backend
  // enforces that too: PUT /api/admin/users/:id is developer-only, refuses to grant
  // the developer role, and refuses to touch the developer account.
  const handleEditSave = async () => {
    if (!editingUser || !editForm.name || !editForm.email) return
    setSaveMessage('')
    setError('')
    try {
      await updateUser(editingUser.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      })
      setSaveMessage('User updated successfully')
      setTimeout(() => setSaveMessage(''), 2000)
      await load()
      setEditingUser(null)
      setEditForm({})
    } catch (err: any) {
      setError(err?.message || 'Failed to update user')
    }
  }

  const handleDelete = async (id: string) => {
    setSaveMessage('')
    setError('')
    try {
      await deleteUser(id)
      setSaveMessage('User deleted')
      setTimeout(() => setSaveMessage(''), 2000)
      await load()
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user')
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <DeveloperLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Users</h1>
            <p className="text-[#805030] text-sm mt-1">
              {loading ? 'Loading users...' : `${users.length} total registered users`}
            </p>
          </div>
          {saveMessage && (
            <span className="bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold">{saveMessage}</span>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-[#b9002c]/10 border border-[#b9002c]/20 text-[#b9002c] px-4 py-3 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        <p className="mb-6 text-[#805030] text-xs bg-[#ffede4] border border-[#dca079]/20 rounded-xl px-4 py-3">
          This is the only place a role can be changed. Approving a verification request does not
          grant a role &mdash; approve the request here, then set the role on this page.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-white border border-[#dca079]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white border border-[#dca079]/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]/20"
          >
            <option value="">All Roles</option>
            {filterRoles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <span className="text-xs text-[#805030] font-medium">{filtered.length} shown</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dca079]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#ffede4] bg-[#fff4f0]">
                  <th className="px-4 py-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Name</th>
                  <th className="px-4 py-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Email</th>
                  <th className="px-4 py-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Role</th>
                  <th className="px-4 py-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Joined</th>
                  <th className="px-4 py-3 font-black uppercase text-[10px] text-[#805030] tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffede4]">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-[#fff4f0] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff7936] to-[#9e3c00] flex items-center justify-center text-white text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-[#4a2507]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#805030]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${roleColors[u.role] || ''}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#805030]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.role !== 'developer' && (
                          <>
                            <button
                              onClick={() => { setEditingUser(u); setEditForm({ name: u.name, email: u.email, role: u.role }) }}
                              className="text-[#004be3] text-xs font-bold hover:underline"
                            >
                              Edit
                            </button>
                            {deleteConfirm === u.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(u.id)} className="text-red-600 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded">Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-[#805030] text-[10px] font-bold">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(u.id)} className="text-red-500 text-xs font-bold hover:underline">Delete</button>
                            )}
                          </>
                        )}
                        {u.role === 'developer' && (
                          <span className="text-[10px] text-[#805030] italic">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-[#805030] text-sm">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setEditingUser(null); setEditForm({}) }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-[#dca079]/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-bold text-[#4a2507]">Edit User</h2>
                <button onClick={() => { setEditingUser(null); setEditForm({}) }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ffede4] transition-colors">
                  <span className="material-symbols-outlined text-[#805030]">close</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Name</label>
                  <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Email</label>
                  <input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#805030] uppercase tracking-wider block mb-1">Role</label>
                  <select value={editForm.role || 'buyer'} onChange={e => setEditForm({ ...editForm, role: e.target.value as UserRole })} className="w-full bg-[#fff4f0] border-none rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff7936]">
                    {allRoles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-[#dca079]/10 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => { setEditingUser(null); setEditForm({}) }} className="px-5 py-2 border border-[#dca079]/30 rounded-full text-xs font-bold text-[#805030] hover:bg-[#ffede4] transition-colors">Cancel</button>
                <button onClick={handleEditSave} className="px-5 py-2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white rounded-full text-xs font-bold shadow-lg shadow-[#ff7936]/20 hover:shadow-xl transition-all">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperUsers
