import 'next-auth'

type UserRole = 'ADMIN' | 'USER'

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
