import { NextRequest, NextResponse } from 'next/server'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

export async function GET(request: NextRequest) {
  const steps: string[] = []
  try {
    steps.push('Starting debug-storage')
    
    // 1. Check Env Vars
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    steps.push(`Has FIREBASE_SERVICE_ACCOUNT_KEY: ${hasServiceAccount}`)
    
    // 2. Check Apps
    const apps = getApps()
    steps.push(`Current apps: ${apps.length}`)
    
    let app
    if (apps.length === 0) {
      steps.push('Initializing new app')
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            app = initializeApp({
                credential: cert(serviceAccount),
                projectId: 'kedup-9rc91',
                storageBucket: 'kedup-9rc91.firebasestorage.app',
            })
            steps.push('Initialized with cert')
        } catch (e) {
            steps.push(`Error parsing service account: ${e instanceof Error ? e.message : String(e)}`)
            throw e
        }
      } else {
        app = initializeApp({
            projectId: 'kedup-9rc91',
            storageBucket: 'kedup-9rc91.firebasestorage.app',
        })
        steps.push('Initialized default')
      }
    } else {
      app = apps[0]
      steps.push(`Using existing app: ${app.name}`)
      // Check options
      steps.push(`App options: ${JSON.stringify(app.options)}`)
    }

    // 3. Get Storage
    steps.push('Getting storage')
    const storage = getStorage(app)
    steps.push('Got storage instance')

    // 4. Get Bucket
    steps.push('Getting bucket')
    const bucket = storage.bucket() // Should use default from config
    steps.push(`Got bucket ref: ${bucket.name}`)

    // 5. Test Access (Get Metadata)
    steps.push('Testing bucket access (getMetadata)')
    try {
        const [metadata] = await bucket.getMetadata()
        steps.push('Got metadata')
        return NextResponse.json({ success: true, steps, metadata })
    } catch (e) {
        steps.push(`Error accessing bucket: ${e instanceof Error ? e.message : String(e)}`)
        return NextResponse.json({ success: false, steps, error: String(e) }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      steps, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
