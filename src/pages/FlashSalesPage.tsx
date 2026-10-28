import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

interface SaleProduct {
  id: string; name: string; spec: string; price: number; originalPrice: number
  discount: number; image: string; badge: string; endsIn: string
}

const saleProducts: SaleProduct[] = [
  { id: 'fs-1', name: 'Veloce Leather Tote', spec: 'Italian calfskin', price: 869, originalPrice: 1240, discount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXzkUTg_9ElyaCi4REZAfb9zM2kWpcHU2l9jbjeFOQxoVN0op_Nz24A5b2Szt74E231cA_6Ahb9_Zo7klTaHuQr9H9uUfym3GSPVTGq2kTnZO5NaVE3ic4j-HtRs1LWoJuIyM2sBUmYHXuG0no1GehNnFtP9be53mzLZXa_suRx1YEEMHqXxjvy_P3103AZxE3gD8dw6aMcUR9JeJG5FUSAmsfaKszgult733H47bSkr9RgSm3dwXuFv3GQg_fTrNBdV1rnnSnQ7us', badge: 'Limited Edition', endsIn: '2 days' },
  { id: 'fs-2', name: 'Aero-Commute Pack', spec: 'Waterproof Cordura', price: 199, originalPrice: 285, discount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAH7bEgl5ka4JXSv8N1sbEndzZKugHLaUyvOFO_NSlYPpS4E4uxp2P6Oz6RPGCLvNR_hOIl406QdxDR-OnwMNHtkAq9JdjfMx9Gv3EW7gmwqN72Ed3FZ8yZUsgE4REqLYIDq68D5L_l7ubWrXlCrMBzlv5Ye3QGIrKpiXlMFAYIERVnTtyA_szQiD02nRtgnR9VsJwxLsQMUC5ELX0yHqrbuI7yp3EOxmifFwJsrZAdQ7FpaqfFwF4yCeAfAp1xRrYqieJmtdlytnl', badge: 'Bestseller', endsIn: '1 day' },
  { id: 'fs-3', name: 'Heritage Duffel XL', spec: 'Waxed canvas', price: 315, originalPrice: 450, discount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChzvSjDPoxZZbxcdKbEmTOSwPLgWt2Yc_-8Dw-vbUNHLqoeBEIo5p4w-ol_l8F07jUuZZquyI8t_A3GnkanfKsqpzWecQw19SU94DPken3VmNy-Xh2GOJzmwlGsapOkP2W7-rlYzyT0DbrJKSubVHwDKfAiOOTw5RKsTJpgxloZmtlcxbiz9VKQ7BZCeyOMczxrgqrGV21zbH9bL4rJc9tVGVlI0LHhMjiqZ3fMv1VZD9EpSyKFBQwj0NMCsUAndfC5hGAgC5wa7qI', badge: 'Best Seller', endsIn: '3 days' },
  { id: 'fs-4', name: 'Prism Crossbody', spec: 'Saffiano leather', price: 428, originalPrice: 610, discount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUMuP5hG_AUlXKUwSzzOgEnDRRgh0BLlf4GGqTRWVmSaOIfY86nAOUZnmrspzIwvnW4Q0-BGAetimAUvKoSK4fDppFMk_LdLkT55bKyTSPhq-tVuuZmbhwvvmpyL72PZbcfpZ4Awa2NFmta_M0gUaQjpkrkY3705UUinpKy_Qgl4huFH9hbu5mdqvp1T_Zkn4D3qdDW0VU8LeORSbzfCvz2a8JfF3phws5X8fqMpl5Eb6eU7i6YLe_5dRpeJq4FfgsXVo71lyCYL0e', badge: 'Flash Sale', endsIn: '12 hours' },
  { id: 'fs-5', name: 'Tactical Assault Pack', spec: '1000D Cordura', price: 99, originalPrice: 145, discount: 32, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArJSYEUVXOtB_Ea9Rz4-j694jhTUrwI2y3-U-hprj4LFikoZy_VBkf8NI1HTmdNWkOFAU-sO33cSErX3dPDyFEjMWa7i0rIXlXNSdtmeyc95kHNl8pCOr3kk21m9wuiUK9duLQpO_IhCKkXhmIAenQ224cUcN3uv6x5YFscnAXTCdswSvGTzX6QYYPLrcjIC5e5S3G-DMjys8Jl3ZC_e2fp3XFr60zExPLKhq4uqiW9HO8vwt3pGhNOHF-uzQIll0qHsgpWXJ8WgED', badge: 'Sale', endsIn: '2 days' },
  { id: 'fs-6', name: 'DSLR Camera Backpack', spec: 'Padded camera insert', price: 89, originalPrice: 125, discount: 29, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0PuVcW4Ic0RG52WNsvVxe4ZvHax76F2wlXIdRHwfjUz_UWNZye6ho28DPfUxB0XvkHDrR4DSmSpJJftCWogHW-KdzvlQ5MxiWTs25z5Q2etuxKQRVosppfu63mESmXms_DwoXqmV7_Sufhyn96viioK1ToiB2FI7uuLgPOPGatflzkjgjuYreV3rcIQ9Rh1dsykc2Y1lP_zIosu2ULZmr4J5qDLXnyJuJ6rv7fUfzBBLGWkT8C2iW5FMqkrNYnsn1S6RB3Qg2dReC', badge: 'Hot Deal', endsIn: '1 day' },
  { id: 'fs-7', name: 'Insulated Ski Boot Bag', spec: 'Thermal lined', price: 52, originalPrice: 75, discount: 31, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy94vspq9Ooju02aDm5o01RH1q4sckaSeknSx1PvRPZCE9fAaid0lpUuFMU0fPsIVECm-ThvIwe5x1gt0CaNZH0QZqHxEpipB0vaXchOYZB7eI0tXITxelBo18afHyeSqL9xQg76r-r3-Y96FNS7rsw_9wB4FB_rCSZnqxL2vorQ6oo17Zy-9SUTLk_O9aNU2xh_SJj_GLPi5kNAAZAIUa5RbL0PGcnCPLKXOCS1EqAkYpRmeNS13Co7pCYyGQwpKwyrqTDWU1J3pv', badge: 'Winter Sale', endsIn: '4 days' },
  { id: 'fs-8', name: 'Stand Golf Bag', spec: 'Auto-pop stand', price: 137, originalPrice: 195, discount: 30, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm8dsLJGs0CeqKO82jOaFZfbstjKwEGbBsFNW0pyIpY8MLUiuivgJyVdYqKUbHJI5LVNzofHY0oZ-GpWPTJnB00HtRRDZFakISDpRZ6poTzcQ-0kw6HGtI6sAMbOVn4YgMeH5CWOHesg_5UQ0NEwBzuJnWwO7ZT1vmtK-upC_YyCM-kSfmhVkDD1sINWiuuxzvmMFDoKUFMiX67h-vRkoZwVtWQiKJMQYRaQ2laUhkFzMqlVayR1FbJYnuVZONpjzRsG_zDj1l19VJ', badge: 'Sale', endsIn: '2 days' },
  { id: 'fs-9', name: 'Gym Backpack Pro', spec: 'Shoe compartment', price: 52, originalPrice: 75, discount: 31, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLNdbKra38mMx_ZqugXM3f_K0c0nAmFLKuUhuAFJvLSPXLH5CGzuHDdu56C3Djg9wnr8BdV_CXwIvbjGF1X8G2D6ryHxvB5jJ5n1drZuMuQtAvHfQZFVgyPq14uxK4QEkZ6lT7nH1ytKXKUXW75nXRr9BzOoj9HmP5U6NJO3aztTJlFI9KAJMmrofExaRRhGc7lgox_Rs-OMWyFwQqSl5w4V2G-03vFqBXTJsZib1XwPoyjuUCb3XFFj8Z14XRxthTubwzbYMPk2_K', badge: 'Flash Deal', endsIn: '6 hours' },
  { id: 'fs-10', name: 'Hydration Backpack 3L', spec: '3L reservoir', price: 52, originalPrice: 75, discount: 31, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYQ90RC_KmudW7b6l3o4HTdkJrwJZMTRj9o7oOEUgop1wrsAzae1g8R4WDPhasZXCcRG8jdj_SjaZ3RFXpWWvOjSI7-8b1watJRoaKDCgGPuZkIRHFrg_NcHiN3dxZbVmGJbrLczEdedTUO6ctO35bGnOCcJaiNN9xNWKEgOdghGHwm5GzXnv1Uy04sJSkGrvQ2d6dk0Gl7yWBEbc2oJ7gJRaRwDQD1PcP5y8LxNCCV79nvLY8gMINgyHjBQmN_FPZW4SzFt0r7BO', badge: 'Sale', endsIn: '3 days' },
  { id: 'fs-11', name: 'Bicycle Pannier Set', spec: 'Waterproof pair', price: 67, originalPrice: 95, discount: 29, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIXtYlg5AzIZi63aj8dgzel2XPLfbrX8RdfZxBzlXo9mdCUcuEHqDlr_vplCbMEQRk5Na2VV__6z3jSFLWUahEZJDPMtVUBAkKZPQNZktClUC9wjGHGVuln8F7aaiQ8iY0kDZXdlvl0wg6-T3ShIdw1tsLjX9dt4BzOv_TGMeMuxUiC0cUrXNwkqjIj6l_I_V4kcQOhPqEn6D-7Y5NV36ZIb4iKUddj4p63yFarh4A0tJvqnxV4tGzVM6GgoAG-qWedKRfIDj0HAz', badge: 'Sale', endsIn: '5 days' },
  { id: 'fs-12', name: 'Classic Gym Duffel', spec: 'Water-resistant', price: 39, originalPrice: 55, discount: 29, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNRks9WOaL8UciXawKPnQTBa97T7aLaBRn5OmH8TC8Mgx_5yYiZQapkrwK6Q0dltmlMoDkzM_pD1z4mYCnAFNDxk72XGmnt_DNDy_iNCT5Jkvt4jqIIu3R3LjnziMXDnzMmVlD2pjk7wVcItC-QgPV9Tsy78i7QAYuLXOLkAtDxpCCQv6D494kSUoKlbSvcGPe35xJH28JhoXM-QHVfEuLmeHKnt32EBp4dxUGGOU_Mo800wb4S2UlBnvdCHrGVO7KUGD-0rWUZaCe', badge: 'Budget Pick', endsIn: '2 days' },
]

const FlashSalesPage: React.FC = () => {
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleAddToCart = (p: SaleProduct) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image })
    setJustAdded(prev => new Set(prev).add(p.id))
    setTimeout(() => {
      setJustAdded(prev => {
        const next = new Set(prev)
        next.delete(p.id)
        return next
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter']">
      <AppHeader />
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <nav className="flex text-[10px] font-bold uppercase tracking-widest text-[#805030] mb-6 gap-2 items-center">
          <Link to="/" className="hover:text-[#9e3c00]">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-[#4a2507]">Flash Sales</span>
        </nav>

          <div className="rounded-2xl p-8 md:p-12 mb-10 text-white relative overflow-hidden bg-[#9e3c00]">
          <img loading="lazy" className="absolute inset-0 w-full h-full object-cover object-right opacity-30" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop" alt="" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#9e3c00]/10 via-[#9e3c00]/70 to-[#9e3c00]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-3xl">local_fire_department</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Limited Time</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">Flash Sales</h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">Limited-time deals on premium bags. Discounts up to 32% off — grab them before they are gone!</p>
            <div className="flex gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
                <span className="text-2xl font-black block">12</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">Products</span>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 text-center">
                <span className="text-2xl font-black block">Up to 32%</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70">Off</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((p) => {
            const added = justAdded.has(p.id)
            const fav = isWishlisted(p.id)
            return (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-[#dca079]/10 group flex flex-col">
                <Link to={`/product/${p.id}`} className="relative aspect-square bg-[#fff4f0] overflow-hidden block">
                  <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.image} alt={p.name} />
                  <div className="absolute top-2 left-2 bg-[#b9002c] text-white text-[10px] font-black px-2 py-0.5 rounded">-{p.discount}%</div>
                  <div className="absolute bottom-2 left-2 bg-[#004be3] text-[#f2f1ff] text-[10px] font-black px-2 py-0.5 rounded">{p.badge}</div>
                  <div className="absolute top-2 right-2">
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist({ id: p.id, name: p.name, price: p.price, image: p.image, badge: p.badge }) }} className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow ${fav ? 'text-[#b9002c]' : 'text-[#805030]'} hover:bg-white transition-colors`}>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-[#4a2507] leading-tight mb-1">{p.name}</h3>
                  <p className="text-[10px] text-[#805030] mb-2">{p.spec}</p>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl font-black text-[#9e3c00]">${p.price.toFixed(0)}</span>
                    <span className="text-sm text-[#805030] line-through">${p.originalPrice.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-amber-400 text-sm">schedule</span>
                    <span className="text-[10px] font-bold text-[#b9002c]">Ends in {p.endsIn}</span>
                  </div>
                  <button onClick={() => handleAddToCart(p)} className={`mt-auto w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${added ? 'bg-green-600 text-white' : 'bg-[#9e3c00] text-white hover:opacity-90'}`}>
                    <span className="material-symbols-outlined text-sm">{added ? 'check' : 'add_shopping_cart'}</span>
                    {added ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default FlashSalesPage
