

// app/api/dashboard/stats/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils/distance';


export async function GET() {
    try {

        const {userId} = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await prisma.profile.findUnique({
            where: {clerkId: userId},
            select: {
                id: true,
                latitude: true,
                longitude: true,
                bloodGroup: true
            }
        })

        if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const totalDonations = await prisma.donation.count({
        where: {donorId: profile.id}  
    })

    // Get all active requests coun
    const allActiveRequests = await prisma.request.findMany({
        where: {status: 'ACTIVE'},
        select: {
            patientLatitude: true,
            patientLongitude: true
        }
    })

    // Get nearby available donors count
    const nearbyActiveRequests = allActiveRequests.filter((req) => {
      const distance = calculateDistance(
        profile.latitude,
        profile.longitude,
        req.patientLatitude,
        req.patientLongitude
      );
      return distance <= 50; // Within 50km
    }).length;


    const allDonors = await prisma.profile.findMany({
        where: {
            available: true,
            id: {not: profile.id}
        },
        select: {
            latitude: true,
            longitude: true
        }
    })

    const nearbyDonoes = allDonors.filter((donor) => {
        const distance = calculateDistance(
            profile.latitude,
            profile.longitude,
            donor.latitude,
            donor.longitude
        )
        return distance <= 20  // within 20km
    }).length

    return NextResponse.json({
        totalDonations,
        activeRequests: nearbyActiveRequests,
        nearbyDonoes
    })


    } catch (err) {
         console.error('Dashboard stats error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    }
}
