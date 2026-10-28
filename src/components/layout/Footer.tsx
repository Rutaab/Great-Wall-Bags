import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

const Footer: React.FC = () => {
  const location = useLocation()
  const { translations } = useLanguage()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <footer className="w-full bg-[#ffede4] dark:bg-stone-900 font-['Inter'] text-xs uppercase tracking-widest border-t-0">
      <div className="w-full px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-[#9e3c00] mb-6">{translations.global}</h4>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/global-trade" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/global-trade') ? 'font-medium' : ''
                }`}
              >
                Global Trade
              </Link>
            </li>
            <li>
              <Link 
                to="/support" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/support') ? 'font-medium' : ''
                }`}
              >
                Help
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/settings') ? 'font-medium' : ''
                }`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#9e3c00] mb-6">Support</h4>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/customer-service" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/customer-service') ? 'font-medium' : ''
                }`}
              >
                Customer Service
              </Link>
            </li>
            <li>
              <Link 
                to="/returns" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/returns') ? 'font-medium' : ''
                }`}
              >
                Returns
              </Link>
            </li>
            <li>
              <Link 
                to="/shipping-info" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/shipping-info') ? 'font-medium' : ''
                }`}
              >
                Shipping Info
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#9e3c00] mb-6">{translations.legal}</h4>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/privacy-policy" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/privacy-policy') ? 'font-medium' : ''
                }`}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/terms-of-use" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/terms-of-use') ? 'font-medium' : ''
                }`}
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#9e3c00] mb-6">{translations.trade}</h4>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/payment-methods" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/payment-methods') ? 'font-medium' : ''
                }`}
              >
                Payment Methods
              </Link>
            </li>
            <li>
              <Link 
                to="/sell-on-great-wall-bags" 
                className={`text-[#805030] dark:text-stone-500 hover:text-[#004be3] transition-colors underline-offset-4 hover:underline ${
                  isActive('/sell-on-great-wall-bags') ? 'font-medium' : ''
                }`}
              >
                Sell on Kinetic
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-12 py-8 bg-[#fff4f0] dark:bg-stone-950 text-center border-t border-outline-variant/10">
        <p className="text-[10px] text-on-surface-variant">© 2024 Great Wall Bags Marketplace. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer