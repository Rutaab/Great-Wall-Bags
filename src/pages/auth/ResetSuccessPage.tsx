import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ResetSuccessPage: React.FC = () => {
  useEffect(() => {
    const toast = document.getElementById('toast')
    if (toast) {
      setTimeout(() => {
        toast.style.transform = 'translateY(0)'
      }, 800)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex items-center justify-center p-4 md:p-0">
      <main className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row relative">
        <div className="relative w-full md:w-1/2 h-48 md:h-auto overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEI9qLJQJDApyR5u0YgPjr-ge3pBgNJlxCBxZdFMHGkVoZsNEdx11kgcB7sQfkn70UvPkv-mfvyDW7tHtZXBtwC8Ar7aTFy4f5Qhqf8Z5kpiAXl_lh4gNDBCglPXIHKdKzZXjrGZUBXuICOCxfCuno8o9WK5Zz0UmGvwPkCmDRExYw8jfSubT0er8_iSaf581KIjSVIitx7swqMnvwuJsW1ydmsbpVQ7sDcJkbDASBfeBplofq09ezmq6IDNbMt6i5-ENw_v338_eM"
            alt=""
          />
          <div className="absolute inset-0 bg-[#9e3c00]/10 mix-blend-multiply" />
          <div className="absolute top-8 left-8 z-10">
            <h1 className="text-2xl font-black text-[#ff7936] tracking-tighter drop-shadow-sm">
              The Kinetic Curator
            </h1>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#ffede4] relative">
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-[#9e3c00] rotate-45" />
            <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-[#004be3] -rotate-12" />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-[#b9002c]" />
          </div>

          <div className="text-center z-10 max-w-sm">
            <div
              className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg"
              style={{
                animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              }}
            >
              <span className="material-symbols-outlined text-[#9e3c00] text-6xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>
                check_circle
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-[#4a2507] tracking-tight mb-4 leading-tight">
              Security Updated
            </h2>
            <p className="text-[#805030] text-sm md:text-base mb-10 font-medium leading-relaxed">
              Your password has been successfully updated. Your account is now secure and ready for your next curated find.
            </p>

            <Link
              to="/login"
              className="group relative w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 hover:shadow-xl hover:shadow-[#9e3c00]/20"
            >
              <span className="relative z-10">Back to Login</span>
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <div className="mt-12 pt-8 border-t border-[#dca079]/20">
              <p className="text-xs text-[#805030] mb-2">Did not perform this action?</p>
              <a href="#" className="text-[#004be3] text-xs font-bold hover:underline transition-all">
                Contact Support Immediately
              </a>
            </div>
          </div>
        </div>

        <div
          id="toast"
          className="fixed bottom-8 right-8 bg-[#4a2507] text-[#fff4f0] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 translate-y-24 transition-transform duration-500 ease-out"
        >
          <span className="material-symbols-outlined text-[#ff7936]">verified_user</span>
          <span className="text-sm font-semibold tracking-wide">Account Verified & Ready</span>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full py-6 flex flex-col items-center gap-2 pointer-events-none">
        <p className="text-xs text-[#805030] opacity-60">© 2024 Kinetic Curator Marketplace. All payments secured with 256-bit encryption.</p>
      </footer>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ResetSuccessPage
