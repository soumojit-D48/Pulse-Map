# 🩸 Pulse Map - Blood Donation App

A modern, location-based blood donation platform built with Next.js that connects blood donors with recipients in real-time. The app helps save lives by making it easy to find nearby donors during emergencies.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)

## ✨ Features

### Core Features
- 🔐 **Authentication** - Secure user authentication with Clerk
- 👤 **Profile Management** - Multi-step profile completion with medical information
- 🗺️ **Location-Based Matching** - Find donors/recipients using interactive maps (Leaflet)
- 🆘 **Emergency Requests** - Create and respond to urgent blood donation requests
- 📊 **Dashboard** - Comprehensive dashboard for donors and recipients
- 🔔 **Real-time Updates** - Track donation requests and responses
- 🌓 **Dark Mode** - Full dark mode support with next-themes
- 📱 **Responsive Design** - Mobile-first, fully responsive UI

### User Roles
- **Donors** - Register availability, respond to requests, track donation history
- **Recipients** - Create blood requests, view nearby donors, manage responses
- **Admin** - Manage users and requests (role-based access)

### Key Functionality
- Blood group compatibility matching
- Distance-based donor search
- Urgency levels (Critical, High, Medium, Low)
- Donation history tracking
- Response management system
- Profile completion wizard

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Maps**: Leaflet, React Leaflet
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand

### Backend
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: Clerk
- **Email**: Nodemailer, Resend
- **API**: Next.js API Routes

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blood-donation-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables))

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Email (Optional)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Schema

The app uses Prisma with PostgreSQL. Key models include:

### Profile
- User information (name, email, phone, blood group, age, gender)
- Location data (latitude, longitude, state, city)
- Donor availability status
- Last donation date

### Request
- Blood donation requests
- Patient information and location
- Urgency level (Critical, High, Medium, Low)
- Units needed
- Status (Active, Fulfilled, Cancelled)

### Donation
- Donation history
- Linked to donor and request
- Date and units donated

### Response
- Donor responses to requests
- Status (Pending, Accepted, Declined)
- Optional message

See `prisma/schema.prisma` for complete schema details.

## 📁 Project Structure

See [project_struct.md](./project_struct.md) for detailed project structure.

## 🔌 API Routes

### Profile
- `POST /api/profile` - Create/update user profile

### Requests
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create new blood request

### Donors
- `GET /api/donors` - Get available donors (with location filtering)

### Donations
- `GET /api/donations` - Get donation history
- `POST /api/donations` - Record new donation

### Responses
- `GET /api/responses` - Get responses to requests
- `POST /api/responses` - Respond to a blood request

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Database Deployment

Use a PostgreSQL hosting service:
- [Neon](https://neon.tech) (Recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com)

### Post-Deployment

1. Run database migrations:
```bash
npx prisma db push
```

2. Verify Clerk webhooks are configured

3. Test the application thoroughly

## 📝 License

This project is private and proprietary.

---

Built with ❤️ using Next.js, Prisma, and Clerk
