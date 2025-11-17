

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



// // app/page.tsx

// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'

// export default async function HomePage() {
//   const { userId } = await auth()

//   // If logged in, redirect to profile complete (we'll add profile check later)
//   if (userId) {
//     redirect('/profile/complete')
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
//       <div className="max-w-4xl px-6 text-center">
//         <h1 className="mb-6 text-6xl font-bold text-red-600">
//           🩸 Blood Donation Network
//         </h1>
//         <p className="mb-8 text-xl text-gray-700">
//           Connect donors with those in urgent need. Save lives in your community.
//         </p>
        
//         <div className="flex gap-4 justify-center">
//           <Link 
//             href="/sign-up"
//             className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
//           >
//             Get Started
//           </Link>
//           <Link 
//             href="/sign-in"
//             className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
//           >
//             Sign In
//           </Link>
//         </div>

//         <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="p-6 bg-white rounded-lg shadow-lg">
//             <div className="text-4xl mb-4">🔍</div>
//             <h3 className="text-xl font-semibold mb-2">Find Donors</h3>
//             <p className="text-gray-600">Search for available blood donors near you</p>
//           </div>
//           <div className="p-6 bg-white rounded-lg shadow-lg">
//             <div className="text-4xl mb-4">🚨</div>
//             <h3 className="text-xl font-semibold mb-2">Emergency Requests</h3>
//             <p className="text-gray-600">Post urgent blood requirements instantly</p>
//           </div>
//           <div className="p-6 bg-white rounded-lg shadow-lg">
//             <div className="text-4xl mb-4">❤️</div>
//             <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
//             <p className="text-gray-600">Make a difference in your community</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }











// app/profile/complete/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

// Lazy load map component
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
});

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  age: z.number().min(18, 'Must be 18+').max(65, 'Must be under 65'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE']),
  lastDonationDate: z.date().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  available: z.boolean().default(true),
});

type ProfileForm = z.infer<typeof profileSchema>;

const BLOOD_GROUPS = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
];

export default function ProfileCompletePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: user?.fullName || '',
      available: true,
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="25"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      {...register('gender')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Medical Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                  <select
                    {...register('bloodGroup')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select your blood group...</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg.value} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Donation Date (Optional)
                  </label>
                  <input
                    type="date"
                    {...register('lastDonationDate', { valueAsDate: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave blank if you've never donated before</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Location</h2>
                <p className="text-gray-600">This helps us connect you with nearby requests</p>

                <LocationPicker
                  onLocationSelect={(location) => {
                    setValue('latitude', location.lat);
                    setValue('longitude', location.lng);
                    // setValue('city', location.city);
                    // setValue('state', location.state);
                    // setValue('country', location.country);
                  }}
                />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      {...register('state')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      {...register('country')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Availability */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      {...register('available')}
                      className="mt-1 h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">I'm available to donate blood</h3>
                      <p className="text-sm text-gray-600">
                        By checking this box, you'll receive notifications about emergency blood requests near you. 
                        You can change this setting anytime from your profile.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Your exact location will never be shared. Requesters will only see approximate area and contact info.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


















