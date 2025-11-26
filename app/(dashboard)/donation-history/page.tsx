
"use client"
import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle, Calendar, MapPin, Building2, User, Droplet } from 'lucide-react';

interface DonationRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  hospitalName: string | null;
  patientLocationName: string;
  urgency: string;
  createdBy: {
    name: string;
    phone: string;
  };
}

interface Donation {
  id: string;
  donorId: string;
  requestId: string | null;
  donationDate: string;
  unitsDonated: number;
  hospitalName: string | null;
  notes: string | null;
  request: DonationRequest | null;
}

interface DonationStats {
  totalDonations: number;
  totalUnits: number;
  lastDonationDate: string | null;
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }

      const data = await response.json();
      setDonations(data.donations);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20';
      case 'HIGH':
        return 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20';
      case 'MEDIUM':
        return 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20';
      case 'LOW':
        return 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={fetchDonations}
            className="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300"
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Donation History
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">Track all your blood donations and contributions</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Donations */}
            <div className="bg-card border border-border rounded-2xl shadow-soft p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 dark:bg-red-500/20 rounded-xl p-3">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalDonations}</p>
                </div>
              </div>
            </div>

            {/* Units Donated */}
            <div className="bg-card border border-border rounded-2xl shadow-soft p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-500/20 rounded-xl p-3">
                  <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Units Donated</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalUnits}</p>
                </div>
              </div>
            </div>

            {/* Last Donation */}
            <div className="bg-card border border-border rounded-2xl shadow-soft p-6 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-500/20 rounded-xl p-3">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Last Donation</p>
                  <p className="text-lg font-bold text-foreground">
                    {stats.lastDonationDate ? formatDate(stats.lastDonationDate) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-soft p-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No donations yet</h3>
            <p className="mt-2 text-muted-foreground">Start saving lives by responding to blood requests!</p>
            <button className="mt-6 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300">
              Find Requests
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div 
                key={donation.id} 
                className="bg-card border border-border rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300">
                        {donation.request?.bloodGroup || 'N/A'}
                      </span>
                      {donation.request && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(donation.request.urgency)}`}>
                          {donation.request.urgency}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                        <Droplet className="h-3 w-3" />
                        {donation.unitsDonated} {donation.unitsDonated === 1 ? 'unit' : 'units'}
                      </span>
                    </div>

                    {/* Patient Name */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {donation.request ? `Patient: ${donation.request.patientName}` : 'Direct Donation'}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {donation.request && (
                        <>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {donation.request.patientLocationName}
                          </p>
                          {donation.request.hospitalName && (
                            <p className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-primary" />
                              {donation.request.hospitalName}
                            </p>
                          )}
                          <p className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Requested by: {donation.request.createdBy.name}
                          </p>
                        </>
                      )}
                      {donation.notes && (
                        <p className="mt-3 p-3 bg-muted/50 rounded-lg text-card-foreground italic border border-border">
                          "{donation.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-6 lg:mt-0 lg:ml-8 text-left lg:text-right">
                    <p className="text-sm font-medium text-muted-foreground">Donation Date</p>
                    <p className="text-lg font-semibold text-foreground mt-1">{formatDate(donation.donationDate)}</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}