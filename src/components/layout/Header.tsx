import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Header: React.FC = () => {
  const { items } = useCart()
  const { language, setLanguage, translations, languages } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-[#fff4f0] dark:bg-stone-950 font-['Inter'] font-semibold tracking-tight shadow-sm dark:shadow-none docked full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black italic text-[#9e3c00] dark:text-[#ff7936]">
            Great Wall Bags
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-[#9e3c00] dark:text-[#ff7936] border-b-2 border-[#9e3c00] py-1">
              {translations.shipping}
            </Link>
            
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-[#4a2507] dark:text-stone-400 hover:bg-[#ffd4bb] dark:hover:bg-stone-800 transition-colors px-2 py-1 rounded"
              >
                <span>{currentLang?.flag}</span>
                <span className="text-xl">{currentLang?.nativeName}</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
              
              {langOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden z-50">
                  <div className="p-3 border-b border-outline-variant/20">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      {translations.selectLanguage}
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setLangOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors ${
                          language === lang.code ? 'bg-primary-container/20 text-primary' : 'text-on-surface'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium">{lang.nativeName}</p>
                          <p className="text-xs text-on-surface-variant">{lang.name}</p>
                        </div>
                        {language === lang.code && (
                          <span className="material-symbols-outlined text-primary ml-auto">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 hidden lg:block">
          <div className="relative group">
            <input 
              className="w-full bg-surface-container-highest rounded-full px-6 py-2.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary outline-none transition-all duration-300" 
              placeholder={translations.search}
              type="text" 
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-[#4a2507] dark:text-stone-400 hover:bg-[#ffd4bb] transition-colors rounded">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="hidden sm:inline">{translations.account}</span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 px-4 py-2 bg-[#9e3c00] text-white rounded-full hover:shadow-lg transition-all active:scale-95 relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="hidden sm:inline">{translations.cart}</span>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header