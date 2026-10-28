import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerification } from '../../contexts/VerificationContext'
import { useRoleGrantWatch } from '../../hooks/useRoleGrant'

const steps = ['Company Info', 'Business Details', 'Agreement']

const businessTypes = [
  'Limited Liability Company (LLC)', 'Sole Proprietorship',
  'Corporation', 'Partnership', 'Non-Profit',
  'Government Enterprise',
]

const ManufacturerOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { submitRequest } = useVerification()
  const [companyName, setCompanyName] = useState('')
  const [factoryLocation, setFactoryLocation] = useState('')
  const [productionCapacity, setProductionCapacity] = useState(0)
  const [yearsInBusiness, setYearsInBusiness] = useState(0)
  const [certifications, setCertifications] = useState<string[]>([])
  const [businessType, setBusinessType] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [taxId, setTaxId] = useState('')
  const [registeredAddress, setRegisteredAddress] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerContact, setOwnerContact] = useState('')
  const [businessLicense, setBusinessLicense] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = (field: string) => {
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!companyName.trim()) newErrors.companyName = 'Company name is required'
      if (!factoryLocation.trim()) newErrors.factoryLocation = 'Factory location is required'
      if (!productionCapacity || productionCapacity <= 0) newErrors.productionCapacity = 'Enter a valid production capacity'
      if (!yearsInBusiness || yearsInBusiness <= 0) newErrors.yearsInBusiness = 'Enter valid years in business'
    }
    if (currentStep === 2) {
      if (!businessType) newErrors.businessType = 'Select your business type'
      if (!registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required'
      if (!taxId.trim()) newErrors.taxId = 'Tax ID / VAT number is required'
      if (!registeredAddress.trim()) newErrors.registeredAddress = 'Registered business address is required'
      if (!ownerName.trim()) newErrors.ownerName = 'Owner/director name is required'
      if (!ownerContact.trim()) newErrors.ownerContact = 'Owner/director contact is required'
      if (!businessLicense) newErrors.businessLicense = 'Business license document is required'
    }
    if (currentStep === 3) {
      if (!agreed) newErrors.agreed = 'You must agree to the terms'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Approving a request does not grant the role by itself, so this waits for the
  // role to actually be set on the account at /developer/users before navigating.
  useRoleGrantWatch('manufacturer', '/manufacturer/factory-hub', submitted)

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const nextStep = () => {
    if (!validateStep()) return
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      submitRequest('manufacturer', {
        companyName,
        factoryLocation,
        productionCapacity,
        yearsInBusiness,
        certifications,
        businessType,
        registrationNumber,
        taxId,
        registeredAddress,
        ownerName,
        ownerContact,
        businessLicense,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setErrors({})
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
              Your details will be reviewed and you will be updated via email. Soon after verification you will get the access to your manufacturer dashboard.
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
              <h2 className="text-2xl font-black text-[#4a2507] mb-1">Factory Information</h2>
              <p className="text-[#805030] text-sm mb-8">Tell us about your manufacturing facility.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Company Name</label>
                  <input value={companyName} onChange={e => { setCompanyName(e.target.value); clearError('companyName') }} className={`w-full bg-[#fff4f0] border ${errors.companyName ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. Precision Bags Ltd." type="text" />
                  {errors.companyName && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Factory Location</label>
                  <input value={factoryLocation} onChange={e => { setFactoryLocation(e.target.value); clearError('factoryLocation') }} className={`w-full bg-[#fff4f0] border ${errors.factoryLocation ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="City, Country" type="text" />
                  {errors.factoryLocation && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.factoryLocation}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Production Capacity (units/month)</label>
                    <input value={productionCapacity || ''} onChange={e => { setProductionCapacity(Number(e.target.value)); clearError('productionCapacity') }} className={`w-full bg-[#fff4f0] border ${errors.productionCapacity ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. 50000" type="number" />
                    {errors.productionCapacity && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.productionCapacity}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Years in Business</label>
                    <input value={yearsInBusiness || ''} onChange={e => { setYearsInBusiness(Number(e.target.value)); clearError('yearsInBusiness') }} className={`w-full bg-[#fff4f0] border ${errors.yearsInBusiness ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. 15" type="number" />
                    {errors.yearsInBusiness && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.yearsInBusiness}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Certifications</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['ISO 9001', 'ISO 14001', 'LWG Certified', 'GRS Certified', 'OEKO-TEX', 'SA8000'].map(cert => (
                      <label key={cert} className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors border ${certifications.includes(cert) ? 'bg-[#ffd4bb] border-[#9e3c00]/30' : 'bg-[#ffede4] border-transparent hover:bg-[#ffd4bb]'}`}>
                        <input type="checkbox" className="rounded text-[#9e3c00] focus:ring-[#ff7936]" checked={certifications.includes(cert)} onChange={e => {
                          if (e.target.checked) setCertifications(prev => [...prev, cert])
                          else setCertifications(prev => prev.filter(c => c !== cert))
                        }} />
                        <span className="text-xs font-medium">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-2xl font-black text-[#4a2507] mb-1">Business Registration</h2>
              <p className="text-[#805030] text-sm mb-8">Provide your official business registration details.</p>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Business Type</label>
                    <select value={businessType} onChange={e => { setBusinessType(e.target.value); clearError('businessType') }} className={`w-full bg-[#fff4f0] border ${errors.businessType ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`}>
                      <option value="">Select business type</option>
                      {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.businessType && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.businessType}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Registration Number</label>
                    <input value={registrationNumber} onChange={e => { setRegistrationNumber(e.target.value); clearError('registrationNumber') }} className={`w-full bg-[#fff4f0] border ${errors.registrationNumber ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. BRN-2024-001234" type="text" />
                    {errors.registrationNumber && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.registrationNumber}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Tax ID / VAT Number</label>
                    <input value={taxId} onChange={e => { setTaxId(e.target.value); clearError('taxId') }} className={`w-full bg-[#fff4f0] border ${errors.taxId ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="e.g. VAT-123456789" type="text" />
                    {errors.taxId && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.taxId}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Business License</label>
                    <p className="text-[10px] text-[#805030] mb-2">{businessLicense || 'Upload your business license document'}</p>
                    <input type="file" accept="image/*,.pdf" onChange={e => { setBusinessLicense(e.target.files?.[0]?.name || ''); clearError('businessLicense') }} className="hidden" id="mfr-license" />
                    <label htmlFor="mfr-license" className={`block w-full py-2 text-center rounded-full text-xs font-bold cursor-pointer transition-colors ${errors.businessLicense ? 'bg-[#b9002c] text-white' : 'bg-[#9e3c00] text-white hover:bg-[#7a2e00]'}`}>Upload Document</label>
                    {errors.businessLicense && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.businessLicense}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4a2507] block mb-2">Registered Business Address</label>
                  <textarea value={registeredAddress} onChange={e => { setRegisteredAddress(e.target.value); clearError('registeredAddress') }} className={`w-full bg-[#fff4f0] border ${errors.registeredAddress ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none resize-none`} placeholder="Full registered address" rows={3} />
                  {errors.registeredAddress && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.registeredAddress}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Owner / Director Full Name</label>
                    <input value={ownerName} onChange={e => { setOwnerName(e.target.value); clearError('ownerName') }} className={`w-full bg-[#fff4f0] border ${errors.ownerName ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="Legal name" type="text" />
                    {errors.ownerName && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.ownerName}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#4a2507] block mb-2">Owner / Director Contact</label>
                    <input value={ownerContact} onChange={e => { setOwnerContact(e.target.value); clearError('ownerContact') }} className={`w-full bg-[#fff4f0] border ${errors.ownerContact ? 'border-[#b9002c]' : 'border-[#dca079]/30'} rounded-xl px-6 py-3 focus:ring-2 focus:ring-[#9e3c00] focus:border-transparent text-sm outline-none`} placeholder="Email or phone" type="text" />
                    {errors.ownerContact && <p className="text-[#b9002c] text-[10px] font-bold mt-1.5 ml-1">{errors.ownerContact}</p>}
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <div className="bg-[#ff7936]/10 p-6 rounded-xl border border-[#ff7936]/20 mb-8">
                <h2 className="text-2xl font-black text-[#9e3c00] mb-4">Manufacturer Agreement</h2>
                <div className="max-h-60 overflow-y-auto pr-4 space-y-4 text-sm text-[#805030]">
                  <p className="font-bold text-[#4a2507]">1. Quality Standards</p>
                  <p>All products must meet the minimum quality standards. Regular QC inspections may be conducted to ensure compliance.</p>
                  <p className="font-bold text-[#4a2507]">2. Production Timelines</p>
                  <p>Manufacturers must adhere to agreed production schedules. Delays must be communicated at least 72 hours in advance.</p>
                  <p className="font-bold text-[#4a2507]">3. Ethical Manufacturing</p>
                  <p>All manufacturing must comply with local labor laws and ethical manufacturing practices. Child labor is strictly prohibited.</p>
                  <p>By agreeing, you commit to upholding the Great Wall Bags Manufacturer Standards of Excellence.</p>
                </div>
              </div>
                <div className="flex items-center gap-3 mb-8">
                  <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); clearError('agreed') }} className="w-6 h-6 rounded border-[#dca079] text-[#9e3c00] focus:ring-[#ff7936]" />
                  <label className="text-sm font-medium">I agree to the Manufacturer Terms & Conditions.</label>
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
                <>Submit for Review <span className="material-symbols-outlined text-sm">rocket_launch</span></>
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
          <span className="font-bold text-[#4a2507]">Great Wall Bags Manufacturer Program</span>
          <p className="text-[10px] text-[#805030] mt-1">© 2026 Great Wall Bags. All rights reserved.</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Privacy Policy</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Terms of Service</a>
          <a href="#" className="text-[10px] text-[#805030] hover:text-[#9e3c00]">Manufacturer Support</a>
        </div>
      </footer>
    </div>
  )
}

export default ManufacturerOnboarding
