import React, { useState, useEffect } from 'react'
import DeveloperLayout from './DeveloperLayout'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'hobags_site_settings'

interface SiteSettings {
  siteName: string
  supportEmail: string
  currency: string
  taxRate: string
  minOrder: string
}

const defaultSettings: SiteSettings = {
  siteName: 'Great Wall Bags',
  supportEmail: 'support@greatwallbags.com',
  currency: 'USD',
  taxRate: '8.5',
  minOrder: '0',
}

const loadSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {}
  return defaultSettings
}

const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

const DeveloperSettings: React.FC = () => {
  const navigate = useNavigate()
  const [siteName, setSiteName] = useState(defaultSettings.siteName)
  const [supportEmail, setSupportEmail] = useState(defaultSettings.supportEmail)
  const [currency, setCurrency] = useState(defaultSettings.currency)
  const [taxRate, setTaxRate] = useState(defaultSettings.taxRate)
  const [minOrder, setMinOrder] = useState(defaultSettings.minOrder)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmCache, setConfirmCache] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  useEffect(() => {
    const s = loadSettings()
    setSiteName(s.siteName)
    setSupportEmail(s.supportEmail)
    setCurrency(s.currency)
    setTaxRate(s.taxRate)
    setMinOrder(s.minOrder)
  }, [])

  const handleSave = () => {
    saveSettings({ siteName, supportEmail, currency, taxRate, minOrder })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearCache = () => {
    const keys = ['hobags_verification_requests', 'hobags_local_session', 'hobags_reset_tokens', 'hobags_cart']
    keys.forEach(k => {
      try { localStorage.removeItem(k) } catch {}
    })
    setCacheCleared(true)
    setConfirmCache(false)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  const handleResetData = () => {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('hobags_')) keysToRemove.push(key)
    }
    keysToRemove.forEach(k => {
      try { localStorage.removeItem(k) } catch {}
    })
    setResetDone(true)
    setConfirmReset(false)
    setTimeout(() => {
      setResetDone(false)
      navigate('/')
    }, 2000)
  }

  return (
    <DeveloperLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Site Settings</h1>
            <p className="text-[#805030] text-sm mt-1">Configure global site parameters</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:shadow-[#ff7936]/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">{saved ? 'check' : 'save'}</span>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {cacheCleared && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
            Cache cleared successfully
          </div>
        )}

        {resetDone && (
          <div className="mb-4 bg-[#b9002c]/10 border border-[#b9002c]/20 text-[#b9002c] px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">refresh</span>
            Site data reset. Redirecting...
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-bold text-[#4a2507] mb-4">General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#805030] mb-1.5">Site Name</label>
                <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full bg-[#ffede4] border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#805030] mb-1.5">Support Email</label>
                <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full bg-[#ffede4] border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]/20 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-bold text-[#4a2507] mb-4">Commerce</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#805030] mb-1.5">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-[#ffede4] border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]/20 transition-all">
                  {['USD', 'EUR', 'GBP', 'CNY', 'AED'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#805030] mb-1.5">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full bg-[#ffede4] border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#805030] mb-1.5">Min Order ($)</label>
                <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full bg-[#ffede4] border-none rounded-lg px-4 py-3 text-[#4a2507] focus:ring-2 focus:ring-[#004be3]/20 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#dca079]/10">
            <h2 className="text-lg font-bold text-[#4a2507] mb-4">Danger Zone</h2>
            <p className="text-sm text-[#805030] mb-4">These actions are destructive and irreversible.</p>
            <div className="flex flex-wrap gap-3">
              {confirmCache ? (
                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                  <span className="text-xs font-bold text-[#b9002c]">Clear verification caches?</span>
                  <button onClick={handleClearCache} className="bg-[#b9002c] text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-[#b9002c]/80">Confirm</button>
                  <button onClick={() => setConfirmCache(false)} className="text-[#805030] text-[10px] font-bold hover:text-[#4a2507]">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmCache(true)} className="border border-[#b9002c]/30 text-[#b9002c] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#b9002c]/5 transition-colors">Clear Verification Caches</button>
              )}
              {confirmReset ? (
                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
                  <span className="text-xs font-bold text-[#b9002c]">This will log everyone out!</span>
                  <button onClick={handleResetData} className="bg-[#b9002c] text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-[#b9002c]/80">Confirm</button>
                  <button onClick={() => setConfirmReset(false)} className="text-[#805030] text-[10px] font-bold hover:text-[#4a2507]">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmReset(true)} className="bg-[#b9002c] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#b9002c]/80 transition-colors">Reset Site Data</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperSettings