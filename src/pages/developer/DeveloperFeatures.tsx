import React, { useState } from 'react'
import DeveloperLayout from './DeveloperLayout'

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
}

const initialFlags: FeatureFlag[] = [
  { id: 'studio-3d', name: '3D Customization Studio', description: 'Enable the 3D bag customization tool', enabled: true, category: 'Features' },
  { id: 'subscriptions', name: 'Subscription Plans', description: 'Allow users to subscribe to premium plans', enabled: true, category: 'Features' },
  { id: 'market-pulse', name: 'Market Pulse', description: 'Show real-time market analytics dashboard', enabled: true, category: 'Dashboard' },
  { id: 'wholesale', name: 'Wholesale Portal', description: 'Enable B2B wholesale ordering', enabled: true, category: 'Features' },
  { id: 'flash-deals', name: 'Flash Deals', description: 'Enable time-limited flash sale events', enabled: true, category: 'Marketing' },
  { id: 'global-trade', name: 'Global Trade Hub', description: 'Show international trade services', enabled: true, category: 'Features' },
  { id: 'multi-language', name: 'Multi-Language Support', description: 'Enable language selector and translations', enabled: false, category: 'Settings' },
  { id: 'seller-analytics', name: 'Seller Advanced Analytics', description: 'Enhanced analytics for seller dashboards', enabled: false, category: 'Features' },
  { id: 'maintenance-mode', name: 'Maintenance Mode', description: 'Put the site in read-only mode for updates', enabled: false, category: 'System' },
]

const DeveloperFeatures: React.FC = () => {
  const [flags, setFlags] = useState(initialFlags)

  const toggle = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  const categories = [...new Set(flags.map(f => f.category))]

  return (
    <DeveloperLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#4a2507] tracking-tighter">Feature Flags</h1>
            <p className="text-[#805030] text-sm mt-1">Toggle site features on and off</p>
          </div>
          <div className="bg-[#ffede4] px-4 py-2 rounded-full text-sm font-bold text-[#805030]">
            {flags.filter(f => f.enabled).length}/{flags.length} active
          </div>
        </div>

        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#805030] mb-3">{cat}</h2>
              <div className="bg-white rounded-xl shadow-sm border border-[#dca079]/10 divide-y divide-[#ffede4]">
                {flags.filter(f => f.category === cat).map(flag => (
                  <div key={flag.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-bold text-[#4a2507]">{flag.name}</p>
                      <p className="text-xs text-[#805030]">{flag.description}</p>
                    </div>
                    <button
                      onClick={() => toggle(flag.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        flag.enabled ? 'bg-[#004be3]' : 'bg-[#dca079]/30'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        flag.enabled ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DeveloperLayout>
  )
}

export default DeveloperFeatures
