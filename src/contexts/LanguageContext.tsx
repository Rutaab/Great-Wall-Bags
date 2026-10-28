import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
]

export interface Translations {
  search: string
  account: string
  cart: string
  shipping: string
  language: string
  selectLanguage: string
  categories: string
  globalSelection: string
  backpacks: string
  luxury: string
  school: string
  travel: string
  business: string
  flashSales: string
  help: string
  settings: string
  home: string
  viewAll: string
  addToCart: string
  buyNow: string
  price: string
  minOrder: string
  verified: string
  newArrivals: string
  bestSellers: string
  freeShipping: string
  support: string
  about: string
  businessLower: string
  followUs: string
  customerService: string
  shippingInfo: string
  returns: string
  aboutUs: string
  privacyPolicy: string
  termsOfUse: string
  sellerPortal: string
  affiliates: string
  // Footer sections
  global: string
  legal: string
  trade: string
}

const translations: Record<string, Translations> = {
   en: {
     search: 'Search for professional manufacturers...',
     account: 'Account',
     cart: 'Cart',
     shipping: 'Shipping',
     language: 'Language',
     selectLanguage: 'Select Language',
     categories: 'Categories',
     globalSelection: 'Global Selection',
     backpacks: 'Backpacks',
     luxury: 'Luxury',
     school: 'School',
     travel: 'Travel',
     business: 'Business',
     flashSales: 'Flash Sales',
     help: 'Help',
     settings: 'Settings',
     home: 'Home',
     viewAll: 'View All',
     addToCart: 'Add to Cart',
     buyNow: 'Buy Now',
     price: 'Price',
     minOrder: 'Min. Order',
     verified: 'Verified Supplier',
     newArrivals: 'New Arrivals',
     bestSellers: 'Best Sellers',
     freeShipping: 'Free Shipping',
     support: 'Support',
     about: 'About',
     businessLower: 'Business',
     followUs: 'Follow Us',
     customerService: 'Customer Service',
     shippingInfo: 'Shipping Info',
     returns: 'Returns',
     aboutUs: 'About Us',
     privacyPolicy: 'Privacy Policy',
     termsOfUse: 'Terms of Use',
     sellerPortal: 'Seller Portal',
     affiliates: 'Affiliates',
     // Footer sections
     global: 'Global',
     legal: 'Legal',
     trade: 'Trade'
   }
}

const getTranslation = (langCode: string): Translations => {
  return translations[langCode] || translations.en
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  translations: Translations
  languages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    translations: getTranslation(language),
    languages,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export { translations }
export default LanguageContext