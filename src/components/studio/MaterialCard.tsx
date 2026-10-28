import React from 'react'

interface MaterialCardProps {
  label: string
  description?: string
  selected?: boolean
  onClick?: () => void
  gradient?: string
  pattern?: 'leather' | 'canvas' | 'suede' | 'vegan'
}

const patternStyles: Record<string, string> = {
  leather: 'bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#6B3410]',
  canvas: 'bg-gradient-to-br from-[#C4A882] via-[#D4B896] to-[#B89A72]',
  suede: 'bg-gradient-to-br from-[#C2956B] via-[#D4A87C] to-[#B88355]',
  vegan: 'bg-gradient-to-br from-[#5B8C5A] via-[#7CB87A] to-[#4A7A49]',
}

const MaterialCard: React.FC<MaterialCardProps> = ({ label, description, selected, onClick, gradient, pattern }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
        selected
          ? 'border-[#9e3c00] bg-[#fff4f0] shadow-md'
          : 'border-[#dca079]/20 bg-white hover:border-[#dca079]/40 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg shrink-0 ${pattern ? patternStyles[pattern] : gradient || 'bg-gradient-to-br from-[#8B4513] to-[#6B3410]'}`}
        />
        <div className="min-w-0">
          <p className={`text-sm font-bold ${selected ? 'text-[#9e3c00]' : 'text-[#4a2507]'}`}>{label}</p>
          {description && <p className="text-[10px] text-[#805030] mt-0.5">{description}</p>}
        </div>
        {selected && <span className="material-symbols-outlined text-[#9e3c00] ml-auto">check_circle</span>}
      </div>
    </button>
  )
}

export default MaterialCard
