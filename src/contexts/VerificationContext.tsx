import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useAuth, type UserRole } from './AuthContext'
import { api } from '../services/api'

export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type RequestableRole = Exclude<UserRole, 'buyer' | 'developer'>

export interface ApplicationData {
  brandName?: string
  brandStory?: string
  taxId?: string
  warehouseLocation?: string
  shippingCapabilities?: string[]
  storeName?: string
  tagline?: string
  productCategory?: string
  sellerFullName?: string
  bankAccount?: string
  routingNumber?: string
  companyName?: string
  factoryLocation?: string
  productionCapacity?: number
  yearsInBusiness?: number
  certifications?: string[]
  businessType?: string
  registrationNumber?: string
  registeredAddress?: string
  ownerName?: string
  ownerContact?: string
  businessLicense?: string
}

export interface VerificationRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: RequestableRole
  status: VerificationStatus
  submittedAt: string
  reviewedAt?: string | null
  notes?: string | null
  type?: 'onboarding' | 'role_change'
  requestedRole?: UserRole
  applicationData?: ApplicationData
}

interface VerificationContextType {
  requests: VerificationRequest[]
  submitRequest: (role: RequestableRole, applicationData?: ApplicationData) => Promise<boolean>
  submitRoleChangeRequest: (newRole: RequestableRole) => Promise<boolean>
  approveRequest: (requestId: string) => Promise<void>
  rejectRequest: (requestId: string, notes?: string) => Promise<void>
  getMyRequest: () => VerificationRequest | undefined
  getMyRoleChangeRequest: () => VerificationRequest | undefined
  getPendingRequests: () => VerificationRequest[]
  getRoleChangeRequests: () => VerificationRequest[]
  isVerified: () => boolean
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined)

export const useVerification = () => {
  const ctx = useContext(VerificationContext)
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider')
  return ctx
}

export const VerificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!user) {
      setRequests([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Requests live in the backend's requests.json, so a status submitted here is
      // the same record the developer console reviews - not a per-browser copy.
      const rows = await api.getMyVerificationRequests()
      setRequests(rows as VerificationRequest[])
    } catch (err: any) {
      setError(err?.message || 'Could not load your requests')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void reload()
  }, [reload])

  const submitRequest = useCallback(
    async (role: RequestableRole, applicationData?: ApplicationData) => {
      if (!user || user.role === 'developer') return false
      setError(null)
      try {
        await api.submitVerificationRequest({
          id: `vr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role,
          type: 'onboarding',
          applicationData,
        })
        await reload()
        return true
      } catch (err: any) {
        setError(err?.message || 'Could not submit your request')
        return false
      }
    },
    [user, reload]
  )

  const submitRoleChangeRequest = useCallback(
    async (newRole: RequestableRole) => {
      if (!user || user.role === 'developer') return false
      setError(null)
      try {
        // Only asks for the new role. The backend keeps the current role on the
        // account until a developer explicitly sets it at /developer/users.
        await api.submitVerificationRequest({
          id: `vr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: user.role as RequestableRole,
          type: 'role_change',
          requestedRole: newRole,
        })
        await reload()
        return true
      } catch (err: any) {
        setError(err?.message || 'Could not submit your request')
        return false
      }
    },
    [user, reload]
  )

  // Approving records the decision only. It deliberately does not touch the user's
  // role: roles are assigned separately at /developer/users, so approving never
  // grants access on its own.
  const approveRequest = useCallback(
    async (requestId: string) => {
      setError(null)
      try {
        const updated = await api.patchDevRequest(requestId, { status: 'approved' })
        setRequests(prev => prev.map(r => (r.id === requestId ? ({ ...r, ...updated } as VerificationRequest) : r)))
      } catch (err: any) {
        setError(err?.message || 'Could not approve the request')
        throw err
      }
    },
    []
  )

  const rejectRequest = useCallback(
    async (requestId: string, notes?: string) => {
      setError(null)
      try {
        const updated = await api.patchDevRequest(requestId, { status: 'rejected', notes })
        setRequests(prev => prev.map(r => (r.id === requestId ? ({ ...r, ...updated } as VerificationRequest) : r)))
      } catch (err: any) {
        setError(err?.message || 'Could not reject the request')
        throw err
      }
    },
    []
  )

  const getMyRequest = useCallback(() => {
    if (!user) return undefined
    return requests.find(r => r.userId === user.id && (!r.type || r.type === 'onboarding'))
  }, [user, requests])

  const getMyRoleChangeRequest = useCallback(() => {
    if (!user) return undefined
    return requests.find(r => r.userId === user.id && r.type === 'role_change')
  }, [user, requests])

  const getPendingRequests = useCallback(
    () => requests.filter(r => r.status === 'pending' && (!r.type || r.type === 'onboarding')),
    [requests]
  )

  const getRoleChangeRequests = useCallback(
    () => requests.filter(r => r.type === 'role_change' && r.status === 'pending'),
    [requests]
  )

  const isVerified = useCallback(() => {
    if (!user) return false
    return getMyRequest()?.status === 'approved'
  }, [user, getMyRequest])

  return (
    <VerificationContext.Provider
      value={{
        requests,
        submitRequest,
        submitRoleChangeRequest,
        approveRequest,
        rejectRequest,
        getMyRequest,
        getMyRoleChangeRequest,
        getPendingRequests,
        getRoleChangeRequests,
        isVerified,
        loading,
        error,
        reload,
      }}
    >
      {children}
    </VerificationContext.Provider>
  )
}