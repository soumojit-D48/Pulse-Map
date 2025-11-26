

// components/responsess/DonorResponseActions.tsx
'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DonorResponseActionsProps {
  responseId: string;
  currentMessage?: string | null;
  status: string;
  onSuccess: () => void;
}

export default function DonorResponseActions({
  responseId,
  currentMessage,
  status,
  onSuccess,
}: DonorResponseActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState(currentMessage || '');
  const [loading, setLoading] = useState(false);

  // Keep local message in sync if parent updates `currentMessage`
  useEffect(() => {
    setMessage(currentMessage || '');
  }, [currentMessage]);

  // Cannot edit or delete accepted responses
  if (status === 'ACCEPTED') {
    return null;
  }

  const handleEdit = async () => {
    if (message.length > 500) {
      toast.error('Message is too long (max 500 characters)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update message');
      }

      toast.success('Message updated successfully');
      setEditDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete response');
      }

      toast.success('Response cancelled successfully');
      setDeleteDialogOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Edit Button */}
        <button
          onClick={() => setEditDialogOpen(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="Edit message"
        >
          <Pencil size={18} />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Cancel response"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Your Message</DialogTitle>
            <DialogDescription>
              Update the message you want to send with your donation offer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message (optional)"
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground mt-2 text-right">
              {message.length}/500 characters
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? 'Updating...' : 'Update Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Response?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your donation response? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Cancel Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}