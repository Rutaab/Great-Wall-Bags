import React from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const ShippingInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AppHeader />
      <main className="min-h-screen max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="space-y-8">
          <section className="mb-8">
            <h1 className="text-4xl font-black text-on-surface tracking-tighter mb-4">
              Shipping Information
            </h1>
            <p className="text-on-surface-variant text-lg">
              Learn about shipping methods, timelines, and costs when purchasing through Great Wall Bags.
            </p>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-black text-on-surface mb-6">Shipping Methods</h2>
            <p className="text-on-surface-variant">
              Since Great Wall Bags is a marketplace connecting buyers and manufacturers, shipping arrangements are made directly between the two parties. However, we provide guidance and resources to help facilitate smooth logistics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">FOB (Free On Board)</h3>
                <p className="text-on-surface-variant">
                  The most common term for international orders. The manufacturer delivers the goods to a specified port, and the buyer arranges and pays for transportation from that point onward.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">CIF (Cost, Insurance, and Freight)</h3>
                <p className="text-on-surface-variant">
                  The manufacturer covers the cost of goods, insurance, and freight to the destination port. The buyer is responsible for unloading and further transportation.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">EXW (Ex Works)</h3>
                <p className="text-on-surface-variant">
                  The buyer is responsible for all transportation costs and risks from the manufacturer's premises to the final destination.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Door-to-Door</h3>
                <p className="text-on-surface-variant">
                  Some manufacturers offer door-to-door service via express couriers (DHL, FedEx, UPS) for smaller orders or samples.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Typical Shipping Timelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Production Time</h3>
                <p className="text-on-surface-variant">
                  Varies by product and manufacturer, typically ranging from 7-30 days for standard orders. Custom orders may take longer.
                </p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg">
                <h3 className="text-xl font-bold text-on-surface mb-4">Transit Time</h3>
                <p className="text-on-surface-variant">
                  Depends on destination and shipping method. Air freight: 3-7 days, Sea freight: 15-45 days, Express courier: 2-5 days.
                </p>
              </div>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Shipping Costs</h2>
            <p className="text-on-surface-variant">
              Shipping costs are not included in the product prices on our platform. They are negotiated directly between the buyer and manufacturer or calculated by the chosen freight carrier.
            </p>
            <div className="mt-4">
              <Link to="/customer-service" className="bg-primary text-white px-4 py-2 rounded font-medium">
                Contact Customer Service for Shipping Assistance
              </Link>
            </div>
          </section>
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-3xl font-bold text-on-surface mb-6">Tips for Buyers</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li className="text-on-surface-variant">
                <span className="font-medium">Confirm Incoterms:</span> Always clarify which shipping terms (FOB, CIF, etc.) apply to your order.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Get multiple quotes:</span> Compare shipping costs from different forwarders or ask the manufacturer for their recommended shipping partner.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Consider insurance:</span> For valuable shipments, consider adding cargo insurance to protect against loss or damage.
              </li>
              <li className="text-on-surface-variant">
                <span className="font-medium">Check import regulations:</span> Be aware of any import duties, taxes, or restrictions in your country that may apply to your purchase.
              </li>
            </ol>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ShippingInfoPage
