import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setToken, getToken, type AuthUser } from '../services/api'

/**
 * Every role the platform knows about. `developer` is never assignable - it is
 * derived server-side from the reserved developer email and cannot be granted
 * through any endpoint, including the developer console.
 */
export type UserRole = 'buyer' | 'seller' | 'manufacturer' | 'supplier' | 'developer'

/** Roles a user may request. `buyer` is the default and needs no approval. */
export const REQUESTABLE_ROLES: UserRole[] = ['seller', 'manufacturer', 'supplier']

export function isRequestableRole(role: string): role is Exclude<UserRole, 'buyer' | 'developer'> {
  return (REQUESTABLE_ROLES as string[]).includes(role)
}

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

interface AuthContextType {
  user: AuthUser | null
  isLoggedIn: boolean
  loading: boolean
  /** Failed sign-ins in this browser, so the form can warn before a hard lockout. */
  loginAttempts: number
  /** Timestamp the backend will accept sign-in attempts again; 0 when allowed. */
  lockoutTime: number
  login: (email: string, password: string) => Promise<void>
  loginWithGoogleCode: (code: string, codeVerifier: string, redirectUri: string) => Promise<void>
  signupWithCode: (name: string, email: string, password: string, role: string, code: string) => Promise<void>
  verifyOtp: (phone: string, code: string, name?: string) => Promise<void>
  forgotPassword: (identifier: string) => Promise<{ message: string; reset_token?: string }>
  resetPassword: (token: string, password: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateUser: (name: string) => Promise<void>
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(0)

  // The single place a session is dropped. Everything else routes through here so
  // the UI can never keep showing a signed-in shell after the backend has
  // rejected the token.
  const clearSession = useCallback(() => {
    setToken(null)
    setUserState(null)
  }, [])

  const adopt = useCallback((res: { token: string; user: AuthUser }) => {
    setToken(res.token)
    setUserState(res.user)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUserState(null)
      return
    }
    try {
      // Always ask the server who this is. Never trust a cached role: a role can be
      // revoked in the developer console while this tab is open, and a stale copy
      // would keep showing privileges the account no longer has.
      setUserState(await api.me())
    } catch {
      clearSession()
    }
  }, [clearSession])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!getToken()) {
        if (!cancelled) setLoading(false)
        return
      }
      try {
        const me = await api.me()
        if (!cancelled) setUserState(me)
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clearSession])

  // api.ts raises this when the backend answers 401 for a token we presented.
  useEffect(() => {
    const onUnauthorized = () => clearSession()
    window.addEventListener('hobags_auth_401', onUnauthorized)
    return () => window.removeEventListener('hobags_auth_401', onUnauthorized)
  }, [clearSession])

  // Sign out when another tab does, so a revoked session does not linger in a
  // background tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'hobags_token' && !e.newValue) clearSession()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [clearSession])

  const login = useCallback(
    async (email: string, password: string) => {
      if (lockoutTime > Date.now()) {
        throw new Error('Too many failed attempts. Please wait before trying again.')
      }
      setLoading(true)
      try {
        adopt(await api.login(email, password))
        setLoginAttempts(0)
        setLockoutTime(0)
      } catch (err: any) {
        // The backend is the authority on when the account is locked. Its 429 is
        // what actually blocks sign-in; this just keeps the form in sync so the
        // user is not left guessing why nothing happens.
        if (err?.status === 429) {
          setLockoutTime(Date.now() + (err.retryAfter || 900) * 1000)
        } else if (err?.status === 401) {
          const attempts = loginAttempts + 1
          setLoginAttempts(attempts)
          if (attempts >= MAX_LOGIN_ATTEMPTS) {
            setLockoutTime(Date.now() + LOCKOUT_MS)
          }
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [adopt, lockoutTime, loginAttempts]
  )

  const loginWithGoogleCode = useCallback(
    async (code: string, codeVerifier: string, redirectUri: string) => {
      // The server exchanges the code for the Google identity, then creates or
      // signs in the account in users.json. The client never sees, supplies, or
      // decides the role.
      adopt(await api.googleCallback({ code, code_verifier: codeVerifier, redirect_uri: redirectUri }))
    },
    [adopt]
  )

  const signupWithCode = useCallback(
    async (name: string, email: string, password: string, _role: string, code: string) => {
      // `_role` is deliberately ignored: the backend always creates buyers and
      // rejects any client-supplied role. Getting a seller/manufacturer/supplier
      // account requires submitting a request and being granted one at
      // /developer/users.
      adopt(await api.emailRegister({ name, email, password, code }))
    },
    [adopt]
  )

  const verifyOtp = useCallback(
    async (phone: string, code: string, name?: string) => {
      adopt(await api.verifyOtp(phone, code, name))
    },
    [adopt]
  )

  const forgotPassword = useCallback(
    async (identifier: string) => api.forgotPassword(identifier),
    []
  )

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      await api.resetPassword(token, password)
      clearSession()
    },
    [clearSession]
  )

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await api.changePassword(currentPassword, newPassword)
  }, [])

  const updateUser = useCallback(async (name: string) => {
    // Only the display name is updatable here. Email and role are deliberately not
    // part of this: changing the email would be a re-verification problem, and the
    // role is owned by the developer console.
    setUserState(await api.updateProfile(name))
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: !!user,
      loading,
      loginAttempts,
      lockoutTime,
      login,
      loginWithGoogleCode,
      signupWithCode,
      verifyOtp,
      forgotPassword,
      resetPassword,
      changePassword,
      updateUser,
      refreshUser,
      logout: clearSession,
    }),
    [
      user,
      loading,
      loginAttempts,
      lockoutTime,
      login,
      loginWithGoogleCode,
      signupWithCode,
      verifyOtp,
      forgotPassword,
      resetPassword,
      changePassword,
      updateUser,
      refreshUser,
      clearSession,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}