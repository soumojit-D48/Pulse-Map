

// // components/complete-profile-form.tsx
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { toast } from 'sonner'

// const profileSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   phone: z.string().min(10, 'Valid phone number required'),
//   bloodGroup: z.enum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE']),
//   age: z.number().min(18, 'Must be 18+').max(65, 'Must be under 65'),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
//   locationName: z.string().min(3, 'Location required'),
//   lastDonationDate: z.string().optional()
// })

// type ProfileFormData = z.infer<typeof profileSchema>

// export default function CompleteProfileForm({ userId }: { userId: string }) {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

//   const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema)
//   })

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           })
//           toast.success('Location captured!')
//         },
//         (error) => {
//           toast.error('Could not get location')
//         }
//       )
//     }
//   }

//   const onSubmit = async (data: ProfileFormData) => {
//     if (!location) {
//       toast.error('Please allow location access')
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await fetch('/api/profile/complete', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...data,
//           latitude: location.lat,
//           longitude: location.lng
//         })
//       })

//       if (response.ok) {
//         toast.success('Profile completed!')
//         router.push('/donor')
//       } else {
//         toast.error('Failed to save profile')
//       }
//     } catch (error) {
//       toast.error('Something went wrong')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div>
//         <Label htmlFor="name">Full Name</Label>
//         <Input id="name" {...register('name')} />
//         {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="phone">Phone Number</Label>
//         <Input id="phone" {...register('phone')} />
//         {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="bloodGroup">Blood Group</Label>
//         <Select onValueChange={(value) => setValue('bloodGroup', value as any)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select blood group" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="A_POSITIVE">A+</SelectItem>
//             <SelectItem value="A_NEGATIVE">A-</SelectItem>
//             <SelectItem value="B_POSITIVE">B+</SelectItem>
//             <SelectItem value="B_NEGATIVE">B-</SelectItem>
//             <SelectItem value="AB_POSITIVE">AB+</SelectItem>
//             <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
//             <SelectItem value="O_POSITIVE">O+</SelectItem>
//             <SelectItem value="O_NEGATIVE">O-</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="age">Age</Label>
//         <Input 
//           id="age" 
//           type="number" 
//           {...register('age', { valueAsNumber: true })} 
//         />
//         {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="gender">Gender</Label>
//         <Select onValueChange={(value) => setValue('gender', value as any)}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select gender" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="MALE">Male</SelectItem>
//             <SelectItem value="FEMALE">Female</SelectItem>
//             <SelectItem value="OTHER">Other</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="locationName">Location</Label>
//         <Input id="locationName" {...register('locationName')} placeholder="e.g., Salt Lake, Kolkata" />
//         <Button type="button" onClick={getCurrentLocation} variant="outline" className="mt-2">
//           📍 Get Current Location
//         </Button>
//         {location && <p className="text-green-600 text-sm mt-2">✓ Location captured</p>}
//         {errors.locationName && <p className="text-red-500 text-sm">{errors.locationName.message}</p>}
//       </div>

//       <div>
//         <Label htmlFor="lastDonationDate">Last Donation Date (Optional)</Label>
//         <Input id="lastDonationDate" type="date" {...register('lastDonationDate')} />
//       </div>

//       <Button type="submit" className="w-full" disabled={loading}>
//         {loading ? 'Saving...' : 'Complete Profile'}
//       </Button>
//     </form>
//   )
// }