
// app/(auth)/sign-up/[[...sign-up]]/page.tsx

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-red-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-600">🩸 Blood Donation</h1>
          <p className="mt-2 text-gray-600">Join us in saving lives</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl"
            }
          }}
        />
      </div>
    </div>
  )
}