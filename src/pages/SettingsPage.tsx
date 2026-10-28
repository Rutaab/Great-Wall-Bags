import React, { useState } from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

type OpenSection = string | null

const SettingsPage: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage()
  const { user, updateUser, changePassword } = useAuth()
  const [open, setOpen] = useState<OpenSection>(null)

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [twoFA, setTwoFA] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true })
  const [currency, setCurrency] = useState('USD')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'United States' })
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [intlPrefs, setIntlPrefs] = useState({ customsValue: '500', exportReason: 'Commercial Sample' })
  const [exportStatus, setExportStatus] = useState<'idle' | 'requested' | 'ready'>('idle')
  const [cookies, setCookies] = useState({ analytics: true, marketing: false, functional: true })
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'done'>('confirm')
  const [saved, setSaved] = useState<string | null>(null)

  const toggle = (id: string) => setOpen(open === id ? null : id)

  const showSaved = (msg: string) => {
    setSaved(msg)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight mb-3">Settings</h1>
          <p className="text-on-surface-variant text-lg">Manage your account preferences and configurations.</p>
        </div>

        {saved && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold text-sm animate-slide-in">
            {saved}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Account Settings */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5 self-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">person</span>
              <h2 className="text-xl font-bold text-on-surface">Account Settings</h2>
            </div>
            <div className="space-y-2">
              {/* Profile Information */}
              <div>
                <div onClick={() => toggle('profile')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Profile Information</p>
                    <p className="text-xs text-on-surface-variant">Name, email, phone number</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'profile' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'profile' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Name</label>
                      <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email</label>
                      <input value={profile.email} disabled className="w-full mt-1 bg-surface-container px-3 py-2 rounded-lg text-sm border border-outline-variant/20 text-on-surface-variant cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Phone</label>
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <button onClick={async () => { await updateUser(profile.name); showSaved('Profile updated') }} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Save Changes</button>
                  </div>
                )}
              </div>

              {/* Password & Security */}
              <div>
                <div onClick={() => toggle('password')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Password & Security</p>
                    <p className="text-xs text-on-surface-variant">Change password, 2FA settings</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'password' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'password' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Current Password</label>
                      <input type="password" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">New Password</label>
                      <input type="password" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Confirm New Password</label>
                      <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setTwoFA(!twoFA)} className={`w-10 h-5 rounded-full relative transition-colors ${twoFA ? 'bg-secondary' : 'bg-outline-variant/30'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFA ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-sm font-medium text-on-surface">Enable Two-Factor Authentication</span>
                    </label>
                    {passwordError && <p className="text-red-600 text-xs font-bold">{passwordError}</p>}
                    <button onClick={async () => {
                      setPasswordError('')
                      if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
                        setPasswordError('All password fields are required')
                        return
                      }
                      if (passwordForm.newPass !== passwordForm.confirm) {
                        setPasswordError('New passwords do not match')
                        return
                      }
                      if (passwordForm.newPass.length < 8) {
                        setPasswordError('New password must be at least 8 characters')
                        return
                      }
                      try {
                        await changePassword(passwordForm.current, passwordForm.newPass)
                        setPasswordForm({ current: '', newPass: '', confirm: '' })
                        showSaved('Password updated')
                      } catch (err: any) {
                        setPasswordError(err.message || 'Failed to update password')
                      }
                    }} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Update Password</button>
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div>
                <div onClick={() => toggle('notifications')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Notification Preferences</p>
                    <p className="text-xs text-on-surface-variant">Email, SMS, push notifications</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'notifications' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'notifications' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    {(['email', 'sms', 'push'] as const).map(type => (
                      <label key={type} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-on-surface capitalize">{type} Notifications</span>
                        <div onClick={() => setNotifications(n => ({ ...n, [type]: !n[type] }))} className={`w-10 h-5 rounded-full relative transition-colors ${notifications[type] ? 'bg-secondary' : 'bg-outline-variant/30'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[type] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </label>
                    ))}
                    <button onClick={() => showSaved('Notification preferences saved')} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Save Preferences</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shopping Preferences */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5 self-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">shopping_bag</span>
              <h2 className="text-xl font-bold text-on-surface">Shopping Preferences</h2>
            </div>
            <div className="space-y-2">

              {/* Default Currency */}
              <div>
                <div onClick={() => toggle('currency')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Default Currency</p>
                    <p className="text-xs text-on-surface-variant">USD, EUR, GBP, JPY, etc.</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'currency' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'currency' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-2 mt-0.5">
                    {['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].map(c => (
                      <label key={c} onClick={() => { setCurrency(c); showSaved(`Currency set to ${c}`) }} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${currency === c ? 'bg-secondary/10 text-secondary' : 'hover:bg-surface-container-low'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currency === c ? 'border-secondary' : 'border-outline-variant/50'}`}>
                          {currency === c && <div className="w-2 h-2 rounded-full bg-secondary" />}
                        </div>
                        <span className="text-sm font-semibold">{c}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Measurement Units */}
              <div>
                <div onClick={() => toggle('units')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Measurement Units</p>
                    <p className="text-xs text-on-surface-variant">Metric or Imperial</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'units' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'units' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-2 mt-0.5">
                    {(['metric', 'imperial'] as const).map(u => (
                      <label key={u} onClick={() => { setUnits(u); showSaved(`Units set to ${u}`) }} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${units === u ? 'bg-secondary/10 text-secondary' : 'hover:bg-surface-container-low'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${units === u ? 'border-secondary' : 'border-outline-variant/50'}`}>
                          {units === u && <div className="w-2 h-2 rounded-full bg-secondary" />}
                        </div>
                        <span className="text-sm font-semibold capitalize">{u}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <div onClick={() => toggle('language')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Language</p>
                    <p className="text-xs text-on-surface-variant">Interface language preference</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'language' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'language' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-1 mt-0.5 max-h-64 overflow-y-auto">
                    {languages.map(l => (
                      <label key={l.code} onClick={() => { setLanguage(l.code); showSaved(`Language set to ${l.nativeName}`) }} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${language === l.code ? 'bg-secondary/10 text-secondary' : 'hover:bg-surface-container-low'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${language === l.code ? 'border-secondary' : 'border-outline-variant/50'}`}>
                          {language === l.code && <div className="w-2 h-2 rounded-full bg-secondary" />}
                        </div>
                        <span className="text-sm">{l.flag}</span>
                        <div>
                          <span className="text-sm font-semibold">{l.name}</span>
                          <span className="text-xs text-on-surface-variant ml-1">({l.nativeName})</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping & Addresses */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5 self-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">local_shipping</span>
              <h2 className="text-xl font-bold text-on-surface">Shipping & Addresses</h2>
            </div>
            <div className="space-y-2">

              {/* Default Shipping Address */}
              <div>
                <div onClick={() => toggle('address')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Default Shipping Address</p>
                    <p className="text-xs text-on-surface-variant">Manage your addresses</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'address' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'address' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Street Address</label>
                      <input value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">City</label>
                        <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">State</label>
                        <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">ZIP Code</label>
                        <input value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Country</label>
                        <input value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                      </div>
                    </div>
                    <button onClick={() => showSaved('Address saved')} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Save Address</button>
                  </div>
                )}
              </div>

              {/* Preferred Shipping Method */}
              <div>
                <div onClick={() => toggle('shippingMethod')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Preferred Shipping Method</p>
                    <p className="text-xs text-on-surface-variant">Standard, Express, Economy</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'shippingMethod' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'shippingMethod' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-2 mt-0.5">
                    {[
                      { id: 'standard', label: 'Standard', desc: '5-8 business days', price: 'Free' },
                      { id: 'express', label: 'Express', desc: '2-3 business days', price: '$12.99' },
                      { id: 'economy', label: 'Economy', desc: '10-15 business days', price: 'Free' }
                    ].map(m => (
                      <label key={m.id} onClick={() => { setShippingMethod(m.id); showSaved(`Shipping method set to ${m.label}`) }} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${shippingMethod === m.id ? 'bg-secondary/10 border border-secondary/20' : 'hover:bg-surface-container-low border border-transparent'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${shippingMethod === m.id ? 'border-secondary' : 'border-outline-variant/50'}`}>
                            {shippingMethod === m.id && <div className="w-2 h-2 rounded-full bg-secondary" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{m.label}</p>
                            <p className="text-xs text-on-surface-variant">{m.desc}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold">{m.price}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* International Preferences */}
              <div>
                <div onClick={() => toggle('intl')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">International Preferences</p>
                    <p className="text-xs text-on-surface-variant">Customs and import defaults</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'intl' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'intl' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Default Customs Value (USD)</label>
                      <input type="number" value={intlPrefs.customsValue} onChange={e => setIntlPrefs(i => ({ ...i, customsValue: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Export Reason</label>
                      <select value={intlPrefs.exportReason} onChange={e => setIntlPrefs(i => ({ ...i, exportReason: e.target.value }))} className="w-full mt-1 bg-surface px-3 py-2 rounded-lg text-sm border border-outline-variant/20 focus:outline-none focus:border-secondary">
                        <option>Commercial Sample</option>
                        <option>Personal Use</option>
                        <option>Gift</option>
                        <option>Merchandise</option>
                        <option>Return</option>
                      </select>
                    </div>
                    <button onClick={() => showSaved('International preferences saved')} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Save Preferences</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/5 self-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">lock</span>
              <h2 className="text-xl font-bold text-on-surface">Privacy & Data</h2>
            </div>
            <div className="space-y-2">

              {/* Data Export */}
              <div>
                <div onClick={() => toggle('export')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Data Export</p>
                    <p className="text-xs text-on-surface-variant">Download your account data</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'export' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'export' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    <p className="text-xs text-on-surface-variant">Request a copy of all data associated with your account, including profile information, order history, and preferences.</p>
                    <div className="flex gap-3">
                      <button onClick={() => { setExportStatus('requested'); showSaved('Export requested. You will be notified when ready.') }} disabled={exportStatus === 'requested'} className={`text-xs font-bold px-4 py-2 rounded-full ${exportStatus === 'requested' ? 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-on-secondary'}`}>
                        {exportStatus === 'requested' ? 'Requested' : 'Request Data Export'}
                      </button>
                      {exportStatus === 'requested' && (
                        <button onClick={() => { setExportStatus('ready'); showSaved('Data export ready for download') }} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full">Simulate Ready</button>
                      )}
                      {exportStatus === 'ready' && (
                        <button onClick={() => { setExportStatus('idle'); showSaved('Download started') }} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Download</button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cookie Preferences */}
              <div>
                <div onClick={() => toggle('cookies')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Cookie Preferences</p>
                    <p className="text-xs text-on-surface-variant">Manage cookie settings</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'cookies' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'cookies' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    {[
                      { key: 'functional' as const, label: 'Functional Cookies', desc: 'Essential for site operation' },
                      { key: 'analytics' as const, label: 'Analytics Cookies', desc: 'Help us improve your experience' },
                      { key: 'marketing' as const, label: 'Marketing Cookies', desc: 'Personalized ads and offers' }
                    ].map(c => (
                      <label key={c.key} className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="text-sm font-medium text-on-surface">{c.label}</span>
                          <p className="text-xs text-on-surface-variant">{c.desc}</p>
                        </div>
                        <div onClick={() => setCookies(ck => ({ ...ck, [c.key]: !ck[c.key] }))} className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${cookies[c.key] ? 'bg-secondary' : 'bg-outline-variant/30'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${cookies[c.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </label>
                    ))}
                    <button onClick={() => showSaved('Cookie preferences saved')} className="bg-secondary text-on-secondary text-xs font-bold px-4 py-2 rounded-full">Save Preferences</button>
                  </div>
                )}
              </div>

              {/* Account Deletion */}
              <div>
                <div onClick={() => toggle('delete')} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                  <div>
                    <p className="font-semibold text-on-surface text-sm">Account Deletion</p>
                    <p className="text-xs text-on-surface-variant">Permanently delete your account</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${open === 'delete' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
                {open === 'delete' && (
                  <div className="p-4 bg-surface-container-lowest rounded-b-lg space-y-3 mt-0.5">
                    {deleteStep === 'confirm' ? (
                      <>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs font-bold text-red-700 mb-1">Warning: This action cannot be undone</p>
                          <p className="text-xs text-red-600">All your data, orders, and preferences will be permanently removed.</p>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={deleteConfirm} onChange={e => setDeleteConfirm(e.target.checked)} className="w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500" />
                          <span className="text-sm text-on-surface">I understand and want to delete my account</span>
                        </label>
                        <button onClick={() => { if (deleteConfirm) { setDeleteStep('done'); showSaved('Account deletion requested') } }} disabled={!deleteConfirm} className={`text-xs font-bold px-4 py-2 rounded-full ${deleteConfirm ? 'bg-red-600 text-white' : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'}`}>Delete My Account</button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <span className="material-symbols-outlined text-4xl text-red-400 mb-2">mail</span>
                        <p className="text-sm font-bold text-on-surface">Deletion Request Submitted</p>
                        <p className="text-xs text-on-surface-variant mt-1">A confirmation email has been sent to your registered email address. Please follow the link to confirm deletion.</p>
                        <button onClick={() => { setDeleteStep('confirm'); setDeleteConfirm(false) }} className="mt-3 text-xs font-bold text-secondary hover:underline">Cancel Request</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes slide-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}

export default SettingsPage
