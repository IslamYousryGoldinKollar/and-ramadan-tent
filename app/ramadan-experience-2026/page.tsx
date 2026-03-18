'use client'

import { useState, useCallback, useEffect } from 'react'
import { EandLogo } from '@/components/ui/eand-logo'
import { ProgressBar } from '@/components/survey/progress-bar'
import { EmojiRating } from '@/components/survey/emoji-rating'
import { StarRating } from '@/components/survey/star-rating'
import { AutoSlideHero } from '@/components/survey/auto-slide-hero'
import { CharacterShowcase } from '@/components/survey/character-showcase'
import { CompletionScreen } from '@/components/survey/completion-screen'
import { Moon, ChevronRight, ChevronLeft, Sparkles, Users, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTION_LABELS = ['You', 'Activities', 'Tent', 'Fawazeer', 'Cooking', 'Branding']

const DEPARTMENTS = [
  'Human Resources', 'Finance', 'Marketing', 'Sales', 'Technology',
  'Customer Experience', 'Legal', 'Operations', 'Strategy',
  'Corporate Communications', 'Procurement', 'Internal Audit', 'Other',
]

const tentImages = [
  '/ramadan activity32.jpg',
  '/ramadan activity33.jpg',
  '/ramadan activity34.jpg',
  '/ramadan activity35.jpg',
  '/ramadan activity36.jpg',
  '/ramadan activity37.jpg',
  '/ramadan activity38.jpg',
  '/1772441430606.jpeg',
  '/1772441431138.jpeg',
]

const fawazeerCharacters = [
  '/fawazeer32.png',
  '/fawazeer33.png',
  '/fawazeer34.png',
  '/fawazeer35.png',
  '/fawazeer36.png',
  '/fawazeer37.png',
  '/fawazeer38.png',
  '/fawazeer39.png',
  '/fawazeer40.png',
  '/fawazeer41.png',
]

const cookingImages = [
  '/coocking.JPG',
  '/coocking32.JPG',
  '/coocking33.JPG',
  '/coocking34.JPG',
]

const activityBgImages = [
  '/1772441430606.jpeg',
  '/1772441431138.jpeg',
  '/ramadan activity35.jpg',
  '/ramadan activity37.jpg',
]

interface SurveyData {
  employeeId?: string
  department?: string
  activitiesRating?: number
  tentRating?: number
  fawazeerRating?: number
  cookingRating?: number
  brandingRating?: number
}

export default function SurveyPage() {
  const [started, setStarted] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<SurveyData>({})
  const [transitioning, setTransitioning] = useState(false)

  const update = useCallback((key: keyof SurveyData, value: string | number) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const totalSections = 6

  const canProceed = useCallback(() => {
    switch (currentSection) {
      case 0: return !!(data.employeeId && data.employeeId.length >= 3 && data.department)
      case 1: return !!data.activitiesRating
      case 2: return !!data.tentRating
      case 3: return !!data.fawazeerRating
      case 4: return !!data.cookingRating
      case 5: return !!data.brandingRating
      default: return false
    }
  }, [currentSection, data])

  const goNext = useCallback(async () => {
    if (transitioning) return
    if (currentSection < totalSections - 1) {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentSection((prev) => prev + 1)
        setTransitioning(false)
      }, 400)
    } else {
      setSubmitting(true)
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses: data, completedAt: new Date().toISOString() }),
        })
      } catch (e) {
        console.error('Survey submission failed:', e)
      }
      setSubmitting(false)
      setCompleted(true)
    }
  }, [currentSection, data, transitioning])

  const goPrev = useCallback(() => {
    if (transitioning || currentSection === 0) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrentSection((prev) => prev - 1)
      setTransitioning(false)
    }, 400)
  }, [currentSection, transitioning])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && canProceed()) goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canProceed, goNext, goPrev])

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-eand-ocean via-ramadan-deep to-eand-ocean">
        <CompletionScreen />
      </div>
    )
  }

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />
  }

  return (
    <div className="min-h-screen bg-eand-ocean flex flex-col overflow-hidden">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/5 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <EandLogo size="sm" className="brightness-0 invert" />
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-ramadan-gold" />
            <span className="text-xs font-medium text-ramadan-gold">Experience Survey</span>
          </div>
        </div>
        <div className="px-4 pb-3">
          <ProgressBar
            currentStep={currentSection}
            totalSteps={totalSections}
            sectionLabels={SECTION_LABELS}
          />
        </div>
      </header>

      {/* Section content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Section 0: Identity */}
        <SectionPanel active={currentSection === 0} transitioning={transitioning}>
          <div className="flex-1 bg-gradient-to-b from-purple-900/60 via-eand-ocean to-purple-950/60 flex flex-col items-center justify-center px-6 py-10">
            <span className="text-4xl mb-4">�</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Tell Us About You</h2>
            <p className="text-white/50 text-sm mb-10 text-center">So we can understand your perspective better</p>

            <div className="w-full max-w-sm flex flex-col gap-6">
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Employee ID</label>
                <input
                  type="text"
                  value={data.employeeId || ''}
                  onChange={(e) => update('employeeId', e.target.value)}
                  placeholder="Enter your employee ID"
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ramadan-gold/50 focus:border-ramadan-gold/50 transition-all"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm font-medium mb-2 block">Department</label>
                <select
                  value={data.department || ''}
                  onChange={(e) => update('department', e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-ramadan-gold/50 focus:border-ramadan-gold/50 transition-all appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.5)\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                >
                  <option value="" disabled className="bg-eand-ocean text-white/50">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-eand-ocean text-white">{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </SectionPanel>

        {/* Section 1: Activities */}
        <SectionPanel active={currentSection === 1} transitioning={transitioning}>
          <AutoSlideHero
            images={activityBgImages}
            interval={3500}
            overlay="bg-gradient-to-b from-purple-900/80 via-eand-ocean/70 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
              <span className="text-4xl mb-3">�</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Pre-Ramadan & Ramadan Activities</h2>
              <p className="text-white/50 text-sm mb-10 text-center max-w-md">
                Think back to all the activities and events we organized this Ramadan
              </p>
              <EmojiRating
                question="How much did you enjoy the Ramadan activities overall?"
                value={data.activitiesRating}
                onRate={(r) => update('activitiesRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 2: Tent */}
        <SectionPanel active={currentSection === 2} transitioning={transitioning}>
          <AutoSlideHero
            images={tentImages}
            interval={3000}
            overlay="bg-gradient-to-b from-amber-900/75 via-eand-ocean/65 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
              <span className="text-4xl mb-3">🟡</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Ramadan Tent</h2>
              <p className="text-white/50 text-sm mb-6 text-center max-w-md">
                The heart of our Ramadan — where we gathered for Iftar
              </p>

              {/* Stats bar */}
              <div className="flex items-center justify-center gap-6 mb-10 animate-fade-in-up">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <Users className="w-4 h-4 text-ramadan-gold" />
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">1,744</p>
                    <p className="text-white/40 text-[10px]">Registrations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <Eye className="w-4 h-4 text-ramadan-gold" />
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">6,288</p>
                    <p className="text-white/40 text-[10px]">Page Visits</p>
                  </div>
                </div>
              </div>

              <EmojiRating
                question="How would you rate the Ramadan Tent experience?"
                value={data.tentRating}
                onRate={(r) => update('tentRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 3: Fawazeer */}
        <SectionPanel active={currentSection === 3} transitioning={transitioning}>
          <div className="flex-1 bg-gradient-to-b from-blue-900/70 via-eand-ocean to-blue-950/70 flex flex-col overflow-hidden">
            <div className="text-center pt-8 px-6">
              <span className="text-4xl mb-3 block">🔵</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ramadan Fawazeer</h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Fun, culture, and employee-powered storytelling
              </p>
            </div>

            <CharacterShowcase images={fawazeerCharacters} interval={2500} />

            <div className="px-6 pb-10 pt-4">
              <EmojiRating
                question="How engaging were the Ramadan Fawazeer?"
                value={data.fawazeerRating}
                onRate={(r) => update('fawazeerRating', r)}
              />
            </div>
          </div>
        </SectionPanel>

        {/* Section 4: Cooking Show */}
        <SectionPanel active={currentSection === 4} transitioning={transitioning}>
          <AutoSlideHero
            images={cookingImages}
            interval={3500}
            overlay="bg-gradient-to-b from-red-900/75 via-eand-ocean/70 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
              <span className="text-4xl mb-3">🔴</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Cooking Show Competition</h2>
              <p className="text-white/50 text-sm mb-10 text-center max-w-md">
                Where food met company culture and team spirit
              </p>
              <EmojiRating
                question="How would you rate the Cooking Show experience?"
                value={data.cookingRating}
                onRate={(r) => update('cookingRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 5: Branding */}
        <SectionPanel active={currentSection === 5} transitioning={transitioning}>
          <div className="flex-1 bg-gradient-to-b from-emerald-900/60 via-eand-ocean to-emerald-950/60 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
            {/* Decorative lanterns */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-12 left-[10%] text-3xl opacity-15 animate-float">🏮</div>
              <div className="absolute top-20 right-[12%] text-4xl opacity-20 animate-float-slow delay-500">�</div>
              <div className="absolute bottom-28 left-[18%] text-2xl opacity-10 animate-float delay-300">✨</div>
              <div className="absolute bottom-20 right-[15%] text-3xl opacity-15 animate-float-slow delay-700">🏮</div>
            </div>

            <span className="text-4xl mb-3 relative z-10">🟢</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center relative z-10">Branding & Atmosphere</h2>
            <p className="text-white/50 text-sm mb-10 text-center max-w-md relative z-10">
              The Ramadan decorations, visuals & spirit across our spaces
            </p>

            <div className="relative z-10">
              <StarRating
                question="How would you rate the Ramadan branding & atmosphere?"
                value={data.brandingRating}
                onRate={(r) => update('brandingRating', r)}
              />
            </div>
          </div>
        </SectionPanel>
      </div>

      {/* Fixed bottom navigation */}
      <div className="sticky bottom-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-t border-white/5 safe-bottom">
        <div className="content-container py-4 flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={currentSection === 0}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300',
              currentSection === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={goNext}
            disabled={!canProceed() || submitting}
            className={cn(
              'flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300',
              canProceed()
                ? 'bg-ramadan-gold text-eand-ocean hover:bg-ramadan-gold/90 shadow-lg shadow-ramadan-gold/20 hover:-translate-y-0.5'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-eand-ocean/30 border-t-eand-ocean rounded-full animate-spin" />
                Sending...
              </>
            ) : currentSection === totalSections - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Submit
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionPanel({ active, transitioning, children }: { active: boolean; transitioning: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col transition-all duration-500 ease-out',
        active && !transitioning
          ? 'opacity-100 translate-x-0 scale-100'
          : active && transitioning
          ? 'opacity-0 scale-95'
          : 'opacity-0 translate-x-full scale-95 pointer-events-none'
      )}
    >
      {children}
    </div>
  )
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-eand-ocean via-ramadan-deep to-eand-ocean flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float">🌙</div>
        <div className="absolute top-20 right-16 text-3xl opacity-15 animate-float-slow delay-500">⭐</div>
        <div className="absolute bottom-32 left-8 text-3xl opacity-15 animate-float delay-300">🏮</div>
        <div className="absolute bottom-20 right-12 text-4xl opacity-20 animate-float-slow delay-700">✨</div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-ramadan-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {showContent && (
        <div className="text-center z-10 max-w-md mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <EandLogo size="lg" className="mx-auto brightness-0 invert" />
          </div>

          {/* Crescent */}
          <div className="text-6xl mb-6 animate-scale-in">🌙</div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ramadan Experience
          </h1>
          <h2 className="text-xl text-ramadan-gold font-semibold mb-3 animate-fade-in-up delay-100">
            Share Your Journey
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-10 animate-fade-in-up delay-200">
            Take 2 minutes to relive the best Ramadan moments and help us make next year even more special.
          </p>

          {/* Sections preview */}
          <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in-up delay-300">
            {['🟣', '🟡', '🔵', '🔴', '🟢'].map((emoji, i) => (
              <span
                key={i}
                className="text-xl opacity-60 animate-float"
                style={{ animationDelay: `${i * 300}ms` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            className="group relative px-10 py-4 bg-ramadan-gold text-eand-ocean font-bold text-lg rounded-2xl shadow-xl shadow-ramadan-gold/20 hover:shadow-ramadan-gold/40 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up delay-400"
          >
            <span className="flex items-center gap-2">
              Let&apos;s Begin
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <p className="text-white/30 text-xs mt-6 animate-fade-in delay-500">
            6 quick steps • Takes about 2 minutes
          </p>
        </div>
      )}
    </div>
  )
}
