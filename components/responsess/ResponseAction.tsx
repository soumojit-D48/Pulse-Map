

// components/responses/ResponseActions.tsx
'use client';

import { useState } from 'react';
import { Check, X, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface ResponseActionsProps {
  responseId: string;
  donorName: string;
  donorPhone: string;
  status: string;
  onSuccess: () => void;
}

export default function ResponseActions({
  responseId,
  donorName,
  donorPhone,
  status,
  onSuccess,
}: ResponseActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to accept response');
      }

      const data = await response.json();
      toast.success(data.message || 'Response accepted and request fulfilled!');
      setShowAcceptConfirm(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DECLINED' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to decline response');
      }

      toast.success('Response declined');
      setShowDeclineConfirm(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to decline response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show actions for already processed responses
  if (status !== 'PENDING') {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <a
          href={`tel:${donorPhone}`}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Phone size={16} />
          Call
        </a>
        <button
          onClick={() => setShowAcceptConfirm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          <Check size={16} />
          Accept & Fulfill
        </button>
        <button
          onClick={() => setShowDeclineConfirm(true)}
          className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          <X size={16} />
          Decline
        </button>
      </div>

      {/* Accept Confirmation Modal */}
      {showAcceptConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setShowAcceptConfirm(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Accept & Fulfill Request
              </h3>
              <p className="text-muted-foreground">
                You're about to mark <strong>{donorName}</strong> as the donor and fulfill this request.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>This will:</strong>
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
                <li>Record {donorName}'s donation in history</li>
                <li>Update their last donation date</li>
                <li>Mark request as fulfilled</li>
                <li>Decline other pending responses</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAcceptConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-card-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setShowDeclineConfirm(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Decline Response
              </h3>
              <p className="text-muted-foreground">
                Are you sure you want to decline <strong>{donorName}</strong>'s response?
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                This won't affect the request status. You can still accept other responses or mark the request as fulfilled manually.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeclineConfirm(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-card-foreground hover:bg-muted transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}