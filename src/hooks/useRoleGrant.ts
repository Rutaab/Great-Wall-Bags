import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useVerification, type RequestableRole } from '../contexts/VerificationContext'

const POLL_INTERVAL_MS = 5000

/**
 * Waits for a partner role to actually become active, then navigates to its
 * dashboard.
 *
 * Approval and role assignment are two separate steps: the developer console
 * records the decision on the request, and the role is only written to the
 * account at /developer/users. So "approved" alone is not enough - this watches
 * the account's real role and only proceeds once it matches, otherwise it would
 * send the user to a dashboard they still cannot open.
 */
export function useRoleGrantWatch(role: RequestableRole, destination: string, enabled: boolean) {
  const { user, refreshUser } = useAuth()
  const { getMyRequest, reload } = useVerification()
  const navigate = useNavigate()
  const [granted, setGranted] = useState(false)
  const navigated = useRef(false)

  useEffect(() => {
    if (!enabled || !user) return
    if (user.role === role) {
      setGranted(true)
      return
    }
    const interval = setInterval(() => {
      // Reloading the request alone is not enough: `user` lives in AuthContext and
      // `reload()` never touches it, so a role granted in the developer console
      // would stay invisible here. Ask the server for the account too.
      void reload()
      void refreshUser()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [enabled, user, role, reload, refreshUser])

  useEffect(() => {
    if (!granted || navigated.current) return
    navigated.current = true
    // No refresh needed here: `granted` is only set once `user.role` already
    // matches, i.e. the server has confirmed the role.
    const timer = setTimeout(() => navigate(destination, { replace: true }), 1000)
    return () => clearTimeout(timer)
  }, [granted, navigate, destination])

  const request = getMyRequest()
  return { approved: request?.status === 'approved', granted }
}