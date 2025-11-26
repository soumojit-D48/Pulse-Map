


// components/requests/QuickDonateModal.tsx
'use client';

// have to fix should show the req taht he can donate
// he shouln't donate his own req,*** but here he can see

import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { toast } from 'sonner';
import BloodGroupBadge from '@/components/dashboard/BloodGroupBadge';
import UrgencyBadge from '@/components/dashboard/UrgencyBadge';

interface QuickDonateModalProps {
  request: {
    id: string;
    patientName: string;
    bloodGroup: string;
    urgency: string;
    unitsNeeded: number;
    hospitalName?: string | null;
    patientLocationName: string;
    distance: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuickDonateModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: QuickDonateModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          message: message.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit response');
      }

      toast.success('Response submitted! The requester will contact you soon.');
      setMessage('');
      onClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="text-primary fill-current" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Confirm Donation
              </h2>
              <p className="text-sm text-muted-foreground">
                You're about to help save a life
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Summary */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                <p className="font-semibold text-card-foreground text-lg">
                  {request.patientName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                <UrgencyBadge urgency={request.urgency} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Units Needed</p>
                <p className="font-medium text-card-foreground">
                  {request.unitsNeeded} {request.unitsNeeded === 1 ? 'unit' : 'units'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Distance</p>
                <p className="font-medium text-card-foreground">
                  {request.distance < 1
                    ? `${Math.round(request.distance * 1000)}m`
                    : `${request.distance.toFixed(1)}km`} away
                </p>
              </div>
              {request.hospitalName && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Hospital</p>
                  <p className="font-medium text-card-foreground">{request.hospitalName}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-card-foreground truncate">
                  {request.patientLocationName}
                </p>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent resize-none"
              placeholder="Let them know when you're available, any questions, or other details..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
              <li>The requester will receive your contact information</li>
              <li>They'll reach out to coordinate the donation</li>
              <li>You can view this response in your profile</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold text-card-foreground hover:bg-muted transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 shadow-glow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Heart className="fill-current" size={20} />
                Confirm Donation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}