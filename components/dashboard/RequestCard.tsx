


// components/dashboard/RequestCard.tsx
import Link from 'next/link';
import BloodGroupBadge from '@/components/dashboard/temp';
import UrgencyBadge from './UrgencyBadge';
import { MapPin, Clock } from 'lucide-react';
import { formatDistance } from '@/lib/utils/distance';
import { useState } from 'react';
import QuickDonateModal from '@/components/requests/QuickDonateModal';

interface RequestCardProps {
  request: {
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
  };
  onResponseSuccess?: () => void;
}

export default function RequestCard({ request, onResponseSuccess }: RequestCardProps) {
  const [showModal, setShowModal] = useState(false);
  const timeAgo = getTimeAgo(new Date(request.createdAt));

  const handleSuccess = () => {
    setShowModal(false);
    if (onResponseSuccess) {
      onResponseSuccess();
    }
  };

  return (
    <>
      <div className="group bg-card border border-border rounded-lg p-4 hover:shadow-hover hover:border-primary/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {request.patientName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'} needed
              </p>
            </div>
          </div>
          <UrgencyBadge urgency={request.urgency} />
        </div>

        <div className="space-y-2 mb-4">
          {request.hospitalName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">🏥</span>
              <span>{request.hospitalName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{request.patientLocationName}</span>
            <span className="text-primary font-medium">
              • {formatDistance(request.distance)} away
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>{timeAgo}</span>
            {request.responseCount > 0 && (
              <span className="ml-auto text-success font-medium">
                {request.responseCount} {request.responseCount === 1 ? 'response' : 'responses'}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/requests/${request.id}`}
            className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground text-center rounded-lg font-medium hover:bg-muted transition-all"
          >
            View Details
          </Link>
          {request.canUserDonate && (
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:opacity-90 hover:shadow-glow transition-all shadow-glow"
            >
              I Can Donate
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <QuickDonateModal
          request={request}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}