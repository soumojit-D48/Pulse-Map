



// app/api/profile/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest,NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { completeProfileSchema } from '@/lib/validations/profile';
import { z } from 'zod';
import { sendEmail } from '@/lib/services/emailService';


export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate data
    const validatedData = completeProfileSchema.parse({
      name: body.name,
      phone: body.phone,
      age: body.age,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      lastDonationDate: body.lastDonationDate ? new Date(body.lastDonationDate) : null,
      state: body.state,
      city: body.city,
      latitude: body.latitude,
      longitude: body.longitude,
      locationName: body.locationName,
      available: body.available,
    });

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { clerkId: userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        clerkId: userId,
        email: body.email,
        name: validatedData.name,
        phone: validatedData.phone,
        bloodGroup: validatedData.bloodGroup,
        age: validatedData.age,
        gender: validatedData.gender,
        state: validatedData.state,
        city: validatedData.city,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        locationName: validatedData.locationName,
        available: validatedData.available,
        lastDonationDate: validatedData.lastDonationDate,
        profileCompleted: true,
      },
    });

     // ✅ Send welcome email
    await sendEmail({
      to: body.email,
      type: 'PROFILE_COMPLETE',
      data: {
        userName: profile.name,
        bloodGroup: profile.bloodGroup,
        locationName: profile.locationName,
      },
    });

    return NextResponse.json(
      { 
        message: 'Profile created successfully',
        profile: {
          id: profile.id,
          name: profile.name,
          bloodGroup: profile.bloodGroup,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Profile creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch user profile
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      include: {
        donationsGiven: {
          orderBy: { donationDate: 'desc' },
          take: 5,
          include: {
            request: {
              select: {
                patientName: true,
                hospitalName: true,
              },
            },
          },
        },
        requestsCreated: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            patientName: true,
            bloodGroup: true,
            status: true,
            createdAt: true,
            urgency: true,
          },
        },
        responses: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            request: {
              select: {
                patientName: true,
                bloodGroup: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Calculate statistics
    const totalDonations = await prisma.donation.count({
      where: { donorId: profile.id },
    });

    const totalUnits = await prisma.donation.aggregate({
      where: { donorId: profile.id },
      _sum: { unitsDonated: true },
    });

    const totalRequests = await prisma.request.count({
      where: { createdById: profile.id },
    });

    const fulfilledRequests = await prisma.request.count({
      where: {
        createdById: profile.id,
        status: 'FULFILLED',
      },
    });

    const pendingResponses = await prisma.response.count({
      where: {
        donorId: profile.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      profile,
      stats: {
        totalDonations,
        totalUnits: totalUnits._sum.unitsDonated || 0,
        totalRequests,
        fulfilledRequests,
        pendingResponses,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update profile
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      phone,
      available,
      state,
      city,
      latitude,
      longitude,
      locationName,
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (available !== undefined) updateData.available = available;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (locationName !== undefined) updateData.locationName = locationName;

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



















// // app/api/profile/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
// import prisma from '@/lib/prisma';
// import { completeProfileSchema } from '@/lib/validations/profile';
// import { z } from 'zod';

// export async function POST(req: NextRequest) {
//   try {
//     // Check authentication
//     const { userId } = await auth();
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Parse request body
//     const body = await req.json();

//     // Validate data
//     const validatedData = completeProfileSchema.parse({
//       name: body.name,
//       phone: body.phone,
//       age: body.age,
//       gender: body.gender,
//       bloodGroup: body.bloodGroup,
//       lastDonationDate: body.lastDonationDate ? new Date(body.lastDonationDate) : null,
//       state: body.state,
//       city: body.city,
//       latitude: body.latitude,
//       longitude: body.longitude,
//       locationName: body.locationName,
//       available: body.available,
//     });

//     // Check if profile already exists
//     const existingProfile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//     });

//     if (existingProfile) {
//       return NextResponse.json(
//         { error: 'Profile already exists' },
//         { status: 400 }
//       );
//     }

//     // Create profile
//     const profile = await prisma.profile.create({
//       data: {
//         clerkId: userId,
//         email: body.email,
//         name: validatedData.name,
//         phone: validatedData.phone,
//         bloodGroup: validatedData.bloodGroup,
//         age: validatedData.age,
//         gender: validatedData.gender,
//         state: validatedData.state,
//         city: validatedData.city,
//         latitude: validatedData.latitude,
//         longitude: validatedData.longitude,
//         locationName: validatedData.locationName,
//         available: validatedData.available,
//         lastDonationDate: validatedData.lastDonationDate,
//         profileCompleted: true,
//       },
//     });

//     return NextResponse.json(
//       { 
//         message: 'Profile created successfully',
//         profile: {
//           id: profile.id,
//           name: profile.name,
//           bloodGroup: profile.bloodGroup,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Profile creation error:', error);

//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { 
//           error: 'Validation error',
//           details: error.issues 
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // GET endpoint to fetch user profile
// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = await auth();
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const profile = await prisma.profile.findUnique({
//       where: { clerkId: userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         bloodGroup: true,
//         age: true,
//         gender: true,
//         state: true,
//         city: true,
//         locationName: true,
//         available: true,
//         lastDonationDate: true,
//         profileCompleted: true,
//         createdAt: true,
//       },
//     });

//     if (!profile) {
//       return NextResponse.json(
//         { error: 'Profile not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ profile });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }




