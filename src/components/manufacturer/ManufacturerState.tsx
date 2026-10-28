import React from 'react'

export const LoadingState: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-20 text-[#805030]">
    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[#ffdcc7] border-t-[#9e3c00]" />
    <p className="text-sm font-medium mt-3">{label || 'Loading...'}</p>
  </div>
)

export const EmptyState: React.FC<{ icon: string; title: string; hint?: string }> = ({ icon, title, hint }) => (
  <div className="text-center py-16 text-[#805030]">
    <span className="material-symbols-outlined text-4xl mb-3">{icon}</span>
    <p className="font-bold">{title}</p>
    {hint && <p className="text-sm mt-1">{hint}</p>}
  </div>
)