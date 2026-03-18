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

    const snapshot = await db.collection('survey_responses').orderBy('createdAt', 'desc').get()
    const responses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Compute aggregated stats
    const total = responses.length
    const ratings = {
      activities: { sum: 0, count: 0 },
      tent: { sum: 0, count: 0 },
      fawazeer: { sum: 0, count: 0 },
      cooking: { sum: 0, count: 0 },
      branding: { sum: 0, count: 0 },
    }

    const departments: Record<string, number> = {}
    const dailyCounts: Record<string, number> = {}

    for (const r of responses) {
      const data = (r as any).responses || {}

      if (data.activitiesRating) { ratings.activities.sum += data.activitiesRating; ratings.activities.count++ }
      if (data.tentRating) { ratings.tent.sum += data.tentRating; ratings.tent.count++ }
      if (data.fawazeerRating) { ratings.fawazeer.sum += data.fawazeerRating; ratings.fawazeer.count++ }
      if (data.cookingRating) { ratings.cooking.sum += data.cookingRating; ratings.cooking.count++ }
      if (data.brandingRating) { ratings.branding.sum += data.brandingRating; ratings.branding.count++ }

      if (data.department) {
        departments[data.department] = (departments[data.department] || 0) + 1
      }

      const date = ((r as any).createdAt || '').split('T')[0]
      if (date) {
        dailyCounts[date] = (dailyCounts[date] || 0) + 1
      }
    }

    const averages = {
      activities: ratings.activities.count ? +(ratings.activities.sum / ratings.activities.count).toFixed(2) : 0,
      tent: ratings.tent.count ? +(ratings.tent.sum / ratings.tent.count).toFixed(2) : 0,
      fawazeer: ratings.fawazeer.count ? +(ratings.fawazeer.sum / ratings.fawazeer.count).toFixed(2) : 0,
      cooking: ratings.cooking.count ? +(ratings.cooking.sum / ratings.cooking.count).toFixed(2) : 0,
      branding: ratings.branding.count ? +(ratings.branding.sum / ratings.branding.count).toFixed(2) : 0,
    }

    // Distribution per category (count per rating 1-5)
    const distributions: Record<string, number[]> = {
      activities: [0, 0, 0, 0, 0],
      tent: [0, 0, 0, 0, 0],
      fawazeer: [0, 0, 0, 0, 0],
      cooking: [0, 0, 0, 0, 0],
      branding: [0, 0, 0, 0, 0],
    }

    for (const r of responses) {
      const data = (r as any).responses || {}
      if (data.activitiesRating >= 1 && data.activitiesRating <= 5) distributions.activities[data.activitiesRating - 1]++
      if (data.tentRating >= 1 && data.tentRating <= 5) distributions.tent[data.tentRating - 1]++
      if (data.fawazeerRating >= 1 && data.fawazeerRating <= 5) distributions.fawazeer[data.fawazeerRating - 1]++
      if (data.cookingRating >= 1 && data.cookingRating <= 5) distributions.cooking[data.cookingRating - 1]++
      if (data.brandingRating >= 1 && data.brandingRating <= 5) distributions.branding[data.brandingRating - 1]++
    }

    return NextResponse.json({
      total,
      averages,
      distributions,
      departments,
      dailyCounts,
      recentResponses: responses.slice(0, 20),
    })
  } catch (error) {
    console.error('Survey report error:', error)
    return NextResponse.json({ error: 'Failed to fetch survey data' }, { status: 500 })
  }
}
