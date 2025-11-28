


// app/api/donations/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user's profile
    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch all donations made by this user
    const donations = await prisma.donation.findMany({
      where: {
        donorId: profile.id,
      },
      include: {
        request: {
          select: {
            id: true,
            patientName: true,
            bloodGroup: true,
            hospitalName: true,
            patientLocationName: true,
            urgency: true,
            createdBy: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        donationDate: 'desc', // Most recent donations first
      },
    });

    // Calculate some statistics
    const stats = {
      totalDonations: donations.length,
      totalUnits: donations.reduce((sum, d) => sum + d.unitsDonated, 0),
      lastDonationDate: donations[0]?.donationDate || null,
    };

    return NextResponse.json({
      success: true,
      donations,
      stats,
    });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}