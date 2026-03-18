import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { responses, completedAt } = body

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Invalid survey data' }, { status: 400 })
    }

    const surveyDoc = {
      responses,
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    const docRef = await db.collection('survey_responses').add(surveyDoc)

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 })
  }
}
