
// app/(dashboard)/home/page.tsx
import { auth } from '@clerk/nextjs/server';
import  prisma  from '@/lib/prisma';

export default async function DashboardHomePage() {
  const { userId } = await auth();

  const profile = await prisma.profile.findUnique({
    where: { clerkId: userId! },
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with blood donation in your area
        </p>
      </div>

      {/* Stats Cards - We'll build these in Step 9 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🩸</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nearby Donors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Requests - Placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Emergency Requests Near You
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Help someone in need today
          </p>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-gray-600">No emergency requests nearby</p>
            <p className="text-sm text-gray-500 mt-1">
              We'll notify you when someone needs your blood type
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}