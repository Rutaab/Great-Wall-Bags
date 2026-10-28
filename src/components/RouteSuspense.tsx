import React, { Suspense } from 'react'

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#fff4f0]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[#ffdcc7] border-t-[#9e3c00]" />
      <p className="text-[#805030] text-sm font-medium">Loading...</p>
    </div>
  </div>
)

interface RouteSuspenseProps {
  children: React.ReactNode
  name?: string
}

const RouteSuspense: React.FC<RouteSuspenseProps> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
)

export default RouteSuspense
