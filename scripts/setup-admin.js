/**
 * Script to create an admin user in the database
 * Usage: node scripts/setup-admin.js
 * 
 * Make sure DATABASE_URL is set in your .env file
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function setupAdmin() {
  try {
    console.log('=== e& Egypt Ramadan Tent - Admin User Setup ===\n')

    // Create admin account directly
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

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { employeeId },
          { email: email.toLowerCase() },
        ],
      },
    })

    if (existing) {
      console.log('\n⚠️  User already exists. Updating to admin...')
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'ADMIN',
          fullName,
          password: hashedPassword,
          department: department || null,
        },
      })
      console.log('\n✅ Admin user updated successfully!')
      console.log(`   Employee ID: ${updated.employeeId}`)
      console.log(`   Email: ${updated.email}`)
      console.log(`   Role: ${updated.role}`)
    } else {
      const user = await prisma.user.create({
        data: {
          employeeId,
          fullName,
          email: email.toLowerCase(),
          password: hashedPassword,
          department: department || null,
          role: 'ADMIN',
        },
      })
      console.log('\n✅ Admin user created successfully!')
      console.log(`   Employee ID: ${user.employeeId}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

setupAdmin()
