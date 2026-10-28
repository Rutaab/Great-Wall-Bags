import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Privacy Policy
            </h1>
            <p className="text-on-surface-variant text-lg">
              Last updated: January 1, 2024
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Introduction</h2>
            <p className="text-on-surface-variant">
              Great Wall Bags ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or otherwise interact with us.
            </p>
            <p className="text-on-surface-variant">
              By accessing or using our services, you acknowledge that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Information We Collect</h2>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Personal Information</h3>
                <p className="text-on-surface-variant">
                  Information that can be used to identify you personally, such as your name, email address, phone number, mailing address, payment information, and other identifiers.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Usage Data</h3>
                <p className="text-on-surface-variant">
                  Information collected automatically when you use our services, such as your IP address, browser type, operating system, pages visited, time spent on pages, and other analytics data.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Cookies and Tracking Technologies</h3>
                <p className="text-on-surface-variant">
                  We use cookies and similar tracking technologies to track activity on our services and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">How We Use Your Information</h2>
            <p className="text-on-surface-variant">
              We may use your personal information for various purposes, including:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To Provide and Maintain Our Services</h3>
                <p className="text-on-surface-variant">
                  Including monitoring the usage of our services, managing your account, and providing customer support.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To Improve Our Services</h3>
                <p className="text-on-surface-variant">
                  To analyze usage trends, improve performance, and develop new features.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To Communicate With You</h3>
                <p className="text-on-surface-variant">
                  By email, phone, SMS, or other forms of communication about updates, security alerts, and support messages.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">For Marketing and Advertising</h3>
                <p className="text-on-surface-variant">
                  To send you promotional materials, special offers, and information about new products and services.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Legal Obligations</h3>
                <p className="text-on-surface-variant">
                  To comply with legal obligations, respond to legal requests, and protect our legal rights.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Sharing Your Information</h2>
            <p className="text-on-surface-variant">
              We may share your information in the following situations:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">With Service Providers</h3>
                <p className="text-on-surface-variant">
                  We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">For Business Transfers</h3>
                <p className="text-on-surface-variant">
                  In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">With Affiliates</h3>
                <p className="text-on-surface-variant">
                  We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">With Your Consent</h3>
                <p className="text-on-surface-variant">
                  We may disclose your personal information for any other purpose with your explicit consent.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Your Rights</h2>
            <p className="text-on-surface-variant">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Access</h3>
                <p className="text-on-surface-variant">
                  You have the right to request access to the personal information we hold about you.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Rectification</h3>
                <p className="text-on-surface-variant">
                  You have the right to request correction of any inaccurate personal information we hold about you.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Erasure</h3>
                <p className="text-on-surface-variant">
                  You have the right to request deletion of your personal information under certain circumstances.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Restrict Processing</h3>
                <p className="text-on-surface-variant">
                  You have the right to request restriction of processing of your personal information.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Data Portability</h3>
                <p className="text-on-surface-variant">
                  You have the right to receive your personal information in a structured, commonly used, and machine-readable format.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Right to Object</h3>
                <p className="text-on-surface-variant">
                  You have the right to object to our processing of your personal information.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Data Security</h2>
            <p className="text-on-surface-variant">
              We implement appropriate technical and organizational measures to protect your personal information from accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
            </p>
            <p className="text-on-surface-variant">
              However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Children's Privacy</h2>
            <p className="text-on-surface-variant">
              Our services are not directed to anyone under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from anyone under 13 without verification of parental consent, we will delete that information.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Changes to This Privacy Policy</h2>
            <p className="text-on-surface-variant">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-on-surface-variant">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Contact Us</h2>
            <p className="text-on-surface-variant">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Email</h3>
                <p className="text-on-surface-variant">
                  privacy@greatwallbags.com
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Mailing Address</h3>
                <p className="text-on-surface-variant">
                  Great Wall Bags Inc.<br/>
                  123 Market Street<br/>
                  San Francisco, CA 94105<br/>
                  United States
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

export default PrivacyPolicyPage
