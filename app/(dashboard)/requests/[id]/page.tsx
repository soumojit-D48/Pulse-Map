

// app/(dashboard)/requests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import BloodGroupBadge from '@/components/dashboard/BloodGroupBadge';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';
import { toast } from 'sonner';

import DonateButton from '@/components/responsess/DonateButton';
import ResponseStatusBadge from '@/components/responsess/ResponseStatusBadge';
import ResponseActions from '@/components/responsess/ResponseAction';
import DonorResponseActions from '@/components/responsess/DonorResponseActions';

interface RequestDetail {
  id: string;
  patientName: string;
  bloodGroup: string;
  urgency: string;
  unitsNeeded: number;
  hospitalName?: string | null;
  patientLocationName: string;
  contactPhone: string;
  notes?: string | null;
  status: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    phone: string;
  };
  responses: {
    id: string;
    status: string;
    message?: string | null;
    createdAt: string;
    donor: {
      id: string;
      name: string;
      phone: string;
      bloodGroup: string;
    };
  }[];
}

interface RequestResponse {
  request: RequestDetail;
  isCreator: boolean;
  hasResponded: boolean;
  canUserDonate: boolean;
  userProfileId?: string; // To check if user is the donor
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [canUserDonate, setCanUserDonate] = useState(false);
  const [userProfileId, setUserProfileId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchRequestDetail();
    }
  }, [params.id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/requests/${params.id}`);
      if (!response.ok) throw new Error('Request not found');
      const data: RequestResponse = await response.json();
      setRequest(data.request);
      setIsCreator(data.isCreator);
      setHasResponded(data.hasResponded);
      setCanUserDonate(data.canUserDonate || false);
      setUserProfileId(data.userProfileId || '');
    } catch (error) {
      console.error('Failed to fetch request:', error);
      toast.error('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/requests/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (!response.ok) throw new Error('Failed to cancel request');

      toast.success('Request cancelled');
      router.push('/requests');
    } catch (error) {
      toast.error('Failed to cancel request');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground mt-4">Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-card-foreground font-medium">Request not found</p>
        <Link
          href="/requests"
          className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Requests
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const config = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      FULFILLED: 'bg-blue-100 text-blue-800 border-blue-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return config[status as keyof typeof config] || config.ACTIVE;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} />
          Back to Requests
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Request Details</h1>
            <p className="text-muted-foreground mt-2">
              Created {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(
              request.status
            )}`}
          >
            {request.status}
          </span>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-card rounded-lg shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Patient Information</h2>
          <div className="flex items-center gap-2">
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
            <UrgencyBadge urgency={request.urgency} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="font-medium text-card-foreground">{request.patientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Contact Phone</p>
              <a
                href={`tel:${request.contactPhone}`}
                className="font-medium text-primary hover:underline"
              >
                {request.contactPhone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl">🩸</span>
            <div>
              <p className="text-sm text-muted-foreground">Units Needed</p>
              <p className="font-medium text-card-foreground">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'}
              </p>
            </div>
          </div>

          {request.hospitalName && (
            <div className="flex items-center gap-3">
              <span className="text-xl">🏥</span>
              <div>
                <p className="text-sm text-muted-foreground">Hospital</p>
                <p className="font-medium text-card-foreground">{request.hospitalName}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin size={20} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-card-foreground">{request.patientLocationName}</p>
            </div>
          </div>

          {request.notes && (
            <div className="flex items-start gap-3 md:col-span-2">
              <span className="text-xl">📝</span>
              <div>
                <p className="text-sm text-muted-foreground">Additional Notes</p>
                <p className="text-card-foreground mt-1">{request.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Donor Responses */}
      <div className="bg-card rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4 border-b border-border pb-4">
          Donor Responses ({request.responses.length})
        </h2>

        {request.responses.length > 0 ? (
          <div className="space-y-3">
            {request.responses.map((response) => {
              const isDonor = userProfileId === response.donor.id;
              
              return (
                <div
                  key={response.id}
                  className="bg-muted/30 rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {response.donor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {response.donor.name}
                          {isDonor && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <BloodGroupBadge bloodGroup={response.donor.bloodGroup} size="sm" />
                          <span className="text-sm text-muted-foreground">{response.donor.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ResponseStatusBadge status={response.status} size="sm" />
                      
                      {/* Show ResponseActions for request creator */}
                      {isCreator && request.status === 'ACTIVE' && (
                        <ResponseActions
                          responseId={response.id}
                          donorName={response.donor.name}
                          donorPhone={response.donor.phone}
                          status={response.status}
                          onSuccess={fetchRequestDetail}
                        />
                      )}
                      
                      {/* Show DonorResponseActions for the donor */}
                      {isDonor && !isCreator && (
                        console.log(isDonor, "d"),
                        console.log( isCreator,"r"),
                        
                        <DonorResponseActions
                          responseId={response.id}
                          currentMessage={response.message}
                          status={response.status}
                          onSuccess={fetchRequestDetail}
                        />
                      )}
                    </div>
                  </div>
                  {response.message && (
                    <p className="text-sm text-muted-foreground mt-3 pl-15 italic">
                      "{response.message}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-card-foreground">No responses yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Nearby donors will be notified about this request
            </p>
          </div>
        )}
      </div>

      {/* Donate Button (for non-creators) */}
      {!isCreator && request.status === 'ACTIVE' && (
        <div className="bg-card rounded-lg shadow-soft p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Want to Help?
          </h2>
          <DonateButton
            requestId={request.id}
            canUserDonate={canUserDonate}
            hasResponded={hasResponded}
            onSuccess={fetchRequestDetail}
          />
        </div>
      )}

      {/* Actions (for creators - only if no responses) */}
      {isCreator && request.status === 'ACTIVE' && request.responses.length === 0 && (
        <div className="flex gap-4">
          <button
            onClick={handleCancelRequest}
            disabled={actionLoading}
            className="flex-1 px-6 py-3 border-2 border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition disabled:opacity-50"
          >
            {actionLoading ? 'Cancelling...' : 'Cancel Request'}
          </button>
        </div>
      )}
    </div>
  );
}