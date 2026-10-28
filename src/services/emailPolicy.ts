import type { UserRole } from '../contexts/AuthContext'

export const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']

export function isAllowedEmailDomain(email: string): boolean {
  const domain = (email || '').toLowerCase().trim().split('@')[1] || ''
  return ALLOWED_EMAIL_DOMAINS.includes(domain)
}

export interface PendingSignupData {
  name: string
  email: string
  password: string
  role: UserRole
}

const PENDING_SIGNUP_KEY = 'hobags_pending_signup'
const PENDING_SIGNUP_CODE_KEY = 'hobags_pending_email_code'

export function savePendingSignup(data: PendingSignupData, code?: string): void {
  try { sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(data)) } catch {}
  if (code) {
    try { sessionStorage.setItem(PENDING_SIGNUP_CODE_KEY, code) } catch {}
  } else {
    try { sessionStorage.removeItem(PENDING_SIGNUP_CODE_KEY) } catch {}
  }
}

export function getPendingSignup(): PendingSignupData | null {
  try {
    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PendingSignupData
    if (!data || !data.email) return null
    return data
  } catch {
    return null
  }
}

export function getPendingSignupCode(): string | null {
  try { return sessionStorage.getItem(PENDING_SIGNUP_CODE_KEY) } catch { return null }
}

export function clearPendingSignup(): void {
  try {
    sessionStorage.removeItem(PENDING_SIGNUP_KEY)
    sessionStorage.removeItem(PENDING_SIGNUP_CODE_KEY)
  } catch {}
}