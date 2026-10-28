import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tighter mb-4">
              About Us
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg">
              Learn more about Great Wall Bags, our team, and our vision for the future of global bag trading.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Who We Are</h2>
            <p className="text-sm md:text-base text-on-surface-variant">
              Great Wall Bags is a global B2B marketplace specializing in bags, backpacks, luggage, and related accessories. We connect verified manufacturers with businesses worldwide, facilitating secure and efficient transactions.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Founders</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  Founded by industry veterans with over 20 years of experience in bag manufacturing and international trade.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Quality Assurance</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  Our dedicated QA team ensures every manufacturer meets our strict standards before joining the platform.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-5 md:p-6 rounded-lg sm:col-span-2 md:col-span-1">
                <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 md:mb-4">Customer Support</h3>
                <p className="text-sm md:text-base text-on-surface-variant">
                  Multilingual support team available to assist buyers and sellers throughout the trading process.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-on-surface mb-6">Our Vision</h2>
            <p className="text-sm md:text-base text-on-surface-variant">
              To become the world's most trusted platform for bag sourcing, where innovation meets tradition and every transaction is backed by our guarantee of quality and reliability.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AboutUsPage
