import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      employeeId: string
      role: UserRole
    }
  }

  interface User {
    employeeId: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    employeeId: string
    role: UserRole
  }
}
