
blood-donation-app/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── donors/
│   │   │   └── page.tsx
│   │   ├── requests/
│   │   │   └── page.tsx
│   │   ├── donations/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── profile/
│   │   └── complete/
│   │       └── page.tsx
│   ├── api/
│   │   ├── profile/
│   │   │   └── route.ts
│   │   ├── requests/
│   │   │   └── route.ts
│   │   ├── donors/
│   │   │   └── route.ts
│   │   └── donations/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── forms/
│   ├── maps/
│   ├── ui/
│   └── notifications/
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── stores/
│   └── useStore.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── tailwind.config.ts


your-project/
├── app/
│   ├── profile/
│   │   └── complete/
│   │       └── page.tsx                    # Main profile completion page
│   ├── api/
│   │   └── profile/
│   │       └── route.ts                    # API endpoint
│   └── layout.tsx                          # Add Sonner Toaster here
├── components/
│   └── profile/
│       ├── PersonalInfoStep.tsx            # Step 1
│       ├── MedicalInfoStep.tsx             # Step 2
│       ├── LocationStep.tsx                # Step 3 (with map)
│       ├── AvailabilityStep.tsx            # Step 4
│       └── StepIndicator.tsx               # Progress indicator
├── lib/
│   ├── prisma.ts                           # Prisma client
│   └── validations/
│       └── profile.ts                      # Zod schemas
├── store/
│   └── profileStore.ts                     # Zustand store
└── middleware.ts                           # Profile check middleware