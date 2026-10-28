import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const PaymentMethodsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Payment Methods
            </h1>
            <p className="text-on-surface-variant text-lg">
              Secure and convenient payment options for your Great Wall Bags purchases.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Accepted Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Credit/Debit Cards</h3>
                <div className="space-y-3">
                  <p className="text-on-surface-variant">Visa</p>
                  <p className="text-on-surface-variant">Mastercard</p>
                  <p className="text-on-surface-variant">American Express</p>
                  <p className="text-on-surface-variant">Discover</p>
                </div>
                <p className="text-on-surface-variant text-sm mt-2">
                  All major credit and debit cards are accepted with secure 3D verification.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Digital Wallets</h3>
                <div className="space-y-3">
                  <p className="text-on-surface-variant">PayPal</p>
                  <p className="text-on-surface-variant">Apple Pay</p>
                  <p className="text-on-surface-variant">Google Pay</p>
                  <p className="text-on-surface-variant">Alipay</p>
                </div>
                <p className="text-on-surface-variant text-sm mt-2">
                  Fast and secure checkout with your preferred digital wallet.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Bank Transfers</h3>
                <div className="space-y-3">
                  <p className="text-on-surface-variant">Wire Transfer (TT)</p>
                  <p className="text-on-surface-variant">ACH (US only)</p>
                  <p className="text-on-surface-variant">SEPA (EU only)</p>
                </div>
                <p className="text-on-surface-variant text-sm mt-2">
                  Ideal for large orders and wholesale purchases.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Payment Security</h2>
            <p className="text-on-surface-variant">
              Your payment security is our top priority. We employ industry-standard encryption and compliance measures to protect your financial information.
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">PCI DSS Compliant</h3>
                <p className="text-on-surface-variant">
                  We comply with Payment Card Industry Data Security Standards to ensure secure handling of card information.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">SSL Encryption</h3>
                <p className="text-on-surface-variant">
                  All data transmitted between your browser and our servers is encrypted using 256-bit SSL technology.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Fraud Prevention</h3>
                <p className="text-on-surface-variant">
                  Advanced fraud detection systems monitor transactions in real-time to prevent unauthorized activity.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">How Payment Works</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li className="text-on-surface-variant">
                <span className="font-medium">Place Your Order:</span> Add items to your cart and proceed to checkout.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Select Payment Method:</span> Choose your preferred payment option at checkout.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Secure Processing:</span> Your payment is processed securely through our payment gateway.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Order Confirmation:</span> You'll receive an email confirmation once payment is successful.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Order Processing:</span> The manufacturer begins processing your order upon payment confirmation.
              </li>
            </ol>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Supported Currencies</h2>
            <p className="text-on-surface-variant">
              We support multiple currencies to facilitate international transactions. Prices are displayed in your local currency based on current exchange rates.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">USD:</span> US Dollar</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">EUR:</span> Euro</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">GBP:</span> British Pound</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">JPY:</span> Japanese Yen</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">CAD:</span> Canadian Dollar</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">AUD:</span> Australian Dollar</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PaymentMethodsPage
