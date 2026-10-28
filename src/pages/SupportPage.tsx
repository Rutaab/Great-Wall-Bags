import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Support Center
            </h1>
            <p className="text-on-surface-variant text-lg">
              Technical assistance and resources for using the Great Wall Bags platform effectively.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Getting Started Guide</h2>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">For Buyers</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-on-surface-variant">Create your free buyer account</li>
                  <li className="text-on-surface-variant">Browse manufacturers or search for specific products</li>
                  <li className="text-on-surface-variant">Request quotes or samples directly from suppliers</li>
                  <li className="text-on-surface-variant">Negotiate terms and place orders through our secure system</li>
                  <li className="text-on-surface-variant">Track shipments and manage orders in your dashboard</li>
                </ol>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">For Manufacturers</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li className="text-on-surface-variant">Apply to become a verified supplier</li>
                  <li className="text-on-surface-variant">Complete your company profile and product catalog</li>
                  <li className="text-on-surface-variant">Undergo our verification process (typically 3-5 business days)</li>
                  <li className="text-on-surface-variant">Start receiving inquiries from qualified buyers</li>
                  <li className="text-on-surface-variant">Manage orders and communications through your supplier dashboard</li>
                </ol>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Product Discovery</h3>
                <p className="text-on-surface-variant">
                  Advanced search filters, category browsing, and curated collections to find exactly what you need.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Communication Tools</h3>
                <p className="text-on-surface-variant">
                  Secure messaging system, video call integration, and document sharing for seamless negotiations.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Trade Assurance</h3>
                <p className="text-on-surface-variant">
                  Payment protection, quality inspection services, and dispute resolution mechanisms.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Analytics & Reports</h3>
                <p className="text-on-surface-variant">
                  Track your purchasing patterns, supplier performance, and market trends with detailed reports.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Helpful Resources</h2>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Video Tutorials</h3>
                <p className="text-on-surface-variant">
                  Step-by-step guides for common tasks like requesting quotes, negotiating prices, and managing orders.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Documentation</h3>
                <p className="text-on-surface-variant">
                  Comprehensive guides covering all platform features, policies, and best practices.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Webinars</h3>
                <p className="text-on-surface-variant">
                  Regular live sessions on market trends, sourcing strategies, and platform updates.
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

export default SupportPage
