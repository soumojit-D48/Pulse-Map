

// components/profile/MedicalInfoStep.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicalInfoSchema, MedicalInfoFormData } from '@/lib/validations/profile';
import { useProfileStore } from '@/store/profileStore';
import { useEffect } from 'react';
import { Droplet } from 'lucide-react';

const bloodGroups = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export default function MedicalInfoStep() {
  const { formData, updateFormData, nextStep } = useProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MedicalInfoFormData>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      bloodGroup: formData.bloodGroup || undefined,
      lastDonationDate: formData.lastDonationDate || null,
    },
  });

  const selectedBloodGroup = watch('bloodGroup');

  useEffect(() => {
    if (formData.bloodGroup) setValue('bloodGroup', formData.bloodGroup);
    if (formData.lastDonationDate) setValue('lastDonationDate', formData.lastDonationDate);
  }, [formData, setValue]);

  const onSubmit = (data: MedicalInfoFormData) => {
    updateFormData(data);
    console.log(data, "data");
    
    nextStep();
  };

  // Calculate eligibility for next donation
  const getEligibilityStatus = () => {
    if (!formData.lastDonationDate) return null;
    
    const lastDonation = new Date(formData.lastDonationDate);
    const today = new Date();
    const daysSinceLastDonation = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilEligible = 90 - daysSinceLastDonation;

    if (daysUntilEligible <= 0) {
      return { eligible: true, message: 'You are eligible to donate blood!' };
    } else {
      return { 
        eligible: false, 
        message: `You'll be eligible to donate again in ${daysUntilEligible} days` 
      };
    }
  };

  const eligibilityStatus = getEligibilityStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
        <p className="text-gray-600 mt-1">Help us understand your donation eligibility</p>
      </div>

      <form id="medical-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-5"> */}
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Blood Group <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {bloodGroups.map((group) => (
              <label
                key={group.value}
                className="flex flex-col items-center justify-center px-4 py-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-red-500 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 transition-all"
              >
                <input
                  type="radio"
                  value={group.value}
                  {...register('bloodGroup')}
                  className="sr-only"
                />
                <Droplet 
                  className={`w-6 h-6 mb-1 ${
                    selectedBloodGroup === group.value ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <span className="text-lg font-bold">{group.label}</span>
              </label>
            ))}
          </div>
          {errors.bloodGroup && (
            <p className="mt-1 text-sm text-red-600">{errors.bloodGroup.message}</p>
          )}
        </div>

        {/* Last Donation Date */}
        <div>
          <label htmlFor="lastDonationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Last Donation Date <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            id="lastDonationDate"
            type="date"
            {...register('lastDonationDate', {
              setValueAs: (value) => (value ? new Date(value) : null),
            })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {errors.lastDonationDate && (
            <p className="mt-1 text-sm text-red-600">{errors.lastDonationDate.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Leave blank if you haven't donated before
          </p>
        </div>

        {/* Eligibility Status */}
        {eligibilityStatus && (
          <div className={`p-4 rounded-lg ${
            eligibilityStatus.eligible 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-sm font-medium ${
              eligibilityStatus.eligible ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {eligibilityStatus.message}
            </p>
          </div>
        )}

        {/* Blood Donation Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Blood Donation Facts:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>You must wait at least 90 days (3 months) between donations</li>
            <li>You should weigh at least 50 kg (110 lbs)</li>
            <li>You should be in good health and feeling well</li>
            <li>One donation can save up to 3 lives</li>
          </ul>
        </div>

        {/* Blood Compatibility Chart */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Blood Compatibility Guide:</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">O-</span>
              <span className="text-gray-600">Universal donor (can donate to all)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">AB+</span>
              <span className="text-gray-600">Universal receiver (can receive from all)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">A+</span>
              <span className="text-gray-600">Can donate to A+, AB+</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">B+</span>
              <span className="text-gray-600">Can donate to B+, AB+</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}