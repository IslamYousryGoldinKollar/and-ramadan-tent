'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { YouTubeEmbed } from '@/components/riddles/youtube-embed'
import { QuestionForm } from '@/components/riddles/question-form'
import { UserInfoForm } from '@/components/public/user-info-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isValidEandEmail } from '@/lib/utils'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { EandLogo } from '@/components/ui/eand-logo'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}

interface Episode {
  id: string
  title: string
  description?: string
  youtubeUrl: string
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
  const [employeeId, setEmployeeId] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<{
    employeeId?: string
    employeeName?: string
    email?: string
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

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required'
    }
    if (!employeeName.trim()) {
      newErrors.employeeName = 'Full name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEandEmail(email)) {
      newErrors.email = 'Email must be from @eand.com domain'
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
        selectedAnswer: answers[q.id] as 'A' | 'B' | 'C' | 'D',
      }))

      const response = await fetch(`/api/riddles/${episode.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          employeeName,
          email: email.toLowerCase(),
          answers: answerArray,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answers')
      }

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <Link href="/riddles" className="flex items-center gap-2 text-gray-600 active:text-eand-red">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Episodes</span>
          </Link>
          <EandLogo size="sm" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-5">
        {/* Episode Info */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Ep. {episode.episodeNumber}: {episode.title}
          </h1>
          {episode.description && (
            <p className="text-sm text-gray-500">{episode.description}</p>
          )}
        </div>

        <Card className="border border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            <YouTubeEmbed url={episode.youtubeUrl} title={episode.title} />
          </CardContent>
        </Card>

        {/* User Info Form */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserInfoForm
              employeeId={employeeId}
              employeeName={employeeName}
              email={email}
              onEmployeeIdChange={setEmployeeId}
              onEmployeeNameChange={setEmployeeName}
              onEmailChange={setEmail}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Questions */}
        {episode.questions.length > 0 && (
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Answer the Questions</CardTitle>
              <p className="text-xs text-gray-500">
                Watch the video above then answer below
              </p>
            </CardHeader>
            <CardContent>
              <QuestionForm
                questions={episode.questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
              {errors.answers && (
                <p className="text-sm text-red-600 mt-4">{errors.answers}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || !episode.isActive}
          size="lg"
          className="w-full py-6 text-base rounded-xl shadow-md active:scale-[0.98] transition-transform"
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </Button>
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
