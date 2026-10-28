import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RouteSuspense from './components/RouteSuspense'
import ErrorBoundary from './components/ErrorBoundary'

const GlobalTradeHub = React.lazy(() => import('./pages/GlobalTradeHub'))
const AccessoriesPage = React.lazy(() => import('./pages/AccessoriesPage'))
const EducationPage = React.lazy(() => import('./pages/EducationPage'))
const SuitcasePage = React.lazy(() => import('./pages/SuitcasePage'))

const FlashDealsHub = React.lazy(() => import('./pages/FlashDealsHub'))
const FlashSalesPage = React.lazy(() => import('./pages/FlashSalesPage'))
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'))
const CartPage = React.lazy(() => import('./pages/CartPage'))
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage'))
const CheckoutShipping = React.lazy(() => import('./pages/CheckoutShipping'))
const CheckoutPayment = React.lazy(() => import('./pages/CheckoutPayment'))
const CheckoutReview = React.lazy(() => import('./pages/CheckoutReview'))
const CheckoutProcessing = React.lazy(() => import('./pages/CheckoutProcessing'))
const CheckoutSuccess = React.lazy(() => import('./pages/CheckoutSuccess'))
const CompanyPage = React.lazy(() => import('./pages/CompanyPage'))
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'))
const CustomerServicePage = React.lazy(() => import('./pages/CustomerServicePage'))
const SupportPage = React.lazy(() => import('./pages/SupportPage'))
const ReturnsPage = React.lazy(() => import('./pages/ReturnsPage'))
const ShippingInfoPage = React.lazy(() => import('./pages/ShippingInfoPage'))
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfUsePage = React.lazy(() => import('./pages/TermsOfUsePage'))
const PaymentMethodsPage = React.lazy(() => import('./pages/PaymentMethodsPage'))
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'))
const SearchPage = React.lazy(() => import('./pages/SearchPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'))
const AccountPage = React.lazy(() => import('./pages/AccountPage'))
const SupplierOnboarding = React.lazy(() => import('./pages/supplier/SupplierOnboarding'))
const SupplierDashboard = React.lazy(() => import('./pages/supplier/SupplierDashboard'))
const SupplierBoutiqueEditor = React.lazy(() => import('./pages/supplier/SupplierBoutiqueEditor'))
const SupplierInventory = React.lazy(() => import('./pages/supplier/SupplierInventory'))
const SupplierOrders = React.lazy(() => import('./pages/supplier/SupplierOrders'))
const SupplierAnalytics = React.lazy(() => import('./pages/supplier/SupplierAnalytics'))
const SupplierPayouts = React.lazy(() => import('./pages/supplier/SupplierPayouts'))
const SupplierAddProduct = React.lazy(() => import('./pages/supplier/SupplierAddProduct'))
const SupplierStorefront = React.lazy(() => import('./pages/supplier/SupplierStorefront'))
const SupplierTrendPulse = React.lazy(() => import('./pages/supplier/SupplierTrendPulse'))
const SupplierWarehouses = React.lazy(() => import('./pages/supplier/SupplierWarehouses'))
const SupplierBulkImport = React.lazy(() => import('./pages/supplier/SupplierBulkImport'))
const SupplierContacts = React.lazy(() => import('./pages/supplier/SupplierContacts'))
const SellerDashboard = React.lazy(() => import('./pages/seller/SellerDashboard'))
const SellerProducts = React.lazy(() => import('./pages/seller/SellerProducts'))
const SellerOrders = React.lazy(() => import('./pages/seller/SellerOrders'))
const SellerAnalytics = React.lazy(() => import('./pages/seller/SellerAnalytics'))
const SellerPayouts = React.lazy(() => import('./pages/seller/SellerPayouts'))
const SellerFlashDeals = React.lazy(() => import('./pages/seller/SellerFlashDeals'))
const SellerCampaigns = React.lazy(() => import('./pages/seller/SellerCampaigns'))
const SellerCustomer360 = React.lazy(() => import('./pages/seller/SellerCustomer360'))
const SellerAddProduct = React.lazy(() => import('./pages/seller/SellerAddProduct'))
const SellerStorefront = React.lazy(() => import('./pages/seller/SellerStorefront'))
const SellerPublicStorefront = React.lazy(() => import('./pages/SellerPublicStorefront'))
const SellerOnboarding = React.lazy(() => import('./pages/seller/SellerOnboarding'))
const ManufacturerAddProduct = React.lazy(() => import('./pages/manufacturer/ManufacturerAddProduct'))
const ManufacturerLandingPage = React.lazy(() => import('./pages/manufacturer/ManufacturerLandingPage'))
const ManufacturerOnboarding = React.lazy(() => import('./pages/manufacturer/ManufacturerOnboarding'))
const PendingApprovalPage = React.lazy(() => import('./pages/PendingApprovalPage'))
const FactoryHubPage = React.lazy(() => import('./pages/manufacturer/FactoryHubPage'))
const LogisticsPage = React.lazy(() => import('./pages/manufacturer/LogisticsPage'))
const ProductionPage = React.lazy(() => import('./pages/manufacturer/ProductionPage'))
const WholesaleOrdersPage = React.lazy(() => import('./pages/manufacturer/WholesaleOrdersPage'))
const QCReportsPage = React.lazy(() => import('./pages/manufacturer/QCReportsPage'))
const ContractsPage = React.lazy(() => import('./pages/manufacturer/ContractsPage'))
const AnalyticsPage = React.lazy(() => import('./pages/manufacturer/AnalyticsPage'))
const InventoryPage = React.lazy(() => import('./pages/manufacturer/InventoryPage'))
const ManufacturerPredictiveMaintenance = React.lazy(() => import('./pages/manufacturer/ManufacturerPredictiveMaintenance'))
const ManufacturerBOMManager = React.lazy(() => import('./pages/manufacturer/ManufacturerBOMManager'))
const ManufacturerScorecards = React.lazy(() => import('./pages/manufacturer/ManufacturerScorecards'))
const ManufacturerContacts = React.lazy(() => import('./pages/manufacturer/ManufacturerContacts'))
const MainCustomizerPage = React.lazy(() => import('./pages/studio/MainCustomizerPage'))
const HardwareMonogrammingPage = React.lazy(() => import('./pages/studio/HardwareMonogrammingPage'))
const MaterialTextureLabPage = React.lazy(() => import('./pages/studio/MaterialTextureLabPage'))
const ExteriorDesignPage = React.lazy(() => import('./pages/studio/ExteriorDesignPage'))
const InternalLayoutPage = React.lazy(() => import('./pages/studio/InternalLayoutPage'))
const DesignSummaryPage = React.lazy(() => import('./pages/studio/DesignSummaryPage'))
const CustomCurationReviewPage = React.lazy(() => import('./pages/custom/CustomCurationReviewPage'))
const ListNewProductPage = React.lazy(() => import('./pages/custom/ListNewProductPage'))
const LumiReAtelierPage = React.lazy(() => import('./pages/custom/LumiReAtelierPage'))
const SubscriptionDashboardPage = React.lazy(() => import('./pages/subscription/SubscriptionDashboardPage'))
const MarketPulsePage = React.lazy(() => import('./pages/MarketPulsePage'))
const WholesalePage = React.lazy(() => import('./pages/WholesalePage'))
const SpecialOccasionsPage = React.lazy(() => import('./pages/SpecialOccasionsPage'))
const ProductDetailStudioPage = React.lazy(() => import('./pages/ProductDetailStudioPage'))
const ProductEditPage = React.lazy(() => import('./pages/product/ProductEditPage'))
const CategoryRoutes = React.lazy(() => import('./CategoryRoutes'))
const RoleSelectPage = React.lazy(() => import('./pages/auth/RoleSelectPage'))
const RoleGatePage = React.lazy(() => import('./pages/auth/RoleGatePage'))
const DeveloperDashboard = React.lazy(() => import('./pages/developer/DeveloperDashboard'))
const DeveloperProducts = React.lazy(() => import('./pages/developer/DeveloperProducts'))
const DeveloperOrders = React.lazy(() => import('./pages/developer/DeveloperOrders'))
const DeveloperUsers = React.lazy(() => import('./pages/developer/DeveloperUsers'))
const DeveloperRequests = React.lazy(() => import('./pages/developer/DeveloperRequests'))
const DeveloperAnalytics = React.lazy(() => import('./pages/developer/DeveloperAnalytics'))
const DeveloperLogs = React.lazy(() => import('./pages/developer/DeveloperLogs'))
const DeveloperFeatures = React.lazy(() => import('./pages/developer/DeveloperFeatures'))
const DeveloperSettings = React.lazy(() => import('./pages/developer/DeveloperSettings'))

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const SignupChoicePage = React.lazy(() => import('./pages/auth/SignupChoicePage'))
const EmailSignupPage = React.lazy(() => import('./pages/auth/EmailSignupPage'))
const PhoneSignupPage = React.lazy(() => import('./pages/auth/PhoneSignupPage'))
const OtpVerificationPage = React.lazy(() => import('./pages/auth/OtpVerificationPage'))
const EmailVerifyPage = React.lazy(() => import('./pages/auth/EmailVerifyPage'))
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'))
const ResetSuccessPage = React.lazy(() => import('./pages/auth/ResetSuccessPage'))
const GoogleCallbackPage = React.lazy(() => import('./pages/auth/GoogleCallbackPage'))

const L = (Component: React.LazyExoticComponent<any>) => (
  <RouteSuspense><Component /></RouteSuspense>
)

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={L(FlashDealsHub)} />
        <Route path="/global-trade" element={L(GlobalTradeHub)} />
        <Route path="/education" element={L(EducationPage)} />
        <Route path="/flash-deals" element={L(FlashSalesPage)} />
        <Route path="/accessories" element={L(AccessoriesPage)} />
        <Route path="/suitcase" element={L(SuitcasePage)} />
        <Route path="/company" element={L(CompanyPage)} />
        <Route path="/about-us" element={L(AboutUsPage)} />
        <Route path="/customer-service" element={L(CustomerServicePage)} />
        <Route path="/support" element={L(SupportPage)} />
        <Route path="/returns" element={L(ReturnsPage)} />
        <Route path="/shipping-info" element={L(ShippingInfoPage)} />
        <Route path="/privacy-policy" element={L(PrivacyPolicyPage)} />
        <Route path="/terms-of-use" element={L(TermsOfUsePage)} />
        <Route path="/payment-methods" element={L(PaymentMethodsPage)} />
        <Route path="/search" element={L(SearchPage)} />
        <Route path="/product/:id" element={L(ProductDetailPage)} />
        <Route path="/contact" element={L(ContactPage)} />
        <Route path="/marketpulse" element={L(MarketPulsePage)} />
        <Route path="/wholesale" element={L(WholesalePage)} />
        <Route path="/special-occasions" element={L(SpecialOccasionsPage)} />
        <Route path="/product/studio/:id" element={L(ProductDetailStudioPage)} />

        <Route path="/login" element={L(LoginPage)} />
        <Route path="/signup" element={L(SignupChoicePage)} />
        <Route path="/signup/email" element={L(EmailSignupPage)} />
        <Route path="/signup/email/verify" element={L(EmailVerifyPage)} />
        <Route path="/signup/phone" element={L(PhoneSignupPage)} />
        <Route path="/verify" element={L(OtpVerificationPage)} />
        <Route path="/forgot-password" element={L(ForgotPasswordPage)} />
        <Route path="/reset-password" element={L(ResetPasswordPage)} />
        <Route path="/reset-success" element={L(ResetSuccessPage)} />
        <Route path="/auth/google/callback" element={L(GoogleCallbackPage)} />

        <Route path="/wishlist" element={<ProtectedRoute>{L(WishlistPage)}</ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute>{L(CartPage)}</ProtectedRoute>} />
        <Route path="/order-history" element={<ProtectedRoute>{L(OrderHistoryPage)}</ProtectedRoute>} />
        <Route path="/checkout/shipping" element={<ProtectedRoute>{L(CheckoutShipping)}</ProtectedRoute>} />
        <Route path="/checkout/payment" element={<ProtectedRoute>{L(CheckoutPayment)}</ProtectedRoute>} />
        <Route path="/checkout/review" element={<ProtectedRoute>{L(CheckoutReview)}</ProtectedRoute>} />
        <Route path="/checkout/processing" element={<ProtectedRoute>{L(CheckoutProcessing)}</ProtectedRoute>} />
        <Route path="/checkout/success" element={<ProtectedRoute>{L(CheckoutSuccess)}</ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute>{L(AccountPage)}</ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute>{L(SettingsPage)}</ProtectedRoute>} />
        <Route path="/product/:id/edit" element={<ProtectedRoute>{L(ProductEditPage)}</ProtectedRoute>} />
        <Route path="/pending-approval" element={<ProtectedRoute>{L(PendingApprovalPage)}</ProtectedRoute>} />
        <Route path="/role-select" element={<ProtectedRoute>{L(RoleSelectPage)}</ProtectedRoute>} />
        <Route path="/role-gate/:role" element={<ProtectedRoute>{L(RoleGatePage)}</ProtectedRoute>} />

        <Route path="/supplier/onboarding" element={<ProtectedRoute>{L(SupplierOnboarding)}</ProtectedRoute>} />
        <Route path="/supplier/dashboard" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierDashboard)}</ProtectedRoute>} />
        <Route path="/supplier/boutique-editor" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierBoutiqueEditor)}</ProtectedRoute>} />
        <Route path="/supplier/inventory" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierInventory)}</ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierOrders)}</ProtectedRoute>} />
        <Route path="/supplier/analytics" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierAnalytics)}</ProtectedRoute>} />
        <Route path="/supplier/payouts" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierPayouts)}</ProtectedRoute>} />
        <Route path="/supplier/add-product" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierAddProduct)}</ProtectedRoute>} />
        <Route path="/supplier/storefront" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierStorefront)}</ProtectedRoute>} />
        <Route path="/supplier/trend-pulse" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierTrendPulse)}</ProtectedRoute>} />
        <Route path="/supplier/warehouses" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierWarehouses)}</ProtectedRoute>} />
        <Route path="/supplier/bulk-import" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierBulkImport)}</ProtectedRoute>} />
        <Route path="/supplier/contact" element={<ProtectedRoute requiredRole={['supplier']}>{L(SupplierContacts)}</ProtectedRoute>} />

        <Route path="/seller/onboarding" element={<ProtectedRoute>{L(SellerOnboarding)}</ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerDashboard)}</ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerProducts)}</ProtectedRoute>} />
        <Route path="/seller/add-product" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerAddProduct)}</ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerOrders)}</ProtectedRoute>} />
        <Route path="/seller/analytics" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerAnalytics)}</ProtectedRoute>} />
        <Route path="/seller/payouts" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerPayouts)}</ProtectedRoute>} />
        <Route path="/seller/storefront" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerStorefront)}</ProtectedRoute>} />
        <Route path="/seller/flash-deals" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerFlashDeals)}</ProtectedRoute>} />
        <Route path="/seller/campaigns" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerCampaigns)}</ProtectedRoute>} />
        <Route path="/seller/contact" element={<ProtectedRoute requiredRole={['seller']}>{L(SellerCustomer360)}</ProtectedRoute>} />
        <Route path="/store/:sellerId" element={L(SellerPublicStorefront)} />

        <Route path="/manufacturer" element={<ProtectedRoute>{L(ManufacturerLandingPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/onboarding" element={<ProtectedRoute>{L(ManufacturerOnboarding)}</ProtectedRoute>} />
        <Route path="/manufacturer/factory-hub" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(FactoryHubPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/logistics" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(LogisticsPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/production" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ProductionPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/wholesale-orders" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(WholesaleOrdersPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/qc-reports" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(QCReportsPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/contracts" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ContractsPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/analytics" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(AnalyticsPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/inventory" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(InventoryPage)}</ProtectedRoute>} />
        <Route path="/manufacturer/predictive-maintenance" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ManufacturerPredictiveMaintenance)}</ProtectedRoute>} />
        <Route path="/manufacturer/bom-manager" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ManufacturerBOMManager)}</ProtectedRoute>} />
        <Route path="/manufacturer/scorecards" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ManufacturerScorecards)}</ProtectedRoute>} />
        <Route path="/manufacturer/add-product" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ManufacturerAddProduct)}</ProtectedRoute>} />
        <Route path="/manufacturer/contact" element={<ProtectedRoute requiredRole={['manufacturer']}>{L(ManufacturerContacts)}</ProtectedRoute>} />

        <Route path="/customizer" element={<ProtectedRoute>{L(MainCustomizerPage)}</ProtectedRoute>} />
        <Route path="/studio/hardware" element={<ProtectedRoute>{L(HardwareMonogrammingPage)}</ProtectedRoute>} />
        <Route path="/studio/materials" element={<ProtectedRoute>{L(MaterialTextureLabPage)}</ProtectedRoute>} />
        <Route path="/studio/exterior" element={<ProtectedRoute>{L(ExteriorDesignPage)}</ProtectedRoute>} />
        <Route path="/studio/interior" element={<ProtectedRoute>{L(InternalLayoutPage)}</ProtectedRoute>} />
        <Route path="/studio/summary" element={<ProtectedRoute>{L(DesignSummaryPage)}</ProtectedRoute>} />
        <Route path="/custom/review" element={<ProtectedRoute>{L(CustomCurationReviewPage)}</ProtectedRoute>} />
        <Route path="/custom/create" element={<ProtectedRoute>{L(ListNewProductPage)}</ProtectedRoute>} />
        <Route path="/custom/atelier" element={<ProtectedRoute>{L(LumiReAtelierPage)}</ProtectedRoute>} />

        <Route path="/subscription/dashboard" element={<ProtectedRoute>{L(SubscriptionDashboardPage)}</ProtectedRoute>} />

        <Route path="/developer" element={<ProtectedRoute developerOnly>{L(DeveloperDashboard)}</ProtectedRoute>} />
        <Route path="/developer/products" element={<ProtectedRoute developerOnly>{L(DeveloperProducts)}</ProtectedRoute>} />
        <Route path="/developer/orders" element={<ProtectedRoute developerOnly>{L(DeveloperOrders)}</ProtectedRoute>} />
        <Route path="/developer/users" element={<ProtectedRoute developerOnly>{L(DeveloperUsers)}</ProtectedRoute>} />
        <Route path="/developer/requests" element={<ProtectedRoute developerOnly>{L(DeveloperRequests)}</ProtectedRoute>} />
        <Route path="/developer/analytics" element={<ProtectedRoute developerOnly>{L(DeveloperAnalytics)}</ProtectedRoute>} />
        <Route path="/developer/logs" element={<ProtectedRoute developerOnly>{L(DeveloperLogs)}</ProtectedRoute>} />
        <Route path="/developer/features" element={<ProtectedRoute developerOnly>{L(DeveloperFeatures)}</ProtectedRoute>} />
        <Route path="/developer/settings" element={<ProtectedRoute developerOnly>{L(DeveloperSettings)}</ProtectedRoute>} />

        <Route
          path="/*"
          element={
            <RouteSuspense name="Category">
              <CategoryRoutes />
            </RouteSuspense>
          }
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default AppRoutes
