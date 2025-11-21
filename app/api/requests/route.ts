
// app/api/requests/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createRequestSchema } from '@/lib/validations/request';
import { getCompatibleDonors } from '@/lib/utils/bloodCompatibility';
import { calculateDistance } from '@/lib/utils/distance';

// POST - Create new request
export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user profile
        const profile = await prisma.profile.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const body = await req.json();
        const validatedData = createRequestSchema.parse(body);

        // Create request
        const request = await prisma.request.create({
            data: {
                createdById: profile.id,
                patientName: validatedData.patientName,
                bloodGroup: validatedData.bloodGroup,
                contactPhone: validatedData.contactPhone,
                urgency: validatedData.urgency,
                unitsNeeded: validatedData.unitsNeeded,
                hospitalName: validatedData.hospitalName || null,
                notes: validatedData.notes || null,
                patientLatitude: validatedData.patientLatitude,
                patientLongitude: validatedData.patientLongitude,
                patientLocationName: validatedData.patientLocationName,
                status: 'ACTIVE',
            },
        });

        // Find matching donors
        const compatibleBloodGroups = getCompatibleDonors(validatedData.bloodGroup as any);

        const donors = await prisma.profile.findMany({
            where: {
                bloodGroup: { in: compatibleBloodGroups },
                available: true,
                id: { not: profile.id }, // Exclude request creator
            },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                phone: true,
            },
        });

        // Calculate distances and filter nearby donors
        const nearbyDonors = donors
            .map((donor) => ({
                ...donor,
                distance: calculateDistance(
                    validatedData.patientLatitude,
                    validatedData.patientLongitude,
                    donor.latitude,
                    donor.longitude
                ),
            }))
            .filter((donor) => donor.distance <= 20) // Within 20km
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20); // Top 20 nearest

        // *** Send notifications to nearby donors
        // For now, just log the count
        console.log(`Found ${nearbyDonors.length} matching donors nearby`);

        return NextResponse.json(
            {
                success: true,
                request: {
                    id: request.id,
                    patientName: request.patientName,
                    bloodGroup: request.bloodGroup,
                    urgency: request.urgency,
                },
                matchedDonors: nearbyDonors.length,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create request error:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid data', details: error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

//******* */ GET - Fetch user's requests (already covered in nearby/route.ts)
export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const profile = await prisma.profile.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const whereClause: any = {
            createdById: profile.id,
        };

        if (status) {
            whereClause.status = status;
        }

        const requests = await prisma.request.findMany({
            where: whereClause,
            include: {
                responses: {
                    include: {
                        donor: {
                            select: {
                                id: true,
                                name: true,
                                phone: true,
                                bloodGroup: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error('Fetch requests error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}