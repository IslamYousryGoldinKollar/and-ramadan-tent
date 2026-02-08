'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Lightbulb, Tent, ChevronRight, CalendarDays } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header — compact, mobile-friendly */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-eand-red">e&</span>
            <span className="text-sm font-medium text-gray-500">Egypt</span>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            Ramadan 2026
          </span>
        </div>
      </header>

      {/* Hero — Tent Registration CTA */}
      <section className="bg-gradient-to-b from-red-50 via-orange-50 to-white px-4 pt-8 pb-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-eand-red rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200">
            <Tent className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
            Ramadan Tent<br />Registration
          </h1>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Reserve your seat at the e& Egypt Corporate Ramadan Tent for Iftar & Suhoor
          </p>
          <Link href="/tent-registration" className="block">
            <Button size="lg" className="w-full text-base py-6 rounded-xl shadow-md active:scale-[0.98] transition-transform">
              <CalendarDays className="h-5 w-5 mr-2" />
              Book Your Seat Now
            </Button>
          </Link>
          <Link
            href="/tent-registration/manage"
            className="inline-block mt-3 text-sm text-gray-500 hover:text-eand-red transition-colors"
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
            <Card className="border border-gray-100 shadow-sm active:bg-gray-50 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-purple-600" />
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
            <Card className="border border-gray-100 shadow-sm active:bg-gray-50 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-amber-600" />
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
      <footer className="px-4 py-4 text-center text-gray-400 text-xs safe-bottom">
        <p>© 2026 e& Egypt. All rights reserved.</p>
      </footer>
    </div>
  )
}
