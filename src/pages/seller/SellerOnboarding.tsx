import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerification } from '../../contexts/VerificationContext'
import { useRoleGrantWatch } from '../../hooks/useRoleGrant'

const steps = ['Store Setup', 'Identity', 'Payment', 'Launch']

const SellerOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { submitRequest } = useVerification()
  const [storeName, setStoreName] = useState('')
  const [tagline, setTagline] = useState('')
  const [productCategory, setProductCategory] = useState('Handbags')
  const [sellerFullName, setSellerFullName] = useState('')
  const [governmentId, setGovernmentId] = useState('')
  const [selfiePhoto, setSelfiePhoto] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = (field: string) => {
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!storeName.trim()) newErrors.storeName = 'Store name is required'
      if (!tagline.trim()) newErrors.tagline = 'Tagline is required'
    }
    if (currentStep === 2) {
      if (!sellerFullName.trim()) newErrors.sellerFullName = 'Full name is required'
      if (!governmentId) newErrors.governmentId = 'Government ID is required'
      if (!selfiePhoto) newErrors.selfiePhoto = 'Selfie photo is required'
    }
    if (currentStep === 3) {
      if (!bankAccount.trim()) newErrors.bankAccount = 'Bank account is required'
      if (!routingNumber.trim()) newErrors.routingNumber = 'Routing number is required'
    }
    if (currentStep === 4) {
      if (!agreed) newErrors.agreed = 'You must agree to the terms'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Approving a request does not grant the role by itself, so this waits for the
  // role to actually be set on the account at /developer/users before navigating.
  useRoleGrantWatch('seller', '/seller/dashboard', submitted)

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const nextStep = () => {
    if (!validateStep()) return
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      submitRequest('seller', {
        storeName,
        tagline,
        productCategory,
        sellerFullName,
        bankAccount,
        routingNumber,
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

      <main className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        {submitted ? (
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-[#dca079]/10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9e3c00] to-[#ff7936] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#4a2507] mb-4">Application Submitted</h2>
            <p className="text-[#805030] text-base mb-6 max-w-lg mx-auto leading-relaxed">
              Your details will be reviewed and you will be updated via email. Soon after verification you will get the access to your store.
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

        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#dca079]/10">
          {currentStep === 1 && (
            <section>
              <h2 className="text-2xl font-black text-[#4a2507] mb-1">Your Store</h2>
              <p className="text-[#805030] text-sm mb-8">Set up your seller storefront in minutes.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Store Name</label>
                  <input value={storeName} onChange={e => { setStoreName(e.target.value); clearError('storeName') }} className={`w-full bg-[#fff4f0] border ${errors.storeName ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. Artisan Collective Co." type="text" />
                  {errors.storeName && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.storeName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Tagline</label>
                  <input value={tagline} onChange={e => { setTagline(e.target.value); clearError('tagline') }} className={`w-full bg-[#fff4f0] border ${errors.tagline ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. Handcrafted bags with soul" type="text" />
                  {errors.tagline && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.tagline}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Product Category</label>
                  <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="w-full bg-[#fff4f0] border border-[#dca079]/30 rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none">
                    <option>Handbags</option>
                    <option>Backpacks</option>
                    <option>Travel Bags</option>
                    <option>Accessories</option>
                    <option>Multiple Categories</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-2xl font-black text-[#4a2507] mb-1">Identity Verification</h2>
              <p className="text-[#805030] text-sm mb-8">Verify your identity to start selling.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Full Name</label>
                  <input value={sellerFullName} onChange={e => { setSellerFullName(e.target.value); clearError('sellerFullName') }} className={`w-full bg-[#fff4f0] border ${errors.sellerFullName ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="Your legal name" type="text" />
                  {errors.sellerFullName && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.sellerFullName}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${errors.governmentId ? 'border-[#b9002c] bg-red-50' : 'bg-[#ffede4] border-[#dca079]/10'}`}>
                    <span className="material-symbols-outlined text-[#9e3c00] mb-2">badge</span>
                    <h3 className="text-sm font-bold">Government ID</h3>
                    <p className="text-[10px] text-[#805030] mb-4">{governmentId || 'Passport or driver\'s license'}</p>
                    <input type="file" accept="image/*" onChange={e => { setGovernmentId(e.target.files?.[0]?.name || ''); clearError('governmentId') }} className="hidden" id="seller-govt-id" />
                    <label htmlFor="seller-govt-id" className="block w-full py-2 bg-[#9e3c00] text-white rounded-full text-xs font-bold hover:bg-[#7a2e00] transition-colors text-center cursor-pointer">Upload</label>
                    {errors.governmentId && <p className="text-[#b9002c] text-[10px] font-bold mt-2">{errors.governmentId}</p>}
                  </div>
                  <div className={`p-4 rounded-xl border ${errors.selfiePhoto ? 'border-[#b9002c] bg-red-50' : 'bg-[#ffede4] border-[#dca079]/10'}`}>
                    <span className="material-symbols-outlined text-[#9e3c00] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>camera_alt</span>
                    <h3 className="text-sm font-bold">Selfie Verification</h3>
                    <p className="text-[10px] text-[#805030] mb-4">{selfiePhoto || 'Take a quick selfie to confirm'}</p>
                    <input type="file" accept="image/*" onChange={e => { setSelfiePhoto(e.target.files?.[0]?.name || ''); clearError('selfiePhoto') }} className="hidden" id="seller-selfie" />
                    <label htmlFor="seller-selfie" className="block w-full py-2 bg-[#9e3c00] text-white rounded-full text-xs font-bold hover:bg-[#7a2e00] transition-colors text-center cursor-pointer">Take Photo</label>
                    {errors.selfiePhoto && <p className="text-[#b9002c] text-[10px] font-bold mt-2">{errors.selfiePhoto}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <h2 className="text-2xl font-black text-[#4a2507] mb-1">Payment Setup</h2>
              <p className="text-[#805030] text-sm mb-8">Set up how you'll get paid.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Bank Account</label>
                  <input value={bankAccount} onChange={e => { setBankAccount(e.target.value); clearError('bankAccount') }} className={`w-full bg-[#fff4f0] border ${errors.bankAccount ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="Account number" type="text" />
                  {errors.bankAccount && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.bankAccount}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Routing Number</label>
                  <input value={routingNumber} onChange={e => { setRoutingNumber(e.target.value); clearError('routingNumber') }} className={`w-full bg-[#fff4f0] border ${errors.routingNumber ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="Routing number" type="text" />
                  {errors.routingNumber && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.routingNumber}</p>}
                </div>
                <div className="bg-[#ffede4] p-4 rounded-xl border border-[#ff7936]/20">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[#9e3c00]">lock</span>
                    <span className="font-medium">Your payment info is encrypted and secure.</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section>
              <div className="bg-[#ff7936]/10 p-6 rounded-xl border border-[#ff7936]/20 mb-8">
                <h2 className="text-2xl font-black text-[#9e3c00] mb-4">Seller Agreement</h2>
                <div className="max-h-60 overflow-y-auto pr-4 space-y-4 text-sm text-[#805030]">
                  <p className="font-bold text-[#4a2507]">1. Product Standards</p>
                  <p>All listed products must be accurately described with authentic images. Misrepresentation will result in account suspension.</p>
                  <p className="font-bold text-[#4a2507]">2. Fulfillment</p>
                  <p>Orders must be shipped within 48 hours of purchase. Tracking information must be provided for all orders.</p>
                  <p className="font-bold text-[#4a2507]">3. Customer Service</p>
                  <p>Seller must respond to customer inquiries within 24 hours. Returns must be processed within 5 business days.</p>
                  <p>By agreeing, you commit to the Great Wall Bags Seller Standards of Excellence.</p>
                </div>
              </div>
                <div className="flex items-center gap-3 mb-8">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-6 h-6 rounded border-[#dca079] text-[#9e3c00] focus:ring-[#ff7936]" />
                  <label className="text-sm font-medium">I agree to the Seller Terms & Conditions.</label>
                </div>
                {errors.agreed && <p className="text-[#b9002c] text-[10px] font-bold mt-1 ml-1">{errors.agreed}</p>}
            </section>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#ffede4]">
            <button
              onClick={prevStep}
              className={`px-8 py-3 rounded-full text-sm font-bold text-[#805030] hover:bg-[#fff4f0] transition-all flex items-center gap-2 ${currentStep === 1 ? 'invisible' : ''}`}
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
                <>Launch Store <span className="material-symbols-outlined text-sm">rocket_launch</span></>
              ) : (
                <>Next Step <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </div>
        </div>
        </>
        )}
      </main>

      <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-8 border-t border-[#dca079]/10 bg-white">
        <div>
          <span className="font-bold text-[#4a2507]">Great Wall Bags Seller Program</span>
          <p className="text-[10px] text-[#805030] mt-1">© 2026 Great Wall Bags. All rights reserved.</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Privacy Policy</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Terms of Service</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Seller Support</a>
        </div>
      </footer>
    </div>
  )
}

export default SellerOnboarding
