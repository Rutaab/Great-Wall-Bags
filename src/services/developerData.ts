import { api, type AuthUser, type VerificationRequestRecord } from './api'
import type { UserRole } from '../contexts/AuthContext'
import type { VerificationRequest } from '../contexts/VerificationContext'

/**
 * A user row as the developer console sees it. Note there is no `password` field:
 * the backend never sends password hashes to any client, and a plaintext password
 * must never be part of this shape - it belongs in signup, not in a user record.
 */
export interface DevUser extends Omit<AuthUser, 'role'> {
  role: UserRole
  createdAt: string
}

// Every function here is a thin wrapper over a backend endpoint. Nothing is stored
// in the browser: users live in the backend's users.json and requests in
// requests.json, so the console shows the same state as every other session.

export async function getAllUsers(): Promise<DevUser[]> {
  const rows = await api.getAdminUsers()
  return rows as DevUser[]
}

/**
 * The only place a role can be changed. Backed by PUT /api/admin/users/:id, which
 * refuses to grant the developer role and refuses to edit the developer account.
 */
export async function updateUser(id: string, updates: Partial<DevUser>): Promise<DevUser> {
  const updated = await api.updateAdminUser(id, updates)
  return { ...updated, createdAt: (updated as DevUser).createdAt } as DevUser
}

export async function deleteUser(id: string): Promise<boolean> {
  await api.deleteAdminUser(id)
  return true
}

export async function getAllRequests(): Promise<VerificationRequest[]> {
  const rows = await api.getDevRequests()
  return rows as VerificationRequest[]
}

/**
 * Records the approval decision only. It does NOT change the user's role - that
 * stays a separate, explicit action at /developer/users, so approving a request
 * can never silently hand out seller/manufacturer/supplier access.
 */
export async function approveRequest(requestId: string): Promise<VerificationRequestRecord | null> {
  return api.patchDevRequest(requestId, { status: 'approved' })
}

/**
 * Approving a role-change request also records the decision only. The new role has
 * to be assigned separately through updateUser() at /developer/users.
 */
export async function approveRoleChange(requestId: string): Promise<VerificationRequestRecord | null> {
  return api.patchDevRequest(requestId, { status: 'approved' })
}

export async function rejectRequest(requestId: string, notes?: string): Promise<VerificationRequestRecord | null> {
  return api.patchDevRequest(requestId, { status: 'rejected', notes })
}

export async function getDevDashboardStats() {
  const [users, requests] = await Promise.all([getAllUsers(), getAllRequests()])
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const nonBuyerCount = users.filter(u => !['buyer', 'developer'].includes(u.role)).length
  const recentRegistrations = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
  return {
    totalUsers: users.length,
    activeSellers: nonBuyerCount,
    pendingVerifications: pendingRequests.length,
    recentRegistrations,
    totalRequests: requests.length,
  }
}