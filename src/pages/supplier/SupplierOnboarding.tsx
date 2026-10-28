import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerification } from '../../contexts/VerificationContext'
import { useRoleGrantWatch } from '../../hooks/useRoleGrant'

const steps = ['Brand Info', 'Verification', 'Logistics', 'Agreement']

const SupplierOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { submitRequest } = useVerification()
  const [brandName, setBrandName] = useState('')
  const [brandStory, setBrandStory] = useState('')
  const [businessLicense, setBusinessLicense] = useState('')
  const [identityProof, setIdentityProof] = useState('')
  const [taxId, setTaxId] = useState('')
  const [warehouseLocation, setWarehouseLocation] = useState('')
  const [shippingCapabilities, setShippingCapabilities] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)

  // Approving a request does not grant the role by itself, so this waits for the
  // role to actually be set on the account at /developer/users before navigating.
  useRoleGrantWatch('supplier', '/supplier/dashboard', submitted)

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      if (!agreed) return
      submitRequest('supplier', {
        brandName,
        brandStory,
        taxId,
        warehouseLocation,
        shippingCapabilities,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507]">
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-3 bg-[#fff4f0]/80 backdrop-blur-xl border-b border-[#dca079]/10">
        <span className="text-xl font-black text-[#9e3c00] tracking-tighter">Great Wall Bags</span>
        <div className="flex items-center gap-4">
          <button className="text-[#805030] hover:text-[#9e3c00] transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button onClick={() => navigate('/')} className="text-[#805030] hover:text-[#9e3c00] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
        {submitted ? (
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#dca079]/10 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9e3c00] to-[#ff7936] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#4a2507] mb-4">Application Submitted</h2>
            <p className="text-[#805030] text-base mb-6 max-w-lg mx-auto leading-relaxed">
              Your details will be reviewed and you will be updated via email. Soon after verification you will get the access to your supplier dashboard.
            </p>
            <div className="bg-[#ffede4] rounded-xl p-5 mb-8 inline-flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-[#ffdcc7] border-t-[#9e3c00]" />
              <span className="text-sm font-semibold text-[#805030]">Awaiting Developer Review</span>
            </div>
            <button onClick={() => navigate('/')} className="text-sm font-semibold text-[#805030] hover:text-[#9e3c00] transition-colors">
              Return to Home
            </button>
          </div>
        ) : (
        <>
        <div className="w-full mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#ffd4bb] -z-10 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-[#9e3c00] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${progress}%` }} />
            {steps.map((label, i) => {
              const stepNum = i + 1
              const isActive = stepNum === currentStep
              const isCompleted = stepNum < currentStep
              return (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[#fff4f0] transition-all duration-300 ${
                    isActive ? 'bg-[#9e3c00] text-white' :
                    isCompleted ? 'bg-[#004be3] text-white' :
                    'bg-[#ffd4bb] text-[#805030]'
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-sm">check</span>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-[#805030] uppercase tracking-wider">{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm border border-[#dca079]/10">
            {/* Step 1: Brand Information */}
            {currentStep === 1 && (
              <section>
                <h2 className="text-2xl font-black text-[#4a2507] mb-1">Brand Identity</h2>
                <p className="text-[#805030] text-sm mb-8">Introduce your bag brand to our global audience.</p>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Brand Name</label>
                    <input value={brandName} onChange={e => setBrandName(e.target.value)} className="w-full bg-[#ffd4bb]/30 border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-[#004be3] text-sm outline-none" placeholder="e.g. Atlas Travelware" type="text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Brand Logo</label>
                    <div className="border-2 border-dashed border-[#dca079]/30 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-[#ffe3d3] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-4xl text-[#805030] mb-2">cloud_upload</span>
                      <p className="text-sm text-[#805030]">Drop SVG, PNG or JPG (min 800x800px)</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Brand Story</label>
                    <textarea value={brandStory} onChange={e => setBrandStory(e.target.value)} className="w-full bg-[#ffd4bb]/30 border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#004be3] text-sm outline-none resize-none" placeholder="Tell us about your materials, craftsmanship, and mission..." rows={5} />
                    <p className="text-[10px] text-[#805030] text-right mt-1">{brandStory.length} / 1000 characters</p>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Verification */}
            {currentStep === 2 && (
              <section>
                <h2 className="text-2xl font-black text-[#4a2507] mb-1">Business Verification</h2>
                <p className="text-[#805030] text-sm mb-8">We maintain high trust standards. All suppliers are vetted.</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#ffede4] rounded-xl border border-[#dca079]/10">
                      <span className="material-symbols-outlined text-[#004be3] mb-2">assignment_ind</span>
                      <h3 className="text-sm font-bold">Business License</h3>
                      <p className="text-[10px] text-[#805030] mb-4">{businessLicense || 'Official government registration document.'}</p>
                      <input type="file" accept=".pdf" onChange={e => setBusinessLicense(e.target.files?.[0]?.name || '')} className="hidden" id="supplier-license" />
                      <label htmlFor="supplier-license" className="block w-full py-2 bg-[#004be3] text-white rounded-full text-xs font-bold hover:bg-[#0041c8] transition-colors text-center cursor-pointer">Upload PDF</label>
                    </div>
                    <div className="p-4 bg-[#ffede4] rounded-xl border border-[#dca079]/10">
                      <span className="material-symbols-outlined text-[#004be3] mb-2">badge</span>
                      <h3 className="text-sm font-bold">Identity Proof</h3>
                      <p className="text-[10px] text-[#805030] mb-4">{identityProof || 'Passport or National ID of company owner.'}</p>
                      <input type="file" accept="image/*" onChange={e => setIdentityProof(e.target.files?.[0]?.name || '')} className="hidden" id="supplier-id" />
                      <label htmlFor="supplier-id" className="block w-full py-2 bg-[#004be3] text-white rounded-full text-xs font-bold hover:bg-[#0041c8] transition-colors text-center cursor-pointer">Upload Image</label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Tax Identification Number (TIN)</label>
                    <input value={taxId} onChange={e => setTaxId(e.target.value)} className="w-full bg-[#ffd4bb]/30 border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-[#004be3] text-sm outline-none" placeholder="XX-XXXXXXX" type="text" />
                  </div>
                </div>
              </section>
            )}

            {/* Step 3: Logistics */}
            {currentStep === 3 && (
              <section>
                <h2 className="text-2xl font-black text-[#4a2507] mb-1">Logistics & Shipping</h2>
                <p className="text-[#805030] text-sm mb-8">Where are your bags stored and how do they travel?</p>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Primary Warehouse Location</label>
                    <div className="relative">
                      <input value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)} className="w-full bg-[#ffd4bb]/30 border-none rounded-full px-6 pl-12 py-3 focus:ring-2 focus:ring-[#004be3] text-sm outline-none" placeholder="Search for warehouse address..." type="text" />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#805030]">location_on</span>
                    </div>
                  </div>
                  <div className="bg-[#ffe3d3] rounded-xl overflow-hidden aspect-video relative flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-5xl text-[#9e3c00]/30">map</span>
                      <p className="text-sm text-[#805030] mt-2">Map will appear here</p>
                    </div>
                    <div className="absolute inset-0 bg-[#9e3c00]/10 flex items-center justify-center">
                      <span className="bg-[#9e3c00] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">Confirm Location</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-3">Shipping Capabilities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: 'flight', label: 'Air Freight' },
                        { icon: 'directions_boat', label: 'Ocean' },
                        { icon: 'local_shipping', label: 'Ground' },
                        { icon: 'rocket_launch', label: 'Express' },
                      ].map(item => (
                        <label key={item.icon} className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors border ${shippingCapabilities.includes(item.label) ? 'bg-[#c6d0ff] border-[#004be3]/30' : 'bg-[#ffede4] border-transparent hover:bg-[#c6d0ff]'}`}>
                          <input type="checkbox" className="hidden" checked={shippingCapabilities.includes(item.label)} onChange={e => {
                            if (e.target.checked) setShippingCapabilities(prev => [...prev, item.label])
                            else setShippingCapabilities(prev => prev.filter(s => s !== item.label))
                          }} />
                          <span className="material-symbols-outlined text-[#805030]">{item.icon}</span>
                          <span className="text-[10px] font-medium">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 4: Agreement */}
            {currentStep === 4 && (
              <section>
                <div className="bg-[#ff7936]/10 p-6 rounded-xl border border-[#ff7936]/20 mb-8">
                  <h2 className="text-2xl font-black text-[#9e3c00] mb-4">Creator Agreement</h2>
                  <div className="max-h-80 overflow-y-auto pr-4 space-y-4 text-sm text-[#805030] no-scrollbar">
                    <p className="font-bold text-[#4a2507]">1. Quality Assurance</p>
                    <p>Every product sold on Great Wall Bags must undergo a three-point inspection. You agree to maintain zero tolerance for defects in stitching, hardware, and material consistency.</p>
                    <p className="font-bold text-[#4a2507]">2. Authentic Sourcing</p>
                    <p>Materials must be ethically sourced. If using leather, it must be LWG certified. If synthetic, GRS certification is preferred. Counterfeit elements will result in immediate termination.</p>
                    <p className="font-bold text-[#4a2507]">3. Customer Commitment</p>
                    <p>Suppliers are required to ship within 48 hours of order confirmation. Delays exceeding 72 hours must be proactively reported to our concierge team.</p>
                    <p>By signing below, you join an elite tier of bag makers dedicated to the Great Wall Bags legacy.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-6 h-6 rounded border-[#dca079] text-[#9e3c00] focus:ring-[#ff7936]" />
                  <label className="text-sm font-medium">I have read and agreed to the Creator Quality Standards.</label>
                </div>
                {!agreed && currentStep === steps.length && <p className="text-[#b9002c] text-xs font-bold">Please agree to the terms before submitting.</p>}
              </section>
            )}

            {/* Action Bar */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#ffe3d3]">
              <button
                onClick={prevStep}
                className={`px-8 py-3 rounded-full text-sm font-bold text-[#805030] hover:bg-[#ffe3d3] transition-all flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back
              </button>
              <button
                onClick={nextStep}
                className={`px-10 py-3 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                  currentStep === steps.length
                    ? 'bg-[#004be3] text-white'
                    : 'bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white'
                }`}
              >
                {currentStep === steps.length ? (
                  <>Complete Onboarding <span className="material-symbols-outlined text-sm">rocket_launch</span></>
                ) : (
                  <>Next Step <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                )}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#ffede4] rounded-xl p-6 border border-[#dca079]/10">
              <h3 className="font-bold text-[#4a2507] mb-4">Why Great Wall Bags?</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#004be3]/10 text-[#004be3] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">2.4M Global Reach</h4>
                    <p className="text-[10px] text-[#805030]">Connect with dedicated bag enthusiasts across 45 countries.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#b9002c]/10 text-[#b9002c] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">payments</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Fast Settlements</h4>
                    <p className="text-[10px] text-[#805030]">Payments processed within 7 days of verified delivery.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#9e3c00]/10 text-[#9e3c00] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">verified</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Curator Support</h4>
                    <p className="text-[10px] text-[#805030]">Direct access to professional photography and marketing tools.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden aspect-square relative shadow-xl">
              <img loading="lazy" src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop" alt="" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#fff4f0]/90 backdrop-blur rounded-lg">
                <p className="text-xs italic text-[#4a2507]">"Kinetic provides the perfect stage for our artisanal heritage to reach a modern digital audience."</p>
                <p className="text-[10px] font-bold mt-2">— Founder, Heirloom Leather Co.</p>
              </div>
            </div>
          </aside>
        </div>
        </>
        )}
      </main>

      <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-8 border-t border-[#dca079]/10 bg-[#ffede4]">
        <div>
          <span className="font-bold text-[#4a2507]">Great Wall Bags Supplier Program</span>
          <p className="text-[10px] text-[#805030] mt-1">© 2024 Great Wall Bags. All rights reserved.</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Privacy Policy</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Terms of Service</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Contact Support</a>
        </div>
      </footer>
    </div>
  )
}

export default SupplierOnboarding
