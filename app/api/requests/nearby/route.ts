

// app/api/requests/nearby/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils/distance';
import { getCompatibleDonors } from '@/lib/utils/bloodCompatibility';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bloodGroupFilter = searchParams.get('bloodGroup');
    const radiusKm = parseInt(searchParams.get('radius') || '50');

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        bloodGroup: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Build where clause
    const whereClause: any = {
      status: 'ACTIVE',
    };

    if (bloodGroupFilter) {
      whereClause.bloodGroup = bloodGroupFilter;
    }

    // Fetch all active requests
    const requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            name: true,
            phone: true,
          },
        },
        responses: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate distance and filter by radius
    const requestsWithDistance = requests
      .map((request) => {
        const distance = calculateDistance(
          profile.latitude,
          profile.longitude,
          request.patientLatitude,
          request.patientLongitude
        );

        // Check if user can donate to this blood group
        const compatibleDonors = getCompatibleDonors(request.bloodGroup as any);
        const canUserDonate = compatibleDonors.includes(profile.bloodGroup as any);

        return {
          ...request,
          distance,
          canUserDonate,
          responseCount: request.responses.length,
        };
      })
      .filter((request) => request.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance); // Sort by nearest first

    return NextResponse.json({ requests: requestsWithDistance });
  } catch (error) {
    console.error('Nearby requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}