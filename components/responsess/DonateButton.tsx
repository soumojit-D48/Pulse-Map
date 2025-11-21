

// components/responses/DonateButton.tsx
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface DonateButtonProps {
  requestId: string;
  canUserDonate: boolean;
  hasResponded: boolean;
  onSuccess?: () => void;
}

export default function DonateButton({
  requestId,
  canUserDonate,
  hasResponded,
  onSuccess,
}: DonateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleDonate = async () => {
    if (!canUserDonate) {
      toast.error('Your blood group is not compatible with this request');
      return;
    }

    if (hasResponded) {
      toast.info('You have already responded to this request');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          message: message.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit response');
      }

      toast.success('Response submitted! The requester will contact you soon.');
      setShowMessageInput(false);
      setMessage('');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (hasResponded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800">
          <Heart className="fill-current" size={20} />
          <span className="font-medium">You've already responded to this request</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          The requester will contact you if needed
        </p>
      </div>
    );
  }

  if (!canUserDonate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-medium">
          Your blood group is not compatible with this request
        </p>
        <p className="text-sm text-yellow-700 mt-1">
          Thank you for your willingness to help!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!showMessageInput ? (
        <button
          onClick={() => setShowMessageInput(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary-dark transition shadow-glow"
        >
          <Heart className="fill-current" size={24} />
          I Can Donate Blood
        </button>
      ) : (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent resize-none"
              placeholder="Let them know when you're available or any other details..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowMessageInput(false);
                setMessage('');
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-border rounded-lg font-medium text-card-foreground hover:bg-muted transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDonate}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm Donation'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <strong>What happens next:</strong> The requester will receive your contact information 
          and will reach out to coordinate the donation.
        </p>
      </div>
    </div>
  );
}