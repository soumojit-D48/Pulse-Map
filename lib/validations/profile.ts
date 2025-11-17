
// lib/validations/profile.ts
import { z } from 'zod';

// Step 1: Personal Info Schema
export const personalInfoSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .length(10, 'Phone number must be exactly 10 digits'),
  
  age: z.number()
    .min(18, 'You must be at least 18 years old to donate blood')
    .max(65, 'Donors must be under 65 years old'),
  
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    error: 'Please select your gender',
  }),
});

// Step 2: Medical Info Schema
export const medicalInfoSchema = z.object({
  bloodGroup: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE'
  ], {
    error: 'Please select your blood group',
  }),
  
  lastDonationDate: z.date()
    .optional()
    .nullable()
    .refine((date) => {
      if (!date) return true; // Allow null/undefined
      return date <= new Date(); // Date should not be in the future
    }, 'Last donation date cannot be in the future'),
});

// Step 3: Location Schema
export const locationSchema = z.object({
  state: z.string()
    .min(1, 'Please select a state'),
  
  city: z.string()
    .min(1, 'Please select a city'),
  
  latitude: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  
  longitude: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  
  locationName: z.string()
    .min(3, 'Please provide a location name or address')
    .max(200, 'Location name is too long'),
});

// Step 4: Availability Schema
export const availabilitySchema = z.object({
  available: z.boolean(),
});

// Complete Profile Schema (all steps combined)
export const completeProfileSchema = personalInfoSchema
  .merge(medicalInfoSchema)
  .merge(locationSchema)
  .merge(availabilitySchema);

// Type inference
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type MedicalInfoFormData = z.infer<typeof medicalInfoSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;