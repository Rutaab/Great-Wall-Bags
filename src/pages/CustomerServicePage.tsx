import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const CustomerServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Customer Service
            </h1>
            <p className="text-on-surface-variant text-lg">
              We're here to help you with any questions or concerns about your Great Wall Bags experience.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">How to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Email Support</h3>
                <p className="text-on-surface-variant">
                  <span className="font-medium">support@greatwallbags.com</span><br/>
                  Typical response time: 1-2 business hours
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Live Chat</h3>
                <p className="text-on-surface-variant">
                  Available 24/7 for immediate assistance<br/>
                  <span className="text-xs">Look for the chat icon in the bottom right corner</span>
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Support Hours</h2>
            <p className="text-on-surface-variant">
              Our customer service team is available to assist you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">Weekdays:</span> 8:00 AM - 8:00 PM GMT</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">Weekends:</span> 10:00 AM - 6:00 PM GMT</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg">
                <p className="text-on-surface-variant"><span className="font-medium">Holidays:</span> Limited support available</p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">How do I verify a manufacturer?</h3>
                <p className="text-on-surface-variant">
                  All manufacturers on our platform undergo a rigorous verification process including business license validation, factory audits, and product quality checks. You can see verification badges on manufacturer profiles.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">What payment methods are accepted?</h3>
                <p className="text-on-surface-variant">
                  We support major credit cards, PayPal, bank transfers, and letters of credit for larger orders. Payment terms can be negotiated directly with manufacturers.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">How is shipping handled?</h3>
                <p className="text-on-surface-variant">
                  Shipping arrangements are made directly between buyers and manufacturers. Many manufacturers offer FOB pricing, and we can help facilitate logistics through our trusted partners.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">What is your return policy?</h3>
                <p className="text-on-surface-variant">
                  Return policies vary by manufacturer and are clearly stated on each product page. We recommend reviewing these terms before placing an order. Our support team can help mediate any disputes that arise.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CustomerServicePage
