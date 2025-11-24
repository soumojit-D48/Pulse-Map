







// // app/profile/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth, useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import {
//   User,
//   Phone,
//   MapPin,
//   Heart,
//   Calendar,
//   Activity,
//   Mail,
//   Edit2,
//   Save,
//   X,
//   Loader2,
//   CheckCircle,
//   Clock,
//   FileText,
//   TrendingUp,
// } from 'lucide-react';

// interface Donation {
//   id: string;
//   donationDate: string;
//   unitsDonated: number;
//   request: {
//     patientName: string;
//     hospitalName: string | null;
//   } | null;
// }

// interface Request {
//   id: string;
//   patientName: string;
//   bloodGroup: string;
//   status: string;
//   urgency: string;
//   createdAt: string;
// }

// interface Response {
//   id: string;
//   status: string;
//   createdAt: string;
//   request: {
//     patientName: string;
//     bloodGroup: string;
//     status: string;
//   };
// }

// interface Profile {
//   id: string;
//   name: string;
//   email: string;
//   phone: string | null;
//   bloodGroup: string;
//   age: number;
//   gender: string;
//   state: string;
//   city: string;
//   locationName: string;
//   available: boolean;
//   lastDonationDate: string | null;
//   createdAt: string;
//   avatarUrl: string | null;
//   donationsGiven: Donation[];
//   requestsCreated: Request[];
//   responses: Response[];
// }

// interface Stats {
//   totalDonations: number;
//   totalUnits: number;
//   totalRequests: number;
//   fulfilledRequests: number;
//   pendingResponses: number;
// }

// const BLOOD_GROUP_LABELS: { [key: string]: string } = {
//   A_POSITIVE: 'A+',
//   A_NEGATIVE: 'A-',
//   B_POSITIVE: 'B+',
//   B_NEGATIVE: 'B-',
//   AB_POSITIVE: 'AB+',
//   AB_NEGATIVE: 'AB-',
//   O_POSITIVE: 'O+',
//   O_NEGATIVE: 'O-',
// };

// export default function ProfilePage() {
//   const { isLoaded, userId } = useAuth();
//   const { user } = useUser();
//   const router = useRouter();

//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [editData, setEditData] = useState({
//     name: '',
//     phone: '',
//     available: false,
//   });

//   useEffect(() => {
//     if (isLoaded && !userId) {
//       router.push('/sign-in');
//       return;
//     }

//     if (userId) {
//       fetchProfile();
//     }
//   }, [isLoaded, userId, router]);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/profile');

//       if (!response.ok) {
//         throw new Error('Failed to fetch profile');
//       }

//       const data = await response.json();
//       setProfile(data.profile);
//       setStats(data.stats);
//       setEditData({
//         name: data.profile.name,
//         phone: data.profile.phone || '',
//         available: data.profile.available,
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const response = await fetch('/api/profile', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editData),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update profile');
//       }

//       await fetchProfile();
//       setIsEditing(false);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to update');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (profile) {
//       setEditData({
//         name: profile.name,
//         phone: profile.phone || '',
//         available: profile.available,
//       });
//     }
//     setIsEditing(false);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'ACTIVE':
//       case 'PENDING':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'FULFILLED':
//       case 'ACCEPTED':
//         return 'bg-green-100 text-green-800';
//       case 'CANCELLED':
//       case 'DECLINED':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !profile || !stats) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 text-lg">{error || 'Profile not found'}</p>
//           <button
//             onClick={fetchProfile}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="px-6 py-8">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
//                   {user?.imageUrl ? (
//                     <img
//                       src={user.imageUrl}
//                       alt={profile.name}
//                       className="h-20 w-20 rounded-full object-cover"
//                     />
//                   ) : (
//                     <User className="h-10 w-10 text-red-600" />
//                   )}
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
//                   <p className="text-gray-600 flex items-center gap-2 mt-1">
//                     <Mail className="h-4 w-4" />
//                     {profile.email}
//                   </p>
//                 </div>
//               </div>

//               {!isEditing ? (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//                 >
//                   <Edit2 className="h-4 w-4" />
//                   Edit Profile
//                 </button>
//               ) : (
//                 <div className="mt-4 md:mt-0 flex gap-2">
//                   <button
//                     onClick={handleSave}
//                     disabled={saving}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400"
//                   >
//                     {saving ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Save className="h-4 w-4" />
//                     )}
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//                   >
//                     <X className="h-4 w-4" />
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Donations</p>
//                 <p className="text-3xl font-bold text-red-600">{stats.totalDonations}</p>
//               </div>
//               <Heart className="h-8 w-8 text-red-200" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Units Donated</p>
//                 <p className="text-3xl font-bold text-blue-600">{stats.totalUnits}</p>
//               </div>
//               <Activity className="h-8 w-8 text-blue-200" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Requests Created</p>
//                 <p className="text-3xl font-bold text-purple-600">{stats.totalRequests}</p>
//               </div>
//               <FileText className="h-8 w-8 text-purple-200" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Fulfilled</p>
//                 <p className="text-3xl font-bold text-green-600">{stats.fulfilledRequests}</p>
//               </div>
//               <CheckCircle className="h-8 w-8 text-green-200" />
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Pending</p>
//                 <p className="text-3xl font-bold text-orange-600">{stats.pendingResponses}</p>
//               </div>
//               <Clock className="h-8 w-8 text-orange-200" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Personal Information */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Basic Info */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {isEditing ? (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Name
//                       </label>
//                       <input
//                         type="text"
//                         value={editData.name}
//                         onChange={(e) =>
//                           setEditData({ ...editData, name: e.target.value })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone
//                       </label>
//                       <input
//                         type="tel"
//                         value={editData.phone}
//                         onChange={(e) =>
//                           setEditData({ ...editData, phone: e.target.value })
//                         }
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div>
//                       <p className="text-sm text-gray-600">Name</p>
//                       <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                         <User className="h-4 w-4" />
//                         {profile.name}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Phone</p>
//                       <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                         <Phone className="h-4 w-4" />
//                         {profile.phone || 'Not provided'}
//                       </p>
//                     </div>
//                   </>
//                 )}

//                 <div>
//                   <p className="text-sm text-gray-600">Blood Group</p>
//                   <p className="text-lg font-semibold text-red-600 flex items-center gap-2">
//                     <Heart className="h-4 w-4" />
//                     {BLOOD_GROUP_LABELS[profile.bloodGroup]}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">Age</p>
//                   <p className="text-lg font-semibold text-gray-900">{profile.age} years</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">Gender</p>
//                   <p className="text-lg font-semibold text-gray-900 capitalize">
//                     {profile.gender.toLowerCase()}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-600">Last Donation</p>
//                   <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     {profile.lastDonationDate
//                       ? formatDate(profile.lastDonationDate)
//                       : 'Never'}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">Availability Status</p>
//                     <p className="text-lg font-semibold text-gray-900">
//                       {isEditing ? 'Toggle availability' : profile.available ? 'Available to donate' : 'Currently unavailable'}
//                     </p>
//                   </div>
//                   {isEditing ? (
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={editData.available}
//                         onChange={(e) =>
//                           setEditData({ ...editData, available: e.target.checked })
//                         }
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
//                     </label>
//                   ) : (
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         profile.available
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       {profile.available ? 'Available' : 'Unavailable'}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Location */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 Location
//               </h2>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600">City, State</p>
//                   <p className="text-lg font-semibold text-gray-900">
//                     {profile.city}, {profile.state}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Address</p>
//                   <p className="text-gray-900">{profile.locationName}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Donations */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h2>
//               {profile.donationsGiven.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">No donations yet</p>
//               ) : (
//                 <div className="space-y-3">
//                   {profile.donationsGiven.map((donation) => (
//                     <div
//                       key={donation.id}
//                       className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {donation.request?.patientName || 'Direct Donation'}
//                           </p>
//                           {donation.request?.hospitalName && (
//                             <p className="text-sm text-gray-600">
//                               {donation.request.hospitalName}
//                             </p>
//                           )}
//                           <p className="text-sm text-gray-500 mt-1">
//                             {donation.unitsDonated} unit{donation.unitsDonated > 1 ? 's' : ''}
//                           </p>
//                         </div>
//                         <p className="text-sm text-gray-500">
//                           {formatDate(donation.donationDate)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar - Requests & Responses */}
//           <div className="space-y-6">
//             {/* My Requests */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">My Requests</h2>
//               {profile.requestsCreated.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">No requests yet</p>
//               ) : (
//                 <div className="space-y-3">
//                   {profile.requestsCreated.map((request) => (
//                     <div
//                       key={request.id}
//                       className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-sm font-semibold text-red-600">
//                           {BLOOD_GROUP_LABELS[request.bloodGroup]}
//                         </span>
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
//                             request.status
//                           )}`}
//                         >
//                           {request.status}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium">
//                         {request.patientName}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {formatDate(request.createdAt)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* My Responses */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">My Responses</h2>
//               {profile.responses.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">No responses yet</p>
//               ) : (
//                 <div className="space-y-3">
//                   {profile.responses.map((response) => (
//                     <div
//                       key={response.id}
//                       className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-sm font-semibold text-red-600">
//                           {BLOOD_GROUP_LABELS[response.request.bloodGroup]}
//                         </span>
//                         <span
//                           className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
//                             response.status
//                           )}`}
//                         >
//                           {response.status}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium">
//                         For: {response.request.patientName}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {formatDate(response.createdAt)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
























// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  Heart,
  Calendar,
  Activity,
  Mail,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface Donation {
  id: string;
  donationDate: string;
  unitsDonated: number;
  request: {
    patientName: string;
    hospitalName: string | null;
  } | null;
}

interface Request {
  id: string;
  patientName: string;
  bloodGroup: string;
  status: string;
  urgency: string;
  createdAt: string;
}

interface Response {
  id: string;
  status: string;
  createdAt: string;
  request: {
    patientName: string;
    bloodGroup: string;
    status: string;
  };
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bloodGroup: string;
  age: number;
  gender: string;
  state: string;
  city: string;
  locationName: string;
  available: boolean;
  lastDonationDate: string | null;
  createdAt: string;
  avatarUrl: string | null;
  donationsGiven: Donation[];
  requestsCreated: Request[];
  responses: Response[];
}

interface Stats {
  totalDonations: number;
  totalUnits: number;
  totalRequests: number;
  fulfilledRequests: number;
  pendingResponses: number;
}

const BLOOD_GROUP_LABELS: { [key: string]: string } = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

export default function ProfilePage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    available: false,
  });

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
      return;
    }

    if (userId) {
      fetchProfile();
    }
  }, [isLoaded, userId, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setStats(data.stats);
      setEditData({
        name: data.profile.name,
        phone: data.profile.phone || '',
        available: data.profile.available,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        name: profile.name,
        phone: profile.phone || '',
        available: profile.available,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20';
      case 'FULFILLED':
      case 'ACCEPTED':
        return 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/20';
      case 'CANCELLED':
      case 'DECLINED':
        return 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/20';
      default:
        return 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error || 'Profile not found'}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg shadow-soft mb-6">
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={profile.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="mt-4 md:mt-0 flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold text-primary">{stats.totalDonations}</p>
              </div>
              <Heart className="h-8 w-8 text-red-200 dark:text-red-500/30" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Units Donated</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalUnits}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-200 dark:text-blue-500/30" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requests Created</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalRequests}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-200 dark:text-purple-500/30" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.fulfilledRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200 dark:text-green-500/30" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingResponses}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200 dark:text-orange-500/30" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {profile.phone || 'Not provided'}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {BLOOD_GROUP_LABELS[profile.bloodGroup]}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="text-lg font-semibold text-foreground">{profile.age} years</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {profile.gender.toLowerCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Last Donation</p>
                  <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {profile.lastDonationDate
                      ? formatDate(profile.lastDonationDate)
                      : 'Never'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Availability Status</p>
                    <p className="text-lg font-semibold text-foreground">
                      {isEditing ? 'Toggle availability' : profile.available ? 'Available to donate' : 'Currently unavailable'}
                    </p>
                  </div>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editData.available}
                        onChange={(e) =>
                          setEditData({ ...editData, available: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        profile.available
                          ? 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/20'
                          : 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20'
                      }`}
                    >
                      {profile.available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">City, State</p>
                  <p className="text-lg font-semibold text-foreground">
                    {profile.city}, {profile.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-foreground">{profile.locationName}</p>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Donations</h2>
              {profile.donationsGiven.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No donations yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.donationsGiven.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-foreground">
                            {donation.request?.patientName || 'Direct Donation'}
                          </p>
                          {donation.request?.hospitalName && (
                            <p className="text-sm text-muted-foreground">
                              {donation.request.hospitalName}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {donation.unitsDonated} unit{donation.unitsDonated > 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(donation.donationDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Requests & Responses */}
          <div className="space-y-6">
            {/* My Requests */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">My Requests</h2>
              {profile.requestsCreated.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No requests yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.requestsCreated.map((request) => (
                    <div
                      key={request.id}
                      className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {BLOOD_GROUP_LABELS[request.bloodGroup]}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium">
                        {request.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Responses */}
            <div className="bg-card border border-border rounded-lg shadow-soft p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">My Responses</h2>
              {profile.responses.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No responses yet</p>
              ) : (
                <div className="space-y-3">
                  {profile.responses.map((response) => (
                    <div
                      key={response.id}
                      className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-primary">
                          {BLOOD_GROUP_LABELS[response.request.bloodGroup]}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            response.status
                          )}`}
                        >
                          {response.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium">
                        For: {response.request.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(response.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}