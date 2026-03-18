import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // No orderBy — sort in JS to avoid Firestore index requirements on named DB
    const snapshot = await db.collection('survey_responses').get()
    const responses = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''))

    const total = responses.length
    const ratingKeys = ['activities', 'tent', 'fawazeer', 'cooking', 'branding'] as const
    const fieldMap: Record<string, string> = {
      activities: 'activitiesRating',
      tent: 'tentRating',
      fawazeer: 'fawazeerRating',
      cooking: 'cookingRating',
      branding: 'brandingRating',
    }

    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}
    const distributions: Record<string, number[]> = {}
    for (const k of ratingKeys) {
      sums[k] = 0; counts[k] = 0; distributions[k] = [0, 0, 0, 0, 0]
    }

    const departments: Record<string, number> = {}
    const dailyCounts: Record<string, number> = {}

    for (const r of responses) {
      const data = (r as any).responses || {}

      for (const k of ratingKeys) {
        const val = data[fieldMap[k]]
        if (val && val >= 1 && val <= 5) {
          sums[k] += val
          counts[k]++
          distributions[k][val - 1]++
        }
      }

      if (data.department) {
        departments[data.department] = (departments[data.department] || 0) + 1
      }

      const date = ((r as any).createdAt || '').split('T')[0]
      if (date) {
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
      }
    }

    const averages: Record<string, number> = {}
    for (const k of ratingKeys) {
      averages[k] = counts[k] ? +(sums[k] / counts[k]).toFixed(2) : 0
    }

    return NextResponse.json({
      total,
      averages,
      distributions,
      departments,
      dailyCounts,
      recentResponses: responses.slice(0, 50),
    })
  } catch (error) {
    console.error('Survey report error:', error)
    return NextResponse.json({ error: 'Failed to fetch survey data' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { ids } = await request.json()
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    const batch = db.batch()
    for (const id of ids) {
      batch.delete(db.collection('survey_responses').doc(id))
    }
    await batch.commit()

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error('Survey delete error:', error)
    return NextResponse.json({ error: 'Failed to delete records' }, { status: 500 })
  }
}
