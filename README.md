# e& Egypt Ramadan Tent Reservation System

A comprehensive web application for managing reservations at the e& Egypt Corporate Ramadan Tent. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

### Employee Features
- **Secure Authentication**: Login with Employee ID and Corporate Email (@eand.com domain)
- **Interactive Calendar**: 30-day Ramadan calendar with color-coded availability indicators
- **Flexible Booking**: Partial bookings (1-19 seats) or full tent booking (20 seats)
- **Self-Service Management**: Lookup, cancel, and reschedule reservations using Serial Number
- **QR Code Generation**: Automatic QR code generation for each reservation
- **Credit System**: Track usage with a conceptual credit system (200 credits for full tent)

### Admin Features
- **Admin Dashboard**: Overview of all reservations and statistics
- **Master Calendar View**: See all reservations across the 30-day period
- **Check-in System**: Scan QR codes or enter serial numbers to mark attendance
- **Data Export**: Download CSV reports with comprehensive booking data
- **Real-time Updates**: Instant reflection of cancellations and modifications

### Smart Waiting List
- **Priority Algorithm**: Fair distribution based on booking history
  - Tier 1 (High): First-time users (0 bookings)
  - Tier 2 (Medium): Occasional users (1-2 bookings)
  - Tier 3 (Low): Frequent users (3+ bookings)
- **Fill-the-Gap Automation**: Automatically notifies highest priority users when slots open
- **2-Hour Confirmation Window**: Users have 2 hours to confirm their spot

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with Radix UI components
- **QR Codes**: qrcode library
- **Form Validation**: Zod
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Email service (for notifications - currently uses console.log, needs integration)

## Installation

1. **Clone the repository**
   ```bash
   cd eand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000`)
   - Email configuration (SMTP settings)

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Create an admin user** (optional)
   
   You can create an admin user directly in the database:
   ```sql
   INSERT INTO "User" (id, "employeeId", "fullName", email, role, "createdAt", "updatedAt")
   VALUES ('admin-id', 'ADMIN001', 'Admin User', 'admin@eand.com', 'ADMIN', NOW(), NOW());
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

- **Production URL**: https://peopleofeand.goldinkollar.com
- **Capacity**: 120 seats per day (configurable in `lib/utils.ts`)

```
eand/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── reservations/  # Reservation CRUD operations
│   │   ├── availability/  # Availability checking
│   │   └── waiting-list/ # Waiting list management
│   ├── dashboard/         # Employee dashboard pages
│   ├── admin/             # Admin panel pages
│   └── login/             # Login page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── calendar/         # Calendar components
│   └── booking/          # Booking-related components
├── lib/                  # Utility functions and business logic
│   ├── prisma.ts         # Prisma client
│   ├── reservations.ts   # Reservation logic
│   ├── waiting-list.ts   # Waiting list logic
│   ├── priority.ts       # Priority scoring algorithm
│   ├── notifications.ts  # Email notification templates
│   └── qrcode.ts         # QR code generation
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
└── types/                # TypeScript type definitions
```

## Database Schema

### Users
- Employee information and authentication

### Reservations
- Booking details with serial numbers and QR codes
- Status tracking (CONFIRMED, CANCELLED, RESCHEDULED, CHECKED_IN)

### WaitingList
- Queue management with priority scoring
- Notification tracking and confirmation deadlines

### AuditLog
- Complete history of all reservation actions
- Used for analytics and compliance

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Reservations
- `GET /api/reservations` - Get user's reservations (or all for admin with date range)
- `POST /api/reservations` - Create new reservation
- `DELETE /api/reservations/[id]` - Cancel reservation
- `PATCH /api/reservations/[id]` - Reschedule reservation
- `POST /api/reservations/lookup` - Lookup by serial number

### Availability
- `GET /api/availability?date=...` - Check availability for a date

### Waiting List
- `POST /api/waiting-list` - Join waiting list
- `POST /api/waiting-list/confirm/[id]` - Confirm waiting list entry

## Key Features Implementation

### Serial Number Generation
Format: `RAM-YY-XXXX` (e.g., RAM-24-9088)
- YY: Last 2 digits of year
- XXXX: Random 4-digit number

### Capacity Management
- Hard limit: 20 seats per day
- Real-time availability checking
- Automatic waiting list integration when full

### Priority Algorithm
The system calculates priority based on booking history:
- **Tier 1**: 0 bookings → Score: 100
- **Tier 2**: 1-2 bookings → Score: 50
- **Tier 3**: 3+ bookings → Score: 10

When a slot opens, the highest priority user is automatically notified.

## Email Notifications

The system includes email templates for:
- Booking confirmation
- Modification alerts
- Cancellation confirmations
- Waiting list notifications
- Reminders

**Note**: Currently, emails are logged to console. Integrate with your email service (SendGrid, AWS SES, etc.) in `lib/notifications.ts`.

## Security Considerations

- Email domain validation (@eand.com only)
- Row Level Security (RLS) policies in database
- JWT-based authentication
- Parameterized database queries (Prisma handles this)
- Input validation with Zod schemas

## Development

### Database Management
```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Type Generation
Prisma Client is automatically generated, but you can regenerate:
```bash
npm run db:generate
```

## Production Deployment

1. **Set up production database**
   - Use a managed PostgreSQL service (AWS RDS, Supabase, etc.)
   - Update `DATABASE_URL` in production environment

2. **Configure environment variables**
   - Set all required environment variables
   - Use secure secrets management

3. **Set up email service**
   - Integrate with production email service
   - Update `lib/notifications.ts`

4. **Build and deploy**
   ```bash
   npm run build
   npm start
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

## Future Enhancements

- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with HR system for auto-user creation
- [ ] Multi-language support (Arabic/English)
- [ ] Push notifications
- [ ] Guest management (adding guest names)
- [ ] Dietary preferences tracking

## License

Internal use only - e& Egypt

## Support

For issues or questions, contact the development team.
