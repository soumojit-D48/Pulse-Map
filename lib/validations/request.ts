

import { z } from 'zod';

export const createRequestSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  bloodGroup: z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
  ], {
    error: 'Blood group is required',
  }),
  contactPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  urgency: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  unitsNeeded: z.number().min(1, 'At least 1 unit required').max(10, 'Maximum 10 units'),
  hospitalName: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  patientLatitude: z.number(),
  patientLongitude: z.number(),
  patientLocationName: z.string().min(2, 'Location is required'),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;