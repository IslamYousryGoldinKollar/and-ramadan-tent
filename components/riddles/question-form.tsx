'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Question {
  id: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
}

interface QuestionFormProps {
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, answer: string) => void
}

export function QuestionForm({
  questions,
  answers,
  onAnswerChange,
}: QuestionFormProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {index + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium mb-4">{question.questionText}</p>
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => onAnswerChange(question.id, value)}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id={`q${question.id}-A`} />
                  <Label htmlFor={`q${question.id}-A`} className="cursor-pointer">
                    A. {question.optionA}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id={`q${question.id}-B`} />
                  <Label htmlFor={`q${question.id}-B`} className="cursor-pointer">
                    B. {question.optionB}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id={`q${question.id}-C`} />
                  <Label htmlFor={`q${question.id}-C`} className="cursor-pointer">
                    C. {question.optionC}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="D" id={`q${question.id}-D`} />
                  <Label htmlFor={`q${question.id}-D`} className="cursor-pointer">
                    D. {question.optionD}
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
