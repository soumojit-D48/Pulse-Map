

// app/(dashboard)/find-requests/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, MapPin, Phone, Clock, AlertCircle, Droplet, User, MessageCircle } from 'lucide-react';

// Import Leaflet CSS in the component
import 'leaflet/dist/leaflet.css';

// Dynamically import the entire map component with no SSR
const MapView = dynamic(() => import('./Mapview'), { 
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
        <p>Loading map...</p>
      </div>
    </div>
  )
});

interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  urgency: string;
  hospitalName?: string | null;
  patientLocationName: string;
  patientLatitude: number;
  patientLongitude: number;
  distance: number;
  canUserDonate: boolean;
  responseCount: number;
  createdAt: Date;
  createdBy: {
    name: string;
    phone: string | null;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const BLOOD_GROUPS = [
  'ALL',
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
];

const BLOOD_GROUP_LABELS: { [key: string]: string } = {
  ALL: 'All Groups',
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

const URGENCY_COLORS = {
  CRITICAL: 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/20',
  HIGH: 'bg-orange-100 dark:bg-orange-500/10 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-500/20',
  MEDIUM: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/20',
  LOW: 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300 border-green-200 dark:border-green-500/20',
};

// Format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default function FindRequestsPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [bloodGroup, setBloodGroup] = useState('ALL');
  const [radius, setRadius] = useState(20);

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
      return;
    }

    if (userId) {
      fetchRequests();
    }
  }, [isLoaded, userId, router, bloodGroup]);

  // Debounced radius change
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      fetchRequests(newRadius);
    }, 500);

    setDebounceTimer(timer);
  };

  const fetchRequests = async (customRadius?: number) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        radius: String(customRadius ?? radius),
      });

      if (bloodGroup !== 'ALL') {
        params.append('bloodGroup', bloodGroup);
      }

      const response = await fetch(`/api/requests/nearby?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch requests');
      }

      const data = await response.json();
      
      // ✅ Get userLocation from API response (same as donors page)
      setRequests(data.requests);
      setUserLocation(data.userLocation);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUserLocation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (phone: string | null) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleRespond = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Finding blood requests near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Find Blood Requests</h1>
          <p className="text-muted-foreground">Help save lives by responding to urgent blood needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-card rounded-lg shadow-soft border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {BLOOD_GROUP_LABELS[group]}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance Radius Slider */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance Radius: {radius} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            <span className="font-semibold">{requests.length} request(s) found</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Map and List Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden h-[600px]">
            {userLocation ? (
              <MapView
                userLocation={userLocation}
                requests={requests}
                radius={radius}
                bloodGroupLabels={BLOOD_GROUP_LABELS}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <MapPin className="mx-auto h-12 w-12 mb-4" />
                  <p className="font-medium mb-2">Location Required</p>
                  <p className="text-sm">Please complete your profile with location information</p>
                  <button
                    onClick={() => router.push('/profile')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Request List */}
          <div className="space-y-4 h-[600px] overflow-y-auto">
            {requests.length === 0 ? (
              <div className="bg-card rounded-lg shadow-soft border border-border p-12 text-center">
                <Droplet className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No requests found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try increasing the search radius or changing filters
                </p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="bg-card rounded-lg shadow-soft border border-border hover:shadow-glow transition p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{request.patientName}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300">
                          {BLOOD_GROUP_LABELS[request.bloodGroup]}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            URGENCY_COLORS[request.urgency as keyof typeof URGENCY_COLORS]
                          }`}
                        >
                          {request.urgency}
                        </span>
                        {request.canUserDonate && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                            You can donate
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Droplet className="h-4 w-4" />
                          {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''} needed
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {request.hospitalName || request.patientLocationName} • {request.distance.toFixed(1)} km
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(request.createdAt)}
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Contact: {request.createdBy.name}
                        </p>
                        <p className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          {request.responseCount} response{request.responseCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {request.createdBy.phone && (
                      <button
                        onClick={() => handleContact(request.createdBy.phone)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </button>
                    )}
                    <button
                      onClick={() => handleRespond(request.id)}
                      className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Respond
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}












// // app/(dashboard)/find-requests/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import { Loader2, MapPin, Phone, Clock, AlertCircle, Droplet, User, MessageCircle } from 'lucide-react';

// // Import Leaflet CSS in the component
// import 'leaflet/dist/leaflet.css';

// // Dynamically import the entire map component with no SSR
// const MapView = dynamic(() => import('./Mapview'), { 
//   ssr: false,
//   loading: () => (
//     <div className="h-full flex items-center justify-center text-muted-foreground">
//       <div className="text-center">
//         <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
//         <p>Loading map...</p>
//       </div>
//     </div>
//   )
// });

// interface BloodRequest {
//   id: string;
//   patientName: string;
//   bloodGroup: string;
//   unitsNeeded: number;
//   urgency: string;
//   hospitalName?: string | null;
//   patientLocationName: string;
//   patientLatitude: number;
//   patientLongitude: number;
//   distance: number;
//   canUserDonate: boolean;
//   responseCount: number;
//   createdAt: Date;
//   createdBy: {
//     name: string;
//     phone: string | null;
//   };
// }

// interface UserLocation {
//   latitude: number;
//   longitude: number;
// }

// const BLOOD_GROUPS = [
//   'ALL',
//   'A_POSITIVE',
//   'A_NEGATIVE',
//   'B_POSITIVE',
//   'B_NEGATIVE',
//   'AB_POSITIVE',
//   'AB_NEGATIVE',
//   'O_POSITIVE',
//   'O_NEGATIVE',
// ];

// const BLOOD_GROUP_LABELS: { [key: string]: string } = {
//   ALL: 'All Groups',
//   A_POSITIVE: 'A+',
//   A_NEGATIVE: 'A-',
//   B_POSITIVE: 'B+',
//   B_NEGATIVE: 'B-',
//   AB_POSITIVE: 'AB+',
//   AB_NEGATIVE: 'AB-',
//   O_POSITIVE: 'O+',
//   O_NEGATIVE: 'O-',
// };

// const URGENCY_COLORS = {
//   CRITICAL: 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/20',
//   HIGH: 'bg-orange-100 dark:bg-orange-500/10 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-500/20',
//   MEDIUM: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/20',
//   LOW: 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300 border-green-200 dark:border-green-500/20',
// };

// // Format time ago
// function formatTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

//   if (seconds < 60) return 'Just now';
//   if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
//   return `${Math.floor(seconds / 86400)} days ago`;
// }

// export default function FindRequestsPage() {
//   const { isLoaded, userId } = useAuth();
//   const router = useRouter();

//   const [requests, setRequests] = useState<BloodRequest[]>([]);
//   const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Filters
//   const [bloodGroup, setBloodGroup] = useState('ALL');
//   const [radius, setRadius] = useState(20);

//   // Debounce timer
//   const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (isLoaded && !userId) {
//       router.push('/sign-in');
//       return;
//     }

//     if (userId) {
//       fetchUserProfile();
//       fetchRequests();
//     }
//   }, [isLoaded, userId, router, bloodGroup]);

//   // Fetch user profile for location
//   const fetchUserProfile = async () => {
//     try {
//       const response = await fetch('/api/profile');
//       if (response.ok) {
//         const data = await response.json();
//         if (data.latitude && data.longitude) {
//           setUserLocation({
//             latitude: data.latitude,
//             longitude: data.longitude,
//           });
//         } else {
//           // Fallback to browser geolocation if profile doesn't have location
//           requestBrowserLocation();
//         }
//       }
//     } catch (err) {
//       console.error('Failed to fetch user profile:', err);
//       requestBrowserLocation();
//     }
//   };

//   // Request browser geolocation
//   const requestBrowserLocation = () => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//           setError(null);
//         },
//         (error) => {
//           console.error('Geolocation error:', error);
//           setError('Unable to get your location. Please enable location access or update your profile.');
//         }
//       );
//     } else {
//       setError('Geolocation is not supported by your browser. Please update your location in your profile.');
//     }
//   };

//   // Debounced radius change
//   const handleRadiusChange = (newRadius: number) => {
//     setRadius(newRadius);

//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     const timer = setTimeout(() => {
//       fetchRequests(newRadius);
//     }, 500);

//     setDebounceTimer(timer);
//   };

//   const fetchRequests = async (customRadius?: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams({
//         radius: String(customRadius ?? radius),
//       });

//       if (bloodGroup !== 'ALL') {
//         params.append('bloodGroup', bloodGroup);
//       }

//       const response = await fetch(`/api/requests/nearby?${params}`);

//       if (!response.ok) {
//         throw new Error('Failed to fetch requests');
//       }

//       const data = await response.json();
//       setRequests(data.requests);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContact = (phone: string | null) => {
//     if (phone) {
//       window.location.href = `tel:${phone}`;
//     }
//   };

//   const handleRespond = (requestId: string) => {
//     router.push(`/requests/${requestId}`);
//   };

//   if (!isLoaded || (loading && !userLocation)) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
//           <p className="mt-4 text-muted-foreground">Finding blood requests near you...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-card border-b border-border sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <h1 className="text-2xl font-bold text-foreground">Find Blood Requests</h1>
//           <p className="text-muted-foreground">Help save lives by responding to urgent blood needs</p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Filters */}
//         <div className="bg-card rounded-lg shadow-soft border border-border p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Blood Group Filter */}
//             <div>
//               <label className="block text-sm font-medium text-foreground mb-2">
//                 Blood Group
//               </label>
//               <select
//                 value={bloodGroup}
//                 onChange={(e) => setBloodGroup(e.target.value)}
//                 className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
//               >
//                 {BLOOD_GROUPS.map((group) => (
//                   <option key={group} value={group}>
//                     {BLOOD_GROUP_LABELS[group]}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Distance Radius Slider */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-foreground mb-2">
//                 Distance Radius: {radius} km
//               </label>
//               <input
//                 type="range"
//                 min="1"
//                 max="100"
//                 value={radius}
//                 onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
//                 className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
//               />
//               <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                 <span>1 km</span>
//                 <span>50 km</span>
//                 <span>100 km</span>
//               </div>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mt-4 text-sm text-muted-foreground">
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Searching...
//               </span>
//             ) : (
//               <span className="font-semibold">{requests.length} request(s) found</span>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
//             <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//             <span className="text-red-700 dark:text-red-300">{error}</span>
//           </div>
//         )}

//         {/* Map and List Container */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Map */}
//           <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden h-[600px]">
//             {userLocation ? (
//               <MapView
//                 userLocation={userLocation}
//                 requests={requests}
//                 radius={radius}
//                 bloodGroupLabels={BLOOD_GROUP_LABELS}
//               />
//             ) : (
//               <div className="h-full flex items-center justify-center text-muted-foreground">
//                 <div className="text-center p-8">
//                   <MapPin className="mx-auto h-12 w-12 mb-4" />
//                   <p className="font-medium mb-2">Location not available</p>
//                   <p className="text-sm mb-4">We need your location to find nearby blood requests</p>
//                   <button
//                     onClick={requestBrowserLocation}
//                     className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
//                   >
//                     Enable Location Access
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Request List */}
//           <div className="space-y-4 h-[600px] overflow-y-auto">
//             {requests.length === 0 ? (
//               <div className="bg-card rounded-lg shadow-soft border border-border p-12 text-center">
//                 <Droplet className="mx-auto h-12 w-12 text-muted-foreground" />
//                 <h3 className="mt-4 text-lg font-medium text-foreground">No requests found</h3>
//                 <p className="mt-2 text-muted-foreground">
//                   Try increasing the search radius or changing filters
//                 </p>
//               </div>
//             ) : (
//               requests.map((request) => (
//                 <div key={request.id} className="bg-card rounded-lg shadow-soft border border-border hover:shadow-glow transition p-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2 flex-wrap">
//                         <h3 className="text-lg font-semibold text-foreground">{request.patientName}</h3>
//                         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300">
//                           {BLOOD_GROUP_LABELS[request.bloodGroup]}
//                         </span>
//                         <span
//                           className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
//                             URGENCY_COLORS[request.urgency as keyof typeof URGENCY_COLORS]
//                           }`}
//                         >
//                           {request.urgency}
//                         </span>
//                         {request.canUserDonate && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
//                             You can donate
//                           </span>
//                         )}
//                       </div>

//                       <div className="space-y-1 text-sm text-muted-foreground">
//                         <p className="flex items-center gap-2">
//                           <Droplet className="h-4 w-4" />
//                           {request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''} needed
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <MapPin className="h-4 w-4" />
//                           {request.hospitalName || request.patientLocationName} • {request.distance.toFixed(1)} km
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <Clock className="h-4 w-4" />
//                           {formatTimeAgo(request.createdAt)}
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <User className="h-4 w-4" />
//                           Contact: {request.createdBy.name}
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <MessageCircle className="h-4 w-4" />
//                           {request.responseCount} response{request.responseCount !== 1 ? 's' : ''}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     {request.createdBy.phone && (
//                       <button
//                         onClick={() => handleContact(request.createdBy.phone)}
//                         className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
//                       >
//                         <Phone className="h-4 w-4" />
//                         Call
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleRespond(request.id)}
//                       className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition flex items-center justify-center gap-2"
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                       Respond
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


