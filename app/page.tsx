'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tent, Brain, HeartHandshake, Activity, Moon, ChevronRight } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'
import { KeyVisual } from '@/components/ui/key-visual'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <EandLogo size="sm" className="brightness-0 invert" />
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-ramadan-gold" />
            <span className="text-xs font-medium text-ramadan-gold">Ramadan 2026</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-[#141a3c]">
        {/* Key Visual SVG - Full Width, No Overlay */}
        <div className="w-full">
          <KeyVisual className="w-full h-auto max-h-[60vh] object-contain" />
        </div>
        
        {/* Hero Content - Placed below the visual to avoid overlay */}
        <div className="content-container py-8 md:py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Ramadan Tent Registration
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
            Join us for an unforgettable Iftar experience at the e& Egypt Ramadan Tent. 
            Reserve your spot and celebrate the holy month with us.
          </p>
          <div className="flex justify-center animate-fade-in-up delay-200">
            <Link href="/tent-registration">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full bg-ramadan-gold hover:bg-ramadan-gold/90 text-eand-ocean font-bold shadow-lg shadow-ramadan-gold/20 transition-transform hover:-translate-y-1">
                Book Your Seat Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Actions - 2 Big Cards */}
      <section className="py-12 px-4 -mt-6 relative z-10">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tent Registration Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-ramadan-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Tent className="w-10 h-10 text-ramadan-gold" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Tent Registration</h2>
              <p className="text-gray-500 mb-8 leading-relaxed max-w-sm">
                Secure your table for family and friends. Enjoy our exclusive menu and atmosphere.
              </p>
              <Link href="/tent-registration" className="w-full max-w-xs mt-auto">
                <Button className="w-full py-6 rounded-xl bg-ramadan-gold hover:bg-ramadan-gold/90 text-eand-ocean font-bold">
                  Enter Registration
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Ramadan Riddles Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-eand-ocean/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-eand-ocean" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ramadan Riddles</h2>
              <p className="text-gray-500 mb-8 leading-relaxed max-w-sm">
                Test your knowledge and win prizes! Watch daily episodes and answer the riddles.
              </p>
              <Link href="/riddles" className="w-full max-w-xs mt-auto">
                <Button className="w-full py-6 rounded-xl bg-eand-ocean hover:bg-eand-ocean/90 text-white font-bold">
                  Start Playing
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Ramadan Tips Section */}
      <section className="py-12 px-4 bg-white">
        <div className="content-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Ramadan Tips</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Expert advice for your physical, mental, and emotional health during the holy month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical */}
            <Link href="/wellness" className="group block">
              <div className="h-full bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl p-6 transition-colors duration-300 border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">Physical</h3>
                <p className="text-emerald-700/80 text-sm leading-relaxed">
                  Nutrition, hydration, and energy management for a healthy body.
                </p>
              </div>
            </Link>

            {/* Mental */}
            <Link href="/wellness" className="group block">
              <div className="h-full bg-sky-50 hover:bg-sky-100/80 rounded-2xl p-6 transition-colors duration-300 border border-sky-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-sky-900 mb-2">Mental</h3>
                <p className="text-sky-700/80 text-sm leading-relaxed">
                  Focus, clarity, and stress management techniques.
                </p>
              </div>
            </Link>

            {/* Emotional */}
            <Link href="/wellness" className="group block">
              <div className="h-full bg-rose-50 hover:bg-rose-100/80 rounded-2xl p-6 transition-colors duration-300 border border-rose-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-rose-900 mb-2">Emotional</h3>
                <p className="text-rose-700/80 text-sm leading-relaxed">
                  Balance, connection, and inner peace throughout the month.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <Link href="/wellness">
              <Button variant="outline" className="px-8 py-6 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-eand-ocean hover:text-eand-ocean font-semibold">
                View All Tips
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-eand-ocean px-4 py-8 text-center safe-bottom mt-auto">
        <EandLogo size="sm" className="mx-auto mb-4 brightness-0 invert opacity-40" />
        <p className="text-white/30 text-sm">© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
