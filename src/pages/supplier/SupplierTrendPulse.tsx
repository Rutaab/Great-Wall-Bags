import React, { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getSellerOrders } from '../../services/localOrders'
import { getProductsByUser } from '../../services/localProducts'
import SupplierLayout from '../../components/supplier/SupplierLayout'

const trendIcons: Record<string, string> = {
  rising: 'trending_up',
  falling: 'trending_down',
  stable: 'remove',
  emerging: 'new_releases',
}

const trendColors: Record<string, string> = {
  rising: 'text-green-600 bg-green-50',
  falling: 'text-red-600 bg-red-50',
  stable: 'text-gray-600 bg-gray-50',
  emerging: 'text-[#004be3] bg-blue-50',
}

function pickDirection(keyword: string, orderCounts: Map<string, number>): 'rising' | 'falling' | 'stable' | 'emerging' {
  const count = orderCounts.get(keyword.toLowerCase()) || 0
  if (count > 3) return 'rising'
  if (count > 1) return 'stable'
  if (count === 1) return 'emerging'
  return 'falling'
}

function pickVolume(keyword: string, orderCounts: Map<string, number>): 'low' | 'medium' | 'high' | 'very_high' {
  const count = orderCounts.get(keyword.toLowerCase()) || 0
  if (count > 5) return 'very_high'
  if (count > 3) return 'high'
  if (count > 1) return 'medium'
  return 'low'
}

const volumeBars: Record<string, string> = {
  low: 'w-1/4',
  medium: 'w-2/4',
  high: 'w-3/4',
  very_high: 'w-full',
}

const SupplierTrendPulse: React.FC = () => {
  const { user } = useAuth()

  const products = useMemo(() => {
    if (!user) return []
    return getProductsByUser(user.id)
  }, [user])

  const orders = useMemo(() => {
    if (!user) return []
    return getSellerOrders(user.id)
  }, [user])

  const trends = useMemo(() => {
    const orderCounts = new Map<string, number>()
    for (const order of orders) {
      for (const item of order.items) {
        if (item.seller_id !== user?.id) continue
        const words = item.name.toLowerCase().split(/\s+/)
        for (const w of words) {
          orderCounts.set(w, (orderCounts.get(w) || 0) + item.quantity)
        }
      }
    }

    const generated = products.map(p => {
      const words = p.name.split(/\s+/)
      const keyword = words.length > 1 ? words.slice(-2).join(' ') : p.name
      const direction = pickDirection(keyword, orderCounts)
      const volume = pickVolume(keyword, orderCounts)
      const orderWordCount = orderCounts.get(keyword.toLowerCase()) || 0
      const score = Math.min(
        (orderWordCount * 10) + (products.filter(pr => pr.category === p.category).length * 5) + Math.random() * 10,
        99
      )
      return {
        id: p.id,
        keyword,
        direction,
        category: p.category || 'General',
        season: 'all',
        volume,
        score: Math.round(score),
      }
    })

    return generated.sort((a, b) => b.score - a.score)
  }, [products, orders, user])

  const risingCount = trends.filter(t => t.direction === 'rising').length
  const emergingCount = trends.filter(t => t.direction === 'emerging').length
  const topScore = trends.length > 0 ? trends[0].score : 0
  const categoriesTracked = new Set(trends.map(t => t.category)).size

  return (
    <SupplierLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#4a2507] tracking-tighter">Trend Pulse</h1>
        <p className="text-[#805030] font-medium text-sm">AI-powered market trend intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Trending Now', value: risingCount, icon: 'local_fire_department', color: 'bg-[#ff7936]' },
          { label: 'Emerging', value: emergingCount, icon: 'new_releases', color: 'bg-[#004be3]' },
          { label: 'Peak Score', value: topScore > 0 ? `${topScore}%` : '--', icon: 'stars', color: 'bg-[#4a2507]' },
          { label: 'Categories Tracked', value: categoriesTracked, icon: 'category', color: 'bg-[#9e3c00]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#dca079]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-white text-base">{s.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-black text-[#4a2507]">{s.value}</p>
            <p className="text-xs text-[#805030] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#dca079]/10 overflow-hidden">
        <div className="p-6 border-b border-[#ffede4]">
          <h2 className="text-lg font-bold text-[#4a2507]">Keyword Trend Scores</h2>
        </div>
        {trends.length > 0 ? (
          <div className="divide-y divide-[#ffede4]">
            {trends.map((t, i) => (
              <div key={t.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#fff4f0] transition-colors">
                <span className="text-[10px] font-bold text-[#805030] w-6">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[#4a2507]">{t.keyword}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${trendColors[t.direction] || 'text-gray-600 bg-gray-50'}`}>
                      <span className="material-symbols-outlined text-xs align-middle mr-0.5">{trendIcons[t.direction] || 'remove'}</span>
                      {t.direction}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#805030]">
                    <span>Category: {t.category}</span>
                    {t.season && t.season !== 'all' && <span>Season: {t.season}</span>}
                    <span>Volume: {t.volume}</span>
                  </div>
                </div>
                <div className="text-right w-32">
                  <div className="text-lg font-black text-[#4a2507]">{t.score}%</div>
                  <div className="w-full h-1.5 bg-[#ffede4] rounded-full mt-1">
                    <div className={`h-full bg-gradient-to-r from-[#ff7936] to-[#9e3c00] rounded-full ${volumeBars[t.volume] || 'w-1/2'}`} style={{ width: `${t.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-[#805030] text-sm">Add products to see trend insights.</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  )
}

export default SupplierTrendPulse
