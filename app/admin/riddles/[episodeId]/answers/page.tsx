'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Eye, ArrowLeft, Download, Search } from 'lucide-react'
import Link from 'next/link'

interface Answer {
  id: string
  email: string
  idNumber: string
  phoneNumber: string
  selectedAnswer: string
  isCorrect: boolean
  submittedAt: string
  question: {
    id: string
    questionText: string
    correctAnswer: string
  }
}

export default function AnswersPage() {
  const params = useParams()
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (params.episodeId) {
      fetchAnswers()
    }
  }, [params.episodeId])

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`/api/riddles/${params.episodeId}/answers`)
      if (response.ok) {
        const data = await response.json()
        setAnswers(data)
      }
    } catch (error) {
      console.error('Error fetching answers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group answers by user (idNumber + email)
  const answersByUser = answers.reduce((acc, answer) => {
    const key = `${answer.idNumber}-${answer.email}`
    if (!acc[key]) {
      acc[key] = {
        idNumber: answer.idNumber,
        email: answer.email,
        phoneNumber: answer.phoneNumber,
        answers: [],
        submittedAt: answer.submittedAt,
      }
    }
    acc[key].answers.push(answer)
    return acc
  }, {} as Record<string, { idNumber: string; email: string; phoneNumber: string; answers: Answer[]; submittedAt: string }>)

  const filteredUsers = Object.values(answersByUser).filter((user) => {
    if (!search) return true
    const s = search.toLowerCase()
    return user.email.toLowerCase().includes(s) || user.idNumber.toLowerCase().includes(s) || user.phoneNumber.includes(s)
  })

  const handleExportCSV = () => {
    const csv = [
      ['Email', 'ID Number', 'Phone', 'Question', 'Selected', 'Correct Answer', 'Is Correct', 'Submitted At'],
      ...answers.map((a) => [
        a.email, a.idNumber, a.phoneNumber,
        a.question?.questionText || '', a.selectedAnswer,
        a.question?.correctAnswer || '', a.isCorrect ? 'Yes' : 'No',
        new Date(a.submittedAt).toLocaleString(),
      ]),
    ].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `answers-episode-${params.episodeId}.csv`
    a.click()
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/admin/riddles/${params.episodeId}`} className="text-sm text-gray-600 hover:text-eand-red flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Episode
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="h-8 w-8" />
              All Answers ({answers.length})
            </h1>
            <p className="text-gray-600 mt-2">
              {Object.keys(answersByUser).length} unique participants
            </p>
          </div>
          <Button variant="outline" onClick={handleExportCSV} disabled={answers.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by email, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <Card className="modern-card">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">{search ? 'No matching submissions' : 'No answers submitted yet'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredUsers.map((user, index) => {
              const correctCount = user.answers.filter((a) => a.isCorrect).length
              const totalQuestions = user.answers.length
              const allCorrect = correctCount === totalQuestions

              return (
                <Card key={index} className="modern-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{user.email}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          ID: {user.idNumber} • Phone: {user.phoneNumber}
                        </p>
                      </div>
                      <Badge variant={allCorrect ? 'success' : 'outline'}>
                        {correctCount}/{totalQuestions} Correct
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`p-3 rounded-lg ${answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                        >
                          <p className="font-medium mb-2">{answer.question?.questionText}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Selected: </span>
                              <span className="font-semibold">{answer.selectedAnswer}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                (Correct: {answer.question?.correctAnswer})
                              </span>
                            </div>
                            {answer.isCorrect ? (
                              <Badge variant="success">Correct</Badge>
                            ) : (
                              <Badge variant="destructive">Incorrect</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Submitted: {new Date(user.submittedAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
