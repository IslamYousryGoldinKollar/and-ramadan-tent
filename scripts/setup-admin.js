/**
 * Script to create an admin user in the Firestore database
 * Usage: node scripts/setup-admin.js
 * 
 * Make sure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_KEY is set
 */

const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const bcrypt = require('bcryptjs')

const DATABASE_ID = 'eandramadan'

// Initialize Firebase Admin
let app
if (getApps().length === 0) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKey) {
    const serviceAccount = JSON.parse(serviceAccountKey)
    app = initializeApp({ credential: cert(serviceAccount), projectId: 'kedup-9rc91' })
  } else {
    app = initializeApp({ projectId: 'kedup-9rc91' })
  }
} else {
  app = getApps()[0]
}

const db = getFirestore(app, DATABASE_ID)

async function setupAdmin() {
  try {
    console.log('=== e& Egypt Ramadan Tent - Admin User Setup ===\n')

    const employeeId = 'ADMIN001'
    const fullName = 'Islam Yousry'
    const email = 'islam.yousry@goldinkollar.com'
    const password = 'EandRamadan@GK'
    const department = 'IT'

    if (!email.endsWith('@eand.com') && !email.endsWith('@goldinkollar.com')) {
      console.error('\n❌ Error: Email must be from @eand.com or @goldinkollar.com domain')
      process.exit(1)
    }

    if (!password || password.length < 6) {
      console.error('\n❌ Error: Password must be at least 6 characters')
      process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Check if user already exists by employeeId or email
    const byEmployeeId = await db.collection('users')
      .where('employeeId', '==', employeeId)
      .limit(1)
      .get()

    const byEmail = await db.collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get()

    const existing = !byEmployeeId.empty ? byEmployeeId.docs[0] : (!byEmail.empty ? byEmail.docs[0] : null)

    if (existing) {
      console.log('\n⚠️  User already exists. Updating to admin...')
      await existing.ref.update({
        role: 'ADMIN',
        fullName,
        password: hashedPassword,
        department: department || null,
        updatedAt: new Date(),
      })
      const data = existing.data()
      console.log('\n✅ Admin user updated successfully!')
      console.log(`   Employee ID: ${data.employeeId}`)
      console.log(`   Email: ${data.email}`)
      console.log(`   Role: ADMIN`)
    } else {
      const id = db.collection('users').doc().id
      const now = new Date()
      await db.collection('users').doc(id).set({
        employeeId,
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        department: department || null,
        role: 'ADMIN',
        createdAt: now,
        updatedAt: now,
      })
      console.log('\n✅ Admin user created successfully!')
      console.log(`   Employee ID: ${employeeId}`)
      console.log(`   Email: ${email.toLowerCase()}`)
      console.log(`   Role: ADMIN`)
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

setupAdmin()
