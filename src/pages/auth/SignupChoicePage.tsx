import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignupChoicePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] overflow-hidden">
      <main className="min-h-screen flex flex-col md:flex-row">
        <section className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-12 relative z-10 bg-[#fff4f0]">
          <div className="mb-20 flex items-center justify-between">
            <div className="text-xl font-black text-[#9e3c00] tracking-tighter">The Kinetic Curator</div>
            <Link to="/login" className="group flex items-center gap-2 text-[#805030] hover:text-[#9e3c00] transition-colors duration-200">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="font-semibold text-sm tracking-tight">Back to Login</span>
            </Link>
          </div>

          <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#4a2507] tracking-tight leading-tight mb-4">
                How would you like to join?
              </h1>
              <p className="text-[#805030] text-lg leading-relaxed">
                Step into a marketplace designed for the focused and the fast. Select your preferred method to begin your journey.
              </p>
            </header>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/signup/email')}
                className="w-full flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-[#dca079]/20 group transition-all"
                style={{ transform: 'translateY(0)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
                onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)' }}
              >
                <div className="w-14 h-14 rounded-full bg-[#ffd4bb] flex items-center justify-center text-[#9e3c00] group-hover:bg-[#9e3c00] group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">mail</span>
                </div>
                <div className="ml-6 text-left">
                  <div className="text-xl font-bold text-[#4a2507]">Sign up with Email</div>
                  <div className="text-[#805030] text-sm">Classic setup via your inbox</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-[#dca079] group-hover:text-[#9e3c00] transition-colors">chevron_right</span>
              </button>

              <button
                onClick={() => navigate('/signup/phone')}
                className="w-full flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-transparent hover:border-[#dca079]/20 group transition-all"
                style={{ transform: 'translateY(0)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
                onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)' }}
              >
                <div className="w-14 h-14 rounded-full bg-[#c6d0ff] flex items-center justify-center text-[#004be3] group-hover:bg-[#004be3] group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">smartphone</span>
                </div>
                <div className="ml-6 text-left">
                  <div className="text-xl font-bold text-[#4a2507]">Sign up with Phone</div>
                  <div className="text-[#805030] text-sm">Fast access via secure SMS code</div>
                </div>
                <span className="material-symbols-outlined ml-auto text-[#dca079] group-hover:text-[#004be3] transition-colors">chevron_right</span>
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs text-[#805030] leading-relaxed">
                By signing up, you agree to our{' '}
                <a href="#" className="text-[#9e3c00] font-bold underline underline-offset-4 hover:text-[#8b3400]">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-[#9e3c00] font-bold underline underline-offset-4 hover:text-[#8b3400]">Privacy Policy</a>.
              </p>
            </div>
          </div>

          <footer className="mt-auto pt-8 border-t border-[#ffd4bb] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#805030]">© 2024 Kinetic Curator Marketplace. Secure 256-bit encryption.</p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00]">Support</a>
              <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00]">Safety Center</a>
            </div>
          </footer>
        </section>

        <section className="hidden md:block md:w-5/12 lg:w-1/2 relative bg-[#ffe3d3]">
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(255, 244, 240, 1) 0%, rgba(255, 244, 240, 0) 20%)' }} />
          <img
            className="w-full h-full object-cover grayscale-[20%] sepia-[10%]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcQvzLuDHq09AI-V__j_VRe73BY-okAF0NlvhXA7E6xeT6rr3hZrmasdKFpdVzGFqB0E2ykVltZy1Z-XGYp_Dsj9RgkQK9a9z7VgJuXoUWo68l4cEoIU77kxb1LTWx6GZfIbkHdqZ-6wXBDzOqGUeHdGCmyemmDwkKpEF8ViJQYHSfc_LH6QSbxt5p7mI2njR6m_Js7CkLy6FMrjSwlTlMhFDsIKAa63Sov2tZvgkEvu4w8koQQIQ2hUU4KBhv5GjCReIoIIGo3AAF"
            alt=""
          />
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <div className="bg-[#fff4f0]/80 backdrop-blur-xl p-8 rounded-xl shadow-2xl border border-white/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#fff4f0] bg-gray-200 overflow-hidden">
                      <img
                        className="w-full h-full"
                        src={`https://lh3.googleusercontent.com/aida-public/AB6AXuARv4syMcI3gL6iut1f99SvCWl2QMMJKer2-PoHszo9JpwtL-SS3uI1YVnRXdweQ2oPEfRiwdsq563tvMPT3wd-w3cpElPpYome3RYqthEShkic45g7lYhbByU9ZiwQjt5_vKEKDjrcShIFfAqyXIKuawqNdScpS-MT_80fYXerlOgavctwKqsdyxhA8OfNuhLyFTdoMRd2SPB3lbom7sj3irjt5IlFKDoHfJPwpG8Z6mH0aUeL9b0oE3Ssu5im89bsB_dxINfXR4dG`}
                        alt=""
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold text-[#4a2507]">+12k Joiners this week</span>
              </div>
              <blockquote className="italic text-lg text-[#4a2507] font-medium leading-tight">
                "The marketplace where craftsmanship meets speed. I found pieces here that tell a story, delivered with modern precision."
              </blockquote>
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#9e3c00]">Verified Curator Review</p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/felt.png')" }} />
    </div>
  )
}

export default SignupChoicePage
