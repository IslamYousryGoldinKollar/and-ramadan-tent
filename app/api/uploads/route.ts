import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { saveUpload, listUploads, deleteUpload } from '@/lib/uploads'

const ALLOWED_UPLOAD_MIME_PREFIXES = ['image/', 'video/']

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 50MB max
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 })
    }

    if (!file.type || !ALLOWED_UPLOAD_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      return NextResponse.json({ error: 'Unsupported file type. Only image and video uploads are allowed.' }, { status: 400 })
    }

    const userId = (session.user as any).id
    const result = await saveUpload(file, userId)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    
    // Log error to Firestore for debugging
    try {
      const { db } = await import('@/lib/db')
      await db.collection('system_logs').add({
        route: '/api/uploads',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null,
        timestamp: new Date()
      })
    } catch (logError) {
      console.error('Failed to log error to Firestore:', logError)
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const mimeType = searchParams.get('type') || undefined

    const uploads = await listUploads({ mimeType })
    return NextResponse.json(uploads)
  } catch (error) {
    console.error('Error listing uploads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Upload ID required' }, { status: 400 })
    }

    await deleteUpload(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
