

// app/(dashboard)/Home/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Heart, Users, FileText } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RequestCard from '@/components/dashboard/RequestCard';
import Link from 'next/link';

interface DashboardStats {
  totalDonations: number; // all
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
  const [statsLoading, setStatsLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [filterBloodGroup]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const statsRes = await fetch('/api/dashboard/stats');
      // console.log(statsRes, "sdjsjk");


      if (!statsRes.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const statsData = await statsRes.json();
      console.log(statsData, "data");

      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsRes = await fetch(
        `/api/requests/nearby?radius=50${filterBloodGroup ? `&bloodGroup=${filterBloodGroup}` : ''}`
      );

      if (!requestsRes.ok) {
        throw new Error('Failed to fetch requests');
      }

      const requestsData = await requestsRes.json();
      setRequests(requestsData.requests || []);
      // console.log(requestsData.requests, "rrrr");

    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSuccess = () => {
    // Refresh requests after successful response
    fetchRequests();


  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard 👋</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with blood donation in your area
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsLoading ? (
          // Loading skeletons for stats
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-soft p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Emergency Requests Section */}
      <div className="bg-card rounded-lg shadow-soft">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Emergency Requests Near You
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Help someone in need today
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
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
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-dark transition shadow-glow"
              >
                + Create Request
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground mt-4">Loading requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onResponseSuccess={handleResponseSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-card-foreground">
                {filterBloodGroup
                  ? `No ${filterBloodGroup.replace('_', ' ')} requests nearby`
                  : 'No emergency requests nearby'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                We'll notify you when someone needs your blood type
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}