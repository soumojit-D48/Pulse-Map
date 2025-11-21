
// // app/(dashboard)/home/page.tsx
// import { auth } from '@clerk/nextjs/server';
// import  prisma  from '@/lib/prisma';

// export default async function DashboardHomePage() {
//   const { userId } = await auth();

//   const profile = await prisma.profile.findUnique({
//     where: { clerkId: userId! },
//   });

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           Welcome back, {profile?.name}! 👋
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Here's what's happening with blood donation in your area
//         </p>
//       </div>

//       {/* Stats Cards - We'll build these in Step 9 */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Donations</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
//               <span className="text-2xl">🩸</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Requests</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <span className="text-2xl">📋</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Nearby Donors</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <span className="text-2xl">👥</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Emergency Requests - Placeholder */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Emergency Requests Near You
//           </h2>
//           <p className="text-sm text-gray-600 mt-1">
//             Help someone in need today
//           </p>
//         </div>
//         <div className="p-6">
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
//               <span className="text-3xl">🔍</span>
//             </div>
//             <p className="text-gray-600">No emergency requests nearby</p>
//             <p className="text-sm text-gray-500 mt-1">
//               We'll notify you when someone needs your blood type
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



















// app/(dashboard)/home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Heart, Users, FileText } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RequestCard from '@/components/dashboard/RequestCard';
import Link from 'next/link';

interface DashboardStats {
  totalDonations: number;
  activeRequests: number;
  nearbyDonors: number;
}

interface Request {
  id: string;
  patientName: string;
  bloodGroup: string;
  urgency: string;
  unitsNeeded: number;
  hospitalName?: string | null;
  patientLocationName: string;
  distance: number;
  createdAt: Date;
  responseCount: number;
  canUserDonate: boolean;
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    activeRequests: 0,
    nearbyDonors: 0,
  });
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [filterBloodGroup]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch('/api/dashboard/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch nearby requests
      const requestsRes = await fetch(
        `/api/requests/nearby?radius=50${filterBloodGroup ? `&bloodGroup=${filterBloodGroup}` : ''}`
      );
      const requestsData = await requestsRes.json();
      setRequests(requestsData.requests || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard 👋</h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with blood donation in your area
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={Heart}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatsCard
          title="Active Requests"
          value={stats.activeRequests}
          icon={FileText}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Nearby Donors"
          value={stats.nearbyDonors}
          icon={Users}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Emergency Requests Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Emergency Requests Near You
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Help someone in need today
              </p>
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Blood Groups</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
              </select>

              <Link
                href="/requests/new"
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                + Create Request
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 mt-4">Loading requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-600">
                {filterBloodGroup
                  ? `No ${filterBloodGroup.replace('_', ' ')} requests nearby`
                  : 'No emergency requests nearby'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                We'll notify you when someone needs your blood type
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}