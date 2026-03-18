'use client'

import { useState, useCallback, useEffect } from 'react'
import { EandLogo } from '@/components/ui/eand-logo'
import { ProgressBar } from '@/components/survey/progress-bar'
import { ImageCarousel } from '@/components/survey/image-carousel'
import { EmojiRating } from '@/components/survey/emoji-rating'
import { ChoiceSelector } from '@/components/survey/choice-selector'
import { TextFeedback } from '@/components/survey/text-feedback'
import { SectionWrapper } from '@/components/survey/section-wrapper'
import { CompletionScreen } from '@/components/survey/completion-screen'
import { Moon, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTION_LABELS = ['Activities', 'Tent', 'Fawazeer', 'Cooking', 'Branding']

const activityImages = [
  { src: '/ramadan activity32.jpg', alt: 'Activity 1' },
  { src: '/ramadan activity33.jpg', alt: 'Activity 2' },
  { src: '/ramadan activity34.jpg', alt: 'Activity 3' },
  { src: '/ramadan activity35.jpg', alt: 'Activity 4' },
  { src: '/ramadan activity36.jpg', alt: 'Activity 5' },
  { src: '/ramadan activity37.jpg', alt: 'Activity 6' },
  { src: '/ramadan activity38.jpg', alt: 'Activity 7' },
]

const fawazeerImages = [
  { src: '/fawazeer32.png', alt: 'Fawazeer 1' },
  { src: '/fawazeer33.png', alt: 'Fawazeer 2' },
  { src: '/fawazeer34.png', alt: 'Fawazeer 3' },
  { src: '/fawazeer35.png', alt: 'Fawazeer 4' },
  { src: '/fawazeer36.png', alt: 'Fawazeer 5' },
  { src: '/fawazeer37.png', alt: 'Fawazeer 6' },
  { src: '/fawazeer38.png', alt: 'Fawazeer 7' },
  { src: '/fawazeer39.png', alt: 'Fawazeer 8' },
  { src: '/fawazeer40.png', alt: 'Fawazeer 9' },
  { src: '/fawazeer41.png', alt: 'Fawazeer 10' },
  { src: '/fawazeer42.png', alt: 'Fawazeer 11' },
]

const cookingImages = [
  { src: '/coocking.JPG', alt: 'Cooking Show' },
  { src: '/coocking32.JPG', alt: 'Cooking Competition 1' },
  { src: '/coocking33.JPG', alt: 'Cooking Competition 2' },
  { src: '/coocking34.JPG', alt: 'Cooking Competition 3' },
]

interface SurveyData {
  // Section 1 - Activities
  activitiesEnjoyment?: number
  activitiesStandout?: number
  activitiesJoinAgain?: string
  // Section 2 - Tent
  tentUsed?: string
  tentExperience?: number
  tentImprovement?: string
  // Section 3 - Fawazeer
  fawazeerEngaging?: number
  fawazeerEmployees?: string
  fawazeerTone?: number
  // Section 4 - Cooking
  cookingIdea?: number
  cookingEngaging?: string
  cookingParticipate?: string
  // Section 5 - Branding
  brandingFeel?: number
  brandingEnhanced?: string
  brandingImprovement?: string
}

export default function SurveyPage() {
  const [started, setStarted] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none')
  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<SurveyData>({})

  const update = useCallback((key: keyof SurveyData, value: string | number) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const canProceed = useCallback(() => {
    switch (currentSection) {
      case 0:
        return data.activitiesEnjoyment && data.activitiesStandout !== undefined && data.activitiesJoinAgain
      case 1:
        return data.tentUsed && data.tentExperience
      case 2:
        return data.fawazeerEngaging && data.fawazeerEmployees
      case 3:
        return data.cookingIdea && data.cookingEngaging
      case 4:
        return data.brandingFeel && data.brandingEnhanced
      default:
        return false
    }
  }, [currentSection, data])

  const goNext = useCallback(async () => {
    if (currentSection < 4) {
      setDirection('left')
      setTimeout(() => {
        setCurrentSection((prev) => prev + 1)
        setDirection('right')
        setTimeout(() => setDirection('none'), 50)
      }, 300)
    } else {
      // Submit
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
  }, [currentSection, data])

  const goPrev = useCallback(() => {
    if (currentSection > 0) {
      setDirection('right')
      setTimeout(() => {
        setCurrentSection((prev) => prev - 1)
        setDirection('left')
        setTimeout(() => setDirection('none'), 50)
      }, 300)
    }
  }, [currentSection])

  // Keyboard navigation
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
            totalSteps={5}
            sectionLabels={SECTION_LABELS}
          />
        </div>
      </header>

      {/* Sections container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Section 1: Activities */}
        <SectionWrapper
          title="Pre-Ramadan & Ramadan Activities"
          subtitle="Relive the moments that brought us together"
          emoji="🟣"
          color="purple"
          isActive={currentSection === 0}
          direction={currentSection > 0 ? 'left' : currentSection < 0 ? 'right' : 'none'}
        >
          <ImageCarousel
            images={activityImages}
            selectable
            selectedIndex={data.activitiesStandout}
            onSelect={(i) => update('activitiesStandout', i)}
          />
          <p className="text-white/50 text-xs text-center -mt-4">↑ Tap the activity that stood out the most</p>
          <EmojiRating
            question="How much did you enjoy these activities?"
            value={data.activitiesEnjoyment}
            onRate={(r) => update('activitiesEnjoyment', r)}
          />
          <ChoiceSelector
            question="How likely are you to join again?"
            options={['Definitely!', 'Probably', 'Maybe next time', 'Not sure']}
            value={data.activitiesJoinAgain}
            onSelect={(v) => update('activitiesJoinAgain', v)}
          />
        </SectionWrapper>

        {/* Section 2: Ramadan Tent */}
        <SectionWrapper
          title="Ramadan Tent"
          subtitle="The warmth of gathering together for Iftar"
          emoji="🟡"
          color="amber"
          isActive={currentSection === 1}
          direction={currentSection > 1 ? 'left' : currentSection < 1 ? 'right' : 'none'}
        >
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-2">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-eand-ocean/80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🕌</span>
                <p className="text-white/90 text-xl font-bold">The Ramadan Tent</p>
                <p className="text-white/50 text-sm mt-1">Where everyone gathered for Iftar</p>
              </div>
            </div>
          </div>
          <ChoiceSelector
            question="Did you use the tent booking feature?"
            options={['Yes, multiple times!', 'Yes, once or twice', 'No, but I wanted to', 'No, I didn\'t know about it']}
            value={data.tentUsed}
            onSelect={(v) => update('tentUsed', v)}
          />
          <EmojiRating
            question="How was your overall tent experience?"
            value={data.tentExperience}
            onRate={(r) => update('tentExperience', r)}
          />
          <TextFeedback
            question="What would make the tent experience even better?"
            value={data.tentImprovement || ''}
            onChange={(v) => update('tentImprovement', v)}
            placeholder="Your ideas for improvement..."
          />
        </SectionWrapper>

        {/* Section 3: Fawazeer */}
        <SectionWrapper
          title="Fawazeer Riddles"
          subtitle="Fun, culture, and employee-powered storytelling"
          emoji="🔵"
          color="blue"
          isActive={currentSection === 2}
          direction={currentSection > 2 ? 'left' : currentSection < 2 ? 'right' : 'none'}
        >
          <ImageCarousel images={fawazeerImages} />
          <EmojiRating
            question="How engaging were the riddles?"
            value={data.fawazeerEngaging}
            onRate={(r) => update('fawazeerEngaging', r)}
          />
          <ChoiceSelector
            question="Did you like seeing employees in the content?"
            options={['Loved it! Made it personal', 'It was nice', 'Neutral', 'Prefer professional actors']}
            value={data.fawazeerEmployees}
            onSelect={(v) => update('fawazeerEmployees', v)}
          />
          <EmojiRating
            question="Was the tone (fun/music/storytelling) effective?"
            value={data.fawazeerTone}
            onRate={(r) => update('fawazeerTone', r)}
          />
        </SectionWrapper>

        {/* Section 4: Cooking Show */}
        <SectionWrapper
          title="Cooking Show Competition"
          subtitle="Where food met company culture and values"
          emoji="🔴"
          color="red"
          isActive={currentSection === 3}
          direction={currentSection > 3 ? 'left' : currentSection < 3 ? 'right' : 'none'}
        >
          <ImageCarousel images={cookingImages} />
          <EmojiRating
            question="How did you find the cooking competition idea?"
            value={data.cookingIdea}
            onRate={(r) => update('cookingIdea', r)}
          />
          <ChoiceSelector
            question="Was the cooking show engaging?"
            options={['Very engaging!', 'Quite interesting', 'Somewhat', 'Not really']}
            value={data.cookingEngaging}
            onSelect={(v) => update('cookingEngaging', v)}
          />
          <ChoiceSelector
            question="Would you participate in the next one?"
            options={['Absolutely! Sign me up!', 'Probably', 'Maybe as a viewer', 'Not my thing']}
            value={data.cookingParticipate}
            onSelect={(v) => update('cookingParticipate', v)}
          />
        </SectionWrapper>

        {/* Section 5: Branding */}
        <SectionWrapper
          title="Branding & Atmosphere"
          subtitle="The Ramadan identity across our spaces"
          emoji="🟢"
          color="emerald"
          isActive={currentSection === 4}
          direction={currentSection < 4 ? 'right' : 'none'}
        >
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-2 bg-gradient-to-br from-emerald-900/40 to-eand-ocean">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl animate-float">🏮</span>
                  <span className="text-5xl animate-float delay-200">🌙</span>
                  <span className="text-4xl animate-float delay-400">🏮</span>
                </div>
                <p className="text-white/90 text-xl font-bold">Ramadan Branding</p>
                <p className="text-white/50 text-sm mt-1">Decorations, visuals & Ramadan spirit</p>
              </div>
            </div>
          </div>
          <EmojiRating
            question="How did you feel about the Ramadan branding?"
            value={data.brandingFeel}
            onRate={(r) => update('brandingFeel', r)}
          />
          <ChoiceSelector
            question="Did the branding enhance your Ramadan experience?"
            options={['Definitely, it felt immersive!', 'Yes, it was noticeable', 'A little bit', 'Not really']}
            value={data.brandingEnhanced}
            onSelect={(v) => update('brandingEnhanced', v)}
          />
          <TextFeedback
            question="Any ideas to improve the Ramadan atmosphere?"
            value={data.brandingImprovement || ''}
            onChange={(v) => update('brandingImprovement', v)}
            placeholder="Share your vision..."
          />
        </SectionWrapper>
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
            ) : currentSection === 4 ? (
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
            5 quick sections • 100% anonymous
          </p>
        </div>
      )}
    </div>
  )
}
