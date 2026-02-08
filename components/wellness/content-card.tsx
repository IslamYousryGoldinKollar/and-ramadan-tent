'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

interface WellnessContentCardProps {
  id: string
  title: string
  content: string
  pdfUrl?: string | null
}

export function WellnessContentCard({
  title,
  content,
  pdfUrl,
}: WellnessContentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none mb-4">
          <p className="whitespace-pre-line text-gray-700">{content}</p>
        </div>
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  )
}
