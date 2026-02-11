'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Lightbulb, Tent, ChevronRight, CalendarDays, Star, Moon } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-ramadan-hero px-4 pt-12 pb-10 lg:pt-20 lg:pb-16">
        {/* Animated decorative elements */}
        <div className="absolute top-6 right-8 text-ramadan-gold/20 animate-float-slow">
          <Moon className="h-32 w-32 lg:h-48 lg:w-48" />
        </div>
        <div className="absolute bottom-4 left-6 text-ramadan-gold/10 animate-float delay-1000">
          <Star className="h-20 w-20" />
        </div>
        <div className="particle w-2 h-2 bg-ramadan-gold/30 top-1/3 left-1/4 animate-twinkle" />
        <div className="particle w-1.5 h-1.5 bg-ramadan-gold/20 top-1/4 right-1/3 animate-twinkle delay-700" />
        <div className="particle w-1 h-1 bg-white/20 bottom-1/3 right-1/4 animate-twinkle delay-1500" />
        <div className="particle w-1.5 h-1.5 bg-ramadan-gold/15 top-1/2 left-[15%] animate-twinkle delay-2000" />
        <div className="particle w-1 h-1 bg-white/15 bottom-1/4 left-1/3 animate-twinkle delay-500" />

        <div className="content-container text-center relative z-10">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-ramadan-gold/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-ramadan-gold/30 animate-pulse-glow opacity-0 animate-scale-in">
            <Tent className="h-10 w-10 lg:h-12 lg:w-12 text-ramadan-gold" />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight opacity-0 animate-fade-in-up delay-200">
            Ramadan Tent<br className="lg:hidden" /> Registration
          </h1>
          <p className="text-base lg:text-lg text-white/70 mb-8 leading-relaxed max-w-md mx-auto opacity-0 animate-fade-in-up delay-400">
            Secure your spot at the e& Egypt Ramadan Tent for Iftar at HQ Kattameya, L1.
          </p>
          <div className="max-w-sm mx-auto space-y-3 opacity-0 animate-fade-in-up delay-600">
            <Link href="/tent-registration" className="block">
              <Button size="lg" className="w-full text-base py-6 rounded-2xl bg-ramadan-gold hover:bg-ramadan-gold/90 text-eand-ocean shadow-lg shadow-ramadan-gold/25 active:scale-[0.98] transition-all font-semibold hover:-translate-y-0.5">
                <CalendarDays className="h-5 w-5 mr-2" />
                Book Your Seat Now
              </Button>
            </Link>
            <Link
              href="/tent-registration/manage"
              className="inline-block text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Already registered? Manage your booking →
            </Link>
          </div>
        </div>
      </section>

      {/* Activities section */}
      <section className="flex-1 bg-ramadan-subtle px-4 py-8 lg:py-12">
        <div className="content-container space-y-4">
          <h2 className="text-xs font-semibold text-eand-grey uppercase tracking-wider px-1 opacity-0 animate-fade-in delay-300">
            Ramadan Activities
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ramadan Riddles */}
            <Link href="/riddles" className="block opacity-0 animate-fade-in-up delay-400">
              <Card className="group modern-card-hover overflow-hidden">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 bg-eand-ocean rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-7 w-7 text-ramadan-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">Ramadan Riddles</h3>
                    <p className="text-sm text-eand-grey leading-snug">
                      Watch episodes, answer questions & win prizes
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-eand-med-grey flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </CardContent>
              </Card>
            </Link>

            {/* Ramadan Tips */}
            <Link href="/wellness" className="block opacity-0 animate-fade-in-up delay-500">
              <Card className="group modern-card-hover overflow-hidden">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 bg-eand-dark-green rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="h-7 w-7 text-eand-bright-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">Ramadan Tips</h3>
                    <p className="text-sm text-eand-grey leading-snug">
                      Health advice & practical tips for Ramadan
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-eand-med-grey flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-eand-ocean px-4 py-6 text-center safe-bottom">
        <EandLogo size="sm" className="mx-auto mb-2 brightness-0 invert opacity-40" />
        <p className="text-white/30 text-xs"> 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
