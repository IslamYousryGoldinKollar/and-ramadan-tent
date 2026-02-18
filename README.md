# e& Egypt Ramadan Tent Reservation System

A comprehensive web application for managing reservations at the e& Egypt Corporate Ramadan Tent. Built with Next.js 14, TypeScript, and Firebase (Firestore & App Hosting).

## Features

### Employee Features
- **Secure Authentication**: Login with Employee ID and Corporate Email (@eand.com / @goldinkollar.com domain)
- **Interactive Calendar**: 30-day Ramadan calendar with color-coded availability indicators
- **Flexible Booking**: Partial bookings (1-19 seats) or full tent booking (20 seats)
- **Self-Service Management**: Lookup, cancel, and reschedule reservations using Serial Number
- **QR Code Generation**: Automatic QR code generation for each reservation
- **Credit System**: Track usage with a conceptual credit system (200 credits for full tent)
- **Gamification**: Participate in Ramadan Riddles and win prizes
- **Wellness**: Access daily health and wellness tips for Ramadan

### Admin Features
- **Admin Dashboard**: Overview of all reservations and statistics
- **Master Calendar View**: See all reservations across the 30-day period
- **Check-in System**: Scan QR codes or enter serial numbers to mark attendance
- **Content Management**: Manage Daily Tips and Riddle Episodes
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
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS with Radix UI components
- **Hosting**: Firebase App Hosting
- **Notifications**: Resend (Email)

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase Project with Firestore enabled
- Resend API Key (for emails)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd eand-ramadan-tent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure:
   - `NEXTAUTH_SECRET`: Generate a random secret
   - `NEXTAUTH_URL`: Your application URL
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: JSON string of your Firebase Admin Service Account
   - `RESEND_API_KEY`: Your Resend API Key

4. **Create an admin user**
   ```bash
   ADMIN_EMPLOYEE_ID=ADMIN001 \
   ADMIN_FULL_NAME="Admin Name" \
   ADMIN_EMAIL="admin@eand.com" \
   ADMIN_PASSWORD="strong-password" \
   ADMIN_DEPARTMENT="IT" \
   node scripts/setup-admin.js
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

This project is configured for **Firebase App Hosting**.

1. Connect your GitHub repository to Firebase App Hosting.
2. Ensure the `apphosting.yaml` is present in the root.
3. Set required secrets before deploy (recommended via CLI):
   ```bash
   firebase apphosting:secrets:set nextauthSecret
   firebase apphosting:secrets:set resendApiKey
   ```
4. Grant backend access to secrets:
   ```bash
   firebase apphosting:secrets:grantaccess
   ```

## Project Structure

```
eand/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── reservations/  # Reservation CRUD operations
│   │   ├── admin/         # Admin API routes
│   │   └── riddles/       # Riddles API routes
│   ├── dashboard/         # Employee dashboard pages
│   ├── admin/             # Admin panel pages
│   ├── tent-registration/ # Public booking flow
│   └── login/             # Login page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── calendar/         # Calendar components
│   └── booking/          # Booking-related components
├── lib/                  # Utility functions and business logic
│   ├── db.ts             # Firestore client instance
│   ├── firebase-admin.ts # Firebase Admin SDK setup
│   ├── reservations.ts   # Reservation logic
│   ├── waiting-list.ts   # Waiting list logic
│   ├── notifications.ts  # Notification logic
│   └── sms.ts            # Phone validation helpers
├── scripts/              # Utility scripts (admin setup, etc.)
└── firestore.indexes.json # Firestore index definitions
```

## Database Schema (Firestore)

### `users` Collection
- Employee information, role (EMPLOYEE/ADMIN), and authentication details.

### `reservations` Collection
- Booking details, serial numbers, QR codes, status, and seat counts.

### `waitingList` Collection
- Queue management entries with priority scores.

### `auditLogs` Collection
- Complete history of all reservation actions.

### `riddleEpisodes` / `riddleQuestions` / `riddleAnswers`
- Gamification content and user submissions.

### `dailyTips`
- Wellness content.

## License

Internal use only - e& Egypt
