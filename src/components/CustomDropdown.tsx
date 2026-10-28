import React, { useState, useRef, useEffect } from 'react'

interface CustomDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#ffede4] border-none rounded-full px-5 py-2.5 text-sm font-semibold text-[#4a2507] hover:bg-[#ffdcc7] transition-colors whitespace-nowrap"
      >
        <span>{value}</span>
        <span className={`material-symbols-outlined text-base transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 min-w-[200px] bg-white rounded-xl shadow-xl border border-[#dca079]/10 py-2 z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${
                opt === value
                  ? 'text-[#9e3c00] bg-[#fff4f0] font-bold'
                  : 'text-[#4a2507] hover:bg-[#fff4f0]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
