'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { YouTubeEmbed } from '@/components/riddles/youtube-embed'
import { Plus, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
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

export default function EpisodeManagementPage() {
  const params = useParams()
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)

  // Question form state
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A')

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
      }
    } catch (error) {
      console.error('Error fetching episode:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!episode) return

    try {
      const response = await fetch(`/api/riddles/${episode.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
        }),
      })

      if (response.ok) {
        setShowQuestionDialog(false)
        setQuestionText('')
        setOptionA('')
        setOptionB('')
        setOptionC('')
        setOptionD('')
        setCorrectAnswer('A')
        fetchEpisode()
      }
    } catch (error) {
      console.error('Error adding question:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!episode) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/riddles" className="text-sm text-gray-600 hover:text-eand-red flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Episodes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Episode {episode.episodeNumber}: {episode.title}
            </h1>
          </div>
          <Button onClick={() => setShowQuestionDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Video Preview */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <YouTubeEmbed url={episode.youtubeUrl} title={episode.title} />
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Questions ({episode.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {episode.questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No questions yet. Add your first question!</p>
            ) : (
              <div className="space-y-4">
                {episode.questions.map((question, index) => (
                  <Card key={question.id} className="modern-card border border-gray-100 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Badge variant="success">Correct: {question.correctAnswer}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-4">{question.questionText}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>A. {question.optionA}</div>
                        <div>B. {question.optionB}</div>
                        <div>C. {question.optionC}</div>
                        <div>D. {question.optionD}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Answers */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/admin/riddles/${episode.id}/answers`}>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Answers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Add Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>
              Add a multiple choice question for this episode
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question</Label>
              <Input
                id="questionText"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter the question"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="optionA">Option A</Label>
                <Input
                  id="optionA"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Option A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionB">Option B</Label>
                <Input
                  id="optionB"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Option B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionC">Option C</Label>
                <Input
                  id="optionC"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Option C"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionD">Option D</Label>
                <Input
                  id="optionD"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Option D"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              <select
                id="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowQuestionDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddQuestion} className="flex-1">
                Add Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
