import React from 'react'

interface ConfigSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-xs font-bold text-[#805030] uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default ConfigSection
