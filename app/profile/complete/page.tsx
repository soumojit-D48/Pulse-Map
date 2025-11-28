

// app/profile/complete/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useProfileStore } from '@/store/profileStore';
import StepIndicator from '@/components/profile/StepIndicator';
import PersonalInfoStep from '@/components/profile/PersonalInfoStep';
import MedicalInfoStep from '@/components/profile/MedicalInfoStep';
// import LocationStep from '@/components/profile/LocationStep';
import AvailabilityStep from '@/components/profile/AvailabilityStep';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// export const dynamic = 'force-dynamic';

const LocationStep = dynamic(
  () => import('@/components/profile/LocationStep'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }
);

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const { currentStep, formData, nextStep, prevStep, resetForm } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:   
        if (!formData.name || !formData.phone || !formData.age || !formData.gender) {
          toast.error('Please fill all required fields');
          return false;
        }
        if (formData.age < 18 || formData.age > 65) {
          toast.error('Age must be between 18 and 65');
          return false;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
          toast.error('Please enter a valid 10-digit phone number');
          return false;
        }
        return true;

      case 2:
        if (!formData.bloodGroup) {
          toast.error('Please select your blood group');
          return false;
        }
        return true;

      case 3:
        if (!formData.location) {
          toast.error('Please select your location on the map');
          return false;
        }
        return true;

      case 4:
        return true;

      default:
        return false;
    }
  };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       nextStep();
//     }
//   };



const handleNext = () => {
  if (currentStep === 1) {

    const form = document.getElementById("personal-info-form") as HTMLFormElement | null;

  if (form) {
    form.requestSubmit();  
  }
  return
  }

  if (currentStep === 2) {
 
    const form = document.getElementById("medical-info-form") as HTMLFormElement | null;

  if (form) {
    form.requestSubmit();  
  }
  return
  }

  if (validateStep(currentStep)) {
    nextStep();
  }
};

  const handleBack = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: formData.name,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          lastDonationDate: formData.lastDonationDate,
          state: formData.location?.state,
          city: formData.location?.city,
          latitude: formData.location?.latitude,
          longitude: formData.location?.longitude,
          locationName: formData.location?.locationName,
          available: formData.available,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      toast.success('Profile completed successfully!');
      resetForm();
      router.push('/home');
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast.error(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <MedicalInfoStep />;
      case 3:
        return <LocationStep />;
      case 4:
        return <AvailabilityStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="text-sm text-gray-600">Help us set up your donor account</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {user?.firstName || 'there'}!
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is secure and will only be used to connect donors with recipients
        </p>
      </div>
    </div>
  );
}