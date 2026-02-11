import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const DATABASE_ID = 'eandramadan'

let app: App

function getApp(): App {
  if (getApps().length === 0) {
    // On Firebase App Hosting, application default credentials are available automatically.
    // For local dev, set GOOGLE_APPLICATION_CREDENTIALS env var to a service account key file,
    // or provide FIREBASE_SERVICE_ACCOUNT_KEY as a JSON string in env.
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey)
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: 'kedup-9rc91',
        storageBucket: 'kedup-9rc91.firebasestorage.app',
      })
    } else {
      app = initializeApp({
        projectId: 'kedup-9rc91',
        storageBucket: 'kedup-9rc91.firebasestorage.app',
      })
    }
  } else {
    app = getApps()[0]
  }
  return app
}

const globalForFirestore = globalThis as unknown as {
  firestore: Firestore | undefined
}

if (!globalForFirestore.firestore) {
  globalForFirestore.firestore = getFirestore(getApp(), DATABASE_ID)
}

export const db = globalForFirestore.firestore

export function getStorageBucket() {
  return getStorage(getApp()).bucket()
}
