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
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { VideoEmbed } from '@/components/riddles/video-embed'
import { Plus, ArrowLeft, Eye, Trophy, Trash2, Edit, Download } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  correctAnswer: string
}

interface Episode {
  id: string
  title: string
  description?: string
  videoUrl: string
  episodeNumber: number
  isActive: boolean
  questions: Question[]
  _count?: { answers: number }
}

export default function EpisodeManagementPage() {
  const params = useParams()
  const router = useRouter()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null)

  // Question form state
  const [questionText, setQuestionText] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C'>('A')

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

  const resetForm = () => {
    setQuestionText('')
    setOptionA('')
    setOptionB('')
    setOptionC('')
    setCorrectAnswer('A')
    setEditingQuestion(null)
  }

  const openEditQuestion = (q: Question) => {
    setEditingQuestion(q)
    setQuestionText(q.questionText)
    setOptionA(q.optionA)
    setOptionB(q.optionB)
    setOptionC(q.optionC)
    setCorrectAnswer(q.correctAnswer as 'A' | 'B' | 'C')
    setShowQuestionDialog(true)
  }

  const handleSaveQuestion = async () => {
    if (!episode) return

    try {
      const payload = { questionText, optionA, optionB, optionC, correctAnswer }

      if (editingQuestion) {
        // Update existing question
        const response = await fetch(`/api/riddles/${episode.id}/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          setShowQuestionDialog(false)
          resetForm()
          fetchEpisode()
        }
      } else {
        // Create new question
        const response = await fetch(`/api/riddles/${episode.id}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          setShowQuestionDialog(false)
          resetForm()
          fetchEpisode()
        }
      }
    } catch (error) {
      console.error('Error saving question:', error)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!deleteQuestionId || !episode) return
    try {
      await fetch(`/api/riddles/${episode.id}/questions/${deleteQuestionId}`, { method: 'DELETE' })
      setDeleteQuestionId(null)
      fetchEpisode()
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const handleExportAnswers = async () => {
    if (!episode) return
    try {
      const response = await fetch(`/api/riddles/${episode.id}/answers`)
      if (!response.ok) return
      const answers = await response.json()
      const csv = [
        ['Email', 'ID Number', 'Phone', 'Question', 'Selected', 'Correct Answer', 'Is Correct', 'Submitted At'],
        ...answers.map((a: any) => [
          a.email, a.idNumber, a.phoneNumber,
          a.question?.questionText || '', a.selectedAnswer,
          a.question?.correctAnswer || '', a.isCorrect ? 'Yes' : 'No',
          new Date(a.submittedAt).toLocaleString(),
        ]),
      ].map((row) => row.map((c: string) => `"${c}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `answers-episode-${episode.episodeNumber}.csv`
      a.click()
    } catch (error) {
      console.error('Error exporting answers:', error)
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
          <Button onClick={() => { resetForm(); setShowQuestionDialog(true) }}>
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
            <VideoEmbed url={episode.videoUrl} title={episode.title} />
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
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Correct: {question.correctAnswer}</Badge>
                          <Button variant="outline" size="sm" onClick={() => openEditQuestion(question)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteQuestionId(question.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium mb-4">{question.questionText}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className={question.correctAnswer === 'A' ? 'font-bold text-green-700 bg-green-50 p-2 rounded' : 'p-2'}>A. {question.optionA}</div>
                        <div className={question.correctAnswer === 'B' ? 'font-bold text-green-700 bg-green-50 p-2 rounded' : 'p-2'}>B. {question.optionB}</div>
                        <div className={question.correctAnswer === 'C' ? 'font-bold text-green-700 bg-green-50 p-2 rounded' : 'p-2'}>C. {question.optionC}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="modern-card">
            <CardContent className="pt-6">
              <Link href={`/admin/riddles/${episode.id}/answers`}>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Answers ({episode._count?.answers || 0})
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="pt-6">
              <Link href={`/admin/riddles/${episode.id}/raffle`}>
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Raffle Management
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full" onClick={handleExportAnswers}>
                <Download className="h-4 w-4 mr-2" />
                Export Answers CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={(open) => { if (!open) resetForm(); setShowQuestionDialog(open) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Update the question details' : 'Add a multiple choice question for this episode'}
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
            <div className="grid grid-cols-3 gap-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              <select
                id="correctAnswer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { resetForm(); setShowQuestionDialog(false) }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveQuestion} className="flex-1" disabled={!questionText || !optionA || !optionB || !optionC}>
                {editingQuestion ? 'Save Changes' : 'Add Question'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        open={!!deleteQuestionId}
        onOpenChange={(open) => !open && setDeleteQuestionId(null)}
        title="Delete Question"
        description="This will permanently delete this question and all its answers. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteQuestion}
      />
    </DashboardLayout>
  )
}
