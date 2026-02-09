'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { VideoEmbed } from '@/components/riddles/video-embed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'
import { trackAnalyticsEvent } from '@/components/tracking/page-tracker'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
}

interface Episode {
  id: string
  title: string
  description?: string
  videoUrl: string
  episodeNumber: number
  isActive: boolean
  questions: Question[]
}

export default function EpisodePage() {
  const params = useParams()
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<{
    email?: string
    idNumber?: string
    phoneNumber?: string
    answers?: string
  }>({})

  useEffect(() => {
    if (params.episodeId) {
      fetchEpisode()
    }
  }, [params.episodeId])

  const fetchEpisode = async () => {
    try {
      const response = await fetch(`/api/riddles/${params.episodeId}`)
      if (response.ok) {
        const data = await response.json()
        setEpisode(data)
      } else {
        router.push('/riddles')
      }
    } catch (error) {
      console.error('Error fetching episode:', error)
      router.push('/riddles')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!idNumber.trim()) {
      newErrors.idNumber = 'ID number is required'
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!episode || episode.questions.length === 0) {
      newErrors.answers = 'No questions available'
    } else {
      const allAnswered = episode.questions.every((q) => answers[q.id])
      if (!allAnswered) {
        newErrors.answers = 'Please answer all questions'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !episode) {
      return
    }

    setSubmitting(true)

    try {
      const answerArray = episode.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] as 'A' | 'B' | 'C',
      }))

      const response = await fetch(`/api/riddles/${episode.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          idNumber,
          phoneNumber,
          answers: answerArray,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answers')
      }

      trackAnalyticsEvent('riddle_submit', { episodeId: episode.id, episodeNumber: episode.episodeNumber })
      setShowSuccess(true)
    } catch (error: any) {
      setErrors({ answers: error.message || 'An error occurred' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!episode) {
    return null
  }

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <Link href="/riddles" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Episodes</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      <main className="flex-1 py-6 lg:py-10">
        <div className="content-container space-y-5">
        {/* Episode Info */}
        <div className="opacity-0 animate-fade-in-up">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Ep. {episode.episodeNumber}: {episode.title}
          </h1>
          {episode.description && (
            <p className="text-sm text-gray-500">{episode.description}</p>
          )}
        </div>

        <Card className="border border-gray-100 overflow-hidden opacity-0 animate-fade-in-up delay-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-0">
            <VideoEmbed url={episode.videoUrl} title={episode.title} />
          </CardContent>
        </Card>

        {/* User Info Form */}
        <Card className="border border-gray-100 opacity-0 animate-fade-in-up delay-200 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="transition-all duration-200 focus:ring-2 focus:ring-eand-ocean/20 focus:border-eand-ocean"
              />
              {errors.email && <p className="text-xs text-red-600 animate-fade-in">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Your ID number"
                className="transition-all duration-200 focus:ring-2 focus:ring-eand-ocean/20 focus:border-eand-ocean"
              />
              {errors.idNumber && <p className="text-xs text-red-600 animate-fade-in">{errors.idNumber}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Your phone number"
                className="transition-all duration-200 focus:ring-2 focus:ring-eand-ocean/20 focus:border-eand-ocean"
              />
              {errors.phoneNumber && <p className="text-xs text-red-600 animate-fade-in">{errors.phoneNumber}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        {episode.questions.length > 0 && (
          <Card className="opacity-0 animate-fade-in-up delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Answer the Questions</CardTitle>
              <p className="text-xs text-gray-500">
                Watch the video above then answer below
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {episode.questions.map((question, idx) => (
                <div key={question.id} className="space-y-3 opacity-0 animate-fade-in-up" style={{ animationDelay: `${400 + idx * 150}ms` }}>
                  <p className="font-medium text-sm">
                    {idx + 1}. {question.questionText}
                  </p>
                  <div className="space-y-2">
                    {(['A', 'B', 'C'] as const).map((option) => {
                      const optionText = question[`option${option}` as keyof Question] as string
                      const isSelected = answers[question.id] === option
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm ${
                            isSelected
                              ? 'border-eand-red bg-red-50 text-eand-red font-medium shadow-sm scale-[1.01]'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.99]'
                          }`}
                        >
                          <span className="font-semibold mr-2">{option}.</span>
                          {optionText}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {errors.answers && (
                <p className="text-sm text-red-600 mt-4 animate-fade-in">{errors.answers}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="opacity-0 animate-fade-in-up delay-500">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !episode.isActive}
            size="lg"
            className="w-full py-6 text-base rounded-xl shadow-md active:scale-[0.97] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </div>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center">Answers Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Your answers have been recorded. Winners will be selected by random raffle from correct answers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSuccess(false)}
              className="flex-1 rounded-xl"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false)
                router.push('/riddles')
              }}
              className="flex-1 rounded-xl"
            >
              More Episodes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
