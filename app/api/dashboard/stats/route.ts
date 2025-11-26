



// app/api/dashboard/stats/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils/distance';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Get total donations count
    const totalDonations = await prisma.donation.count({
      // where: { donorId: profile.id },
    });

    // Get all active requests
    const allActiveRequests = await prisma.request.findMany({
      where: { status: 'ACTIVE' },
      select: {
        patientLatitude: true,
        patientLongitude: true,
      },
    });

    // Filter nearby active requests (within 50km)
    const nearbyActiveRequests = allActiveRequests.filter((req) => {
      const distance = calculateDistance(
        profile.latitude,
        profile.longitude,
        req.patientLatitude,
        req.patientLongitude
      );
      return distance <= 150; ///////// **** if 50km then 0 // in ui shows 50
    }).length;

    // Get all available donors (excluding current user)
    const allDonors = await prisma.profile.findMany({
      where: {
        available: true,
        id: { not: profile.id },
      },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    // Filter nearby donors (within 20km)
    const nearbyDonors = allDonors.filter((donor) => {
      const distance = calculateDistance(
        profile.latitude,
        profile.longitude,
        donor.latitude,
        donor.longitude
      );
      return distance <= 220; // 20 or 220
    }).length;

    // Log 
    console.log('Dashboard Stats:', {
      totalDonations,
      nearbyActiveRequests,
      nearbyDonors,
      userId: profile.id,
    });

    // Return the statistics
    return NextResponse.json({
      totalDonations, // all
      activeRequests: nearbyActiveRequests,
      nearbyDonors,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

