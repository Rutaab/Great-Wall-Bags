import React from 'react'
import AppHeader from '../components/layout/AppHeader'
import Footer from '../components/layout/Footer'

const courses = [
  { icon: 'cut', title: 'Pattern Making', desc: 'Learn to draft and cut bag patterns from scratch. Master darts, panels, and seam allowances.' },
  { icon: 'stylus_note', title: 'Sewing Techniques', desc: 'From straight stitch to industrial machines — build your sewing skills with hands-on projects.' },
  { icon: 'handyman', title: 'Leather Crafting', desc: 'Work with genuine leather: skiving, dyeing, edge finishing, and hardware setting.' },
  { icon: 'palette', title: 'Design & Sketching', desc: 'Develop your bag designs from concept sketches to technical drawings with specs.' },
  { icon: 'inventory_2', title: 'Material Science', desc: 'Understand fabrics, linings, interlinings, zippers, and hardware for professional results.' },
  { icon: 'business_center', title: 'Production & Sourcing', desc: 'Scale your craft: find suppliers, create tech packs, and manage small-batch production.' },
]

const EducationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter']">
      <AppHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-[#ff7936]/10 text-[#9e3c00] text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            <span className="material-symbols-outlined text-sm">school</span>
            Learn Bag Making
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#4a2507] tracking-tight mb-4">Master the Art of Bag Making</h1>
          <p className="text-[#805030] max-w-2xl mx-auto text-lg">From beginner stitcher to professional bag designer — access step-by-step courses, pattern libraries, and expert mentorship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {courses.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl p-8 border border-[#dca079]/10 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#ffede4] rounded-xl flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[#9e3c00] text-2xl">{c.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-[#805030] leading-relaxed">{c.desc}</p>
              <button className="mt-5 text-[#004be3] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Start Learning <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#9e3c00] to-[#ff7936] rounded-3xl p-10 md:p-14 text-[#fff0ea] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Join the Academy</h2>
            <p className="text-[#ffede4]/80 max-w-xl mb-8">Get unlimited access to all courses, live workshops, and a community of 2,000+ bag makers. New content added monthly.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="bg-white text-[#9e3c00] px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform">Explore Membership</button>
              <button className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all">View Free Lessons</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EducationPage