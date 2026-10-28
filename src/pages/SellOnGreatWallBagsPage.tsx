import React from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const SellOnGreatWallBagsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Sell on Great Wall Bags
            </h1>
            <p className="text-on-surface-variant text-lg">
              Join our global marketplace and reach millions of buyers worldwide.
            </p>
            <Link
              to="/supplier/onboarding"
              className="inline-flex items-center gap-2 mt-6 bg-[#ff7936] hover:bg-[#e06620] text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">store</span>
              Become a Supplier
            </Link>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Why Sell With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Global Reach</h3>
                <p className="text-on-surface-variant">
                  Access to millions of verified buyers across 180+ countries.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Verified Buyers</h3>
                <p className="text-on-surface-variant">
                  All buyers undergo verification to ensure secure transactions.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Trade Assurance</h3>
                <p className="text-on-surface-variant">
                  Payment protection and dispute resolution services.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li className="text-on-surface-variant">
                <span className="font-medium">Apply to Sell:</span> Submit your business information and product catalog.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Get Verified:</span> Our team reviews your application (typically 3-5 business days).
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">List Products:</span> Upload your products with pricing and MOQ information.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Receive Inquiries:</span> Buyers send you requests for quotes and samples.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Negotiate & Close:</span> Communicate directly with buyers to finalize orders.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Fulfill Orders:</span> Ship products and receive payment through our secure system.
              </li>
            </ol>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Seller Benefits</h2>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">No Listing Fees</h3>
                <p className="text-on-surface-variant">
                  Free to join and list your products. We only charge a small transaction fee on completed sales.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Marketing Support</h3>
                <p className="text-on-surface-variant">
                  Featured placements, email campaigns, and social media promotion.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Analytics Dashboard</h3>
                <p className="text-on-surface-variant">
                  Track your performance, customer insights, and market trends.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Dedicated Support</h3>
                <p className="text-on-surface-variant">
                  Multilingual support team to help you succeed on our platform.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Popular Product Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">backpack</span>
                </div>
                <p className="font-medium text-on-surface">Backpacks & Bags</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">handbag</span>
                </div>
                <p className="font-medium text-on-surface">Handbags & Luggage</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">checkroom</span>
                </div>
                <p className="font-medium text-on-surface">Travel Accessories</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">inventory</span>
                </div>
                <p className="font-medium text-on-surface">Laptop Cases</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">eco</span>
                </div>
                <p className="font-medium text-on-surface">Eco-Friendly Bags</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">wb_sunny</span>
                </div>
                <p className="font-medium text-on-surface">Outdoor Gear</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                </div>
                <p className="font-medium text-on-surface">Business Cases</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <p className="font-medium text-on-surface">Lifestyle Bags</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SellOnGreatWallBagsPage
