import React from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'
import { useCart } from '../contexts/CartContext'
import { getProductById } from '../data/productLookup'
import { formatPrice } from '../utils/currency'

function calcBulkSavings(items: { id: string; price: number; quantity: number }[]): number {
  let total = 0
  for (const item of items) {
    const product = getProductById(item.id)
    if (!product?.bulk || !product?.bulkQty) continue
    const matchQty = product.bulkQty.match(/(\d+)/)
    const matchPrice = product.bulk.match(/\$?([\d.]+)/)
    if (!matchQty || !matchPrice) continue
    const threshold = parseInt(matchQty[1], 10)
    const bulkUnit = parseFloat(matchPrice[1])
    if (item.quantity >= threshold) {
      total += (item.price - bulkUnit) * item.quantity
    }
  }
  return total
}

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart } = useCart()
  
  // Group items by supplier (simulated)
  const suppliers = [
    {
      name: 'Nordic Expedition Gear',
      isVerified: true,
      freeShipping: true,
      items: items.slice(0, 2)
    },
    {
      name: 'Luminary Horology',
      isVerified: false,
      freeShipping: false,
      items: items.slice(2, 3)
    }
  ].filter(s => s.items.length > 0)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const bulkSavings = calcBulkSavings(items)
  const shipping = 0 // Free
  const tax = subtotal * 0.0825
  const total = subtotal - bulkSavings + shipping + tax

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507]">
      <AppHeader />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 space-y-8">
          <div className="flex items-end justify-between border-b border-[#dca079]/20 pb-4">
            <h1 className="text-4xl font-black tracking-tight text-[#9e3c00]">Your Great Wall Bags Cart</h1>
            <p className="text-[#805030] font-medium">{items.length} items</p>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-[#805030] mb-4">shopping_cart</span>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-[#805030] mb-6">Discover our curated collections and add items to your cart.</p>
              <Link to="/" className="bg-[#9e3c00] text-white px-8 py-3 rounded-full font-bold">Continue Shopping</Link>
            </div>
          ) : (
            suppliers.map((supplier, supplierIndex) => (
              <div key={supplierIndex} className="bg-white rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-[#ffede4] flex items-center justify-between border-b border-[#dca079]/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#9e3c00]">store</span>
                    <h2 className="font-bold text-lg">{supplier.name}</h2>
                    {supplier.isVerified && (
                      <span className="bg-[#ffd4bb] text-[#4a2507] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified Seller</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#ff7936]">
                    {supplier.freeShipping ? 'Free Shipping Eligible' : 'Shipping calculated at checkout'}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  {supplier.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-[#fff4f0] p-4 rounded-lg">
                      <div className="w-32 h-32 flex-shrink-0 bg-[#ffede4] rounded-md overflow-hidden">
                        <img loading="lazy" className="w-full h-full object-cover" alt={item.name} src={item.image}/>
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#805030] hover:text-[#b9002c] transition-colors"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                          <p className="text-sm text-[#805030] mt-1">Color: Default | Size: Regular</p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center bg-[#ffede4] rounded-full px-1 md:px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-[#ffd4bb] rounded-full text-sm md:text-base"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center hover:bg-[#ffd4bb] rounded-full text-sm md:text-base"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            {item.originalPrice && (
                              <p className="text-xs text-[#805030] font-bold line-through">{formatPrice((item.originalPrice * item.quantity))}</p>
                            )}
                            <p className="text-xl font-black text-[#9e3c00]">{formatPrice((item.price * item.quantity))}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Order Summary</h2>
              <div className="space-y-4 font-medium">
                <div className="flex justify-between text-[#4a2507]">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#805030]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    Bulk Savings
                  </span>
                  <span className="font-bold">-{formatPrice(bulkSavings)}</span>
                </div>
                <div className="flex justify-between text-[#4a2507]">
                  <span>Shipping Est.</span>
                  <span className="text-[#ff7936] font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-[#4a2507]">
                  <span>Tax (Estimated)</span>
                  <span className="font-bold">{formatPrice(tax)}</span>
                </div>
                <div className="pt-6 border-t border-[#dca079]/20 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#9e3c00]">{formatPrice(total)}</span>
                      <p className="text-[10px] text-[#805030] uppercase font-bold tracking-widest">USD Includes Taxes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/checkout/shipping"
                  className="w-full py-4 bg-gradient-to-br from-[#9e3c00] to-[#ff7936] text-white font-black text-lg rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Secure Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 justify-center opacity-60">
                <span className="material-symbols-outlined text-2xl">credit_card</span>
                <span className="material-symbols-outlined text-2xl">payments</span>
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
            </div>

            <div className="bg-white border border-[#dca079]/10 rounded-xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Logistics Prediction</h3>
              <div className="space-y-4">
                <div className="relative">
                  <select className="w-full bg-[#fff4f0] border-0 rounded-full py-3 px-10 text-sm font-semibold focus:ring-2 focus:ring-[#ff7936] appearance-none">
                    <option>United States (USA)</option>
                    <option>Canada (CAN)</option>
                    <option>United Kingdom (UK)</option>
                    <option>Germany (DE)</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-3 text-[#805030] text-sm">language</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-[#ffd4bb] text-[#ff7936]">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-[#805030]">Estimated Arrival</p>
                      <p className="text-sm font-black">Oct 24 - Oct 27</p>
                      <p className="text-[10px] text-[#ff7936] font-bold">Standard International Shipping</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage