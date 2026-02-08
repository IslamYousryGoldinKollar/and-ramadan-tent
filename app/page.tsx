'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Lightbulb, Tent, ChevronRight, CalendarDays, Sparkles } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header — compact, mobile-friendly */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <EandLogo size="sm" />
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            Ramadan 2026
          </span>
        </div>
      </header>

      {/* Hero — Tent Registration CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-600 via-red-500 to-orange-400 px-4 pt-10 pb-8">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-lg mx-auto text-center relative z-10">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
            <Tent className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-sm">
            Ramadan Tent<br />Registration
          </h1>
          <p className="text-base text-white/90 mb-6 leading-relaxed">
            Reserve your seat at the e& Egypt Ramadan Tent for Iftar & Suhoor
          </p>
          <Link href="/tent-registration" className="block">
            <Button size="lg" className="w-full text-base py-6 rounded-xl bg-white text-red-600 hover:bg-gray-50 shadow-xl active:scale-[0.98] transition-all font-semibold">
              <CalendarDays className="h-5 w-5 mr-2" />
              Book Your Seat Now
            </Button>
          </Link>
          <Link
            href="/tent-registration/manage"
            className="inline-block mt-4 text-sm text-white/80 hover:text-white transition-colors"
          >
            Already registered? Manage your booking →
          </Link>
        </div>
      </section>

      {/* Secondary sections */}
      <section className="px-4 py-6 flex-1">
        <div className="max-w-lg mx-auto space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
            Explore More
          </h2>

          {/* Ramadan Riddles */}
          <Link href="/riddles" className="block">
            <Card className="border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-200">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Ramadan Riddles</h3>
                  <p className="text-sm text-gray-500 leading-snug">
                    Watch episodes, answer questions & win prizes
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>

          {/* Ramadan Tips */}
          <Link href="/wellness" className="block">
            <Card className="border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-200">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Ramadan Tips</h3>
                  <p className="text-sm text-gray-500 leading-snug">
                    Health advice & tips for a better Ramadan
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-5 text-center safe-bottom">
        <EandLogo size="sm" className="mx-auto mb-2 opacity-30" />
        <p className="text-gray-400 text-xs">© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
