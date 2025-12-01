

// app/(dashboard)/requests/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRequestSchema, CreateRequestInput } from '@/lib/validations/request';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import UrgencySelector from '@/components/requests/UrgencySelector';
import BloodGroupSelector from '@/components/requests/BloodGroupSelector';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
});

export default function CreateRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      urgency: 'MEDIUM',
      unitsNeeded: 1,
      patientLatitude: 0,
      patientLongitude: 0,
    },
  });

  const watchBloodGroup = watch('bloodGroup');
  const watchUrgency = watch('urgency');

  const onSubmit = async (data: CreateRequestInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create request');
      }

      const result = await response.json();

      toast.success(
        `Request created! ${result.matchedDonors} nearby donors will be notified.`
      );

      router.push('/requests');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create request. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/Home"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create Blood Request</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create an emergency blood request
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Information */}
        <div className="bg-card rounded-lg shadow-soft p-6 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Patient Information</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Patient Name *
            </label>
            <input
              {...register('patientName')}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
              placeholder="Enter patient name"
            />
            {errors.patientName && (
              <p className="text-destructive text-sm mt-1">{errors.patientName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Blood Group Required *
            </label>
            <BloodGroupSelector
              value={watchBloodGroup}
              onChange={(value) => setValue('bloodGroup', value as any)}
            />
            {errors.bloodGroup && (
              <p className="text-destructive text-sm mt-1">{errors.bloodGroup.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Contact Phone *
            </label>
            <input
              {...register('contactPhone')}
              type="tel"
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
              placeholder="+1234567890"
            />
            {errors.contactPhone && (
              <p className="text-destructive text-sm mt-1">{errors.contactPhone.message}</p>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-card rounded-lg shadow-soft p-6 space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Request Details</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Urgency Level *
            </label>
            <UrgencySelector
              value={watchUrgency}
              onChange={(value) => setValue('urgency', value as any)}
            />
            {errors.urgency && (
              <p className="text-destructive text-sm mt-1">{errors.urgency.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Units Needed *
            </label>
            <input
              {...register('unitsNeeded', { valueAsNumber: true })}
              type="number"
              min="1"
              max="10"
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
              placeholder="1"
            />
            {errors.unitsNeeded && (
              <p className="text-destructive text-sm mt-1">{errors.unitsNeeded.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Hospital Name (Optional)
            </label>
            <input
              {...register('hospitalName')}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent"
              placeholder="Enter hospital name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 ring-primary focus:border-transparent resize-none"
              placeholder="Any additional information..."
            />
            {errors.notes && (
              <p className="text-destructive text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-card rounded-lg shadow-soft p-6 space-y-4">
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-semibold text-card-foreground">Patient Location</h2>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us find nearby donors quickly
            </p>
          </div>

          <LocationPicker
            onLocationSelect={(location) => {
              setValue('patientLatitude', location.lat);
              setValue('patientLongitude', location.lng);
              setValue('patientLocationName', location.locationName);
            }}
          />
          {errors.patientLocationName && (
            <p className="text-destructive text-sm mt-1">{errors.patientLocationName.message}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold text-card-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 shadow-glow"
          >
            {loading ? 'Creating Request...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
}