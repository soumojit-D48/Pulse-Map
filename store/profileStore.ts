

// store/profileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BloodGroup = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 
                         'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface LocationData {
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  locationName: string;
}

interface ProfileFormData {
  // Step 1: Personal Info
  name: string;
  phone: string;
  age: number | null;
  gender: Gender | null;
  
  // Step 2: Medical Info
  bloodGroup: BloodGroup | null;
  lastDonationDate: Date | null;
  
  // Step 3: Location
  location: LocationData | null;
  
  // Step 4: Availability
  available: boolean;
}

interface ProfileStore {
  currentStep: number;
  formData: ProfileFormData;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<ProfileFormData>) => void;
  updateLocation: (location: LocationData) => void;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialFormData: ProfileFormData = {
  name: '',
  phone: '',
  age: null,
  gender: null,
  bloodGroup: null,
  lastDonationDate: null,
  location: null,
  available: false,
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      
      updateLocation: (location) =>
        set((state) => ({
          formData: { ...state.formData, location },
        })),
      
      resetForm: () =>
        set({
          currentStep: 1,
          formData: initialFormData,
        }),
      
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4),
        })),
      
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
    }),
    {
      name: 'profile-form-storage',
    }
  )
);