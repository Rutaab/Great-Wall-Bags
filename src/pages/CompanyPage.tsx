import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const CompanyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tighter mb-4">
              About Great Wall Bags
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg">
              Great Wall Bags is a premier global marketplace connecting verified bag manufacturers with businesses worldwide. Founded in 2010, we've built a trusted platform where quality, transparency, and innovation meet.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Our Mission</h2>
            <p className="text-on-surface-variant text-sm md:text-base">
              To empower global trade by providing a secure, efficient marketplace where buyers can discover high-quality bags directly from verified manufacturers, and sellers can reach international markets with confidence.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Quality First</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  Every manufacturer on our platform undergoes rigorous verification to ensure they meet our strict quality standards.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Transparency</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  We believe in open communication and clear transactions between buyers and sellers.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg sm:col-span-2 md:col-span-1">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Innovation</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  We continuously improve our platform with the latest technology to enhance the trading experience.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Our Story</h2>
            <div className="space-y-4 text-sm md:text-base text-on-surface-variant">
              <p>
                Great Wall Bags began as a small team of bag enthusiasts who recognized the challenges in the global sourcing market. We saw manufacturers struggling to reach international buyers, and businesses finding it difficult to verify suppliers and ensure quality.
              </p>
              <p>
                Our solution was to create a curated marketplace that bridges this gap - combining technology with human expertise to create trust in global trade. Today, we serve thousands of businesses worldwide, helping them source everything from luxury handbags to industrial backpacks.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CompanyPage
