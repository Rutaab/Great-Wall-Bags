import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Route error:', error.message, errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#fff4f0]">
          <div className="text-center px-6">
            <span className="material-symbols-outlined text-5xl text-[#9e3c00] mb-4">error_outline</span>
            <p className="text-[#9e3c00] text-lg font-bold">Something went wrong</p>
            <p className="text-[#805030] text-sm mt-1 mb-4">The page could not be loaded. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#9e3c00] text-white rounded-full text-sm font-semibold hover:bg-[#7a2e00] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
