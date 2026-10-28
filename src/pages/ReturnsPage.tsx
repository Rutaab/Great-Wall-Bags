import React from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const ReturnsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Returns & Refunds
            </h1>
            <p className="text-on-surface-variant text-lg">
              Our policies for product returns, refunds, and dispute resolution.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Return Eligibility</h2>
            <p className="text-on-surface-variant">
              Return policies are set by individual manufacturers and vary by product. Please review the specific return policy listed on each product page before making a purchase.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li className="text-on-surface-variant">
                <span className="font-medium">Review the return policy:</span> Check the product page for the manufacturer's specific return terms.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Contact the seller:</span> Use our messaging system to initiate a return request within the specified timeframe.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Provide documentation:</span> Include photos of any defects or issues, and your order number.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Ship the item:</span> Follow the manufacturer's instructions for returning the product.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Receive your refund:</span> Once the manufacturer approves the return, your refund will be processed according to their policy.
              </li>
            </ol>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Refund Processing Times</h2>
            <p className="text-on-surface-variant">
              Refund processing times vary by manufacturer and payment method. Typically, refunds are issued within 5-15 business days after the manufacturer receives and inspects the returned item.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Dispute Resolution</h2>
            <p className="text-on-surface-variant">
              If you encounter any issues with a return or refund, our support team is available to help mediate between you and the manufacturer to reach a fair resolution.
            </p>
            <div className="mt-4">
              <Link to="/customer-service" className="bg-primary text-white px-4 py-2 rounded font-medium">
                Contact Customer Service
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ReturnsPage
