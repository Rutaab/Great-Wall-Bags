import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const TermsOfUsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Terms of Use
            </h1>
            <p className="text-on-surface-variant text-lg">
              Last updated: January 1, 2024
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Introduction</h2>
            <p className="text-on-surface-variant">
              Welcome to Great Wall Bags! These Terms of Use ("Terms") govern your access to and use of our website, mobile applications, and related services (collectively, the "Services"). Please read these Terms carefully before using our Services.
            </p>
            <p className="text-on-surface-variant">
              By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to all of these Terms, you may not use our Services.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Eligibility</h2>
            <p className="text-on-surface-variant">
              Our Services are available only to individuals who are at least 18 years old and have the legal capacity to enter into a binding contract. By using our Services, you represent and warrant that you meet these eligibility requirements.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Account Registration</h2>
            <p className="text-on-surface-variant">
              To access certain features of our Services, you may need to create an account. When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            <p className="text-on-surface-variant">
              We reserve the right to refuse service, terminate accounts, or remove or edit content at our sole discretion.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">User Conduct</h2>
            <p className="text-on-surface-variant">
              You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">In a way that violates any applicable law or regulation.</h3>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To transmit or procure the sending of any unsolicited or unauthorized advertising or promotional material.</h3>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with any person or entity.</h3>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our Services.</h3>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Intellectual Property</h2>
            <p className="text-on-surface-variant">
              The Services and all content therein, including text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, are the property of Great Wall Bags or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-on-surface-variant">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as follows: (1) cache pages that are accessible through a web browser for personal, non-commercial use; (2) print one copy of a page from the Services for personal, non-commercial use.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Third-Party Links</h2>
            <p className="text-on-surface-variant">
              The Services may contain links to third-party websites or services that are not owned or controlled by Great Wall Bags. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-on-surface-variant">
              You further acknowledge and agree that Great Wall Bags shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such website or service.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Disclaimer of Warranties</h2>
            <p className="text-on-surface-variant">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ANY OTHER WARRANTY.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Limitation of Liability</h2>
            <p className="text-on-surface-variant">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GREAT WALL BAGS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, FROM ANY LOSS OF USE, LOSS OF DATA, OR ANY OTHER LOSS ARISING OUT OF OR IN CONNECTION WITH THE USE OR INABILITY TO USE THE SERVICES, EVEN IF GREAT WALL BAGS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Indemnification</h2>
            <p className="text-on-surface-variant">
              You agree to defend, indemnify, and hold harmless Great Wall Bags and its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Services, or your violation of these Terms.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Termination</h2>
            <p className="text-on-surface-variant">
              We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>
            <p className="text-on-surface-variant">
              Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Governing Law</h2>
            <p className="text-on-surface-variant">
              These Terms shall be governed by and construed in accordance with the laws of the United States and the State of California, without regard to its conflict of law provisions.
            </p>
            <p className="text-on-surface-variant">
              You hereby irrevocably submit to the personal jurisdiction of the state and federal courts located in San Francisco County, California, and waive any objection to such jurisdiction.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Changes to These Terms of Use</h2>
            <p className="text-on-surface-variant">
              Great Wall Bags reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to the effective date of any new terms. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-on-surface-variant">
              By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please discontinue using the Services.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Contact Us</h2>
            <p className="text-on-surface-variant">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-3">Email</h3>
                <p className="text-on-surface-variant">
                  legal@greatwallbags.com
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

export default TermsOfUsePage
