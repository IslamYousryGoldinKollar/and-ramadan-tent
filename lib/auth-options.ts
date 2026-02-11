import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db, toPlainObject } from './db'
import { isValidEandEmail } from './utils'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        employeeId: { label: 'Employee ID', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId || !credentials?.email || !credentials?.password) {
          throw new Error('Employee ID, email, and password are required')
        }

        // Validate e& email domain
        if (!isValidEandEmail(credentials.email)) {
          throw new Error('Invalid email domain. Must be @eand.com or @goldinkollar.com')
        }

        // Find user by employee ID and email
        const snapshot = await db.collection('users')
          .where('employeeId', '==', credentials.employeeId)
          .where('email', '==', credentials.email.toLowerCase())
          .limit(1)
          .get()

        if (snapshot.empty) {
          throw new Error('Invalid credentials')
        }

        const user = toPlainObject<any>(snapshot.docs[0])!

        // Verify password
        if (!user.password) {
          throw new Error('Account not set up. Please contact an administrator.')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          employeeId: user.employeeId,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.employeeId = (user as any).employeeId
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).employeeId = token.employeeId as string
        (session.user as any).role = token.role as string
        (session.user as any).id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
