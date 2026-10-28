import React from 'react'

interface ColorSwatchProps {
  color: string
  label: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label, selected, onClick, size = 'md' }) => {
  const sizeMap = { sm: 'w-7 h-7', md: 'w-9 h-9', lg: 'w-12 h-12' }
  const ringMap = { sm: 'ring-2', md: 'ring-2', lg: 'ring-3' }

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 shrink-0 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      title={label}
    >
      <div
        className={`${sizeMap[size]} rounded-full ${ringMap[size]} transition-all ${
          selected
            ? 'ring-[#9e3c00] ring-offset-2 scale-110'
            : 'ring-transparent hover:scale-105'
        }`}
        style={{ backgroundColor: color }}
      />
      <span className={`text-[10px] font-medium text-[#805030] text-center leading-tight max-w-16 ${selected ? 'text-[#9e3c00]' : ''}`}>
        {label}
      </span>
    </button>
  )
}

export default ColorSwatch
