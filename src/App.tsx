import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { CurrencyProvider, useCurrencyVersion } from './contexts/CurrencyContext'
import { VerificationProvider } from './contexts/VerificationContext'
import { CustomizationProvider } from './contexts/CustomizationContext'
import { ProductProvider } from './contexts/ProductContext'
import ErrorBoundary from './components/ErrorBoundary'

const AppRoutes = React.lazy(() => import('./AppRoutes'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#fff4f0]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[#ffdcc7] border-t-[#9e3c00]" />
      <p className="text-[#805030] text-sm font-medium">Loading...</p>
    </div>
  </div>
)

const AppEntry: React.FC = () => {
  const { loading } = useAuth()
  // Subscribing to the currency store re-renders the whole route tree when the
  // currency or the rates change. Prices are rendered by the module-level
  // formatPrice(), which most components use without importing the context, so
  // this subscription is what keeps every page in sync.
  useCurrencyVersion()
  if (loading) return <PageLoader />
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  )
}

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <Router>
          <CartProvider>
            <WishlistProvider>
            <VerificationProvider>
            <CustomizationProvider>
            <ProductProvider>
            <ErrorBoundary>
              <AppEntry />
            </ErrorBoundary>
            </ProductProvider>
            </CustomizationProvider>
            </VerificationProvider>
            </WishlistProvider>
          </CartProvider>
          </Router>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}

export default App
