

// // app/complete-profile/page.tsx
// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
// import { prisma } from '@/lib/prisma'
// import CompleteProfileForm from '@/components/complete-profile-form'

// export default async function CompleteProfilePage() {
//   const { userId } = await auth()
  
//   if (!userId) redirect('/sign-in')
  
//   // Check if profile already completed
//   const existingProfile = await prisma.profile.findUnique({
//     where: { clerkId: userId }
//   })
  
//   if (existingProfile?.profileCompleted) {
//     redirect('/donor')
//   }
  
//   return (
//     <div className="container max-w-2xl py-10">
//       <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
//       <CompleteProfileForm userId={userId} />
//     </div>
//   )
// }



// app/page.tsx

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const { userId } = await auth()

  // If logged in, redirect to profile complete (we'll add profile check later)
  if (userId) {
    redirect('/profile/complete')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-4xl px-6 text-center">
        <h1 className="mb-6 text-6xl font-bold text-red-600">
          🩸 Blood Donation Network
        </h1>
        <p className="mb-8 text-xl text-gray-700">
          Connect donors with those in urgent need. Save lives in your community.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/sign-up"
            className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/sign-in"
            className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Find Donors</h3>
            <p className="text-gray-600">Search for available blood donors near you</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold mb-2">Emergency Requests</h3>
            <p className="text-gray-600">Post urgent blood requirements instantly</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
            <p className="text-gray-600">Make a difference in your community</p>
          </div>
        </div>
      </div>
    </div>
  )
}