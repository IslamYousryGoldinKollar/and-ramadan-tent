'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

interface Answer {
  id: string
  employeeId: string
  employeeName: string
  email: string
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

  // Group answers by employee
  const answersByEmployee = answers.reduce((acc, answer) => {
    const key = `${answer.employeeId}-${answer.email}`
    if (!acc[key]) {
      acc[key] = {
        employeeId: answer.employeeId,
        employeeName: answer.employeeName,
        email: answer.email,
        answers: [],
        submittedAt: answer.submittedAt,
      }
    }
    acc[key].answers.push(answer)
    return acc
  }, {} as Record<string, { employeeId: string; employeeName: string; email: string; answers: Answer[]; submittedAt: string }>)

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-8 w-8" />
            All Answers
          </h1>
          <p className="text-gray-600 mt-2">
            View all submissions for this episode
          </p>
        </div>

        {Object.keys(answersByEmployee).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No answers submitted yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.values(answersByEmployee).map((employeeAnswers, index) => {
              const correctCount = employeeAnswers.answers.filter((a) => a.isCorrect).length
              const totalQuestions = employeeAnswers.answers.length
              const allCorrect = correctCount === totalQuestions

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{employeeAnswers.employeeName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {employeeAnswers.employeeId} • {employeeAnswers.email}
                        </p>
                      </div>
                      <Badge variant={allCorrect ? 'success' : 'outline'}>
                        {correctCount}/{totalQuestions} Correct
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employeeAnswers.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="font-medium mb-2">{answer.question.questionText}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Selected: </span>
                              <span className="font-semibold">{answer.selectedAnswer}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                (Correct: {answer.question.correctAnswer})
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
                      Submitted: {new Date(employeeAnswers.submittedAt).toLocaleString()}
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
