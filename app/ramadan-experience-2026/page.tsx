'use client'

import { useState, useCallback, useEffect } from 'react'
import { EandLogo } from '@/components/ui/eand-logo'
import { ProgressBar } from '@/components/survey/progress-bar'
import { EmojiRating } from '@/components/survey/emoji-rating'
import { StarRating } from '@/components/survey/star-rating'
import { SliderRating } from '@/components/survey/slider-rating'
import { ChoiceCards } from '@/components/survey/choice-cards'
import { AutoSlideHero } from '@/components/survey/auto-slide-hero'
import { CharacterShowcase } from '@/components/survey/character-showcase'
import { CompletionScreen } from '@/components/survey/completion-screen'
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight, User, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTION_LABELS = ['Identity', 'Activities', 'Tent', 'Fawazeer', 'Cooking', 'Branding']

const DEPARTMENTS = [
  'Human Resources', 'Finance', 'Marketing', 'Sales', 'Technology',
  'Customer Experience', 'Legal', 'Operations', 'Strategy',
  'Corporate Communications', 'Procurement', 'Internal Audit', 'Other',
]

const tentImages = [
  '/1772441430606.jpeg',
  '/1772441431138.jpeg',
  '/ramadan activity32.jpg',
  '/ramadan activity33.jpg',
  '/ramadan activity34.jpg',
  '/ramadan activity35.jpg',
  '/ramadan activity36.jpg',
  '/ramadan activity37.jpg',
  '/ramadan activity38.jpg',
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
  '/ramadan activity32.jpg',
  '/ramadan activity35.jpg',
  '/ramadan activity37.jpg',
  '/ramadan activity38.jpg',
  '/1772441430606.jpeg',
  '/1772441431138.jpeg',
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
      }, 350)
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
    }, 350)
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
      {/* Compact header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/[0.04]">
        <div className="px-5 pt-3 pb-2.5 flex items-center justify-between">
          <EandLogo size="sm" className="brightness-0 invert opacity-60" />
          <span className="text-[11px] font-medium text-white/30 tracking-wide uppercase">Ramadan Survey</span>
        </div>
        <div className="px-5 pb-3">
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
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-5">
              <User className="w-5 h-5 text-white/40" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-1.5 text-center">Tell Us About You</h2>
            <p className="text-white/40 text-sm mb-8 text-center">So we can understand your perspective better</p>

            <div className="w-full max-w-sm flex flex-col gap-5">
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Employee ID
                </label>
                <input
                  type="text"
                  value={data.employeeId || ''}
                  onChange={(e) => update('employeeId', e.target.value)}
                  placeholder="Enter your employee ID"
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-ramadan-gold/40 focus:border-ramadan-gold/30 transition-all"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Department
                </label>
                <select
                  value={data.department || ''}
                  onChange={(e) => update('department', e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-ramadan-gold/40 focus:border-ramadan-gold/30 transition-all appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'rgba(255,255,255,0.3)\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                >
                  <option value="" disabled className="bg-eand-ocean text-white/40">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-eand-ocean text-white">{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </SectionPanel>

        {/* Section 1: Activities — Slider Rating */}
        <SectionPanel active={currentSection === 1} transitioning={transitioning}>
          <AutoSlideHero
            images={activityBgImages}
            interval={4000}
            overlay="bg-gradient-to-b from-eand-ocean/80 via-eand-ocean/65 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-1.5 text-center">Ramadan Activities</h2>
              <p className="text-white/40 text-sm mb-10 text-center max-w-sm">
                Think back to all the activities and events we organized
              </p>
              <SliderRating
                question="How much did you enjoy the Ramadan activities overall?"
                value={data.activitiesRating}
                onRate={(r) => update('activitiesRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 2: Tent — Emoji Rating with stats in question */}
        <SectionPanel active={currentSection === 2} transitioning={transitioning}>
          <AutoSlideHero
            images={tentImages}
            interval={3500}
            overlay="bg-gradient-to-b from-eand-ocean/80 via-eand-ocean/60 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-1.5 text-center">Ramadan Tent</h2>
              <p className="text-white/40 text-sm mb-10 text-center max-w-sm">
                The heart of our Ramadan gathering for Iftar
              </p>
              <EmojiRating
                question="1,744 employees registered and 6,288 visited the tent page. How would you rate the experience?"
                value={data.tentRating}
                onRate={(r) => update('tentRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 3: Fawazeer — Choice Cards with big character showcase */}
        <SectionPanel active={currentSection === 3} transitioning={transitioning}>
          <div className="flex-1 bg-gradient-to-b from-indigo-950/80 via-eand-ocean to-eand-ocean flex flex-col overflow-hidden">
            <div className="text-center pt-5 px-6">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">Ramadan Fawazeer</h2>
              <p className="text-white/40 text-xs">Fun, culture, and employee-powered storytelling</p>
            </div>

            <CharacterShowcase images={fawazeerCharacters} interval={2500} />

            <div className="px-6 pb-6 pt-2">
              <ChoiceCards
                question="How engaging were the Ramadan Fawazeer?"
                value={data.fawazeerRating}
                onRate={(r) => update('fawazeerRating', r)}
                choices={[
                  { label: 'Didn\'t watch', description: 'Missed it this time' },
                  { label: 'It was okay', description: 'Some episodes were nice' },
                  { label: 'Enjoyed it', description: 'Fun and creative' },
                  { label: 'Loved it', description: 'Highlight of Ramadan' },
                  { label: 'Absolutely amazing', description: 'Want more next year!' },
                ]}
              />
            </div>
          </div>
        </SectionPanel>

        {/* Section 4: Cooking Show — Star Rating */}
        <SectionPanel active={currentSection === 4} transitioning={transitioning}>
          <AutoSlideHero
            images={cookingImages}
            interval={4000}
            overlay="bg-gradient-to-b from-eand-ocean/80 via-eand-ocean/65 to-eand-ocean/90"
          >
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-1.5 text-center">Cooking Show</h2>
              <p className="text-white/40 text-sm mb-10 text-center max-w-sm">
                Where food met company culture and team spirit
              </p>
              <StarRating
                question="How would you rate the Cooking Show experience?"
                value={data.cookingRating}
                onRate={(r) => update('cookingRating', r)}
              />
            </div>
          </AutoSlideHero>
        </SectionPanel>

        {/* Section 5: Branding — Star Rating */}
        <SectionPanel active={currentSection === 5} transitioning={transitioning}>
          <div className="flex-1 bg-gradient-to-b from-eand-ocean via-eand-ocean to-eand-ocean flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-ramadan-gold/[0.03] rounded-full blur-[80px]" />

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-1.5 text-center relative z-10">Branding & Atmosphere</h2>
            <p className="text-white/40 text-sm mb-10 text-center max-w-sm relative z-10">
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

      {/* Compact bottom navigation */}
      <div className="sticky bottom-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-t border-white/[0.04]">
        <div className="px-5 py-3 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentSection === 0}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-300',
              currentSection === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={goNext}
            disabled={!canProceed() || submitting}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300',
              canProceed()
                ? 'bg-ramadan-gold text-eand-ocean hover:bg-ramadan-gold/90'
                : 'bg-white/[0.06] text-white/20 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-eand-ocean/30 border-t-eand-ocean rounded-full animate-spin" />
                Sending...
              </>
            ) : currentSection === totalSections - 1 ? (
              <>
                Submit
                <Sparkles className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-3.5 h-3.5" />
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
        'absolute inset-0 flex flex-col transition-all duration-400 ease-out',
        active && !transitioning
          ? 'opacity-100 translate-y-0'
          : active && transitioning
          ? 'opacity-0 translate-y-3'
          : 'opacity-0 translate-y-6 pointer-events-none'
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
    <div className="min-h-screen bg-eand-ocean flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-ramadan-gold/[0.04] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] bg-indigo-500/[0.04] rounded-full blur-[80px]" />

      {showContent && (
        <div className="text-center z-10 max-w-sm mx-auto">
          <div className="mb-6 animate-fade-in">
            <EandLogo size="md" className="mx-auto brightness-0 invert opacity-70" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 animate-fade-in-up">
            Ramadan Experience
          </h1>
          <p className="text-ramadan-gold/80 text-sm font-medium mb-2 animate-fade-in-up delay-100">
            Share Your Journey
          </p>
          <p className="text-white/40 text-sm leading-relaxed mb-10 animate-fade-in-up delay-200">
            Take 2 minutes to relive the best Ramadan moments and help us make next year even more special.
          </p>

          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 px-8 py-3 bg-ramadan-gold text-eand-ocean font-semibold text-sm rounded-lg hover:bg-ramadan-gold/90 transition-all duration-300 animate-fade-in-up delay-300"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <p className="text-white/20 text-xs mt-5 animate-fade-in delay-400">
            6 quick steps &middot; About 2 minutes
          </p>
        </div>
      )}
    </div>
  )
}
