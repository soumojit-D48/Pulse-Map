


// app/(dashboard)/responses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Calendar, Phone, User, Eye } from 'lucide-react';
import BloodGroupBadge from '@/components/dashboard/BloodGroupBadge';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';
import ResponseStatusBadge from '@/components/responsess/ResponseStatusBadge';
import DonorResponseActions from '@/components/responsess/DonorResponseActions';

interface ResponseData {
  id: string;
  status: string;
  message?: string | null;
  createdAt: string;
  request: {
    id: string;
    patientName: string;
    bloodGroup: string;
    urgency: string;
    unitsNeeded: number;
    hospitalName?: string | null;
    patientLocationName: string;
    contactPhone: string;
    status: string;
    createdAt: string;
    createdBy: {
      name: string;
      phone: string;
    };
  };
}

interface ApiResponse {
  responses: ResponseData[];
}

export default function MyResponsesPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED'>('ALL');

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/responses');
      if (!response.ok) throw new Error('Failed to fetch responses');
      const data: ApiResponse = await response.json();
      setResponses(data.responses);
    } catch (error) {
      console.error('Failed to fetch responses:', error);
      toast.error('Failed to load your responses');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (requestId: string) => {
    router.push(`/requests/${requestId}`);
  };

  const filteredResponses = responses.filter((response) => {
    if (filter === 'ALL') return true;
    return response.status === filter;
  });

  const getRequestStatusBadge = (status: string) => {
    const config = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      FULFILLED: 'bg-blue-100 text-blue-800 border-blue-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return config[status as keyof typeof config] || config.ACTIVE;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground mt-4">Loading your responses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Responses</h1>
          <p className="text-muted-foreground mt-2">
            Track all your donation responses in one place
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{responses.length}</p>
          <p className="text-sm text-muted-foreground">Total Responses</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card rounded-lg shadow-soft p-2 flex gap-2">
        {(['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'] as const).map((status) => {
          const count = status === 'ALL' 
            ? responses.length 
            : responses.filter(r => r.status === status).length;
          
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Responses List */}
      {filteredResponses.length > 0 ? (
        <div className="space-y-4">
          {filteredResponses.map((response) => (
            <div
              key={response.id}
              className="bg-card rounded-lg shadow-soft p-6 border border-border hover:shadow-md transition"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Request Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-lg">
                      {response.request.patientName.charAt(0)}
                    </span>
                  </div>

                  {/* Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {response.request.patientName}
                      </h3>
                      <BloodGroupBadge bloodGroup={response.request.bloodGroup} size="sm" />
                      <UrgencyBadge urgency={response.request.urgency} />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRequestStatusBadge(response.request.status)}`}>
                        {response.request.status}
                      </span>
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{response.request.patientLocationName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={16} />
                        <span>{response.request.createdBy.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={16} />
                        <a
                          href={`tel:${response.request.contactPhone}`}
                          className="hover:text-primary hover:underline"
                        >
                          {response.request.contactPhone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} />
                        <span>
                          Requested {new Date(response.request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {response.request.hospitalName && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        🏥 {response.request.hospitalName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Status */}
                <div className="flex flex-col items-end gap-2">
                  <ResponseStatusBadge status={response.status} size="md" />
                  <p className="text-xs text-muted-foreground">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Your Message */}
              {response.message && (
                <div className="bg-muted/30 rounded-lg p-3 mb-4 border-l-4 border-primary">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Your Message:</p>
                  <p className="text-sm text-card-foreground italic">"{response.message}"</p>
                </div>
              )}

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {response.request.unitsNeeded} {response.request.unitsNeeded === 1 ? 'unit' : 'units'} needed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(response.request.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  {/* Edit/Delete Actions */}
                  <DonorResponseActions
                    responseId={response.id}
                    currentMessage={response.message}
                    status={response.status}
                    onSuccess={fetchResponses}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-card rounded-lg shadow-soft p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center mb-6">
            <span className="text-5xl">💬</span>
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            {filter === 'ALL' ? 'No Responses Yet' : `No ${filter} Responses`}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {filter === 'ALL'
              ? "You haven't responded to any blood requests yet. Browse nearby requests to help save lives!"
              : `You don't have any ${filter.toLowerCase()} responses at the moment.`}
          </p>
          {filter === 'ALL' && (
            <button
              onClick={() => router.push('/requests')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Browse Requests
            </button>
          )}
        </div>
      )}
    </div>
  );
}