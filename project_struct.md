# 📁 Pulse Map - Project Structure

This document provides a comprehensive overview of the Blood Donation App project structure.

## 🌳 Directory Tree

```
blood-donation-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx      # Clerk sign-in page
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx      # Clerk sign-up page
│   │
│   ├── (dashboard)/              # Protected dashboard routes (grouped)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard page
│   │   ├── donors/
│   │   │   └── page.tsx          # Browse available donors
│   │   ├── requests/
│   │   │   └── page.tsx          # Blood requests page
│   │   ├── donations/
│   │   │   └── page.tsx          # Donation history page
│   │   ├── profile/
│   │   │   └── page.tsx          # User profile page
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   │
│   ├── profile/
│   │   └── complete/
│   │       └── page.tsx          # Profile completion wizard
│   │
│   ├── api/                      # API routes
│   │   ├── profile/
│   │   │   └── route.ts          # Profile CRUD operations
│   │   ├── requests/
│   │   │   └── route.ts          # Blood request operations
│   │   ├── donors/
│   │   │   └── route.ts          # Donor search & filtering
│   │   ├── donations/
│   │   │   └── route.ts          # Donation history
│   │   ├── responses/
│   │   │   └── route.ts          # Response management
│   │   └── dashboard/
│   │       └── route.ts          # Dashboard data
│   │
│   ├── layout.tsx                # Root layout (Clerk, theme provider)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles & Tailwind
│   └── favicon.ico               # App icon
│
├── components/                   # React components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── Header.tsx            # Dashboard header
│   │   ├── StatsCard.tsx         # Statistics card component
│   │   ├── RequestCard.tsx       # Blood request card
│   │   ├── UrgencyBadge.tsx      # Urgency level badge
│   │   └── temp.tsx              # Temporary/test component
│   │
│   ├── landing/                  # Landing page components
│   │   ├── Hero.tsx              # Hero section
│   │   ├── Features.tsx          # Features section
│   │   ├── HowItWorks.tsx        # How it works section
│   │   └── CTA.tsx               # Call-to-action section
│   │
│   ├── layoutComp/               # Layout components
│   │   ├── Navbar.tsx            # Main navigation bar
│   │   ├── Sidebar.tsx           # Dashboard sidebar
│   │   ├── MobileNav.tsx         # Mobile navigation
│   │   └── Footer.tsx            # Footer component
│   │
│   ├── profile/                  # Profile-related components
│   │   ├── PersonalInfoStep.tsx  # Step 1: Personal info
│   │   ├── MedicalInfoStep.tsx   # Step 2: Medical info
│   │   ├── LocationStep.tsx      # Step 3: Location with map
│   │   ├── AvailabilityStep.tsx  # Step 4: Availability
│   │   └── StepIndicator.tsx     # Progress indicator
│   │
│   ├── requests/                 # Request-related components
│   │   ├── RequestForm.tsx       # Create request form
│   │   ├── RequestList.tsx       # List of requests
│   │   ├── RequestDetails.tsx    # Request detail view
│   │   ├── ResponseList.tsx      # List of responses
│   │   ├── ResponseCard.tsx      # Individual response card
│   │   └── FilterBar.tsx         # Filter requests
│   │
│   ├── responsess/               # Response components (note: typo in folder name)
│   │   ├── ResponseForm.tsx      # Respond to request form
│   │   ├── ResponseStatus.tsx    # Response status indicator
│   │   ├── ResponseActions.tsx   # Accept/decline actions
│   │   └── ResponseHistory.tsx   # Response history
│   │
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   ├── input.tsx             # Input component
│   │   ├── label.tsx             # Label component
│   │   ├── select.tsx            # Select dropdown
│   │   ├── textarea.tsx          # Textarea component
│   │   ├── dialog.tsx            # Dialog/modal component
│   │   └── alert-dialog.tsx      # Alert dialog component
│   │
│   ├── LocationPicker.tsx        # Map-based location picker
│   ├── complete-profile-form.tsx # Profile completion form wrapper
│   └── theme-provider.tsx        # Dark mode theme provider
│
├── lib/                          # Utility libraries
│   ├── services/                 # Business logic services
│   │   └── emailService.ts       # Email sending service
│   │
│   ├── utils/                    # Utility functions
│   │   ├── distance.ts           # Distance calculation
│   │   └── bloodCompatibility.ts # Blood type compatibility
│   │
│   ├── validations/              # Zod validation schemas
│   │   ├── profile.ts            # Profile validation
│   │   └── request.ts            # Request validation
│   │
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── store/                        # Zustand state management
│   ├── profileStore.ts           # Profile state
│   └── themeStore.ts             # Theme state
│
├── prisma/                       # Database
│   └── schema.prisma             # Prisma schema definition
│
├── public/                       # Static assets
│   └── (images, icons, etc.)
│
├── .env                          # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.js                # Next.js configuration
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Dependency lock file
├── postcss.config.mjs            # PostCSS configuration
├── proxy.ts                      # Proxy configuration (if needed)
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Project documentation
└── project_struct.md             # This file
```

## 📂 Key Directories Explained

### `/app` - Application Routes
The `app` directory uses Next.js 13+ App Router with file-based routing:

- **Route Groups** `(auth)` and `(dashboard)` organize routes without affecting URLs
- **Catch-all Routes** `[[...sign-in]]` handle Clerk authentication
- **API Routes** in `/app/api` handle backend logic
- **Layouts** provide shared UI across route segments

### `/components` - React Components
Organized by feature and purpose:

- **Feature-based** folders (`dashboard/`, `profile/`, `requests/`)
- **Layout components** for navigation and structure
- **UI components** from shadcn/ui for consistent design
- **Shared components** like `LocationPicker` used across features

### `/lib` - Business Logic & Utilities
Core application logic separated from UI:

- **Services** for external integrations (email, etc.)
- **Validations** using Zod for type-safe form validation
- **Utils** for common operations (distance calc, blood compatibility)
- **Prisma client** for database access

### `/store` - State Management
Zustand stores for client-side state:

- **profileStore** - User profile data and completion status
- **themeStore** - Dark/light theme preferences

### `/prisma` - Database Schema
Prisma ORM configuration:

- **schema.prisma** - Database models, relations, and enums
- Defines Profile, Request, Donation, Response models
- Includes indexes for performance optimization

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with Clerk provider, theme provider, and Toaster |
| `app/page.tsx` | Landing page with hero, features, and CTA |
| `app/(dashboard)/layout.tsx` | Dashboard layout with sidebar and navigation |
| `lib/prisma.ts` | Prisma client singleton (prevents multiple instances) |
| `lib/utils.ts` | Utility functions like `cn()` for className merging |
| `components.json` | shadcn/ui configuration for component generation |
| `middleware.ts` | Clerk authentication middleware (if exists) |
| `proxy.ts` | Proxy configuration for API routes or external services |

## 🗂️ Component Organization

### Dashboard Components
```
components/dashboard/
├── Header.tsx          # User info, notifications, theme toggle
├── StatsCard.tsx       # Displays key metrics (donations, requests, etc.)
├── RequestCard.tsx     # Individual blood request card
└── UrgencyBadge.tsx    # Color-coded urgency indicator
```

### Profile Components
```
components/profile/
├── PersonalInfoStep.tsx    # Name, age, gender, blood group
├── MedicalInfoStep.tsx     # Medical history, last donation
├── LocationStep.tsx        # Interactive map for location selection
├── AvailabilityStep.tsx    # Availability preferences
└── StepIndicator.tsx       # Multi-step progress bar
```

### Request Components
```
components/requests/
├── RequestForm.tsx         # Create new blood request
├── RequestList.tsx         # Display all requests
├── RequestDetails.tsx      # Detailed request view
├── ResponseList.tsx        # Responses to a request
├── ResponseCard.tsx        # Individual response
└── FilterBar.tsx           # Filter by blood type, urgency, location
```

## 🔌 API Route Structure

All API routes follow RESTful conventions:

```
/api/profile       POST   - Create/update profile
/api/requests      GET    - List all requests
/api/requests      POST   - Create new request
/api/donors        GET    - Search donors (with filters)
/api/donations     GET    - Get donation history
/api/donations     POST   - Record donation
/api/responses     GET    - Get responses
/api/responses     POST   - Create response
/api/dashboard     GET    - Dashboard statistics
```

## 🎨 Styling Architecture

### Tailwind CSS
- **Global styles** in `app/globals.css`
- **CSS variables** for theme colors (light/dark mode)
- **Utility-first** approach with Tailwind classes
- **Custom animations** using Framer Motion

### Component Styling
- **shadcn/ui** provides base components with Radix UI
- **class-variance-authority** for component variants
- **tailwind-merge** (`cn()`) for conditional classes

## 🔐 Authentication Flow

1. User visits protected route
2. Clerk middleware checks authentication
3. If not authenticated → redirect to `/sign-in`
4. After sign-in → check profile completion
5. If incomplete → redirect to `/profile/complete`
6. If complete → access dashboard

## 📊 Database Models

### Core Models
- **Profile** - User information and donor details
- **Request** - Blood donation requests
- **Donation** - Donation history records
- **Response** - Donor responses to requests

### Relationships
```
Profile (1) ─── (N) Donation
Profile (1) ─── (N) Request
Profile (1) ─── (N) Response
Request (1) ─── (N) Response
Request (1) ─── (N) Donation
```

## 🚀 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes** to components or pages
3. **Hot reload** automatically updates browser
4. **Database changes**: Update `schema.prisma` → `npx prisma db push`
5. **View database**: `npx prisma studio`
6. **Build for production**: `npm run build`

## 📝 Naming Conventions

- **Components**: PascalCase (`RequestCard.tsx`)
- **Utilities**: camelCase (`utils.ts`)
- **API routes**: lowercase (`route.ts`)
- **Folders**: lowercase with hyphens (`complete-profile-form.tsx`)
- **Route groups**: parentheses `(dashboard)`

## 🔍 Important Notes

1. **Route Groups** `(auth)` and `(dashboard)` don't affect URLs
2. **Catch-all routes** `[[...sign-in]]` are for Clerk
3. **Typo**: `responsess/` folder has extra 's' (consider renaming)
4. **Prisma Client**: Generated in `node_modules/.prisma/client`
5. **Environment Variables**: Never commit `.env` file

---

This structure follows Next.js best practices and provides a scalable foundation for the blood donation platform.